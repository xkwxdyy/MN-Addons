import { useState, useMemo, useCallback, useEffect } from "react"
import type { Task } from "@/types/task"

interface SearchResult {
  task: Task
  score: number
  matches: {
    title: boolean
    description: boolean
    tags: boolean
  }
}

interface UseTaskSearchOptions {
  tasks: Task[]
  minScore?: number
  maxResults?: number
}

export function useTaskSearch({ 
  tasks, 
  minScore = 0.1,
  maxResults = 50 
}: UseTaskSearchOptions) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches, setPopularSearches] = useState<string[]>([])

  // Load recent and popular searches
  useEffect(() => {
    const recent = localStorage.getItem("mntask-recent-searches")
    const popular = localStorage.getItem("mntask-popular-searches")
    
    if (recent) setRecentSearches(JSON.parse(recent))
    if (popular) setPopularSearches(JSON.parse(popular))
  }, [])

  // Fuzzy search implementation
  const fuzzySearch = useCallback((query: string, text: string): number => {
    if (!query || !text) return 0
    
    const queryLower = query.toLowerCase()
    const textLower = text.toLowerCase()
    
    // Exact match
    if (textLower === queryLower) return 1
    
    // Contains match
    if (textLower.includes(queryLower)) return 0.8
    
    // Fuzzy match
    let score = 0
    let queryIndex = 0
    let textIndex = 0
    
    while (queryIndex < queryLower.length && textIndex < textLower.length) {
      if (queryLower[queryIndex] === textLower[textIndex]) {
        score += 1
        queryIndex++
      }
      textIndex++
    }
    
    return queryIndex === queryLower.length ? score / queryLower.length * 0.6 : 0
  }, [])

  // Search tasks with fuzzy matching
  const searchTasks = useCallback((query: string): SearchResult[] => {
    if (!query) return []
    
    const results: SearchResult[] = []
    
    tasks.forEach(task => {
      const titleScore = fuzzySearch(query, task.title)
      const descScore = task.description ? fuzzySearch(query, task.description) : 0
      const tagScores = task.tags?.map(tag => fuzzySearch(query, tag)) || []
      const maxTagScore = tagScores.length > 0 ? Math.max(...tagScores) : 0
      
      // Calculate total score with weights
      const totalScore = titleScore * 0.5 + descScore * 0.3 + maxTagScore * 0.2
      
      if (totalScore >= minScore) {
        results.push({
          task,
          score: totalScore,
          matches: {
            title: titleScore > 0,
            description: descScore > 0,
            tags: maxTagScore > 0
          }
        })
      }
    })
    
    // Sort by score and limit results
    results.sort((a, b) => b.score - a.score)
    return results.slice(0, maxResults)
  }, [tasks, fuzzySearch, minScore, maxResults])

  // Quick search for common queries
  const quickSearch = useMemo(() => {
    return {
      todayTasks: tasks.filter(task => {
        const today = new Date()
        const taskDate = new Date(task.createdAt)
        return taskDate.toDateString() === today.toDateString()
      }),
      
      overdueTasks: tasks.filter(task => 
        task.status !== "completed" && task.priority === "high"
      ),
      
      inProgressTasks: tasks.filter(task => 
        task.status === "in-progress"
      ),
      
      priorityTasks: tasks.filter(task => 
        task.isPriorityFocus || task.priority === "high"
      ),
      
      untaggedTasks: tasks.filter(task => 
        !task.tags || task.tags.length === 0
      )
    }
  }, [tasks])

  // Save search to history
  const saveSearch = useCallback((query: string) => {
    if (!query.trim()) return
    
    // Update recent searches
    const recent = [...recentSearches]
    const index = recent.indexOf(query)
    if (index > -1) recent.splice(index, 1)
    recent.unshift(query)
    const newRecent = recent.slice(0, 10)
    setRecentSearches(newRecent)
    localStorage.setItem("mntask-recent-searches", JSON.stringify(newRecent))
    
    // Update popular searches (track frequency)
    const popularMap = new Map<string, number>()
    const popular = localStorage.getItem("mntask-search-frequency")
    if (popular) {
      const parsed = JSON.parse(popular)
      Object.entries(parsed).forEach(([key, value]) => {
        popularMap.set(key, value as number)
      })
    }
    popularMap.set(query, (popularMap.get(query) || 0) + 1)
    
    // Get top 5 popular searches
    const sorted = Array.from(popularMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([query]) => query)
    
    setPopularSearches(sorted)
    localStorage.setItem("mntask-popular-searches", JSON.stringify(sorted))
    localStorage.setItem("mntask-search-frequency", JSON.stringify(Object.fromEntries(popularMap)))
  }, [recentSearches])

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
      
      // Escape to close search
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false)
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [searchOpen])

  // Get search suggestions based on partial input
  const getSuggestions = useCallback((partial: string): string[] => {
    if (!partial) return []
    
    const suggestions = new Set<string>()
    const partialLower = partial.toLowerCase()
    
    // Add matching task titles
    tasks.forEach(task => {
      if (task.title.toLowerCase().includes(partialLower)) {
        suggestions.add(task.title)
      }
    })
    
    // Add matching tags
    tasks.forEach(task => {
      task.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(partialLower)) {
          suggestions.add(`#${tag}`)
        }
      })
    })
    
    // Add recent searches that match
    recentSearches.forEach(search => {
      if (search.toLowerCase().includes(partialLower)) {
        suggestions.add(search)
      }
    })
    
    return Array.from(suggestions).slice(0, 5)
  }, [tasks, recentSearches])

  // Highlight matching text (returns plain text, highlighting should be done in the component)
  const highlightMatch = useCallback((text: string, query: string): string => {
    // This is a simplified version that returns the text as-is
    // The actual highlighting should be done in the component using the search query
    return text
  }, [])

  return {
    searchOpen,
    setSearchOpen,
    searchTasks,
    quickSearch,
    recentSearches,
    popularSearches,
    saveSearch,
    getSuggestions,
    highlightMatch
  }
}