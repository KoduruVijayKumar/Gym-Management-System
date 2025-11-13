"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { Badge } from "@/components/ui/badge"

const sidebarItems = [
  { href: "/member/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/member/profile", label: "Profile", icon: "👤" },
  { href: "/member/classes", label: "Classes", icon: "📅" },
  { href: "/member/billing", label: "Billing", icon: "💳" },
  { href: "/member/bookings", label: "My Bookings", icon: "📍" },
]

export default function ProfilePage() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Member",
    email: "member@example.com",
    phone: "+1 234-567-8900",
    dateOfBirth: "1990-05-15",
    membershipType: "premium",
    joinDate: "2024-01-15",
    emergencyContact: "Jane Member",
    emergencyPhone: "+1 234-567-8901",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="member" items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="member" />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
              <p className="text-muted-foreground">View and update your personal information</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your account details</CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => {
                      if (isEditing) {
                        handleSave()
                      }
                      setIsEditing(!isEditing)
                    }}
                  >
                    {isEditing ? "Save" : "Edit"}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold text-foreground mb-4">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Contact Name</Label>
                        <Input
                          id="emergencyContact"
                          name="emergencyContact"
                          value={profile.emergencyContact}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Phone</Label>
                        <Input
                          id="emergencyPhone"
                          name="emergencyPhone"
                          value={profile.emergencyPhone}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Membership Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Membership Type</p>
                    <Badge variant="default" className="capitalize">
                      {profile.membershipType}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                    <p className="font-semibold text-foreground">{profile.joinDate}</p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <Button className="w-full bg-primary hover:bg-primary/90 mb-2">Upgrade Membership</Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      Download Certificate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
