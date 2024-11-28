import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStore } from '@/lib/store';
import { ProfileHeader } from './ProfileHeader';
import { ProfileForm } from './ProfileForm';
import { PasswordForm } from './PasswordForm';

export function ProfilePage() {
  const { user, setUser } = useAdminStore();

  if (!user) return null;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <ProfileHeader user={user} />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} onUpdate={setUser} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm userId={user.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}