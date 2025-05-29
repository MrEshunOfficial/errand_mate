// components/ui/image-upload.tsx
"use client";

import React, { useCallback, useState } from "react";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImageUploadProps {
  value?: string; // Current image URL
  onChange: (url: string | null) => void; // Callback when image changes
  onAltTextChange?: (altText: string) => void; // Callback for alt text changes
  altText?: string; // Current alt text
  disabled?: boolean;
  className?: string;
  maxSizeInMB?: number; // Maximum file size in MB
  acceptedFormats?: string[]; // Accepted file formats
  showAltTextInput?: boolean; // Whether to show alt text input
  placeholder?: string; // Placeholder text
  width?: number; // Preview width
  height?: number; // Preview height
}

const DEFAULT_ACCEPTED_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export default function ImageUpload({
  value,
  onChange,
  onAltTextChange,
  altText = "",
  disabled = false,
  className,
  maxSizeInMB = 5,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  showAltTextInput = false,
  placeholder = "Click to upload an image or drag and drop",
  width = 200,
  height = 150,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Simulate upload function - replace with your actual upload logic
  const uploadToCloudinary = async (file: File): Promise<string> => {
    // This is a mock implementation - replace with your actual upload logic
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful upload
        const mockUrl = URL.createObjectURL(file);
        resolve(mockUrl);

        // Uncomment below to simulate error
        // reject(new Error("Upload failed"));
      }, 2000);
    });
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file type. Please upload: ${acceptedFormats.join(", ")}`;
    }

    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return `File too large. Maximum size is ${maxSizeInMB}MB`;
    }

    return null;
  };

  const handleFileUpload = async (file: File) => {
    setUploadError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setIsUploading(true);

    try {
      const imageUrl = await uploadToCloudinary(file);
      onChange(imageUrl);

      // If alt text callback is provided and no alt text exists, suggest using filename
      if (onAltTextChange && !altText) {
        onAltTextChange(file.name.split(".")[0]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input value to allow uploading the same file again
    event.target.value = "";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled || isUploading) return;

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) =>
        acceptedFormats.includes(file.type)
      );

      if (imageFile) {
        handleFileUpload(imageFile);
      } else {
        setUploadError("Please drop a valid image file");
      }
    },
    [disabled, isUploading, acceptedFormats]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled && !isUploading) {
        setIsDragging(true);
      }
    },
    [disabled, isUploading]
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleRemoveImage = () => {
    onChange(null);
    if (onAltTextChange) {
      onAltTextChange("");
    }
    setUploadError(null);
  };

  const handleAltTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onAltTextChange) {
      onAltTextChange(e.target.value);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-all duration-200",
          {
            "border-muted-foreground/25 hover:border-muted-foreground/50":
              !isDragging && !disabled,
            "border-primary bg-primary/5": isDragging,
            "border-muted-foreground/10 bg-muted/20": disabled,
            "cursor-not-allowed": disabled || isUploading,
            "cursor-pointer": !disabled && !isUploading,
          }
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{ width, height: value ? "auto" : height }}>
        <input
          type="file"
          accept={acceptedFormats.join(",")}
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        {/* Upload Content */}
        {!value ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-1">
                  {placeholder}
                </p>
                <p className="text-xs text-muted-foreground">
                  Max {maxSizeInMB}MB •{" "}
                  {acceptedFormats
                    .map((format) => format.split("/")[1].toUpperCase())
                    .join(", ")}
                </p>
              </>
            )}
          </div>
        ) : (
          /* Image Preview */
          <div className="relative group">
            <div className="relative w-full">
              <Image
                src={value}
                alt={altText || "Uploaded image"}
                width={width}
                height={height}
                className="w-full h-auto rounded-lg object-cover"
                unoptimized
              />

              {/* Remove Button */}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                disabled={disabled || isUploading}
                className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Loading Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Alt Text Input */}
      {showAltTextInput && value && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Alt Text</label>
          <input
            type="text"
            value={altText}
            onChange={handleAltTextChange}
            placeholder="Describe the image for accessibility"
            disabled={disabled}
            className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground">
            Brief description of the image for accessibility
          </p>
        </div>
      )}

      {/* Error Display */}
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{uploadError}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUploadError(null)}
              className="h-auto p-0 text-destructive hover:text-destructive">
              ×
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
