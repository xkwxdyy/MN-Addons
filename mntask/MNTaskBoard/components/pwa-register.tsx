"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Download } from "lucide-react"
import { toast } from "sonner"

export function PWARegister() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false)

  useEffect(() => {
    // Check if running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true

    setIsInStandaloneMode(isStandalone)

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Register service worker
    if ('serviceWorker' in navigator && !isStandalone) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration)
          
          // Check for updates periodically
          setInterval(() => {
            registration.update()
          }, 60000) // Check every minute
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }

    // Listen for beforeinstallprompt event (Android/Desktop Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Show install prompt after a delay
      setTimeout(() => {
        if (!isStandalone) {
          setShowInstallPrompt(true)
        }
      }, 30000) // Show after 30 seconds
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // iOS specific prompt
    if (isIOSDevice && !isStandalone) {
      // Check if user has seen the prompt before
      const hasSeenIOSPrompt = localStorage.getItem('ios-install-prompt-seen')
      if (!hasSeenIOSPrompt) {
        setTimeout(() => {
          setShowInstallPrompt(true)
        }, 10000) // Show after 10 seconds on iOS
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt()
      
      // Wait for the user to respond
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        toast.success('应用安装成功！')
      }
      
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    } else if (isIOS) {
      // For iOS, we can't trigger install, just show instructions
      localStorage.setItem('ios-install-prompt-seen', 'true')
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    if (isIOS) {
      localStorage.setItem('ios-install-prompt-seen', 'true')
    }
  }

  if (!showInstallPrompt || isInStandaloneMode) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Download className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">
                安装 MNTask 应用
              </h3>
              {isIOS ? (
                <div className="space-y-2">
                  <p className="text-sm text-slate-300">
                    将 MNTask 添加到主屏幕，享受原生应用体验
                  </p>
                  <ol className="text-xs text-slate-400 space-y-1">
                    <li>1. 点击底部分享按钮 <span className="text-blue-400">⎙</span></li>
                    <li>2. 选择"添加到主屏幕"</li>
                    <li>3. 点击"添加"完成安装</li>
                  </ol>
                </div>
              ) : (
                <p className="text-sm text-slate-300">
                  安装应用以获得更好的体验，支持离线使用和快速访问
                </p>
              )}
              <div className="flex gap-2 mt-3">
                {!isIOS && (
                  <Button
                    size="sm"
                    onClick={handleInstallClick}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    立即安装
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-slate-400 hover:text-white"
                >
                  {isIOS ? '我知道了' : '稍后提醒'}
                </Button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-slate-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}