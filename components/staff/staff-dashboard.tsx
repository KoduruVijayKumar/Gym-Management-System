"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ClassSession {
  id: string
  name: string
  time: string
  instructor: string
  members: number
  capacity: number
}

const staffSidebarItems = [
  { href: "/staff/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/staff/check-in", label: "Check-in", icon: "✅" },
  { href: "/staff/classes", label: "Classes", icon: "📅" },
  { href: "/staff/members", label: "Members", icon: "👥" },
]

const attendanceData = [
  { time: "6 AM", count: 12 },
  { time: "8 AM", count: 28 },
  { time: "10 AM", count: 15 },
  { time: "12 PM", count: 22 },
  { time: "3 PM", count: 35 },
  { time: "6 PM", count: 62 },
  { time: "8 PM", count: 48 },
]

export default function StaffDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [todayClasses, setTodayClasses] = useState<ClassSession[]>([
    { id: "1", name: "Morning Yoga", time: "6:00 AM", instructor: "Sarah", members: 18, capacity: 20 },
    { id: "2", name: "CrossFit", time: "9:00 AM", instructor: "Mike", members: 22, capacity: 25 },
    { id: "3", name: "Spin Class", time: "12:00 PM", instructor: "Emma", members: 15, capacity: 20 },
    { id: "4", name: "Weight Training", time: "5:30 PM", instructor: "John", members: 28, capacity: 30 },
  ])

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    if (role === "staff") {
      setIsAuthorized(true)
    } else {
      window.location.href = "/"
    }
  }, [])

  if (!isAuthorized) return null

  const totalCheckIns = attendanceData.reduce((sum, d) => sum + d.count, 0)
  const peakHour = attendanceData.reduce((max, d) => (d.count > max.count ? d : max))

  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="staff" items={staffSidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="staff" />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Staff Dashboard</h1>
              <p className="text-muted-foreground">Manage today's operations and member check-ins</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="border-2">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Today's Check-ins</p>
                  <p className="text-2xl font-bold text-foreground">{totalCheckIns}</p>
                  <p className="text-xs text-primary mt-2">+15% vs yesterday</p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Peak Hour</p>
                  <p className="text-2xl font-bold text-foreground">{peakHour.time}</p>
                  <p className="text-xs text-muted-foreground mt-2">{peakHour.count} members</p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Active Classes</p>
                  <p className="text-2xl font-bold text-foreground">{todayClasses.length}</p>
                  <p className="text-xs text-primary mt-2">Today's schedule</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-2">
                <CardHeader>
                  <CardTitle>Today's Attendance</CardTitle>
                  <CardDescription>Hourly check-in activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
                      <YAxis stroke="var(--color-muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="var(--color-primary)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-primary)", r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start bg-primary hover:bg-primary/90">Check In Member</Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Start Class
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Equipment Status
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 mt-6">
              <CardHeader>
                <CardTitle>Today's Classes</CardTitle>
                <CardDescription>Scheduled classes and attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayClasses.map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                      <div>
                        <p className="font-semibold text-foreground">{cls.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {cls.time} • Instructor: {cls.instructor}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="default">
                          {cls.members}/{cls.capacity}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {Math.round((cls.members / cls.capacity) * 100)}% full
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
