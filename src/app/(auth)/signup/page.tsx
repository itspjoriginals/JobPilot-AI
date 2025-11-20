'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useAuth } from '@/hooks/use-auth';
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const router = useRouter();
  const { signUp, loading, user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  useEffect(() => {
    // Redirect if user is already logged in
    if (!loading && user) {
      router.push('/jobs');
    }
  }, [user, loading, router]);


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password, name);
      router.push('/consent');
    } catch (error: any) {
        toast({
            title: 'Signup Failed',
            description: error.message,
            variant: 'destructive',
          });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the signup form if there is no user
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
            <CardDescription>Join JobPilot AI and automate your job search.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="Alex Doe" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="alex.doe@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
               <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
