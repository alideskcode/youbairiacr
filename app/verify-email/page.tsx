"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { Mail, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [canResend, setCanResend] = useState(false)
  const [resendCount, setResendCount] = useState(0)
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    // Get email from session or redirect to signup
    const getSessionEmail = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session?.user?.email) {
        setEmail(data.session.user.email)
        setCanResend(true)
      } else {
        router.push("/signup")
      }
    }

    getSessionEmail()
  }, [router])

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else if (timer === 0 && resendCount > 0) {
      setCanResend(true)
    }
  }, [timer, resendCount])

  const handleResendEmail = async () => {
    if (!canResend || !email) return

    setIsLoading(true)
    setCanResend(false)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })

      if (error) {
        throw new Error(error.message)
      }

      setResendCount(prev => prev + 1)
      setTimer(60)
      toast.success("Verification email sent! Check your inbox.")
    } catch (error) {
      console.error("Resend error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to resend email.")
      setCanResend(true)
    } finally {
      setIsLoading(false)
    }
  }

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
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
              <CardDescription>
                We've sent a verification link to confirm your account
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-300 ml-2">
                {email && (
                  <>
                    We sent a confirmation link to <strong>{email}</strong>. Click it to verify your email and activate your account.
                  </>
                )}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm">What's next?</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Check your inbox and spam folder</span>
                </li>
                <li className="flex gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground flex items-center justify-center text-xs flex-shrink-0">
                    2
                  </div>
                  <span>Click the verification link in the email</span>
                </li>
                <li className="flex gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground flex items-center justify-center text-xs flex-shrink-0">
                    3
                  </div>
                  <span>Your account will be activated</span>
                </li>
              </ol>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email?
              </p>
              <Button
                onClick={handleResendEmail}
                disabled={!canResend || isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Resending...
                  </>
                ) : canResend ? (
                  "Resend Verification Email"
                ) : (
                  `Resend in ${timer}s`
                )}
              </Button>
            </div>

            <div className="pt-4 border-t">
              <Link href="/login">
                <Button variant="ghost" className="w-full" asChild>
                  <span className="flex items-center justify-center gap-2">
                    Back to Sign In
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-sm">
            <Mail className="h-4 w-4" />
            <span>Email verification keeps your account secure</span>
          </div>
        </div>
      </div>
    </div>
  )
}
