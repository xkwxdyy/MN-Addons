import fs from 'fs/promises'
import path from 'path'

export interface TaskData {
  focusTasks?: any[]  // 新字段
  tasks?: any[]       // 保留旧字段以兼容
  pendingTasks: any[]
  inboxTasks: any[]
  allTasks: any[]
  perspectives: any[]
  lastUpdated: string
}

export class FileStorageService {
  private dataDir: string
  private backupDir: string
  private dataFile: string

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data')
    this.backupDir = path.join(this.dataDir, 'backup')
    this.dataFile = path.join(this.dataDir, 'tasks.json')
  }

  async ensureDirectories(): Promise<void> {
    try {
      await fs.mkdir(this.dataDir, { recursive: true })
      await fs.mkdir(this.backupDir, { recursive: true })
    } catch (error) {
      console.error('Failed to create directories:', error)
    }
  }

  async readData(): Promise<TaskData | null> {
    try {
      await this.ensureDirectories()
      const data = await fs.readFile(this.dataFile, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      // File doesn't exist or is invalid, return null
      console.log('No existing data file found, will create new one')
      return null
    }
  }

  async writeData(data: TaskData): Promise<{ success: boolean; backup?: string }> {
    try {
      await this.ensureDirectories()
      
      // Check if we should create a backup
      const backupFile = await this.createBackupIfNeeded()
      
      // Write the main data file
      const jsonData = JSON.stringify(data, null, 2)
      await fs.writeFile(this.dataFile, jsonData, 'utf-8')
      
      return { success: true, backup: backupFile }
    } catch (error) {
      console.error('Failed to write data:', error)
      return { success: false }
    }
  }

  private async createBackupIfNeeded(): Promise<string | undefined> {
    try {
      // Check if a backup was already created today
      const today = new Date().toISOString().split('T')[0]
      const backupFiles = await fs.readdir(this.backupDir)
      const todayBackups = backupFiles.filter(file => file.startsWith(today))
      
      // Only create one backup per day
      if (todayBackups.length > 0) {
        return undefined
      }
      
      // Check if main data file exists
      try {
        const currentData = await fs.readFile(this.dataFile, 'utf-8')
        
        // Create backup with timestamp
        const timestamp = new Date().toISOString()
          .replace(/[:.]/g, '-')
          .replace('T', '_')
          .slice(0, -5) // Remove milliseconds and Z
        const backupFileName = `${timestamp}.json`
        const backupPath = path.join(this.backupDir, backupFileName)
        
        await fs.writeFile(backupPath, currentData, 'utf-8')
        
        // Clean old backups (keep last 7 days)
        await this.cleanOldBackups()
        
        return backupFileName
      } catch {
        // No existing file to backup
        return undefined
      }
    } catch (error) {
      console.error('Failed to create backup:', error)
      return undefined
    }
  }

  private async cleanOldBackups(): Promise<void> {
    try {
      const files = await fs.readdir(this.backupDir)
      const now = Date.now()
      const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000)
      
      for (const file of files) {
        const filePath = path.join(this.backupDir, file)
        const stats = await fs.stat(filePath)
        
        if (stats.mtime.getTime() < sevenDaysAgo) {
          await fs.unlink(filePath)
          console.log(`Deleted old backup: ${file}`)
        }
      }
    } catch (error) {
      console.error('Failed to clean old backups:', error)
    }
  }

  async listBackups(): Promise<string[]> {
    try {
      await this.ensureDirectories()
      const files = await fs.readdir(this.backupDir)
      return files.filter(file => file.endsWith('.json')).sort().reverse()
    } catch (error) {
      console.error('Failed to list backups:', error)
      return []
    }
  }

  async restoreBackup(backupFileName: string): Promise<boolean> {
    try {
      const backupPath = path.join(this.backupDir, backupFileName)
      const backupData = await fs.readFile(backupPath, 'utf-8')
      
      // Create a backup of current data before restoring
      const timestamp = new Date().toISOString()
        .replace(/[:.]/g, '-')
        .replace('T', '_')
        .slice(0, -5)
      const currentBackupPath = path.join(this.backupDir, `before-restore_${timestamp}.json`)
      
      try {
        const currentData = await fs.readFile(this.dataFile, 'utf-8')
        await fs.writeFile(currentBackupPath, currentData, 'utf-8')
      } catch {
        // No current file to backup
      }
      
      // Restore the backup
      await fs.writeFile(this.dataFile, backupData, 'utf-8')
      return true
    } catch (error) {
      console.error('Failed to restore backup:', error)
      return false
    }
  }
}

export const fileStorage = new FileStorageService()