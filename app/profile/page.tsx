"use client"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase/client"
import { AuthGuard } from "@/components/auth-guard"
import { toast } from "sonner"

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  )
}

function ProfileContent() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const initials = user.user_metadata?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user.email?.[0]?.toUpperCase() || "U"

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success("Signed out successfully")
    } catch (error) {
      console.error("Error signing out:", error)
      toast.error("Failed to sign out")
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.user_metadata?.avatar_url || user.user_metadata?.picture || ""} alt={user.user_metadata?.full_name || user.email || ""} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-2xl font-bold">{user.user_metadata?.full_name || user.email}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex gap-4 mt-4">
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 