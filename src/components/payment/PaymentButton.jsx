import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createInvoice } from '@/lib/monobank';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function PaymentButton({ amount, productName, quantity = 1 }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const reference = `order_${Date.now()}`;
      const response = await createInvoice({
        amount: amount * 100, // Convert to kopecks
        merchantPaymInfo: {
          reference,
          destination: `Payment for ${productName}`,
          basketOrder: [{
            name: productName,
            qty: quantity,
            sum: amount * 100,
          }],
        },
        redirectUrl: `${window.location.origin}/payment/success`,
        webHookUrl: `${window.location.origin}/api/payment/webhook`,
      });

      // Redirect to Monobank payment page
      window.location.href = response.pageUrl;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? 'Processing...' : `Pay ${amount} UAH`}
    </Button>
  );
}