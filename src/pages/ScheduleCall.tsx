import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Calendar, Clock, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/config/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ScheduleCall = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [phone, setPhone] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [loading, setLoading] = useState(false);

    // Format phone number to E.164
    const formatPhoneNumber = (phoneNumber: string): string => {
        // Remove all non-digit characters
        let cleaned = phoneNumber.replace(/\D/g, '');

        // If it doesn't start with +, add it
        if (!phoneNumber.startsWith('+')) {
            // Assume India (+91) if 10 digits, otherwise add +
            if (cleaned.length === 10) {
                cleaned = '91' + cleaned;
            }
            return '+' + cleaned;
        }

        return phoneNumber;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            // Format phone number to E.164
            const formattedPhone = formatPhoneNumber(phone);

            // Validate E.164 format
            if (!/^\+?[1-9]\d{1,14}$/.test(formattedPhone)) {
                throw new Error("Invalid phone number format. Please use format: +919876543210");
            }

            // Combine date and time
            const scheduledAt = `${date} ${time}:00`;

            const response = await fetch(API_ENDPOINTS.SCHEDULE_CALL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user.id,
                    phone: formattedPhone,
                    scheduled_at: scheduledAt,
                    message: `Hello! This is a reminder for your appointment scheduled at ${scheduledAt}. Thank you for using Skin Health Hub!`
                }),
            });

            const data = await response.json();

            if (!response.ok || data.status === 'error') {
                throw new Error(data.message || "Failed to schedule call");
            }

            toast({
                title: "Success!",
                description: "Call initiated successfully! You should receive a call shortly.",
            });

            // Reset form
            setPhone("");
            setDate("");
            setTime("");

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to schedule call",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container px-4 py-8 md:py-12">
                <div className="mx-auto max-w-xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Schedule a Call</h1>
                        <p className="text-muted-foreground">
                            Book a consultation or reminder call with our support team
                        </p>
                    </div>

                    <Alert className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Phone Number Format:</strong> Please enter your phone number with country code (e.g., +919876543210 for India, +1234567890 for USA).
                            {" "}<strong>Note:</strong> If using a Twilio trial account, only verified numbers can receive calls.
                        </AlertDescription>
                    </Alert>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5" />
                                Call Details
                            </CardTitle>
                            <CardDescription>
                                Enter your phone number and select when you'd like us to call you.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            className="pl-9"
                                            placeholder="+919876543210"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Include country code (e.g., +91 for India)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="date"
                                            type="date"
                                            className="pl-9"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="time">Time</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="time"
                                            type="time"
                                            className="pl-9"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Initiating Call...
                                        </>
                                    ) : (
                                        "Schedule Call Now"
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

export default ScheduleCall;
