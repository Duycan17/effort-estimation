"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { AuthForm } from "@/components/auth/auth-form"
import { Sidebar } from "@/components/layout/sidebar"
import { EffortPredictionForm } from "@/components/effort-prediction-form"
import { ProjectHistory } from "@/components/project-history"
import { DashboardOverview } from "@/components/dashboard/overview"
import { Analytics } from "@/components/dashboard/analytics"
import { FeedbackCenter } from "@/components/dashboard/feedback-center"
import type { User } from "@supabase/supabase-js"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState("dashboard")

  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardOverview onViewChange={setCurrentView} />
      case "prediction":
        return <EffortPredictionForm user={user} />
      case "history":
        return <ProjectHistory onBack={() => setCurrentView("dashboard")} />
      case "analytics":
        return <Analytics />
      case "feedback":
        return <FeedbackCenter />
      default:
        return <DashboardOverview onViewChange={setCurrentView} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar user={user} currentView={currentView} onViewChange={setCurrentView} />

      <main className="flex-1 lg:ml-0 ml-16">
        <div className="p-6 lg:p-8">{renderCurrentView()}</div>
      </main>
    </div>
  )
}
