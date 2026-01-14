import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, Calendar, ThumbsUp, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Review {
    id: number;
    patient_name: string;
    rating: number;
    comment: string;
    created_at: string;
    appointment_date: string;
}

const Reviews = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchReviews();
        }
    }, [user]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            // If user is a doctor, fetch reviews FOR them
            // If user is a patient, maybe fetch reviews BY them? 
            // The requirement says "review given by user must be visible on that doctor porat review section"
            // So this page likely serves the Doctor to see their reviews.
            // Let's assume this is the Doctor's view of their reviews.

            const response = await fetch(`http://localhost/skin-health-hub-main/skin-health-hub-main/api/reviews/list.php?doctor_id=${user?.id}`);
            const data = await response.json();
            setReviews(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`h-4 w-4 ${index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
            />
        ));
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container px-4 py-8 md:py-12">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">My Reviews</h1>
                        <p className="text-muted-foreground">
                            Feedback from your patients
                        </p>
                    </div>

                    {/* Stats Card */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <MessageSquare className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{reviews.length}</p>
                                        <p className="text-sm text-muted-foreground">Total Reviews</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-yellow-100 rounded-lg">
                                        <Star className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">
                                            {reviews.length > 0
                                                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                                                : "0.0"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Average Rating</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <ThumbsUp className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">
                                            {reviews.filter(r => r.rating >= 4).length}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Positive Reviews</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reviews List */}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <Card key={review.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">{review.patient_name}</CardTitle>
                                                <CardDescription className="flex items-center gap-2 mt-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Appointment: {review.appointment_date}
                                                </CardDescription>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-3">{review.comment}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Reviewed on {new Date(review.created_at).toLocaleDateString()}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}

                            {reviews.length === 0 && (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                        <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
                                        <p className="text-muted-foreground">
                                            Reviews from your patients will appear here.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reviews;
