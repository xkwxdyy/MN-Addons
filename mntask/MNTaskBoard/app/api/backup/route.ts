import { NextRequest, NextResponse } from 'next/server'
import { fileStorage } from '@/services/fileStorage'

export async function GET() {
  try {
    const backups = await fileStorage.listBackups()
    return NextResponse.json({ backups })
  } catch (error) {
    console.error('Failed to list backups:', error)
    return NextResponse.json(
      { error: 'Failed to list backups' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { backupFileName } = await request.json()
    
    if (!backupFileName) {
      return NextResponse.json(
        { error: 'Backup filename is required' },
        { status: 400 }
      )
    }
    
    const success = await fileStorage.restoreBackup(backupFileName)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to restore backup' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to restore backup:', error)
    return NextResponse.json(
      { error: 'Failed to restore backup' },
      { status: 500 }
    )
  }
}