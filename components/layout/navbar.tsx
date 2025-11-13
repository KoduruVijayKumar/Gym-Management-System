"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface NavbarProps {
  role?: string
  onLogout?: () => void
}

export function Navbar({ role, onLogout }: NavbarProps) {
  const handleLogout = () => {
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userRole")
    window.location.href = "/"
    onLogout?.()
  }

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            💪
          </div>
          <span className="font-semibold text-lg text-foreground">FitHub</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          {role && <span className="text-xs md:text-sm text-muted-foreground capitalize">{role}</span>}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
