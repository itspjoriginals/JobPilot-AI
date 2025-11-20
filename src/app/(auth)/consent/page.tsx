'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const consentItems = [
  { id: 'automation', label: 'I consent to JobPilot AI automating job applications on my behalf.' },
  { id: 'session', label: 'I approve the secure storage and use of my session data for automation.' },
  { id: 'risks', label: 'I acknowledge the potential risks of using automation on platforms like LinkedIn.' },
  { id: 'answers', label: 'I accept that AI-generated answers will be used for screening questions.' },
];

export default function ConsentPage() {
  const router = useRouter();
  const { user, updateUserConsent } = useAuth();
  const { toast } = useToast();
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>(
    consentItems.reduce((acc, item) => ({ ...acc, [item.id]: false }), {})
  );

  const handleCheckboxChange = (id: string) => {
    setCheckedState((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  const allChecked = Object.values(checkedState).every(Boolean);

  const handleSubmit = async () => {
    if (allChecked && user) {
      try {
        await updateUserConsent(user.uid);
        router.push('/jobs');
      } catch (error) {
        toast({
            title: 'Error',
            description: 'Could not save consent.',
            variant: 'destructive',
          });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="font-headline text-center text-2xl">One Last Step: Your Consent</CardTitle>
          <CardDescription className="text-center">
            To use our automation features, please review and accept the following terms.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 rounded-lg border p-4">
            {consentItems.map((item) => (
              <div key={item.id} className="flex items-start space-x-3">
                <Checkbox
                  id={item.id}
                  checked={checkedState[item.id]}
                  onCheckedChange={() => handleCheckboxChange(item.id)}
                />
                <Label htmlFor={item.id} className="font-normal leading-relaxed">
                  {item.label}
                </Label>
              </div>
            ))}
          </div>
          <Button onClick={handleSubmit} disabled={!allChecked} className="w-full">
            Agree and Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
