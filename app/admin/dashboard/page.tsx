"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MemberModal } from "@/components/admin/member-modal"
import { StatsCard } from "@/components/admin/stats-card"

interface Member {
  id: string
  name: string
  email: string
  phone: string
  membershipType: "basic" | "premium" | "vip"
  status: "active" | "inactive" | "suspended"
  joinDate: string
  balance: number
}

const sidebarItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/members", label: "Members", icon: "👥" },
  { href: "/admin/billing", label: "Billing", icon: "💳" },
  { href: "/admin/classes", label: "Classes", icon: "📅" },
  { href: "/admin/staff", label: "Staff", icon: "👔" },
  { href: "/admin/reports", label: "Reports", icon: "📈" },
]

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234-567-8900",
      membershipType: "premium",
      status: "active",
      joinDate: "2024-01-15",
      balance: 0,
    },
    {
      id: "2",
      name: "Sarah Smith",
      email: "sarah@example.com",
      phone: "+1 234-567-8901",
      membershipType: "vip",
      status: "active",
      joinDate: "2023-11-20",
      balance: 50,
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1 234-567-8902",
      membershipType: "basic",
      status: "inactive",
      joinDate: "2024-02-01",
      balance: -25,
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [showMemberModal, setShowMemberModal] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    if (role === "admin") {
      setIsAuthorized(true)
    } else {
      window.location.href = "/"
    }
  }, [])

  if (!isAuthorized) return null

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    totalMembers: members.length,
    activeMembers: members.filter((m) => m.status === "active").length,
    monthlyRevenue: 12500,
    pendingBilling: members.filter((m) => m.balance < 0).length,
  }

  const addMember = (newMember: Omit<Member, "id">) => {
    const member: Member = {
      ...newMember,
      id: Math.random().toString(36).substr(2, 9),
    }
    setMembers([...members, member])
    setShowMemberModal(false)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="admin" items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="admin" />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's your gym overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard title="Total Members" value={stats.totalMembers} icon="👥" trend="+5 this month" />
              <StatsCard
                title="Active Members"
                value={stats.activeMembers}
                icon="✅"
                trend={`${((stats.activeMembers / stats.totalMembers) * 100).toFixed(0)}% active`}
              />
              <StatsCard
                title="Monthly Revenue"
                value={`$${stats.monthlyRevenue.toLocaleString()}`}
                icon="💰"
                trend="+12% vs last month"
              />
              <StatsCard title="Pending Billing" value={stats.pendingBilling} icon="⚠️" trend="Action needed" />
            </div>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Members</CardTitle>
                  <CardDescription>Manage gym members and memberships</CardDescription>
                </div>
                <Button onClick={() => setShowMemberModal(true)} className="bg-primary hover:bg-primary/90">
                  Add Member
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="border-b border-border hover:bg-secondary/5">
                          <td className="py-3 px-4 text-foreground">{member.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{member.email}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={member.membershipType === "vip" ? "default" : "secondary"}
                              className="capitalize"
                            >
                              {member.membershipType}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                member.status === "active"
                                  ? "default"
                                  : member.status === "suspended"
                                    ? "destructive"
                                    : "secondary"
                              }
                              className="capitalize"
                            >
                              {member.status}
                            </Badge>
                          </td>
                          <td
                            className={`py-3 px-4 font-semibold ${member.balance < 0 ? "text-destructive" : "text-foreground"}`}
                          >
                            ${member.balance}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <MemberModal isOpen={showMemberModal} onClose={() => setShowMemberModal(false)} onAdd={addMember} />
    </div>
  )
}
