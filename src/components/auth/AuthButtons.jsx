import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from './AuthDialog';

export function AuthButtons() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <Button variant="outline" onClick={() => {
        setIsLogin(true);
        setIsAuthOpen(true);
      }}>
        Sign In
      </Button>
      <Button onClick={() => {
        setIsLogin(false);
        setIsAuthOpen(true);
      }}>
        Sign Up
      </Button>
      <AuthDialog 
        open={isAuthOpen} 
        onOpenChange={setIsAuthOpen} 
        defaultIsLogin={isLogin} 
      />
    </>
  );
}