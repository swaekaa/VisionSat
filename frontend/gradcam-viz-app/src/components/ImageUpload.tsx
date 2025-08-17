import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      onImageSelected(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      onImageSelected(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardContent className="flex flex-col gap-6 pt-5">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer
            ${dragActive ? "border-blue-500 bg-blue-50" : "border-muted bg-card/20"}
            ${selectedFile ? "border-green-500" : ""}`}
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
              <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                <ImageIcon className="inline mr-1" size={14} />
                {selectedFile.name}
              </span>
            </div>
          )}
        </div>
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
