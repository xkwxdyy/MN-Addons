import { Task, Perspective } from '@/types/task'

export interface StorageData {
  tasks: Task[]
  pendingTasks: Task[]
  allTasks: Task[]
  perspectives: Perspective[]
}

class ApiStorageService {
  private cache: StorageData | null = null
  private saveTimeout: NodeJS.Timeout | null = null
  private isSaving = false

  async loadData(): Promise<StorageData> {
    try {
      const response = await fetch('/api/tasks')
      if (!response.ok) {
        throw new Error('Failed to load data')
      }
      
      const data = await response.json()
      
      // Parse dates
      const parseTaskDates = (task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
        progressHistory: task.progressHistory?.map((p: any) => ({
          ...p,
          timestamp: new Date(p.timestamp)
        })) || []
      })
      
      const parsePerspectiveDates = (perspective: any) => ({
        ...perspective,
        createdAt: new Date(perspective.createdAt)
      })
      
      this.cache = {
        tasks: (data.tasks || []).map(parseTaskDates),
        pendingTasks: (data.pendingTasks || []).map(parseTaskDates),
        allTasks: (data.allTasks || []).map(parseTaskDates),
        perspectives: (data.perspectives || []).map(parsePerspectiveDates)
      }
      
      return this.cache
    } catch (error) {
      console.error('Failed to load data from API:', error)
      
      // Fallback to localStorage if available
      const localData = this.loadFromLocalStorage()
      if (localData) {
        this.cache = localData
        // Migrate to file system
        this.saveData(localData)
        return localData
      }
      
      // Return empty structure
      return {
        tasks: [],
        pendingTasks: [],
        allTasks: [],
        perspectives: []
      }
    }
  }

  /**
   * @deprecated Only used for migration from localStorage to file system
   * Will be removed in future version once all users have migrated
   */
  private loadFromLocalStorage(): StorageData | null {
    try {
      const tasks = localStorage.getItem('mntask-tasks')
      const pendingTasks = localStorage.getItem('mntask-pending')
      const allTasks = localStorage.getItem('mntask-all-tasks')
      const perspectives = localStorage.getItem('mntask-perspectives')
      
      if (!tasks && !pendingTasks && !allTasks) {
        return null
      }
      
      const parseTaskDates = (task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
        progressHistory: task.progressHistory?.map((p: any) => ({
          ...p,
          timestamp: new Date(p.timestamp)
        })) || []
      })
      
      const parsePerspectiveDates = (perspective: any) => ({
        ...perspective,
        createdAt: new Date(perspective.createdAt)
      })
      
      return {
        tasks: tasks ? JSON.parse(tasks).map(parseTaskDates) : [],
        pendingTasks: pendingTasks ? JSON.parse(pendingTasks).map(parseTaskDates) : [],
        allTasks: allTasks ? JSON.parse(allTasks).map(parseTaskDates) : [],
        perspectives: perspectives ? JSON.parse(perspectives).map(parsePerspectiveDates) : []
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
      return null
    }
  }

  async saveData(data: StorageData): Promise<void> {
    // Cancel any pending save
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout)
    }
    
    // Update cache
    this.cache = data
    
    // Debounce saves to avoid too many requests
    this.saveTimeout = setTimeout(async () => {
      if (this.isSaving) return
      
      this.isSaving = true
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        
        if (!response.ok) {
          throw new Error('Failed to save data')
        }
        
        const result = await response.json()
        if (result.backup) {
          console.log(`Data saved. Backup created: ${result.backup}`)
        }
      } catch (error) {
        console.error('Failed to save data to API:', error)
        // No fallback to localStorage - data should only be saved to file system
        throw error
      } finally {
        this.isSaving = false
      }
    }, 500) // Debounce for 500ms
  }

  /**
   * Partially update data - only update specified fields
   * This helps avoid race conditions when multiple hooks update different parts
   */
  async updateData(partialData: Partial<StorageData>): Promise<void> {
    try {
      // Get current data (from cache if available)
      const currentData = this.cache || await this.loadData()
      
      // Merge with partial update
      const updatedData = {
        ...currentData,
        ...partialData
      }
      
      // Save the merged data
      await this.saveData(updatedData)
    } catch (error) {
      console.error('Failed to update data:', error)
      throw error
    }
  }

  // Deprecated: Only kept for migration purposes
  // Will be removed in future version

  async migrateFromLocalStorage(): Promise<boolean> {
    try {
      const localData = this.loadFromLocalStorage()
      if (!localData) {
        console.log('No localStorage data to migrate')
        return false
      }
      
      await this.saveData(localData)
      
      // Clear localStorage after successful migration
      localStorage.removeItem('mntask-tasks')
      localStorage.removeItem('mntask-pending')
      localStorage.removeItem('mntask-all-tasks')
      localStorage.removeItem('mntask-perspectives')
      
      console.log('Successfully migrated data from localStorage to file system')
      return true
    } catch (error) {
      console.error('Failed to migrate from localStorage:', error)
      return false
    }
  }
}

export const apiStorage = new ApiStorageService()