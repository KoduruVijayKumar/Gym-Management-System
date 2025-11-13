"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface RevenueData {
  month: string
  revenue: number
  expenses: number
}

interface MembershipData {
  name: string
  value: number
}

interface AttendanceData {
  day: string
  attended: number
  registered: number
}

const sidebarItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/members", label: "Members", icon: "👥" },
  { href: "/admin/billing", label: "Billing", icon: "💳" },
  { href: "/admin/classes", label: "Classes", icon: "📅" },
  { href: "/admin/staff", label: "Staff", icon: "👔" },
  { href: "/admin/reports", label: "Reports", icon: "📈" },
]

const revenueData: RevenueData[] = [
  { month: "Jan", revenue: 8500, expenses: 3200 },
  { month: "Feb", revenue: 9200, expenses: 3400 },
  { month: "Mar", revenue: 11000, expenses: 3800 },
  { month: "Apr", revenue: 12500, expenses: 4000 },
  { month: "May", revenue: 13200, expenses: 4200 },
  { month: "Jun", revenue: 14800, expenses: 4500 },
]

const membershipData: MembershipData[] = [
  { name: "Basic", value: 45 },
  { name: "Premium", value: 65 },
  { name: "VIP", value: 14 },
]

const attendanceData: AttendanceData[] = [
  { day: "Mon", attended: 45, registered: 52 },
  { day: "Tue", attended: 38, registered: 48 },
  { day: "Wed", attended: 52, registered: 58 },
  { day: "Thu", attended: 48, registered: 54 },
  { day: "Fri", attended: 61, registered: 68 },
  { day: "Sat", attended: 72, registered: 85 },
  { day: "Sun", attended: 32, registered: 45 },
]

const COLORS = ["#4f46e5", "#f97316", "#ec4899"]

export default function ReportsPage() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [dateRange, setDateRange] = useState("6m")

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    if (role === "admin") {
      setIsAuthorized(true)
    } else {
      window.location.href = "/"
    }
  }, [])

  if (!isAuthorized) return null

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0)
  const totalExpenses = revenueData.reduce((sum, d) => sum + d.expenses, 0)
  const netProfit = totalRevenue - totalExpenses
  const avgAttendanceRate = Math.round(
    attendanceData.reduce((sum, d) => sum + (d.attended / d.registered) * 100, 0) / attendanceData.length,
  )

  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="admin" items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="admin" />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
                <p className="text-muted-foreground">Detailed insights into your gym operations</p>
              </div>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="1m">Last Month</option>
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="border-2">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-primary mt-2">+18% vs last period</p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
                  <p className="text-2xl font-bold text-foreground">${totalExpenses.toLocaleString()}</p>
                  <p className="text-xs text-secondary mt-2">+8% vs last period</p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Net Profit</p>
                  <p className="text-2xl font-bold text-primary">${netProfit.toLocaleString()}</p>
                  <p className="text-xs text-primary mt-2">+22% vs last period</p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Attendance Rate</p>
                  <p className="text-2xl font-bold text-foreground">{avgAttendanceRate}%</p>
                  <p className="text-xs text-primary mt-2">Average week</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Revenue vs Expenses</CardTitle>
                  <CardDescription>Monthly financial overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                      <YAxis stroke="var(--color-muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="var(--color-primary)" />
                      <Bar dataKey="expenses" fill="var(--color-accent)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Membership Distribution</CardTitle>
                  <CardDescription>Members by membership type</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={membershipData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {membershipData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 mb-8">
              <CardHeader>
                <CardTitle>Weekly Attendance Rates</CardTitle>
                <CardDescription>Class attendance vs registration</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="registered"
                      stroke="var(--color-secondary)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-secondary)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="attended"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-primary)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Top Classes</CardTitle>
                  <CardDescription>Most popular classes this month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "CrossFit Training", members: 52, growth: "+12%" },
                    { name: "Yoga & Meditation", members: 48, growth: "+8%" },
                    { name: "Spin Classes", members: 45, growth: "+5%" },
                    { name: "Weight Training", members: 38, growth: "+3%" },
                  ].map((cls, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2">
                      <div>
                        <p className="font-semibold text-foreground">{cls.name}</p>
                        <p className="text-xs text-muted-foreground">{cls.members} members</p>
                      </div>
                      <span className="text-sm text-primary font-semibold">{cls.growth}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Member Activity</CardTitle>
                  <CardDescription>Member engagement metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { metric: "Active Today", value: "64", icon: "👥" },
                    { metric: "Classes This Week", value: "47", icon: "📅" },
                    { metric: "Avg Visits/Month", value: "12.4", icon: "📊" },
                    { metric: "Retention Rate", value: "87%", icon: "✅" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <p className="font-semibold text-foreground">{item.metric}</p>
                      </div>
                      <span className="text-lg font-bold text-primary">{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
