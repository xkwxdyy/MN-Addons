import { NextRequest, NextResponse } from 'next/server'
import { fileStorage, TaskData } from '@/services/fileStorage'

export async function GET() {
  try {
    const data = await fileStorage.readData()
    
    if (!data) {
      // Return empty data structure if no file exists
      return NextResponse.json({
        tasks: [],
        pendingTasks: [],
        allTasks: [],
        perspectives: [],
        lastUpdated: new Date().toISOString()
      })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to read tasks:', error)
    return NextResponse.json(
      { error: 'Failed to read tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Add timestamp
    const taskData: TaskData = {
      ...data,
      lastUpdated: new Date().toISOString()
    }
    
    const result = await fileStorage.writeData(taskData)
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to save tasks' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      backup: result.backup,
      lastUpdated: taskData.lastUpdated
    })
  } catch (error) {
    console.error('Failed to save tasks:', error)
    return NextResponse.json(
      { error: 'Failed to save tasks' },
      { status: 500 }
    )
  }
}