import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

interface ResultsDisplayProps {
  heatmap?: string; // base64 string for GradCAM
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ heatmap }) => {
  return (
    
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-ai-secondary" />
          GradCAM Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        {heatmap ? (
          <img
            src={heatmap}
            alt="GradCAM Heatmap"
            className="w-full aspect-square object-cover rounded-lg border border-ai-secondary/20"
          />
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
  );
};
