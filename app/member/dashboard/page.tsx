"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface MemberProfile {
  name: string
  email: string
  membershipType: "basic" | "premium" | "vip"
  joinDate: string
  renewalDate: string
  balance: number
  checkins: number
}

interface Attendance {
  date: string
  count: number
}

const sidebarItems = [
  { href: "/member/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/member/profile", label: "Profile", icon: "👤" },
  { href: "/member/classes", label: "Classes", icon: "📅" },
  { href: "/member/billing", label: "Billing", icon: "💳" },
  { href: "/member/bookings", label: "My Bookings", icon: "📍" },
]

const attendanceData: Attendance[] = [
  { date: "Mon", count: 1 },
  { date: "Tue", count: 0 },
  { date: "Wed", count: 1 },
  { date: "Thu", count: 2 },
  { date: "Fri", count: 1 },
  { date: "Sat", count: 0 },
  { date: "Sun", count: 1 },
]

export default function MemberDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [profile, setProfile] = useState<MemberProfile>({
    name: "John Member",
    email: "member@example.com",
    membershipType: "premium",
    joinDate: "2024-01-15",
    renewalDate: "2024-07-15",
    balance: 0,
    checkins: 24,
  })

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    if (role === "member") {
      setIsAuthorized(true)
    } else {
      window.location.href = "/"
    }
  }, [])

  if (!isAuthorized) return null

  const daysUntilRenewal = Math.floor(
    (new Date(profile.renewalDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="member" items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="member" />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, {profile.name}!</h1>
              <p className="text-muted-foreground">Your {profile.membershipType} membership is active</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">💪</span>
                    <Badge variant="default" className="capitalize">
                      {profile.membershipType}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Membership</p>
                  <p className="text-2xl font-bold text-foreground">
                    {profile.membershipType.charAt(0).toUpperCase() + profile.membershipType.slice(1)}
                  </p>
                  <p className="text-xs text-primary mt-2">Renews in {daysUntilRenewal} days</p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">✅</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">This Month</p>
                  <p className="text-2xl font-bold text-foreground">{profile.checkins} visits</p>
                  <p className="text-xs text-muted-foreground mt-2">Last visit: Today</p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">💰</span>
                    {profile.balance >= 0 ? (
                      <Badge variant="default">Paid</Badge>
                    ) : (
                      <Badge variant="destructive">Due</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Account Balance</p>
                  <p className={`text-2xl font-bold ${profile.balance >= 0 ? "text-foreground" : "text-destructive"}`}>
                    ${profile.balance}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-2">
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                  <CardDescription>Your gym visits this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
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
                  <Button className="w-full justify-start bg-primary hover:bg-primary/90">Book a Class</Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    View Schedule
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Update Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Download Receipt
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 mt-6">
              <CardHeader>
                <CardTitle>Upcoming Classes</CardTitle>
                <CardDescription>Classes you're registered for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Morning Yoga", time: "Tomorrow, 6:00 AM", instructor: "Sarah" },
                    { name: "CrossFit Training", time: "Friday, 5:30 PM", instructor: "Mike" },
                    { name: "Spin Class", time: "Saturday, 10:00 AM", instructor: "Emma" },
                  ].map((cls, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                      <div>
                        <p className="font-semibold text-foreground">{cls.name}</p>
                        <p className="text-xs text-muted-foreground">with {cls.instructor}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">{cls.time}</div>
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
