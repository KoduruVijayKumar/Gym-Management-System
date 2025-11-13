"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { InvoiceModal } from "@/components/admin/invoice-modal"

interface Invoice {
  id: string
  memberName: string
  email: string
  amount: number
  status: "paid" | "pending" | "overdue"
  dueDate: string
  issueDate: string
  type: "membership" | "personal-training" | "other"
}

const sidebarItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/members", label: "Members", icon: "👥" },
  { href: "/admin/billing", label: "Billing", icon: "💳" },
  { href: "/admin/classes", label: "Classes", icon: "📅" },
  { href: "/admin/staff", label: "Staff", icon: "👔" },
  { href: "/admin/reports", label: "Reports", icon: "📈" },
]

export default function BillingPage() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-001",
      memberName: "John Doe",
      email: "john@example.com",
      amount: 150,
      status: "paid",
      dueDate: "2024-02-15",
      issueDate: "2024-02-01",
      type: "membership",
    },
    {
      id: "INV-002",
      memberName: "Sarah Smith",
      email: "sarah@example.com",
      amount: 300,
      status: "pending",
      dueDate: "2024-02-20",
      issueDate: "2024-02-06",
      type: "personal-training",
    },
    {
      id: "INV-003",
      memberName: "Mike Johnson",
      email: "mike@example.com",
      amount: 100,
      status: "overdue",
      dueDate: "2024-01-15",
      issueDate: "2024-01-01",
      type: "membership",
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending" | "overdue">("all")
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    if (role === "admin") {
      setIsAuthorized(true)
    } else {
      window.location.href = "/"
    }
  }, [])

  if (!isAuthorized) return null

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalRevenue: invoices.reduce((sum, inv) => (inv.status === "paid" ? sum + inv.amount : sum), 0),
    pendingAmount: invoices.reduce((sum, inv) => (inv.status === "pending" ? sum + inv.amount : sum), 0),
    overdueAmount: invoices.reduce((sum, inv) => (inv.status === "overdue" ? sum + inv.amount : sum), 0),
  }

  const addInvoice = (newInvoice: Omit<Invoice, "id">) => {
    const invoice: Invoice = {
      ...newInvoice,
      id: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
    }
    setInvoices([...invoices, invoice])
    setShowInvoiceModal(false)
  }

  const markAsPaid = (id: string) => {
    setInvoices(invoices.map((inv) => (inv.id === id ? { ...inv, status: "paid" } : inv)))
  }

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter((inv) => inv.id !== id))
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="admin" items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="admin" />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Billing Management</h1>
              <p className="text-muted-foreground">Manage invoices and track payments</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="border-2">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">${stats.totalRevenue}</p>
                  <p className="text-xs text-primary mt-2">Paid invoices</p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Pending Payments</p>
                  <p className="text-2xl font-bold text-foreground">${stats.pendingAmount}</p>
                  <p className="text-xs text-secondary mt-2">
                    {invoices.filter((inv) => inv.status === "pending").length} invoices
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Overdue Amount</p>
                  <p className="text-2xl font-bold text-destructive">${stats.overdueAmount}</p>
                  <p className="text-xs text-destructive mt-2">
                    {invoices.filter((inv) => inv.status === "overdue").length} invoices
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>Manage all billing invoices</CardDescription>
                </div>
                <Button onClick={() => setShowInvoiceModal(true)} className="bg-primary hover:bg-primary/90">
                  Create Invoice
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <Input
                    placeholder="Search by member, email, or invoice ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border border-input rounded-md bg-background text-foreground min-w-40"
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Invoice</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Member</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Due Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-border hover:bg-secondary/5">
                          <td className="py-3 px-4 font-medium text-foreground">{invoice.id}</td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-foreground">{invoice.memberName}</p>
                              <p className="text-xs text-muted-foreground">{invoice.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground capitalize">
                            {invoice.type.replace("-", " ")}
                          </td>
                          <td className="py-3 px-4 font-semibold text-foreground">${invoice.amount}</td>
                          <td className="py-3 px-4 text-muted-foreground">{invoice.dueDate}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                invoice.status === "paid"
                                  ? "default"
                                  : invoice.status === "overdue"
                                    ? "destructive"
                                    : "secondary"
                              }
                              className="capitalize"
                            >
                              {invoice.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              {invoice.status !== "paid" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsPaid(invoice.id)}
                                  className="text-primary hover:text-primary"
                                >
                                  Mark Paid
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteInvoice(invoice.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                Delete
                              </Button>
                            </div>
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

      <InvoiceModal isOpen={showInvoiceModal} onClose={() => setShowInvoiceModal(false)} onAdd={addInvoice} />
    </div>
  )
}
