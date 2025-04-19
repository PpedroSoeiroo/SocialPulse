import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LuUser, LuMail, LuKey, LuSave } from "react-icons/lu";

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    // Simulating API call
    setTimeout(() => {
      setIsSubmitting(false);
      // In a real app, this would update the user profile
    }, 1000);
  };
  
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return; // In a real app, show an error
    }
    
    setIsSubmitting(true);
    
    // Simulating API call
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // In a real app, this would update the password
    }, 1000);
  };

  const userInitials = user?.name?.split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <Sidebar>
      <div className="container py-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and password
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {/* Profile Overview Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{user?.name}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Update Profile Form */}
          <Card>
            <form onSubmit={handleUpdateProfile}>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Full Name
                    </label>
                    <div className="relative">
                      <LuUser className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Your full name"
                        className="pl-10"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Email Address
                    </label>
                    <div className="relative">
                      <LuMail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email address"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Username
                  </label>
                  <Input
                    id="username"
                    placeholder="Your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <LuSave className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <LuSave className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Update Password Form */}
          <Card>
            <form onSubmit={handleUpdatePassword}>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to maintain security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="current-password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Current Password
                  </label>
                  <div className="relative">
                    <LuKey className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Your current password"
                      className="pl-10"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="new-password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      New Password
                    </label>
                    <div className="relative">
                      <LuKey className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Your new password"
                        className="pl-10"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <LuKey className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm new password"
                        className="pl-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !currentPassword || !newPassword || newPassword !== confirmPassword}
                >
                  {isSubmitting ? (
                    <>
                      <LuSave className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <LuKey className="mr-2 h-4 w-4" />
                      Update Password
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </Sidebar>
  );
}
