import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">YOUBAIRIA</h3>
            <p className="text-muted-foreground text-sm">
              Your trusted digital marketplace for quality digital products, software, and creative assets.
            </p>
            <div className="flex space-x-4">
              
              <Link href="https://www.x.com/youbairia" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://www.instagram.com/youbairia" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-muted-foreground hover:text-primary transition-colors">
                  Sell Your Products
                </Link>
              </li>
              <li>
                <Link href="/create-shop" className="text-muted-foreground hover:text-primary transition-colors">
                  Create Shop
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-muted-foreground hover:text-primary transition-colors">
                  Special Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact-us" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping-and-delivery" className="text-muted-foreground hover:text-primary transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/cancellation-and-refund" className="text-muted-foreground hover:text-primary transition-colors">
                  Cancellation & Refund
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">youbairia@outlook.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">+917983009243</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Dehradun, india</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} YOUBAIRIA. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/contact-us" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
