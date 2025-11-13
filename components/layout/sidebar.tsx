"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarProps {
  role: string
  items: Array<{
    href: string
    label: string
    icon?: string
  }>
}

export function Sidebar({ role, items }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-64 bg-sidebar border-r border-sidebar-border flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="font-semibold text-lg text-sidebar-foreground capitalize">{role} Portal</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sidebar-foreground",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              {item.icon && <span className="text-xl">{item.icon}</span>}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
