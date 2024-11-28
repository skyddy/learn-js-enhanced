import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { getInvoiceStatus } from '@/lib/monobank';
import { toast } from 'sonner';

export function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get('invoiceId');

  useEffect(() => {
    if (invoiceId) {
      getInvoiceStatus(invoiceId)
        .then(status => {
          if (status.status !== 'success') {
            toast.error('Payment was not successful');
            navigate('/pricing');
          }
        })
        .catch(error => {
          console.error('Error checking payment status:', error);
          toast.error('Failed to verify payment');
        });
    }
  }, [invoiceId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold">Payment Successful!</h1>
        <p className="text-muted-foreground">
          Thank you for your payment. Your account has been upgraded.
        </p>
        <div className="pt-4">
          <Button onClick={() => navigate('/learn')} className="w-full">
            Start Learning
          </Button>
        </div>
      </Card>
    </div>
  );
}