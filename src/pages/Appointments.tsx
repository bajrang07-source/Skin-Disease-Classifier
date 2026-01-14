import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Loader2, XCircle, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Appointment {
    id: number;
    doctor_name: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
    notes: string;
}

const Appointments = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (user) {
            fetchAppointments();
        }
    }, [user]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost/skin-health-hub-main/skin-health-hub-main/api/appointments/list.php?user_id=${user?.id}`);
            const data = await response.json();
            setAppointments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAppointment = async () => {
        if (!selectedAppointment) return;

        setCancelling(true);
        try {
            const response = await fetch("http://localhost/skin-health-hub-main/skin-health-hub-main/api/appointments/update_status.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    appointment_id: selectedAppointment,
                    status: "rejected",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Cancellation failed");
            }

            toast({
                title: "Success",
                description: "Appointment cancelled successfully",
            });

            fetchAppointments();
            setCancelDialogOpen(false);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to cancel appointment",
            });
        } finally {
            setCancelling(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="h-4 w-4" />;
            case 'rejected':
                return <XCircle className="h-4 w-4" />;
            case 'pending':
                return <Clock className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const upcomingAppointments = appointments.filter(a =>
        a.status !== 'rejected' && new Date(a.appointment_date) >= new Date()
    );
    const pastAppointments = appointments.filter(a =>
        new Date(a.appointment_date) < new Date() || a.status === 'rejected'
    );

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="container px-4 py-8 md:py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
                    <p className="text-muted-foreground">
                        View and manage your appointments
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Upcoming Appointments */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
                            {upcomingAppointments.length > 0 ? (
                                <div className="grid gap-4">
                                    {upcomingAppointments.map((apt) => (
                                        <Card key={apt.id}>
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-semibold">{apt.doctor_name}</h3>
                                                            <Badge variant="outline" className={getStatusColor(apt.status)}>
                                                                <span className="flex items-center gap-1">
                                                                    {getStatusIcon(apt.status)}
                                                                    {apt.status}
                                                                </span>
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-4 w-4" />
                                                                {new Date(apt.appointment_date).toLocaleDateString('en-US', {
                                                                    weekday: 'long',
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-4 w-4" />
                                                                {apt.appointment_time}
                                                            </span>
                                                        </div>
                                                        {apt.notes && (
                                                            <p className="text-sm text-muted-foreground">
                                                                <span className="font-medium">Note:</span> {apt.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {apt.status === 'pending' || apt.status === 'confirmed' ? (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => {
                                                                setSelectedAppointment(apt.id);
                                                                setCancelDialogOpen(true);
                                                            }}
                                                        >
                                                            <XCircle className="h-4 w-4 mr-1" />
                                                            Cancel
                                                        </Button>
                                                    ) : null}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50 text-muted-foreground" />
                                        <p className="text-muted-foreground">No upcoming appointments</p>
                                        <Button variant="link" onClick={() => window.location.href = '/doctors'}>
                                            Book an appointment
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Past Appointments */}
                        {pastAppointments.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Past Appointments</h2>
                                <div className="grid gap-4">
                                    {pastAppointments.map((apt) => (
                                        <Card key={apt.id} className="opacity-75">
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-semibold">{apt.doctor_name}</h3>
                                                            <Badge variant="outline" className={getStatusColor(apt.status)}>
                                                                <span className="flex items-center gap-1">
                                                                    {getStatusIcon(apt.status)}
                                                                    {apt.status}
                                                                </span>
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-4 w-4" />
                                                                {new Date(apt.appointment_date).toLocaleDateString()}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-4 w-4" />
                                                                {apt.appointment_time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Cancel Confirmation Dialog */}
            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Appointment</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel this appointment? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                            Keep Appointment
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleCancelAppointment}
                            disabled={cancelling}
                        >
                            {cancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Cancel Appointment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Appointments;
