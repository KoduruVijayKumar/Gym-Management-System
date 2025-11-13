"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface InvoicePdfProps {
  invoice: {
    id: string
    amount: number
    status: "paid" | "pending" | "overdue"
    dueDate: string
    issueDate: string
    type: string
  }
  onClose: () => void
}

export function InvoicePdf({ invoice, onClose }: InvoicePdfProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice {invoice.id}</DialogTitle>
          <DialogDescription>View and download your invoice</DialogDescription>
        </DialogHeader>

        <div className="bg-white p-8 rounded-lg text-black">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">FitHub Gym</h1>
              <p className="text-gray-600">123 Fitness Street</p>
              <p className="text-gray-600">City, ST 12345</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">INVOICE</p>
              <p className="text-gray-600">{invoice.id}</p>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-8">
            <div>
              <p className="font-bold text-sm text-gray-700 mb-1">Bill To:</p>
              <p className="font-semibold">Member Name</p>
              <p className="text-gray-600">member@example.com</p>
            </div>
            <div>
              <p className="font-bold text-sm text-gray-700 mb-1">Invoice Details:</p>
              <p className="text-gray-600">Issue Date: {invoice.issueDate}</p>
              <p className="text-gray-600">Due Date: {invoice.dueDate}</p>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="border-t border-b border-gray-400">
                <th className="text-left py-2 font-bold">Description</th>
                <th className="text-right py-2 font-bold">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 capitalize">{invoice.type.replace("-", " ")}</td>
                <td className="text-right">${invoice.amount}</td>
              </tr>
            </tbody>
          </table>

          <div className="mb-8 flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2 border-t border-gray-400 font-bold">
                <span>TOTAL DUE:</span>
                <span>${invoice.amount}</span>
              </div>
              <div className="py-2 text-gray-600 text-sm">Status: {invoice.status.toUpperCase()}</div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 mt-8">
            <p>Thank you for your business!</p>
            <p>For questions, contact: billing@fithub.com</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handlePrint} className="bg-primary hover:bg-primary/90">
            Print / Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
