"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, History, BarChart3, Plus, Menu, X, User, LogOut, Star } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface SidebarProps {
  user: SupabaseUser
  currentView: string
  onViewChange: (view: string) => void
}

export function Sidebar({ user, currentView, onViewChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setLoading(false)
  }

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      description: "Overview and quick actions",
    },
    {
      id: "prediction",
      label: "New Prediction",
      icon: Plus,
      description: "Create effort prediction",
    },
    {
      id: "history",
      label: "Project History",
      icon: History,
      description: "View saved projects",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      description: "Prediction insights",
    },
    {
      id: "feedback",
      label: "Feedback Center",
      icon: Star,
      description: "Manage project feedback",
    },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsCollapsed(true)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
          isCollapsed ? "w-16" : "w-64",
          "lg:relative lg:z-auto",
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Effort Predictor</h1>
                <p className="text-xs text-gray-500">Project Management</p>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="lg:hidden">
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-indigo-600" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.user_metadata?.full_name || "User"}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  isCollapsed && "px-2",
                  isActive && "bg-indigo-600 text-white hover:bg-indigo-700",
                )}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && (
                  <div className="text-left">
                    <div className="text-sm font-medium">{item.label}</div>
                    {!isActive && <div className="text-xs text-gray-500">{item.description}</div>}
                  </div>
                )}
              </Button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-10 text-red-600 hover:text-red-700 hover:bg-red-50",
              isCollapsed && "px-2",
            )}
            onClick={handleSignOut}
            disabled={loading}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">{loading ? "Signing out..." : "Sign Out"}</span>}
          </Button>
        </div>
      </div>

      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-40 lg:hidden"
        onClick={() => setIsCollapsed(false)}
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  )
}
