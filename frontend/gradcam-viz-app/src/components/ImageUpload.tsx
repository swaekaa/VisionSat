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
    <Card className="max-w-2xl mx-auto mt-6"> {/* slightly smaller card */}
      <CardContent className="flex flex-col gap-4 pt-4">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative flex flex-col items-center justify-center border-3 border-dashed rounded-xl p-8 transition-all cursor-pointer w-full min-h-[300px]
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
              <Upload className="text-blue-500" size={36} /> {/* smaller icon */}
              <span className="text-lg font-medium text-muted-foreground">
                Drag & drop an image here, or{" "}
                <span className="text-blue-600 underline">click to select</span>
              </span>
            </div>
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected"
                className="rounded-lg shadow-lg object-contain max-h-[85%] max-w-[85%]" // slightly smaller
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
              <span className="absolute bottom-2 left-2 bg-black/70 text-white text-sm px-2 py-1 rounded flex items-center gap-1">
                <ImageIcon className="inline" size={14} />
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
