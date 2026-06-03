"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Eye, EyeOff, Lock, Mail, User, Shield, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      console.log("Starting signup with email:", formData.email)
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/api/auth/callback` : `http://localhost:3000/api/auth/callback`,
          data: {
            full_name: formData.name.trim(),
          },
        },
      })

      console.log("Signup response - error:", error, "data:", data)

      if (error) {
        throw new Error(error.message)
      }

      if (data.user) {
        toast.success("Verification email sent! Please check your inbox.")
        router.push("/verify-email")
      }
    } catch (error) {
      console.error("Signup error:", error)
      const errorMessage = error instanceof Error ? error.message : "Signup failed. Please try again."
      console.error("Full error details:", { error, errorMessage })
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? `${window.location.origin}/api/auth/callback` : `http://localhost:3000/api/auth/callback`,
        },
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error("Google signup error:", error)
      toast.error(error instanceof Error ? error.message : "Google signup failed. Please try again.")
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  const getPasswordStrength = () => {
    if (!formData.password) return { strength: 0, color: "text-muted-foreground", text: "" }
    
    let strength = 0
    if (formData.password.length >= 8) strength++
    if (/[a-z]/.test(formData.password)) strength++
    if (/[A-Z]/.test(formData.password)) strength++
    if (/\d/.test(formData.password)) strength++
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++

    const colors = ["text-red-500", "text-orange-500", "text-yellow-500", "text-blue-500", "text-green-500"]
    const texts = ["Very Weak", "Weak", "Fair", "Good", "Strong"]
    
    return {
      strength: Math.min(strength, 5),
      color: colors[Math.min(strength - 1, 4)],
      text: texts[Math.min(strength - 1, 4)]
    }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription>
                Join our marketplace and start selling digital products
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color.replace('text-', 'bg-')}`}
                          style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs ${passwordStrength.color}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {formData.password.length >= 8 ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <div className="h-3 w-3 rounded-full border border-muted-foreground" />
                        )}
                        At least 8 characters
                      </div>
                      <div className="flex items-center gap-1">
                        {/[a-z]/.test(formData.password) ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <div className="h-3 w-3 rounded-full border border-muted-foreground" />
                        )}
                        Lowercase letter
                      </div>
                      <div className="flex items-center gap-1">
                        {/[A-Z]/.test(formData.password) ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <div className="h-3 w-3 rounded-full border border-muted-foreground" />
                        )}
                        Uppercase letter
                      </div>
                      <div className="flex items-center gap-1">
                        {/\d/.test(formData.password) ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <div className="h-3 w-3 rounded-full border border-muted-foreground" />
                        )}
                        Number
                      </div>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <Separator />

            <Button 
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
              Continue with Google
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
              <p className="text-xs text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-sm">
            <Shield className="h-4 w-4" />
            <span>Secure registration with strong password requirements</span>
          </div>
        </div>
      </div>
    </div>
  )
}
