import Link from "next/link"

const adminLinks = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/payouts", label: "Payouts" },
  { href: "/admin/payment-settings", label: "Payment settings" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin/products" className="font-semibold">
              Admin
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Back to site
          </Link>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  )
}
