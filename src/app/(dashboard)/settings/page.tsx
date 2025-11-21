'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { mockUser } from '@/lib/data';
import { Linkedin, Save, PlusCircle, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

function SettingsSkeleton() {
    return (
      <div className="container mx-auto space-y-8">
        <div>
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-5 w-72 mt-2" />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
              <Card>
                  <CardHeader>
                      <Skeleton className="h-6 w-56" />
                      <Skeleton className="h-5 w-80 mt-2" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <div className="grid grid-cols-3 gap-4">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                      </div>
                       <div className="space-y-2">
                          <Skeleton className="h-5 w-64" />
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-4 w-full max-w-sm" />
                      </div>
                  </CardContent>
              </Card>
  
              <Card>
                  <CardHeader>
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-5 w-72 mt-2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-4">
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                      </div>
                      <Skeleton className="h-10 w-full mt-4" />
                  </CardContent>
              </Card>
          </div>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-32 mt-2 mx-auto" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

export default function SettingsPage() {
  const { user, signInWithLinkedIn, loading: authLoading } = useAuth();
  
  // Initialize state with mockUser and update with real user data when available
  const [dailyLimit, setDailyLimit] = useState(mockUser.dailyApplyLimit);
  const [strategy, setStrategy] = useState(mockUser.applyStrategy);
  const [savedAnswers, setSavedAnswers] = useState(mockUser.savedAnswers);

  const handleLinkedInConnect = async () => {
    try {
      await signInWithLinkedIn();
    } catch (error) {
      console.error("LinkedIn Sign-in failed", error);
    }
  };

  if (authLoading || !user) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="container mx-auto space-y-8">
       <div>
        <h1 className="font-headline text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your automation preferences and profile.</p>
       </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Automation Strategy</CardTitle>
                    <CardDescription>Control how the AI applies to jobs for you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label className="font-medium">Apply Strategy</Label>
                        <RadioGroup value={strategy} onValueChange={(value) => setStrategy(value as any)} className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <RadioGroupItem value="Aggressive" id="aggressive" className="peer sr-only" />
                                <Label htmlFor="aggressive" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    Aggressive
                                    <span className="mt-2 text-xs text-muted-foreground">60%+ Match</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="Balanced" id="balanced" className="peer sr-only" />
                                <Label htmlFor="balanced" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    Balanced
                                     <span className="mt-2 text-xs text-muted-foreground">75%+ Match</span>
                                </Label>
                            </div>
                           <div>
                                <RadioGroupItem value="Targeted" id="targeted" className="peer sr-only" />
                                <Label htmlFor="targeted" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    Targeted
                                     <span className="mt-2 text-xs text-muted-foreground">85-90% Match</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                     <div>
                        <Label htmlFor="daily-limit" className="font-medium">Job Application Daily Limit ({dailyLimit})</Label>
                        <div className="flex items-center gap-4 pt-2">
                            <Slider id="daily-limit" min={5} max={50} step={1} value={[dailyLimit]} onValueChange={(value) => setDailyLimit(value[0])} />
                            <span className="text-sm font-medium">{dailyLimit}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Default: 20/day. Adjust based on your risk tolerance.</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Saved Answers</CardTitle>
                    <CardDescription>Pre-fill answers to common screening questions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {savedAnswers.map((answer, index) => (
                        <div key={index} className="flex items-end gap-2">
                            <div className="flex-grow space-y-2">
                                <Label htmlFor={`q-${index}`}>Question Pattern</Label>
                                <Input id={`q-${index}`} value={answer.pattern} />
                                <Label htmlFor={`a-${index}`}>Generated Answer</Label>
                                <Input id={`a-${index}`} value={answer.generatedAnswer} />
                            </div>
                            <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                    ))}
                     <Button variant="outline" className="w-full mt-4">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Answer
                    </Button>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleLinkedInConnect} className="w-full bg-[#0A66C2] hover:bg-[#0A66C2]/90">
                <Linkedin className="mr-2 h-4 w-4" />
                {mockUser.linkedInSessionStatus === 'active' ? 'Reconnect LinkedIn' : 'Connect LinkedIn'}
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Session status: <span className={mockUser.linkedInSessionStatus === 'active' ? 'text-green-500' : 'text-red-500'}>{mockUser.linkedInSessionStatus}</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
