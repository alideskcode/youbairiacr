"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '@/hooks/use-admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UPIQRCode } from '@/components/upi-qr-code';
import { DollarSign, Download, QrCode, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Payout {
  id: string;
  submissionId: string;
  amount: number;
  status: string;
  createdAt: string;
  processedAt?: string;
  paymentMethod?: string;
  upiId?: string;
  submission: {
    content: string;
    task: {
      title: string;
      budget: number;
      seller: {
        user: {
          name: string;
          email: string;
        };
      };
    };
  };
  marketer: {
    user: {
      name: string;
      email: string;
    };
  };
}

export default function AdminPayoutsPage() {
  const { isReady, isAdmin, getAuthHeaders } = useAdmin();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const fetchPayouts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const headers = await getAuthHeaders();
      const response = await fetch(`/api/admin/payouts?${params}`, { headers });

      if (response.ok) {
        const data = await response.json();
        setPayouts(data.payouts ?? []);
      } else {
        const body = await response.json().catch(() => ({}));
        toast.error(body.error ?? 'Failed to fetch payouts');
        setPayouts([]);
      }
    } catch (error) {
      console.error('Error fetching payouts:', error);
      toast.error('Failed to fetch payouts');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, getAuthHeaders]);

  useEffect(() => {
    if (isReady && isAdmin) {
      fetchPayouts();
    }
  }, [isReady, isAdmin, fetchPayouts]);

  const processPayout = async (submissionId: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/admin/payouts', {
        method: 'POST',
        headers,
        body: JSON.stringify({ submissionId }),
      });

      if (response.ok) {
        toast.success('Payout processed successfully!');
        fetchPayouts();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to process payout');
      }
    } catch (error) {
      console.error('Error processing payout:', error);
      toast.error('Failed to process payout');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (!isReady) {
    return <p className="text-muted-foreground">Loading admin...</p>;
  }

  if (!isAdmin) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6">
        <h2 className="font-semibold text-destructive">Admin access denied</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Add your email to ADMIN_EMAILS and NEXT_PUBLIC_ADMIN_EMAILS in .env.local.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Payout Management</h1>
        <p className="text-gray-600">
          Process payments for approved content submissions
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Payouts List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : payouts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No payouts found</h3>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? 'No payouts have been created yet.' 
                : `No payouts with status "${statusFilter}" found.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {payouts.map((payout) => (
            <Card key={payout.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {payout.submission.task.title}
                    </CardTitle>
                    <CardDescription>
                      Payout for content submission
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(payout.status)}>
                      {payout.status}
                    </Badge>
                    <span className="text-lg font-bold text-green-600">
                      ₹{payout.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Content Creator</h4>
                    <p className="text-sm text-gray-600">
                      {payout.marketer.user.name} ({payout.marketer.user.email})
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Task Owner</h4>
                    <p className="text-sm text-gray-600">
                      {payout.submission.task.seller.user.name} ({payout.submission.task.seller.user.email})
                    </p>
                  </div>
                </div>

                <div className="mt-3 text-sm text-gray-600">
                  <p><strong>Content:</strong> {payout.submission.content.substring(0, 100)}...</p>
                  {payout.paymentMethod === 'PAYTM_UPI' && payout.upiId && (
                    <p><strong>Paytm UPI ID:</strong> {payout.upiId}</p>
                  )}
                  {payout.stripePayoutId && (
                    <p><strong>Payment ID:</strong> {payout.stripePayoutId}</p>
                  )}
                  <p><strong>Payment Method:</strong> {payout.paymentMethod || 'PAYTM_UPI'}</p>
                  <p><strong>Created:</strong> {formatDate(payout.createdAt)}</p>
                  {payout.processedAt && (
                    <p><strong>Processed:</strong> {formatDate(payout.processedAt)}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  {payout.status === 'PENDING' && (
                    <>
                      <Button 
                        onClick={() => processPayout(payout.submissionId)}
                        className="flex items-center gap-2"
                      >
                        <DollarSign className="h-4 w-4" />
                        Process Payout
                      </Button>
                      
                      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline"
                            onClick={() => setSelectedPayout(payout)}
                            className="flex items-center gap-2"
                          >
                            <QrCode className="h-4 w-4" />
                            Generate QR
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Generate Payment QR Code</DialogTitle>
                          </DialogHeader>
                          {selectedPayout && (
                            <UPIQRCode 
                              amount={selectedPayout.amount}
                              description={`Payout for: ${selectedPayout.submission.task.title}`}
                              onPaymentComplete={() => {
                                setShowQRModal(false);
                                processPayout(selectedPayout.submissionId);
                              }}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Payout Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold">Task</h4>
                          <p className="text-sm text-gray-600">{payout.submission.task.title}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Content</h4>
                          <p className="text-sm text-gray-600">{payout.submission.content}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold">Amount</h4>
                            <p className="text-sm text-gray-600">₹{payout.amount.toFixed(2)}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Status</h4>
                            <Badge className={getStatusColor(payout.status)}>
                              {payout.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
