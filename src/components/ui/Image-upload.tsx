// components/ui/image-upload-simple.tsx
"use client";

import React, { useCallback, useState } from "react";
import { Upload, X, AlertCircle, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImageUploadSimpleProps {
  value?: string | File; // Can be URL string or File object
  onChange: (file: File | null, previewUrl?: string) => void;
  disabled?: boolean;
  className?: string;
  maxSizeInMB?: number;
  acceptedFormats?: string[];
  placeholder?: string;
  width?: number;
  height?: number;
}

const DEFAULT_ACCEPTED_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export default function ImageUploadSimple({
  value,
  onChange,
  disabled = false,
  className,
  maxSizeInMB = 5,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  placeholder = "Click to upload an image or drag and drop",
  width = 400,
  height = 200,
}: ImageUploadSimpleProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Get display URL - either the value (if string) or preview URL (if File)
  const displayUrl = typeof value === "string" ? value : previewUrl;

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedFormats.includes(file.type)) {
        return `Invalid file type. Please upload: ${acceptedFormats
          .map((format) => format.split("/")[1].toUpperCase())
          .join(", ")}`;
      }

      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        return `File too large. Maximum size is ${maxSizeInMB}MB`;
      }

      return null;
    },
    [acceptedFormats, maxSizeInMB]
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      setUploadError(null);

      const validationError = validateFile(file);
      if (validationError) {
        setUploadError(validationError);
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Call onChange with the file and preview URL
      onChange(file, url);
    },
    [onChange, validateFile]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    event.target.value = "";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) =>
        acceptedFormats.includes(file.type)
      );

      if (imageFile) {
        handleFileSelect(imageFile);
      } else {
        setUploadError("Please drop a valid image file");
      }
    },
    [disabled, acceptedFormats, handleFileSelect]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setUploadError(null);
    onChange(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-all duration-200 overflow-hidden",
          {
            "border-muted-foreground/25 hover:border-muted-foreground/50":
              !isDragging && !disabled && !displayUrl,
            "border-primary bg-primary/5": isDragging,
            "border-muted-foreground/10 bg-muted/20": disabled,
            "cursor-not-allowed": disabled,
            "cursor-pointer": !disabled && !displayUrl,
            "border-muted-foreground/50": displayUrl,
          }
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          width: "100%",
          maxWidth: width,
          minHeight: displayUrl ? "auto" : height,
        }}>
        {!displayUrl && (
          <input
            type="file"
            accept={acceptedFormats.join(",")}
            onChange={handleInputChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
          />
        )}

        {!displayUrl ? (
          <div
            className="flex flex-col items-center justify-center p-6 text-center"
            style={{ minHeight: height }}>
            <div
              className={cn(
                "rounded-full p-4 mb-3 transition-colors",
                isDragging ? "bg-primary/10" : "bg-muted/50"
              )}>
              <Upload
                className={cn(
                  "h-8 w-8 transition-colors",
                  isDragging ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
            <p className="text-sm text-muted-foreground mb-1 font-medium">
              {isDragging ? "Drop your image here" : placeholder}
            </p>
            <p className="text-xs text-muted-foreground">
              Max {maxSizeInMB}MB •{" "}
              {acceptedFormats
                .map((format) => format.split("/")[1].toUpperCase())
                .join(", ")}
            </p>
          </div>
        ) : (
          <div className="relative group">
            <div className="relative w-full">
              <Image
                src={displayUrl}
                alt="Selected image"
                width={width}
                height={height}
                className="w-full h-auto rounded-lg object-cover"
                style={{ maxHeight: height * 1.5 }}
                unoptimized
                onError={() => {
                  setUploadError("Failed to load image");
                }}
              />

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                disabled={disabled}
                className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                <X className="h-4 w-4" />
              </Button>

              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={disabled}
                  className="h-8 px-3 shadow-lg"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = acceptedFormats.join(",");
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileSelect(file);
                    };
                    input.click();
                  }}>
                  <ImageIcon className="h-3 w-3 mr-1" />
                  Replace
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
