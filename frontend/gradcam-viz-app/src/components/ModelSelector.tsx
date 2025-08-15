import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Brain, Cpu, Zap } from "lucide-react";

interface ModelOption {
  id: string;
  name: string;
  description: string;
  accuracy: string;
  speed: "fast" | "medium" | "slow";
  icon: React.ReactNode;
}

const modelOptions: ModelOption[] = [
  {
    id: "resnet50",
    name: "ResNet-50",
    description: "Deep residual network for image classification",
    accuracy: "92.1%",
    speed: "fast",
    icon: <Zap className="h-4 w-4" />
  },
  {
    id: "vgg16",
    name: "VGG-16",
    description: "Visual geometry group convolutional neural network",
    accuracy: "90.8%",
    speed: "medium",
    icon: <Brain className="h-4 w-4" />
  },
  {
    id: "efficientnet",
    name: "EfficientNet-B7",
    description: "Compound scaling method for neural networks",
    accuracy: "94.3%",
    speed: "slow",
    icon: <Cpu className="h-4 w-4" />
  }
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  const selectedModelInfo = modelOptions.find(model => model.id === selectedModel);

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case "fast": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "slow": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-ai-primary" />
          Model Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="bg-background/50 border-ai-primary/20 focus:border-ai-primary focus:ring-ai-primary/30">
            <SelectValue placeholder="Choose a model" />
          </SelectTrigger>
          <SelectContent className="bg-card/95 backdrop-blur-sm border-ai-primary/20">
            {modelOptions.map((model) => (
              <SelectItem key={model.id} value={model.id} className="focus:bg-ai-primary/10">
                <div className="flex items-center gap-3">
                  {model.icon}
                  <div>
                    <div className="font-medium">{model.name}</div>
                    <div className="text-xs text-muted-foreground">{model.description}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedModelInfo && (
          <div className="p-4 rounded-lg bg-gradient-subtle border border-ai-primary/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {selectedModelInfo.icon}
                <span className="font-medium">{selectedModelInfo.name}</span>
              </div>
              <Badge className={getSpeedColor(selectedModelInfo.speed)} variant="outline">
                {selectedModelInfo.speed}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {selectedModelInfo.description}
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Accuracy:</span>
              <span className="text-ai-primary font-medium">{selectedModelInfo.accuracy}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};