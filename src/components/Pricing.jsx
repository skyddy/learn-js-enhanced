import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PaymentButton } from './payment/PaymentButton';
import { useAdminStore } from '@/lib/store';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthDialog } from './auth/AuthDialog';
import { useState } from 'react';

const plans = [
  {
    name: 'Basic',
    description: 'Perfect for getting started',
    price: 0,
    features: [
      'Access to basic lessons',
      'Community support',
      'Basic exercises',
      'Progress tracking',
    ],
  },
  {
    name: 'Pro',
    description: 'Best for professional developers',
    price: 1,
    features: [
      'All Basic features',
      'Advanced lessons',
      'Code reviews',
      'Private Discord access',
      'Priority support',
      'Project-based learning',
    ],
  },
  {
    name: 'Enterprise',
    description: 'For teams and organizations',
    price: 2,
    features: [
      'All Pro features',
      'Custom learning paths',
      'Team management',
      'API access',
      'SSO integration',
      'Dedicated support',
      'Custom content',
    ],
  },
];

export function Pricing() {
  const { user } = useAdminStore();
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handlePurchase = (plan) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your learning journey
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={plan.name} className={cn(
              "relative flex flex-col transition-all duration-200",
              index === 1 && "border-primary shadow-lg scale-105"
            )}>
              <CardHeader>
                {index === 1 && (
                  <div className="px-3 py-1 text-xs font-semibold text-primary-foreground bg-primary rounded-full w-fit mb-2">
                    Popular
                  </div>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="text-3xl font-bold">
                  {plan.price === 0 ? 'Free' : `${plan.price} UAH/month`}
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.price === 0 ? (
                  <Button 
                    onClick={() => navigate('/learn')}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                ) : user ? (
                  <PaymentButton 
                    amount={plan.price}
                    productName={`${plan.name} Plan`}
                    quantity={1}
                  />
                ) : (
                  <Button 
                    onClick={() => handlePurchase(plan)}
                    className="w-full"
                  >
                    Sign up to Purchase
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Auth Dialog */}
        <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} defaultIsLogin={false} />
      </div>
    </div>
  );
}