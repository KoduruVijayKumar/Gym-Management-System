"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { Badge } from "@/components/ui/badge"
import { InvoicePdf } from "@/components/member/invoice-pdf"

interface Invoice {
  id: string
  amount: number
  status: "paid" | "pending" | "overdue"
  dueDate: string
  issueDate: string
  type: "membership" | "personal-training" | "other"
}

const sidebarItems = [
  { href: "/member/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/member/profile", label: "Profile", icon: "👤" },
  { href: "/member/classes", label: "Classes", icon: "📅" },
  { href: "/member/billing", label: "Billing", icon: "💳" },
  { href: "/member/bookings", label: "My Bookings", icon: "📍" },
]

export default function MemberBillingPage() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-001",
      amount: 150,
      status: "paid",
      dueDate: "2024-02-15",
      issueDate: "2024-02-01",
      type: "membership",
    },
    {
      id: "INV-002",
      amount: 150,
      status: "pending",
      dueDate: "2024-03-15",
      issueDate: "2024-03-01",
      type: "membership",
    },
    {
      id: "INV-003",
      amount: 200,
      status: "pending",
      dueDate: "2024-02-28",
      issueDate: "2024-02-14",
      type: "personal-training",
    },
  ])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showPdf, setShowPdf] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    if (role === "member") {
      setIsAuthorized(true)
    } else {
      window.location.href = "/"
    }
  }, [])

  if (!isAuthorized) return null

  const stats = {
    totalPaid: invoices.reduce((sum, inv) => (inv.status === "paid" ? sum + inv.amount : sum), 0),
    totalDue: invoices.reduce((sum, inv) => (inv.status !== "paid" ? sum + inv.amount : sum), 0),
    pendingCount: invoices.filter((inv) => inv.status === "pending").length,
  }

  const handleViewPdf = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowPdf(true)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="member" items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="member" />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Billing</h1>
              <p className="text-muted-foreground">View your invoices and payment history</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="border-2">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
                  <p className="text-2xl font-bold text-foreground">${stats.totalPaid}</p>
                  <p className="text-xs text-primary mt-2">All time</p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Amount Due</p>
                  <p className="text-2xl font-bold text-destructive">${stats.totalDue}</p>
                  <p className="text-xs text-destructive mt-2">{stats.pendingCount} invoices pending</p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Membership Renewal</p>
                  <p className="text-2xl font-bold text-foreground">Mar 15, 2024</p>
                  <p className="text-xs text-muted-foreground mt-2">23 days remaining</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Invoice History</CardTitle>
                <CardDescription>Your recent invoices and receipts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Invoice</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-border hover:bg-secondary/5">
                          <td className="py-3 px-4 font-medium text-foreground">{invoice.id}</td>
                          <td className="py-3 px-4 text-muted-foreground capitalize">
                            {invoice.type.replace("-", " ")}
                          </td>
                          <td className="py-3 px-4 font-semibold text-foreground">${invoice.amount}</td>
                          <td className="py-3 px-4 text-muted-foreground">{invoice.issueDate}</td>
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewPdf(invoice)}
                              className="text-primary hover:text-primary"
                            >
                              View Receipt
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 mt-6">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Your saved payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                  <div>
                    <p className="font-semibold text-foreground">Visa ending in 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/25</p>
                  </div>
                  <Badge variant="default">Default</Badge>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {showPdf && selectedInvoice && <InvoicePdf invoice={selectedInvoice} onClose={() => setShowPdf(false)} />}
    </div>
  )
}
