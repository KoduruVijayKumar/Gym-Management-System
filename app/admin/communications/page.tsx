"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CommunicationModal } from "@/components/admin/communication-modal"

interface Communication {
  id: string
  subject: string
  message: string
  recipient: "all" | "active" | "inactive"
  type: "email" | "sms" | "push"
  sentAt: string
  status: "sent" | "pending" | "failed"
  openRate?: number
  recipients: number
}

const sidebarItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/members", label: "Members", icon: "👥" },
  { href: "/admin/billing", label: "Billing", icon: "💳" },
  { href: "/admin/classes", label: "Classes", icon: "📅" },
  { href: "/admin/staff", label: "Staff", icon: "👔" },
  { href: "/admin/reports", label: "Reports", icon: "📈" },
]

export default function CommunicationsPage() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [communications, setCommunications] = useState<Communication[]>([
    {
      id: "COM-001",
      subject: "New Class Schedule Available",
      message: "Check out our new summer class schedule!",
      recipient: "all",
      type: "email",
      sentAt: "2024-03-01 10:30 AM",
      status: "sent",
      openRate: 65,
      recipients: 124,
    },
    {
      id: "COM-002",
      subject: "Membership Renewal Reminder",
      message: "Your membership expires in 7 days. Renew now!",
      recipient: "active",
      type: "sms",
      sentAt: "2024-02-28 09:00 AM",
      status: "sent",
      openRate: 82,
      recipients: 45,
    },
    {
      id: "COM-003",
      subject: "Come Back to the Gym!",
      message: "We miss you! Check out our latest offers.",
      recipient: "inactive",
      type: "email",
      sentAt: "2024-02-25 03:00 PM",
      status: "sent",
      openRate: 38,
      recipients: 89,
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "email" | "sms" | "push">("all")
  const [showCommunicationModal, setShowCommunicationModal] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    if (role === "admin") {
      setIsAuthorized(true)
    } else {
      window.location.href = "/"
    }
  }, [])

  if (!isAuthorized) return null

  const filteredCommunications = communications.filter((comm) => {
    const matchesSearch =
      comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || comm.type === typeFilter
    return matchesSearch && matchesType
  })

  const stats = {
    totalSent: communications.filter((c) => c.status === "sent").length,
    avgOpenRate: Math.round(communications.reduce((sum, c) => sum + (c.openRate || 0), 0) / communications.length),
    totalRecipients: communications.reduce((sum, c) => sum + c.recipients, 0),
  }

  const addCommunication = (newComm: Omit<Communication, "id" | "sentAt" | "openRate">) => {
    const comm: Communication = {
      ...newComm,
      id: `COM-${String(communications.length + 1).padStart(3, "0")}`,
      sentAt: new Date().toLocaleString(),
      openRate: 0,
    }
    setCommunications([...communications, comm])
    setShowCommunicationModal(false)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="admin" items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="admin" />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Communications</h1>
              <p className="text-muted-foreground">Manage member communications and notifications</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="border-2">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Messages Sent</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalSent}</p>
                  <p className="text-xs text-primary mt-2">This month</p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Avg Open Rate</p>
                  <p className="text-2xl font-bold text-foreground">{stats.avgOpenRate}%</p>
                  <p className="text-xs text-primary mt-2">All messages</p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Recipients</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalRecipients}</p>
                  <p className="text-xs text-muted-foreground mt-2">Across all messages</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Communication History</CardTitle>
                  <CardDescription>All sent communications and notifications</CardDescription>
                </div>
                <Button onClick={() => setShowCommunicationModal(true)} className="bg-primary hover:bg-primary/90">
                  Send Message
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <Input
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as any)}
                    className="px-3 py-2 border border-input rounded-md bg-background text-foreground min-w-40"
                  >
                    <option value="all">All Types</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push">Push</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Subject</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Recipients</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Open Rate</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Sent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCommunications.map((comm) => (
                        <tr key={comm.id} className="border-b border-border hover:bg-secondary/5">
                          <td className="py-3 px-4 font-medium text-foreground">{comm.subject}</td>
                          <td className="py-3 px-4">
                            <Badge variant="secondary" className="capitalize">
                              {comm.type}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{comm.recipients}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                comm.status === "sent"
                                  ? "default"
                                  : comm.status === "failed"
                                    ? "destructive"
                                    : "secondary"
                              }
                              className="capitalize"
                            >
                              {comm.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-semibold text-foreground">{comm.openRate}%</td>
                          <td className="py-3 px-4 text-muted-foreground text-sm">{comm.sentAt}</td>
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

      <CommunicationModal
        isOpen={showCommunicationModal}
        onClose={() => setShowCommunicationModal(false)}
        onAdd={addCommunication}
      />
    </div>
  )
}
