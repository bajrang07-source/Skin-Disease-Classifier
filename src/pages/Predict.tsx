import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, Upload, Shield, Info, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { API_ENDPOINTS } from "@/config/api";

const Predict = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ predicted_class: string; confidence: number } | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 10MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !user) return;
    setIsAnalyzing(true);
    console.log('🚀 Starting analysis...');

    try {
      // 1. Upload image to PHP Backend first
      console.log('📤 Step 1: Uploading image to PHP backend...');
      const uploadStartTime = performance.now();
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);

      const uploadResponse = await fetch(API_ENDPOINTS.UPLOAD_IMAGE, {
        method: 'POST',
        body: uploadFormData,
      });

      const uploadData = await uploadResponse.json();
      console.log(`✅ Upload completed in ${(performance.now() - uploadStartTime).toFixed(0)}ms`, uploadData);

      if (!uploadResponse.ok) {
        throw new Error(uploadData.message || 'Image upload failed');
      }

      const savedImagePath = uploadData.image_path;

      // 2. Send image to Flask ML backend for prediction
      console.log('🤖 Step 2: Sending to ML backend for prediction...');
      const mlStartTime = performance.now();
      const mlFormData = new FormData();
      mlFormData.append('file', selectedFile);

      const mlResponse = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: mlFormData,
      });

      const mlData = await mlResponse.json();
      console.log(`✅ ML prediction completed in ${(performance.now() - mlStartTime).toFixed(0)}ms`, mlData);

      if (!mlResponse.ok) {
        throw new Error(mlData.error || 'Prediction failed');
      }

      // 3. Save prediction to PHP database with the correct image path
      console.log('💾 Step 3: Saving prediction to database...');
      const saveStartTime = performance.now();
      const saveResponse = await fetch(API_ENDPOINTS.SAVE_PREDICTION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          image_path: savedImagePath, // Use the path returned by upload.php
          prediction_result: mlData.predicted_class,
          confidence_score: mlData.confidence / 100
        }),
      });

      console.log(`✅ Save completed in ${(performance.now() - saveStartTime).toFixed(0)}ms`);

      if (!saveResponse.ok) {
        console.error("Failed to save prediction to database");
      }

      console.log('🎉 Analysis complete! Setting result...');
      setResult({
        predicted_class: mlData.predicted_class,
        confidence: mlData.confidence
      });

      toast({
        title: "Analysis complete",
        description: `Detected: ${mlData.predicted_class}`,
      });

    } catch (error: any) {
      console.error("❌ Analysis error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to analyze image. Make sure the ML backend is running on port 5000.",
      });
    } finally {
      console.log('✨ Analysis finished, resetting analyzing state');
      setIsAnalyzing(false);
    }
  };

  const formatDiseaseName = (name: string) => {
    return name.replace(/_/g, ' ');
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-700 bg-green-50 border-green-200';
    if (confidence >= 60) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-orange-700 bg-orange-50 border-orange-200';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container px-4 py-8 md:py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Skin Analysis</h1>
            <p className="text-muted-foreground">
              Upload a clear photo of your skin condition for instant AI analysis
            </p>
          </div>

          {/* Privacy Notice */}
          <Alert className="mb-6 border-primary/20 bg-primary/5">
            <Shield className="h-4 w-4 text-primary" />
            <AlertDescription>
              <strong className="text-foreground">Privacy First:</strong> Your image is analyzed securely using our AI model. Results are saved to your account for future reference.
            </AlertDescription>
          </Alert>

          {/* Upload Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>
                Choose a clear, well-lit photo showing the affected area
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!preview ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileSelect}
                    />
                    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/20 p-8 transition-colors hover:border-primary hover:bg-muted/40">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <div className="text-center">
                        <p className="font-medium">Upload Photo</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          JPG, PNG (max 10MB)
                        </p>
                      </div>
                    </div>
                  </label>

                  <label htmlFor="camera-upload" className="cursor-pointer">
                    <input
                      id="camera-upload"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="sr-only"
                      onChange={handleFileSelect}
                    />
                    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/20 p-8 transition-colors hover:border-primary hover:bg-muted/40">
                      <Camera className="h-10 w-10 text-muted-foreground" />
                      <div className="text-center">
                        <p className="font-medium">Take Photo</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Use your camera
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-auto"
                    />
                  </div>

                  {result && (
                    <div className={`p-4 border rounded-lg ${getConfidenceColor(result.confidence)}`}>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">
                            Prediction: {formatDiseaseName(result.predicted_class)}
                          </h3>
                          <p className="font-medium">
                            Confidence: {result.confidence.toFixed(2)}%
                          </p>
                          <p className="text-sm mt-2 opacity-90">
                            This is an AI prediction based on image analysis. Please consult a dermatologist for an accurate diagnosis and treatment plan.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreview(null);
                        setResult(null);
                      }}
                      disabled={isAnalyzing}
                    >
                      Choose Different Image
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !!result}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Image"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex gap-2 mb-2">
                  <Info className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="font-medium text-sm">Tips for best results:</p>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-7">
                  <li>• Use good lighting (natural light works best)</li>
                  <li>• Take a clear, close-up photo</li>
                  <li>• Ensure the affected area is in focus</li>
                  <li>• Avoid shadows or glare</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
            <AlertDescription className="text-sm">
              <strong>Medical Disclaimer:</strong> This tool provides AI-powered predictions
              and is not a substitute for professional medical advice. For severe symptoms like
              bleeding or intense pain, contact emergency services immediately.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default Predict;
