import { NextRequest, NextResponse } from 'next/server'
import { fileStorage, TaskData } from '@/services/fileStorage'

export async function GET() {
  try {
    const data = await fileStorage.readData()
    
    if (!data) {
      // Return empty data structure if no file exists
      return NextResponse.json({
        focusTasks: [],
        tasks: [],  // 保留以兼容旧版本
        pendingTasks: [],
        allTasks: [],
        perspectives: [],
        lastUpdated: new Date().toISOString()
      })
    }
    
    // 确保兼容性：如果有旧的 tasks 字段，复制到 focusTasks
    const responseData = {
      ...data,
      focusTasks: data.focusTasks || data.tasks || [],
      tasks: data.tasks || data.focusTasks || []  // 保留以兼容
    }
    
    return NextResponse.json(responseData)
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