import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Target, TrendingUp } from "lucide-react";

interface Prediction {
  class: string;
  confidence: number;
  probability: number;
}

interface ResultsDisplayProps {
  predictions: Prediction[];
  gradcamImage?: string;
  isLoading?: boolean;
}

export const ResultsDisplay = ({ predictions, gradcamImage, isLoading }: ResultsDisplayProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-ai-primary animate-spin" />
              Analyzing...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-2 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-ai-secondary animate-pulse" />
              Generating GradCAM...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-muted rounded-lg animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (predictions.length === 0 && !gradcamImage) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
          <p className="text-muted-foreground">
            Upload an image and select a model to see predictions and explanations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-ai-primary" />
            Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gradient-subtle border border-ai-primary/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{prediction.class}</span>
                  <Badge 
                    variant="outline" 
                    className={
                      index === 0 
                        ? "bg-ai-primary/20 text-ai-primary border-ai-primary/30" 
                        : "bg-muted/50"
                    }
                  >
                    #{index + 1}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-medium">{(prediction.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={prediction.confidence * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* GradCAM Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-ai-secondary" />
            GradCAM Explanation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gradcamImage ? (
            <div className="space-y-4">
              <img
                src={gradcamImage}
                alt="GradCAM Visualization"
                className="w-full aspect-square object-cover rounded-lg border border-ai-secondary/20"
              />
              <div className="text-sm text-muted-foreground">
                <p>
                  <span className="text-ai-secondary font-medium">GradCAM</span> highlights 
                  the regions that influenced the model's decision. 
                  Warmer colors indicate higher importance.
                </p>
              </div>
            </div>
          ) : (
            <div className="aspect-square bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
              <div className="text-center">
                <Eye className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">
                  GradCAM visualization will appear here
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};