import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Toaster } from 'sonner'
import { SessionProvider } from '@/components/session-provider'
import { CartNotification } from './components/cart-notification'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Digital Marketplace',
  description: 'Your one-stop shop for digital products',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col items-center">
              <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
            <Footer />
          </div>
          <Toaster richColors position="top-center" />
          <CartNotification />
        </SessionProvider>
      </body>
    </html>
  )
}
