import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Target, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface Prediction {
  class: string;
  confidence: number; // 0 to 1
}

interface ResultsDisplayProps {
  heatmap?: string; // GradCAM image
  predictions?: Prediction[]; // predictions from backend
  isLoading?: boolean;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ heatmap, predictions, isLoading }) => {
  const displayPredictions: Prediction[] = predictions || [];

  // Show placeholder if nothing has been analyzed yet
  if (!isLoading && !heatmap && displayPredictions.length === 0) {
    return (
      <Card className="text-center py-12 mt-8">
        <CardContent>
          <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
          <p className="text-muted-foreground">
            Upload an image and click Analyze to see predictions and GradCAM visualizations
          </p>
        </CardContent>
      </Card>
    );
  }

  const showPredictions = isLoading || !!heatmap || displayPredictions.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Predictions Panel */}
      {showPredictions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-ai-primary" />
              Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayPredictions.map((p, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-gradient-subtle border border-ai-primary/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{p.class}</span>
                    <Badge
                      variant="outline"
                      className={i === 0
                        ? "bg-ai-primary/20 text-ai-primary border-ai-primary/30"
                        : "bg-muted/50"
                      }
                    >
                      #{i + 1}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-medium">{(p.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={p.confidence * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* GradCAM Panel */}
      {/* GradCAM Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-ai-secondary" />
            GradCAM Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          {heatmap ? (
            <Dialog>
              <DialogTrigger asChild>
                <img
                  src={heatmap}
                  alt="GradCAM Heatmap"
                  className="w-full aspect-square object-cover rounded-lg border border-ai-secondary/20 cursor-pointer hover:opacity-90 transition"
                />
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-2">
                <img
                  src={heatmap}
                  alt="Full GradCAM Heatmap"
                  className="w-full h-auto rounded-lg"
                />
              </DialogContent>
            </Dialog>
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
