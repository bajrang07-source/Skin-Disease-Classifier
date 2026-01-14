import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Save } from "lucide-react";

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    role: string;
    specialization?: string;
    experience_years?: number;
    bio?: string;
}

const Profile = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost/skin-health-hub-main/skin-health-hub-main/api/users/profile.php?user_id=${user?.id}`);
            const data = await response.json();
            setProfile(data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setSaving(true);
        try {
            const response = await fetch("http://localhost/skin-health-hub-main/skin-health-hub-main/api/users/update_profile.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: profile.id,
                    full_name: profile.full_name,
                    phone: profile.phone,
                    specialization: profile.specialization,
                    experience_years: profile.experience_years,
                    bio: profile.bio,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Update failed");
            }

            toast({
                title: "Success",
                description: "Profile updated successfully!",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to update profile",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container px-4 py-8 flex justify-center items-center min-h-[60vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="container px-4 py-8 md:py-12">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
                        <p className="text-muted-foreground">
                            Manage your account information
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profile?.email || ""}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="full_name">Full Name</Label>
                                    <Input
                                        id="full_name"
                                        type="text"
                                        value={profile?.full_name || ""}
                                        onChange={(e) => setProfile(prev => prev ? { ...prev, full_name: e.target.value } : null)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={profile?.phone || ""}
                                        onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                        required
                                    />
                                </div>

                                {profile?.role === 'doctor' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="specialization">Specialization</Label>
                                            <Input
                                                id="specialization"
                                                type="text"
                                                value={profile?.specialization || ""}
                                                onChange={(e) => setProfile(prev => prev ? { ...prev, specialization: e.target.value } : null)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="experience_years">Years of Experience</Label>
                                            <Input
                                                id="experience_years"
                                                type="number"
                                                value={profile?.experience_years || 0}
                                                onChange={(e) => setProfile(prev => prev ? { ...prev, experience_years: parseInt(e.target.value) } : null)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Textarea
                                                id="bio"
                                                value={profile?.bio || ""}
                                                onChange={(e) => setProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                                                rows={4}
                                                placeholder="Tell patients about yourself..."
                                            />
                                        </div>
                                    </>
                                )}

                                <Button type="submit" className="w-full" disabled={saving}>
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
