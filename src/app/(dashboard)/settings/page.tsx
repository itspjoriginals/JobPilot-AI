
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Linkedin, Save, PlusCircle, Trash2, Upload, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface SavedAnswer {
  pattern: string;
  generatedAnswer: string;
}

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
              <CardContent className="space-y-4">
                 <Skeleton className="h-24 w-24 rounded-full mx-auto" />
                 <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-32 mt-2 mx-auto" />
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
}

export default function SettingsPage() {
  const { user, signInWithLinkedIn, loading: authLoading, setUser } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [dailyLimit, setDailyLimit] = useState(20);
  const [strategy, setStrategy] = useState<'Aggressive' | 'Balanced' | 'Targeted'>('Balanced');
  const [savedAnswers, setSavedAnswers] = useState<SavedAnswer[]>([]);
  const [linkedInStatus, setLinkedInStatus] = useState<'active' | 'expired' | 'none'>('none');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        setPageLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.displayName || user.displayName || '');
          setDailyLimit(data.dailyApplyLimit || 20);
          setStrategy(data.applyStrategy || 'Balanced');
          setSavedAnswers(data.savedAnswers || []);
          setLinkedInStatus(data.linkedInSessionStatus || 'none');
        } else {
            // Pre-fill from auth if no doc exists
            setName(user.displayName || '');
        }
        setPageLoading(false);
      };
      fetchUserData();
    }
  }, [user]);

  const handleLinkedInConnect = async () => {
    try {
      await signInWithLinkedIn();
      toast({ title: 'LinkedIn connection initiated. Please follow the instructions.' });
    } catch (error: any) {
      toast({ title: 'LinkedIn Connection Failed', description: error.message, variant: 'destructive' });
    }
  };
  
  const handleProfilePictureUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    
    setIsUploading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    
    try {
        await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(storageRef);
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { photoURL });
        setUser({ ...user, photoURL });
        toast({ title: 'Profile picture updated successfully!' });
    } catch (error: any) {
        console.error("Error uploading profile picture: ", error);
        toast({ title: 'Upload Failed', description: 'Could not upload profile picture. If this persists, please check storage permissions.', variant: 'destructive' });
    } finally {
        setIsUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userData = {
        displayName: name,
        dailyApplyLimit,
        applyStrategy: strategy,
        savedAnswers,
      };
      await setDoc(userDocRef, userData, { merge: true });
      toast({ title: 'Settings saved successfully!' });
    } catch (error) {
      console.error("Error saving settings: ", error);
      toast({ title: 'Save Failed', description: 'Could not save settings.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnswerChange = (index: number, field: keyof SavedAnswer, value: string) => {
    const newAnswers = [...savedAnswers];
    newAnswers[index][field] = value;
    setSavedAnswers(newAnswers);
  };
  
  const addAnswer = () => {
    setSavedAnswers([...savedAnswers, { pattern: '', generatedAnswer: '' }]);
  };
  
  const removeAnswer = (index: number) => {
    setSavedAnswers(savedAnswers.filter((_, i) => i !== index));
  };


  if (authLoading || pageLoading) {
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
                                <Input id={`q-${index}`} value={answer.pattern} onChange={(e) => handleAnswerChange(index, 'pattern', e.target.value)} />
                                <Label htmlFor={`a-${index}`}>Generated Answer</Label>
                                <Input id={`a-${index}`} value={answer.generatedAnswer} onChange={(e) => handleAnswerChange(index, 'generatedAnswer', e.target.value)} />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeAnswer(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                    ))}
                     <Button variant="outline" className="w-full mt-4" onClick={addAnswer}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Answer
                    </Button>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
                <CardTitle className="font-headline">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                        <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" onClick={handleProfilePictureUpload} disabled={isUploading}>
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        {isUploading ? 'Uploading...' : 'Upload Picture'}
                    </Button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleLinkedInConnect} className="w-full bg-[#0A66C2] hover:bg-[#0A66C2]/90">
                <Linkedin className="mr-2 h-4 w-4" />
                {linkedInStatus === 'active' ? 'Reconnect LinkedIn' : 'Connect LinkedIn'}
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Session status: <span className={linkedInStatus === 'active' ? 'text-green-500' : 'text-red-500'}>{linkedInStatus}</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle className="font-headline">Save All Changes</CardTitle>
            </CardHeader>
            <CardContent>
                <Button className="w-full" onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
