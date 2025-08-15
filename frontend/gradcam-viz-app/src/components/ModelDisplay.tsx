import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap } from "lucide-react";

export const ModelDisplay = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-ai-primary" />
          Model Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 rounded-lg bg-gradient-subtle border border-ai-primary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="font-medium">ResNet-50</span>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30" variant="outline">
              Active
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Deep residual network for image classification
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Accuracy:</span>
              <span className="text-ai-primary font-medium">97.24%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Speed:</span>
              <span className="text-green-400 font-medium">Fast</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};