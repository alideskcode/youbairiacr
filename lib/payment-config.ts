// Payment Configuration for Content Reward Program

export const PAYMENT_CONFIG = {
  PAYTM_UPI: {
    UPI_ID: "9368598307@pthdfc",
    MERCHANT_NAME: "Youbairia",
    CURRENCY: "INR",
  },
  PAYMENT_METHODS: {
    PAYTM_UPI: "PAYTM_UPI",
    STRIPE: "STRIPE",
  },
  DEFAULT_PAYMENT_METHOD: "PAYTM_UPI",
}

const LOCAL_STORAGE_KEY = "youbairia_payment_settings"

type StoredSettings = {
  paytmUpiId?: string
  merchantName?: string
}

function readStoredSettings(): StoredSettings | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredSettings) : null
  } catch {
    return null
  }
}

export function getPaytmUpiId(): string {
  const stored = readStoredSettings()
  if (stored?.paytmUpiId?.trim()) {
    return stored.paytmUpiId.trim()
  }
  return PAYMENT_CONFIG.PAYTM_UPI.UPI_ID
}

export function getMerchantName(): string {
  const stored = readStoredSettings()
  if (stored?.merchantName?.trim()) {
    return stored.merchantName.trim()
  }
  return PAYMENT_CONFIG.PAYTM_UPI.MERCHANT_NAME
}

export function updatePaytmUpiId(newUpiId: string): void {
  PAYMENT_CONFIG.PAYTM_UPI.UPI_ID = newUpiId
}

export function getPaymentMethodDisplayName(method: string): string {
  switch (method) {
    case "PAYTM_UPI":
      return "Paytm UPI"
    case "STRIPE":
      return "Stripe"
    default:
      return method
  }
}
