"use client"

export const dynamic = "force-dynamic"

import { useCallback, useEffect, useState } from "react"
import { CreditCard, Save, Settings } from "lucide-react"
import { toast } from "sonner"

import { useAdmin } from "@/hooks/use-admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

const LOCAL_STORAGE_KEY = "youbairia_payment_settings"

type PaymentSettings = {
  paytmUpiId: string
  merchantName: string
  currency: string
  updatedAt?: string | null
}

const defaultSettings: PaymentSettings = {
  paytmUpiId: "",
  merchantName: "Digital Marketplace",
  currency: "INR",
}

export default function PaymentSettingsPage() {
  const { isReady, isAdmin, getAuthHeaders } = useAdmin()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<PaymentSettings>(defaultSettings)
  const [loadedFrom, setLoadedFrom] = useState<"api" | "local" | null>(null)

  const loadSettings = useCallback(async () => {
    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      const response = await fetch("/api/admin/payment-settings", { headers })

      if (response.ok) {
        const data = await response.json()
        setSettings({
          paytmUpiId: data.paytmUpiId ?? "",
          merchantName: data.merchantName ?? defaultSettings.merchantName,
          currency: data.currency ?? "INR",
          updatedAt: data.updatedAt,
        })
        setLoadedFrom("api")
        return
      }

      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (stored) {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) })
        setLoadedFrom("local")
      }
    } catch (error) {
      console.error("Error loading settings:", error)
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (stored) {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) })
        setLoadedFrom("local")
      }
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders])

  useEffect(() => {
    if (isReady && isAdmin) {
      loadSettings()
    }
  }, [isReady, isAdmin, loadSettings])

  const handleSave = async () => {
    if (!settings.paytmUpiId.trim()) {
      toast.error("Paytm UPI ID is required")
      return
    }

    setSaving(true)
    try {
      const headers = await getAuthHeaders()
      const response = await fetch("/api/admin/payment-settings", {
        method: "PUT",
        headers,
        body: JSON.stringify(settings),
      })

      const body = await response.json().catch(() => ({}))

      if (response.ok) {
        setSettings({
          paytmUpiId: body.paytmUpiId,
          merchantName: body.merchantName,
          currency: body.currency,
          updatedAt: body.updatedAt,
        })
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(body))
        setLoadedFrom("api")
        toast.success("Payment settings saved")
        return
      }

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings))
      setLoadedFrom("local")
      toast.warning(
        body.hint ??
          "Saved locally only. Run supabase/admin-setup.sql in Supabase to enable database storage."
      )
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (!isReady) {
    return <p className="text-muted-foreground">Loading...</p>
  }

  if (!isAdmin) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6">
        <h2 className="font-semibold text-destructive">Admin access denied</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Add your email to ADMIN_EMAILS in .env.local to manage payment settings.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure Paytm UPI details used for marketplace payouts.
        </p>
        {loadedFrom === "local" && (
          <p className="text-sm text-amber-600 mt-2">
            Showing locally saved settings. Run <code className="text-xs">supabase/admin-setup.sql</code> in Supabase for server persistence.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Paytm UPI Configuration
            </CardTitle>
            <CardDescription>
              Configure your Paytm UPI ID for receiving payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading settings...</p>
            ) : (
              <>
                <div>
                  <Label htmlFor="paytmUpiId">Paytm UPI ID *</Label>
                  <Input
                    id="paytmUpiId"
                    type="text"
                    placeholder="your-upi-id@paytm"
                    value={settings.paytmUpiId}
                    onChange={(e) =>
                      setSettings({ ...settings, paytmUpiId: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="merchantName">Merchant Name</Label>
                  <Input
                    id="merchantName"
                    type="text"
                    value={settings.merchantName}
                    onChange={(e) =>
                      setSettings({ ...settings, merchantName: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    type="text"
                    value={settings.currency}
                    disabled
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleSave}
                  disabled={saving || !settings.paytmUpiId.trim()}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Current Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Payment Method</span>
              <Badge>Paytm UPI</Badge>
            </div>
            <div className="flex justify-between gap-4">
              <span className="font-medium">UPI ID</span>
              <span className="font-mono text-right break-all">
                {settings.paytmUpiId || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Merchant</span>
              <span>{settings.merchantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status</span>
              <Badge variant="outline" className="text-green-600">
                {settings.paytmUpiId ? "Active" : "Not configured"}
              </Badge>
            </div>
            {settings.updatedAt && (
              <p className="text-xs text-muted-foreground">
                Last saved: {new Date(settings.updatedAt).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
