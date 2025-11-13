"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("member")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Store credentials in localStorage for demo
    localStorage.setItem("userEmail", email)
    localStorage.setItem("userRole", role)
    // Redirect based on role
    if (role === "admin") {
      window.location.href = "/admin/dashboard"
    } else if (role === "staff") {
      window.location.href = "/staff/dashboard"
    } else {
      window.location.href = "/member/dashboard"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              💪
            </div>
          </div>
          <CardTitle className="text-2xl text-center">FitHub Gym</CardTitle>
          <CardDescription className="text-center">Professional Gym Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Tabs defaultValue="login" onValueChange={(v) => setIsLogin(v === "login")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@fithub.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Login As</Label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                    <option value="member">Member</option>
                  </select>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Sign In
                </Button>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Demo: Use any email/password. New accounts default to Member role.
                </p>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={(e) => {
                    e.preventDefault()
                    setRole("member")
                    handleSubmit(e)
                  }}
                >
                  Create Account
                </Button>
              </TabsContent>
            </Tabs>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Demo Credentials</span>
              </div>
            </div>

            <div className="space-y-2 p-3 bg-secondary/20 rounded-lg text-sm">
              <p className="font-semibold text-foreground">Test Accounts:</p>
              <p className="text-muted-foreground">Admin: admin@fithub.com</p>
              <p className="text-muted-foreground">Staff: staff@fithub.com</p>
              <p className="text-muted-foreground">Member: member@fithub.com</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
