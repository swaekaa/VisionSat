import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/gradcam";

const ImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [heatmap, setHeatmap] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag events for highlight animation
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    setError(null);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      uploadImage(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  // Handle file selection via click
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      uploadImage(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setHeatmap(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Upload image to backend and handle response
  const uploadImage = async (file: File) => {
    setLoading(true);
    setHeatmap(null);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Server error");
      }

      const data = await response.json();
      if (data.heatmap) {
        setHeatmap(`data:image/png;base64,${data.heatmap}`);
      } else {
        setError("No heatmap returned from server.");
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardContent className="flex flex-col gap-6">
        {/* Drag-and-drop and click-to-upload area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer
            ${dragActive ? "border-blue-500 bg-blue-50" : "border-muted bg-card/20"}
            ${selectedFile ? "border-green-500" : ""}
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {!selectedFile ? (
            <div className="flex flex-col items-center gap-2">
              <Upload className="text-blue-500" size={32} />
              <span className="text-lg font-medium text-muted-foreground">
                Drag & drop an image here, or{" "}
                <span className="text-blue-600 underline">click to select</span>
              </span>
            </div>
          ) : (
            <div className="relative w-full flex flex-col items-center">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected"
                className="rounded-lg shadow-lg object-contain max-h-48 w-full"
              />
              {/* Remove button overlay */}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
                onClick={e => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                title="Remove image"
              >
                <X />
              </Button>
              {/* Image name at bottom left */}
              <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                <ImageIcon className="inline mr-1" size={14} />
                {selectedFile.name}
              </span>
            </div>
          )}
          {loading && (
            <span className="absolute inset-x-0 bottom-2 text-center text-blue-600 animate-pulse">
              Processing image...
            </span>
          )}
        </div>
        {/* Error message */}
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}
        {/* Grad-CAM heatmap result display */}
        {heatmap && (
          <div className="flex flex-col items-center gap-2 mt-2">
            <span className="font-semibold text-muted-foreground">
              Grad-CAM Heatmap
            </span>
            <img
              src={heatmap}
              alt="Grad-CAM Heatmap"
              className="rounded-lg shadow-lg object-contain max-h-48 w-full border border-blue-200"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUpload;