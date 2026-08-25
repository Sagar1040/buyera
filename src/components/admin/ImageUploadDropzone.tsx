"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  X,
  CheckCircle2,
  Link as LinkIcon,
  Trash2,
} from "lucide-react";

interface ImageUploadDropzoneProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  placeholder?: string;
  aspectRatio?: "square" | "banner" | "product";
}

export function ImageUploadDropzone({
  value,
  onChange,
  label = "Upload Image",
  className = "",
  placeholder = "https://images.unsplash.com/...",
  aspectRatio = "product",
}: ImageUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputVal, setUrlInputVal] = useState(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WEBP, GIF).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError("Image file size exceeds 15MB limit.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Image upload failed.");
      }

      onChange(data.url);
      setUrlInputVal(data.url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setUrlInputVal("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const aspectClass =
    aspectRatio === "banner"
      ? "aspect-[21/9] sm:aspect-[16/7]"
      : aspectRatio === "square"
      ? "aspect-square"
      : "aspect-[3/4]";

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal">
            {label}
          </label>
        )}
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-gold-dark hover:text-charcoal font-medium transition-colors flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlInput ? "Hide Direct URL" : "Enter Image URL"}
        </button>
      </div>

      {showUrlInput && (
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={urlInputVal}
            onChange={(e) => {
              setUrlInputVal(e.target.value);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            className="flex-1 border border-canvas-border p-2 text-xs text-charcoal font-mono bg-cream-50/50 focus:outline-none focus:border-gold"
          />
          {urlInputVal && (
            <button
              type="button"
              onClick={() => {
                setUrlInputVal("");
                onChange("");
              }}
              className="p-2 text-rose-600 hover:text-rose-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Dropzone & Preview Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative group border-2 border-dashed transition-all cursor-pointer rounded-xs overflow-hidden ${
          isDragging
            ? "border-gold bg-gold/5"
            : value
            ? "border-canvas-border bg-white"
            : "border-canvas-border/80 bg-cream-50/40 hover:border-gold/60 hover:bg-cream-100/50"
        } ${value ? "" : "p-6 text-center"}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {value ? (
          <div className={`relative w-full ${aspectClass} bg-cream-100 flex items-center justify-center overflow-hidden`}>
            {/* Live Image Preview */}
            <img
              src={value}
              alt="Uploaded Asset Preview"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                // If broken link
                (e.target as HTMLElement).style.display = "none";
              }}
            />

            {/* Hover overlay with action buttons */}
            <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 text-white">
              <UploadCloud className="w-6 h-6 text-gold" />
              <p className="text-xs font-semibold">Click or Drop new image to replace</p>
              <button
                type="button"
                onClick={handleRemove}
                className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] uppercase tracking-wider font-semibold rounded-xs shadow-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Image
              </button>
            </div>

            {/* Badge Indicator */}
            <span className="absolute top-2 left-2 bg-charcoal/80 text-gold text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs backdrop-blur-xs flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Active Preview
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 px-4 space-y-2">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
                <p className="text-xs font-semibold text-charcoal">
                  Uploading Image to Server...
                </p>
                <p className="text-[10px] text-charcoal/50">Please wait a moment</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-cream-100 border border-canvas-border flex items-center justify-center text-charcoal/60 group-hover:text-gold group-hover:border-gold transition-colors">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-charcoal">
                    Click to browse or drag & drop image
                  </p>
                  <p className="text-[10px] text-charcoal/50 mt-0.5">
                    Supports high-resolution PNG, JPG, WEBP (up to 15MB)
                  </p>
                </div>
                <span className="inline-block mt-2 px-3 py-1 bg-white border border-canvas-border text-[10px] font-semibold uppercase tracking-wider text-charcoal/70 group-hover:border-gold">
                  Select Local File
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1">
          <X className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
