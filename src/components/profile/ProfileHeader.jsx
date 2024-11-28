import { Badge } from '@/components/ui/badge';
import { Shield, User } from 'lucide-react';

export function ProfileHeader({ user }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
        <User className="h-8 w-8" />
      </div>
      <div>
        <h1 className="text-3xl font-bold">{user.name}</h1>
        <div className="flex items-center gap-2 mt-1">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <Badge variant="secondary" className="capitalize">
            {user.role}
          </Badge>
        </div>
      </div>
    </div>
  );
}