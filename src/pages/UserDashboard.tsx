import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Calendar,
  FileText,
  Map,
  Phone,
  User,
  Star,
  Camera,
  Stethoscope,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: number;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string;
}

interface Prediction {
  id: number;
  prediction_result: string;
  confidence_score: number;
  created_at: string;
}

interface PendingReview {
  id: number; // appointment id
  doctor_id: number;
  doctor_name: string;
  appointment_date: string;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  // Review State
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<PendingReview | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
      checkPendingReviews();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch appointments
      const appointmentsRes = await fetch(`http://localhost/skin-health-hub-main/skin-health-hub-main/api/appointments/list.php?user_id=${user?.id}`);
      const appointmentsData = await appointmentsRes.json();
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);

      // Fetch predictions
      const predictionsRes = await fetch(`http://localhost/skin-health-hub-main/skin-health-hub-main/api/predict/history.php?user_id=${user?.id}`);
      const predictionsData = await predictionsRes.json();
      setPredictions(Array.isArray(predictionsData) ? predictionsData : []);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkPendingReviews = async () => {
    try {
      const response = await fetch(`http://localhost/skin-health-hub-main/skin-health-hub-main/api/appointments/pending_reviews.php?user_id=${user?.id}`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setPendingReviews(data);
        setCurrentReview(data[0]); // Start with the first one
        setIsReviewDialogOpen(true);
      }
    } catch (error) {
      console.error("Error checking pending reviews:", error);
    }
  };

  const handleSubmitReview = async () => {
    if (!currentReview || rating === 0) return;

    setSubmittingReview(true);
    try {
      const response = await fetch("http://localhost/skin-health-hub-main/skin-health-hub-main/api/reviews/add.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointment_id: currentReview.id,
          doctor_id: currentReview.doctor_id,
          user_id: user?.id,
          rating: rating,
          comment: comment
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      toast({
        title: "Success",
        description: "Review submitted successfully!",
      });

      // Remove this review from pending list
      const remainingReviews = pendingReviews.filter(r => r.id !== currentReview.id);
      setPendingReviews(remainingReviews);

      // Reset form
      setRating(0);
      setComment("");

      // If more reviews, show next, else close
      if (remainingReviews.length > 0) {
        setCurrentReview(remainingReviews[0]);
      } else {
        setIsReviewDialogOpen(false);
      }

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit review",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSkipReview = () => {
    if (!currentReview) return;

    // Just move to next or close
    const remainingReviews = pendingReviews.filter(r => r.id !== currentReview.id);
    setPendingReviews(remainingReviews);

    if (remainingReviews.length > 0) {
      setCurrentReview(remainingReviews[0]);
      setRating(0);
      setComment("");
    } else {
      setIsReviewDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/predict")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-primary" />
                Predict Condition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Upload or capture an image to get instant AI-powered analysis
              </p>
              <Button className="w-full">Start Prediction</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/doctors")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Stethoscope className="h-5 w-5 text-primary" />
                Find Doctors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Search for verified specialists near you
              </p>
              <Button variant="outline" className="w-full">Browse Doctors</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/learn")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                Learn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Read articles about skin conditions and treatments
              </p>
              <Button variant="outline" className="w-full">Explore Articles</Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.slice(0, 3).map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{apt.doctor_name}</p>
                        <p className="text-sm text-muted-foreground">{apt.appointment_date} at {apt.appointment_time}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs capitalize ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        apt.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {apt.status}
                      </div>
                    </div>
                  ))}
                  <Button variant="link" onClick={() => navigate("/doctors")} className="w-full">
                    View all appointments
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming appointments</p>
                  <Button variant="link" onClick={() => navigate("/doctors")}>
                    Book an appointment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Predictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : predictions.length > 0 ? (
                <div className="space-y-4">
                  {predictions.slice(0, 3).map((pred) => (
                    <div key={pred.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{pred.prediction_result}</p>
                        <p className="text-sm text-muted-foreground">Confidence: {(pred.confidence_score * 100).toFixed(1)}%</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(pred.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  <Button variant="link" onClick={() => navigate("/predict")} className="w-full">
                    Start new prediction
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No predictions yet</p>
                  <Button variant="link" onClick={() => navigate("/predict")}>
                    Start your first prediction
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Disease Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Disease Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Map className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>View disease occurrence data across India</p>
                <Button variant="outline" className="mt-3" onClick={() => navigate("/heatmap")}>
                  View Heatmap
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Call */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Schedule Call
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Phone className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Schedule appointment reminder calls</p>
                <Button variant="outline" className="mt-3" onClick={() => navigate("/schedule-call")}>
                  Schedule Call
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile & Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full" onClick={() => navigate("/profile")}>
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate("/reviews")}>
                  <Star className="h-4 w-4 mr-2" />
                  My Reviews
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={(open) => {
        if (!open && pendingReviews.length > 0) {
          // Prevent closing if reviews pending, or handle as skip
          // For now allow close
          setIsReviewDialogOpen(false);
        } else {
          setIsReviewDialogOpen(open);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
            <DialogDescription>
              How was your appointment with {currentReview?.doctor_name} on {currentReview?.appointment_date}?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer transition-colors ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>

            <div className="space-y-2">
              <Label>Your Review (Optional)</Label>
              <Textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-between">
            <Button variant="ghost" onClick={handleSkipReview}>
              Skip
            </Button>
            <Button onClick={handleSubmitReview} disabled={rating === 0 || submittingReview}>
              {submittingReview && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
