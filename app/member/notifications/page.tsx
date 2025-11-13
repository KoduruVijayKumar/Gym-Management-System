"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: string
  title: string
  message: string
  type: "class" | "billing" | "membership" | "promotion"
  read: boolean
  createdAt: string
}

const sidebarItems = [
  { href: "/member/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/member/profile", label: "Profile", icon: "👤" },
  { href: "/member/classes", label: "Classes", icon: "📅" },
  { href: "/member/billing", label: "Billing", icon: "💳" },
  { href: "/member/bookings", label: "My Bookings", icon: "📍" },
]

export default function NotificationsPage() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Class Reminder",
      message: "Your morning yoga class starts in 1 hour!",
      type: "class",
      read: false,
      createdAt: "2024-03-02 05:30 AM",
    },
    {
      id: "2",
      title: "Membership Renewal",
      message: "Your premium membership renews in 5 days.",
      type: "membership",
      read: false,
      createdAt: "2024-03-01 02:00 PM",
    },
    {
      id: "3",
      title: "Invoice Available",
      message: "Your March invoice is now available. View your billing details.",
      type: "billing",
      read: true,
      createdAt: "2024-02-29 09:00 AM",
    },
    {
      id: "4",
      title: "Special Offer",
      message: "Get 20% off on personal training sessions this month!",
      type: "promotion",
      read: true,
      createdAt: "2024-02-28 06:00 PM",
    },
  ])

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    if (role === "member") {
      setIsAuthorized(true)
    } else {
      window.location.href = "/"
    }
  }, [])

  if (!isAuthorized) return null

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "class":
        return "default"
      case "billing":
        return "destructive"
      case "membership":
        return "secondary"
      case "promotion":
        return "default"
      default:
        return "secondary"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "class":
        return "📅"
      case "billing":
        return "💳"
      case "membership":
        return "💪"
      case "promotion":
        return "🎁"
      default:
        return "📢"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="member" items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="member" />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
                <p className="text-muted-foreground">
                  You have {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
                </p>
              </div>
              {unreadCount > 0 && (
                <Button variant="outline" onClick={markAllAsRead}>
                  Mark All as Read
                </Button>
              )}
            </div>

            <div className="space-y-3 max-w-2xl">
              {notifications.length === 0 ? (
                <Card className="border-2">
                  <CardContent className="p-8 text-center">
                    <p className="text-2xl mb-2">📭</p>
                    <p className="text-lg font-semibold text-foreground mb-1">No notifications</p>
                    <p className="text-muted-foreground">You're all caught up!</p>
                  </CardContent>
                </Card>
              ) : (
                notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`border-2 cursor-pointer transition-colors ${notification.read ? "" : "bg-primary/5"}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <span className="text-2xl mt-1">{getTypeIcon(notification.type)}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">{notification.title}</h3>
                              {!notification.read && <span className="w-2 h-2 bg-primary rounded-full" />}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant={getTypeColor(notification.type) as any} className="capitalize">
                                {notification.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{notification.createdAt}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          ✕
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
