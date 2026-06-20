import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t shadow-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  {/* Company Info */}
  <div className="space-y-4">
    <h3 className="text-lg font-bold">YOUBAIRIA</h3>
    <p className="text-gray-600 text-sm">
      Buy, sell, and monetize digital products instantly.
    </p>
    <div className="flex space-x-4">
      
      <Link href="https://www.x.com/youbairia" className="text-gray-600 hover:text-black transition-colors">
        <Twitter className="h-5 w-5" />
      </Link>
      <Link href="https://www.instagram.com/youbairia" className="text-gray-600 hover:text-black transition-colors">
        <Instagram className="h-5 w-5" />
      </Link>
      
    </div>
  </div>

  {/* Quick Links */}
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Quick Links</h3>
    <ul className="space-y-2 text-sm">
      <li>
        <Link href="/products" className="text-gray-600 hover:text-black transition-colors">
          Products
        </Link>
      </li>
      <li>
        <Link href="/campaigns" className="text-gray-600 hover:text-black transition-colors">
          Campaigns
        </Link>
      </li>
      <li>
        <Link href="/sell" className="text-gray-600 hover:text-black transition-colors">
          Sell Products
        </Link>
      </li>
    </ul>
  </div>

  {/* Support */}
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Support</h3>
    <ul className="space-y-2 text-sm">
      <li>
        <Link href="/contact-us" className="text-gray-600 hover:text-black transition-colors">
          Contact Us
        </Link>
      </li>
      <li>
        <Link href="/shipping-and-delivery" className="text-gray-600 hover:text-black transition-colors">
          Shipping & Delivery
        </Link>
      </li>
    </ul>
  </div>

  {/* Legal */}
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Legal</h3>
    <ul className="space-y-2 text-sm">
      <li>
        <Link href="/privacy-policy" className="text-gray-600 hover:text-black transition-colors">
          Privacy Policy
        </Link>
      </li>
      <li>
        <Link href="/terms-and-conditions" className="text-gray-600 hover:text-black transition-colors">
          Terms & Conditions
        </Link>
      </li>
    </ul>
  </div>
        </div>

  {/* Contact Info */}
  <div className="border-t mt-8 pt-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="flex items-center space-x-2">
        <Mail className="h-4 w-4 text-gray-600" />
        <span className="text-sm text-gray-600">info@youbairia.com</span>
      </div>
      <div className="flex items-center space-x-2">
        <Phone className="h-4 w-4 text-gray-600" />
        <span className="text-sm text-gray-600">+917983009243</span>
      </div>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
    <p className="text-sm text-gray-600">
      © {new Date().getFullYear()} YOUBAIRIA. All rights reserved.
    </p>
    <div className="flex space-x-6 text-sm text-gray-600">
      <Link href="/privacy-policy" className="hover:text-black transition-colors">
        Privacy
      </Link>
      <Link href="/terms-and-conditions" className="hover:text-black transition-colors">
        Terms
      </Link>
    </div>
  </div>
      </div>
    </footer>
  )
}
