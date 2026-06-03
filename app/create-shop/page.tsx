"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle2, Clock, FileText, Shield, Sparkles, TrendingUp, Zap, Users, Globe, Rocket } from "lucide-react"
import Link from "next/link"
import SellerForm from "@/app/components/seller-form"

export default function CreateShopPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container relative mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Start selling in minutes</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 animate-fade-in-up leading-tight">
            Make Campaigns To Market Your Products & Services.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Join the fastest growing marketplace for digital products. 
            <span className="text-primary font-medium">Zero setup time.</span> Maximum earnings.
          </p>
        </div>

        {/* Seller Form Section */}
        <div className="max-w-2xl mx-auto mb-20">
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Create Campaign</CardTitle>
              <CardDescription>
                Add your campaign details to start marketing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SellerForm />
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm group">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Quick Setup</CardTitle>
              <CardDescription>Get your shop up and running in under 5 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                  <span>Simple registration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                  <span>Easy product upload</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                  <span>Instant shop creation</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm group">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Maximize Earnings</CardTitle>
              <CardDescription>Keep 80% of your sales</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                  <span>No platform fees</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                  <span>Instant payouts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                  <span>Multiple payment methods</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm group">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Secure & Reliable</CardTitle>
              <CardDescription>Built-in security and reliability</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                  <span>Secure payments</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                  <span>Digital delivery</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                  <span>24/7 support</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 group hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
            <p className="text-muted-foreground">Access customers from around the world with our global marketplace.</p>
          </div>
          <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 group hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground">Track your sales and growth with detailed analytics and insights.</p>
          </div>
          <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 group hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Rocket className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Marketing Tools</h3>
            <p className="text-muted-foreground">Promote your products with built-in marketing and SEO tools.</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="space-y-6">
            <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300" asChild>
              <Link href="/sell">
                Create Your Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
               Already have a Shop? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
