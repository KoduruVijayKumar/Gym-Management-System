"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CommunicationModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (comm: {
    subject: string
    message: string
    recipient: "all" | "active" | "inactive"
    type: "email" | "sms" | "push"
    status: "sent" | "pending" | "failed"
    recipients: number
  }) => void
}

export function CommunicationModal({ isOpen, onClose, onAdd }: CommunicationModalProps) {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    recipient: "all" as const,
    type: "email" as const,
    recipients: 124,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRecipientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const recipientMap: Record<string, number> = {
      all: 124,
      active: 98,
      inactive: 26,
    }
    setFormData((prev) => ({
      ...prev,
      recipient: value as any,
      recipients: recipientMap[value] || 0,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      ...formData,
      status: "sent",
    })
    setFormData({
      subject: "",
      message: "",
      recipient: "all",
      type: "email",
      recipients: 124,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Communication</DialogTitle>
          <DialogDescription>Send a message to your gym members.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Membership Renewal Reminder"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message..."
              rows={4}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Message Type</Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push Notification</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient">Send To</Label>
            <select
              id="recipient"
              name="recipient"
              value={formData.recipient}
              onChange={handleRecipientChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="all">All Members (124)</option>
              <option value="active">Active Members (98)</option>
              <option value="inactive">Inactive Members (26)</option>
            </select>
          </div>

          <p className="text-xs text-muted-foreground bg-secondary/10 p-2 rounded">
            This message will be sent to {formData.recipients} members.
          </p>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
              Send
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
