import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload from "../components/ImageUpload";
import { RotatingEarth } from "@/components/RotatingEarth";
import { ModelDisplay } from "@/components/ModelDisplay";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Sparkles, Brain, Cpu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const GRADCAM_API_URL = `${API_BASE_URL}/gradcam`;
const PREDICT_API_URL = `${API_BASE_URL}/predict`;

interface Prediction {
  class: string;
  confidence: number;
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [gradcamImage, setGradcamImage] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
  if (!selectedImage) {
    toast({ title: "No Image Selected", description: "Please upload an image to analyze", variant: "destructive" });
    return;
  }

  setIsAnalyzing(true);
  setGradcamImage(null);

  try {
    // 1. GradCAM request
    const gradcamForm = new FormData();
    gradcamForm.append("image", selectedImage);
    const gradcamRes = await fetch(GRADCAM_API_URL, { method: "POST", body: gradcamForm });
    const gradcamData = await gradcamRes.json();
    if (gradcamData.heatmap) {
      setGradcamImage(`data:image/png;base64,${gradcamData.heatmap}`);
    }

    // 2. Prediction request (new FormData!)
    const predictForm = new FormData();
    predictForm.append("image", selectedImage);
    const predictRes = await fetch(PREDICT_API_URL, { method: "POST", body: predictForm });
    const predictData = await predictRes.json();
    if (predictData.predictions) {
      setPredictions(predictData.predictions);
    } else {
      throw new Error("No predictions returned");
    }

    toast({ title: "Analysis Complete", description: "GradCAM and predictions generated successfully" });
  } catch (err: any) {
    toast({ title: "Analysis Failed", description: err.message || "Network or server error", variant: "destructive" });
  } finally {
    setIsAnalyzing(false);
  }
};

  return (
    <div className="min-h-screen relative overflow-hidden">
      <RotatingEarth />

      <div className="absolute inset-0 bg-gradient-to-br from-background/20 via-transparent to-background/30" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-ai-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-ai-secondary/5 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-ai-primary" />
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              VisionSat
            </h1>
            <Brain className="h-8 w-8 text-ai-secondary" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced image classification with explainable AI. Upload your image 
            and discover GradCAM visualizations.
          </p>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Image Upload */}
          <div className="lg:col-span-2">
            <ImageUpload onImageSelected={(file) => setSelectedImage(file)} />
          </div>

          {/* Model Info & Analyze Button */}
          <div className="space-y-6">
            <ModelDisplay />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-ai-accent" />
                  Analysis Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="ai"
                  size="lg"
                  className="w-full"
                  onClick={handleAnalyze}
                  disabled={!selectedImage || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze Image
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results Display */}
        <ResultsDisplay
          heatmap={gradcamImage || ""}
          predictions={predictions}
          isLoading={isAnalyzing}
        />
      </div>
    </div>
  );
};

export default Index;
