import React, { useState, useRef } from "react";

// Get API URL from environment variable, fallback to localhost if not set
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/gradcam";

/**
 * ImageUpload Component
 * - Handles drag-and-drop and click-to-upload for a single image
 * - Sends image to backend via POST (multipart/form-data)
 * - Displays returned Grad-CAM heatmap below the upload box
 * - Handles loading and error states
 */
const ImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [heatmap, setHeatmap] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setError(null);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      uploadImage(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      {/* Drag-and-drop and click-to-upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: "2px dashed #888",
          borderRadius: 8,
          padding: 32,
          textAlign: "center",
          cursor: "pointer",
          background: "#fafafa",
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <p>
          Drag & drop an image here, or{" "}
          <span style={{ color: "#007bff", textDecoration: "underline" }}>
            click to select
          </span>
        </p>
        {loading && <p>Processing image...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      {/* Display Grad-CAM heatmap below upload box */}
      {heatmap && (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <h4>Grad-CAM Heatmap</h4>
          <img
            src={heatmap}
            alt="Grad-CAM Heatmap"
            style={{
              maxWidth: "100%",
              borderRadius: 8,
              boxShadow: "0 2px 8px #ccc",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;