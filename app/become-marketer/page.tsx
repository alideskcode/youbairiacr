"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, TrendingUp, Star, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const contentTypes = [
  { id: 'UGC', label: 'User Generated Content (UGC)', description: 'Authentic content from real users' },
  { id: 'REEL', label: 'Instagram/TikTok Reels', description: 'Short-form video content' },
  { id: 'TWEET', label: 'Social Media Posts', description: 'Twitter, LinkedIn, Facebook posts' },
  { id: 'BLOG_POST', label: 'Blog Posts & Articles', description: 'Long-form written content' },
  { id: 'VIDEO', label: 'Video Content', description: 'YouTube videos, tutorials, reviews' },
];

export default function BecomeMarketerPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    specialties: [] as string[],
    portfolio: '',
    socialLinks: {
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: '',
    },
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      setSession(authSession);
    } catch (error) {
      console.error("Auth check failed:", error);
    }
  };

  const handleSpecialtyToggle = (specialtyId: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialtyId)
        ? prev.specialties.filter(id => id !== specialtyId)
        : [...prev.specialties, specialtyId],
    }));
  };

  const handleSubmit = async () => {
    if (!session?.user) {
      toast.error('Please sign in to register as a marketer');
      return;
    }

    if (!formData.bio.trim()) {
      toast.error('Please provide a bio');
      return;
    }

    if (formData.specialties.length === 0) {
      toast.error('Please select at least one content specialty');
      return;
    }

    setRegistering(true);
    try {
      const response = await fetch('/api/marketers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio: formData.bio,
          specialties: formData.specialties,
          portfolio: formData.portfolio || undefined,
          socialLinks: Object.values(formData.socialLinks).some(link => link.trim()) 
            ? formData.socialLinks 
            : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Successfully registered as a marketer!');
        router.push('/rewards');
      } else {
        toast.error(data.error || 'Failed to register as marketer');
      }
    } catch (error) {
      console.error('Error registering as marketer:', error);
      toast.error('Failed to register as marketer');
    } finally {
      setRegistering(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to your account to register as a marketer.
          </p>
          <Button onClick={() => router.push('/signin')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Become a Content Creator</h1>
          <p className="text-xl text-gray-600 mb-8">
            Join our community of creators and earn money by creating content for amazing products
          </p>
          
          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center justify-center gap-3 p-4 bg-green-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <h3 className="font-semibold">Earn Money</h3>
                <p className="text-sm text-gray-600">Get paid for your content</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="text-left">
                <h3 className="font-semibold">Build Portfolio</h3>
                <p className="text-sm text-gray-600">Showcase your work</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="text-left">
                <h3 className="font-semibold">Grow Your Brand</h3>
                <p className="text-sm text-gray-600">Expand your reach</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create Your Creator Profile</CardTitle>
              <CardDescription>
                Tell us about yourself and your content creation skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself, your experience, and what makes you unique as a content creator..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <Label>Content Specialties *</Label>
                <p className="text-sm text-gray-600 mb-3">
                  Select the types of content you specialize in creating
                </p>
                <div className="space-y-3">
                  {contentTypes.map((type) => (
                    <div key={type.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={type.id}
                        checked={formData.specialties.includes(type.id)}
                        onCheckedChange={() => handleSpecialtyToggle(type.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={type.id} className="font-medium cursor-pointer">
                          {type.label}
                        </Label>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="portfolio">Portfolio URL (Optional)</Label>
                <Input
                  id="portfolio"
                  type="url"
                  placeholder="https://your-portfolio.com"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                />
              </div>

              <div>
                <Label>Social Media Links (Optional)</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Input
                    placeholder="Instagram"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                    })}
                  />
                  <Input
                    placeholder="Twitter"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                    })}
                  />
                  <Input
                    placeholder="LinkedIn"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                    })}
                  />
                  <Input
                    placeholder="YouTube"
                    value={formData.socialLinks.youtube}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, youtube: e.target.value }
                    })}
                  />
                </div>
              </div>

              <Button 
                onClick={handleSubmit} 
                disabled={registering}
                className="w-full"
              >
                {registering ? 'Creating Profile...' : 'Create Creator Profile'}
              </Button>
            </CardContent>
          </Card>

          {/* How It Works */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Browse Opportunities</h3>
                    <p className="text-sm text-gray-600">
                      Explore available content creation tasks from various sellers
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Submit Your Content</h3>
                    <p className="text-sm text-gray-600">
                      Create and submit content that meets the seller's requirements
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Get Approved & Paid</h3>
                    <p className="text-sm text-gray-600">
                      Receive payment once your content is approved by the seller
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Why Join Our Platform?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Direct payment for your work</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Build relationships with brands</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Flexible content types</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Grow your personal brand</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Professional portfolio building</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ready to Start?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Once you create your profile, you'll be able to browse and apply for content creation opportunities.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/rewards')}
                >
                  Browse Opportunities
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
