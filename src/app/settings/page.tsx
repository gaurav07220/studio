
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const {
    user,
    profile,
    updatePassword,
    deleteAccount,
    reauthenticate,
    updateProfile,
    loading: authLoading,
  } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordForDelete, setPasswordForDelete] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please enter both your current and new passwords.",
      });
      return;
    }
    setIsUpdatingPassword(true);
    try {
      await updatePassword(currentPassword, newPassword);
      toast({ title: "Password Updated", description: "Your password has been changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!passwordForDelete) {
        toast({ variant: 'destructive', title: 'Password required', description: 'Please enter your password to confirm.' });
        return;
    }
    setIsDeletingAccount(true);
    try {
        await reauthenticate(passwordForDelete);
        await deleteAccount();
        toast({ title: "Account Deleted", description: "Your account has been permanently deleted." });
        router.push('/');
    } catch (error) {
        toast({ variant: "destructive", title: "Deletion Failed", description: error instanceof Error ? error.message : 'Could not delete your account.' });
    } finally {
        setIsDeletingAccount(false);
    }
  };

  const handleNotificationChange = (key: 'email' | 'push', value: boolean) => {
    if (!profile) return;
    const currentSettings = profile.notifications || { email: true, push: false };
    updateProfile({
        notifications: { ...currentSettings, [key]: value }
    });
  }

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateProfile({ theme });
    // The actual theme change is handled by the AuthProvider effect
  }

  if (authLoading || !profile) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="p-4 md:p-8 flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-4xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account and application preferences.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Update your password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword}>
                {isUpdatingPassword && <Loader2 className="mr-2 animate-spin"/>}
                Update Password
            </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose how you want to be notified.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="cursor-pointer">Email Notifications</Label>
            <Switch id="email-notifications" checked={profile.notifications?.email ?? true} onCheckedChange={(checked) => handleNotificationChange('email', checked)}/>
          </div>
           <p className="text-sm text-muted-foreground">Receive emails about new job matches and platform updates.</p>
           <Separator />
           <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications" className="cursor-pointer">Push Notifications</Label>
            <Switch id="push-notifications" checked={profile.notifications?.push ?? false} onCheckedChange={(checked) => handleNotificationChange('push', checked)} />
          </div>
           <p className="text-sm text-muted-foreground">Get push notifications on your devices. (Coming soon!)</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
            <Label>Appearance</Label>
            <div className="flex gap-2">
                <Button variant={profile.theme === 'light' ? 'default' : 'outline'} onClick={() => handleThemeChange('light')}>Light</Button>
                <Button variant={profile.theme === 'dark' ? 'default' : 'outline'} onClick={() => handleThemeChange('dark')}>Dark</Button>
                <Button variant={!profile.theme || profile.theme === 'system' ? 'default' : 'outline'} onClick={() => handleThemeChange('system')}>System</Button>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
             <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
             <CardDescription>Be careful, these actions are irreversible.</CardDescription>
        </CardHeader>
        <CardContent>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete My Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="password-for-delete">Please type your password to confirm.</Label>
                        <Input id="password-for-delete" type="password" value={passwordForDelete} onChange={e => setPasswordForDelete(e.target.value)} />
                    </div>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeletingAccount}>
                         {isDeletingAccount && <Loader2 className="mr-2 animate-spin" />}
                        Continue
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardContent>
      </Card>

    </div>
  );
}
