import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Star,
  Activity,
  Settings,
  Loader2,
  TrendingUp,
  DollarSign,
  Eye
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Appointment {
  id: number;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string;
}

interface PatientHistory {
  id: number;
  prediction_result: string;
  confidence_score: number;
  created_at: string;
}

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<{ name: string; history: PatientHistory[] } | null>(null);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);

  // Quick Actions Dialog States
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isPatientListDialogOpen, setIsPatientListDialogOpen] = useState(false);
  const [isMedicalRecordsDialogOpen, setIsMedicalRecordsDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost/skin-health-hub-main/skin-health-hub-main/api/appointments/list.php?user_id=${user?.id}&role=doctor`);
      const data = await response.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: 'confirmed' | 'rejected') => {
    setProcessingId(id);
    try {
      const response = await fetch("http://localhost/skin-health-hub-main/skin-health-hub-main/api/appointments/update_status.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointment_id: id,
          status: status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }

      toast({
        title: "Success",
        description: `Appointment ${status}`,
      });

      // Refresh appointments to update the UI
      await fetchAppointments();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update status",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const viewPatientHistory = (patientName: string) => {
    // Mock patient history - in real app, fetch from API
    const mockHistory: PatientHistory[] = [
      { id: 1, prediction_result: "Eczema", confidence_score: 0.89, created_at: "2024-01-10" },
      { id: 2, prediction_result: "Psoriasis", confidence_score: 0.76, created_at: "2024-01-05" },
    ];
    setSelectedPatient({ name: patientName, history: mockHistory });
    setIsHistoryDialogOpen(true);
  };

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');
  const todayAppointments = appointments.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    return a.appointment_date === today && a.status === 'confirmed';
  });

  // Get all appointments for today (for schedule view)
  const todaySchedule = appointments.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    return a.appointment_date === today;
  });

  // Calculate weekly stats
  const weeklyAppointments = appointments.filter(a => {
    const appointmentDate = new Date(a.appointment_date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return appointmentDate >= weekAgo;
  }).length;

  const stats = {
    totalPatients: appointments.length,
    todayPatients: todayAppointments.length,
    pendingRequests: pendingAppointments.length,
    weeklyAppointments: weeklyAppointments,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.totalPatients}</div>
                <Users className="h-8 w-8 text-primary opacity-50" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.todayPatients}</div>
                <Activity className="h-8 w-8 text-success opacity-50" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Scheduled today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.pendingRequests}</div>
                <Clock className="h-8 w-8 text-warning opacity-50" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Awaiting response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.weeklyAppointments}</div>
                <TrendingUp className="h-8 w-8 text-info opacity-50" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Last 7 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointment Requests */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointment Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingAppointments.map((request) => (
                    <div
                      key={request.id}
                      className="border rounded-lg p-4 flex items-start justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{request.patient_name}</h4>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">New</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {request.appointment_date} at {request.appointment_time}
                        </p>
                        {request.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">Note:</span> {request.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => updateStatus(request.id, 'confirmed')}
                          disabled={processingId === request.id}
                        >
                          {processingId === request.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => updateStatus(request.id, 'rejected')}
                          disabled={processingId === request.id}
                        >
                          {processingId === request.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingAppointments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No pending appointment requests</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setIsScheduleDialogOpen(true)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setIsPatientListDialogOpen(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                Patient List
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setIsMedicalRecordsDialogOpen(true)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Medical Records
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/profile')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{apt.patient_name}</p>
                        <p className="text-sm text-muted-foreground">{apt.appointment_time}</p>
                        {apt.notes && (
                          <p className="text-xs text-muted-foreground mt-1">Note: {apt.notes}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewPatientHistory(apt.patient_name)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View History
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No appointments scheduled for today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile & Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Your Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-4xl font-bold mb-2">4.8</div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < 4 ? "fill-warning text-warning" : "text-muted"
                        }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">142 reviews</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response Time</span>
                    <span className="font-medium">2.3 hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-medium">96%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Patient History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Patient History - {selectedPatient?.name}</DialogTitle>
            <DialogDescription>
              Previous consultations and predictions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {selectedPatient?.history.map((item) => (
              <div key={item.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.prediction_result}</p>
                    <p className="text-sm text-muted-foreground">
                      Confidence: {(item.confidence_score * 100).toFixed(1)}%
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* View Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Today's Schedule</DialogTitle>
            <DialogDescription>
              All appointments scheduled for {new Date().toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4 max-h-96 overflow-y-auto">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((apt) => (
                <div key={apt.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{apt.patient_name}</p>
                      <p className="text-sm text-muted-foreground">{apt.appointment_time}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        apt.status === 'confirmed'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : apt.status === 'pending'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                      }
                    >
                      {apt.status}
                    </Badge>
                  </div>
                  {apt.notes && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Note:</span> {apt.notes}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No appointments scheduled for today</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Patient List Dialog */}
      <Dialog open={isPatientListDialogOpen} onOpenChange={setIsPatientListDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Today's Patient Queue</DialogTitle>
            <DialogDescription>
              Confirmed patients with appointments today
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4 max-h-96 overflow-y-auto">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((apt, index) => (
                <div key={apt.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold">{apt.patient_name}</p>
                        <p className="text-sm font-medium">{apt.appointment_time}</p>
                      </div>
                      {apt.notes && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Concern:</span> {apt.notes}
                        </p>
                      )}
                      <Button
                        size="sm"
                        variant="link"
                        className="p-0 h-auto mt-2"
                        onClick={() => viewPatientHistory(apt.patient_name)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View History
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No patients in queue today</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Medical Records Dialog */}
      <Dialog open={isMedicalRecordsDialogOpen} onOpenChange={setIsMedicalRecordsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Medical Records</DialogTitle>
            <DialogDescription>
              View all patient medical records and history
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4 max-h-96 overflow-y-auto">
            {confirmedAppointments.length > 0 ? (
              confirmedAppointments.map((apt) => (
                <div key={apt.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{apt.patient_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Last visit: {apt.appointment_date}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewPatientHistory(apt.patient_name)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      View Records
                    </Button>
                  </div>
                  {apt.notes && (
                    <p className="text-sm text-muted-foreground">
                      Last note: {apt.notes}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No medical records available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorDashboard;

