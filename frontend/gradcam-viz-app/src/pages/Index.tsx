import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload from "../components/ImageUpload";
import { RotatingEarth } from "@/components/RotatingEarth";
import { ModelDisplay } from "@/components/ModelDisplay";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Sparkles, Brain, Cpu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockPredictions = [
  { class: "Golden Retriever", confidence: 0.89, probability: 0.89 },
  { class: "Labrador", confidence: 0.76, probability: 0.76 },
  { class: "Beagle", confidence: 0.45, probability: 0.45 },
];

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [gradcamImage, setGradcamImage] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    // Reset previous results
    setPredictions([]);
    setGradcamImage("");
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      setPredictions(mockPredictions);
      // Mock GradCAM image (you would replace this with actual API response)
      setGradcamImage(URL.createObjectURL(selectedImage));
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: "Image classification and GradCAM explanation generated successfully",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Live Rotating Earth Background */}
      <RotatingEarth />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/20 via-transparent to-background/30" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-ai-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-ai-secondary/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-ai-primary" />
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Ekaansh lodu
            </h1>
            <Brain className="h-8 w-8 text-ai-secondary" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced image classification with explainable AI. Upload your image, select a model, 
            and discover both predictions and visual explanations through GradCAM.
          </p>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Image Upload */}
          <div className="lg:col-span-2">
            <ImageUpload
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              className="h-full"
            />
          </div>

          {/* Model Information & Controls */}
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
                
                <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  <p className="mb-1">
                    <span className="font-medium">Model:</span> ResNet-50
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> {
                      selectedImage ? "Ready to analyze" : "Waiting for image"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results */}
        <ResultsDisplay
          predictions={predictions}
          gradcamImage={gradcamImage}
          isLoading={isAnalyzing}
        />

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-ai-primary/20">
            <Sparkles className="h-4 w-4 text-ai-primary" />
            <span className="text-sm text-muted-foreground">
              Powered by advanced neural networks and explainable AI
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;