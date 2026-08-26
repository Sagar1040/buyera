"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Image as ImageIcon,
  X,
  Trash2,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
} from "lucide-react";

export type ImageUploadType = "banner" | "product" | "category" | "brand";

interface ImageUploadProps {
  type?: ImageUploadType;
  value: string;
  onChange: (url: string) => void;
  onDelete?: () => void;
  label?: string;
  className?: string;
  folder?: string;
}

const GUIDE_CONFIGS: Record<
  ImageUploadType,
  {
    badge: string;
    guide: string;
    aspect: string;
    maxSizeMB: number;
    folder: string;
  }
> = {
  banner: {
    badge: "EDITORIAL BANNER",
    guide: "Recommended: 1920x600 px (16:9 widescreen) | Max 5MB (JPG, PNG, WEBP)",
    aspect: "aspect-[16/6]",
    maxSizeMB: 5,
    folder: "banners",
  },
  product: {
    badge: "PORTRAIT ATELIER",
    guide: "Recommended: 800x1066 px (3:4 portrait) | Max 3MB (JPG, PNG, WEBP)",
    aspect: "aspect-[3/4]",
    maxSizeMB: 3,
    folder: "products",
  },
  category: {
    badge: "CIRCULAR / ARCH",
    guide: "Recommended: 600x600 px (1:1 square) | Max 2MB (JPG, PNG, WEBP)",
    aspect: "aspect-square",
    maxSizeMB: 2,
    folder: "categories",
  },
  brand: {
    badge: "LOGO / ASSET",
    guide: "Recommended: 400x160 px (Transparent SVG/PNG) | Max 2MB",
    aspect: "aspect-[5/2]",
    maxSizeMB: 2,
    folder: "branding",
  },
};

export function ImageUpload({
  type = "product",
  value,
  onChange,
  onDelete,
  label,
  className = "",
  folder,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const config = GUIDE_CONFIGS[type] || GUIDE_CONFIGS.product;
  const targetFolder = folder || config.folder;

  const handleFileUpload = async (file: File) => {
    setErrorMessage(null);

    // Validate size
    if (file.size > config.maxSizeMB * 1024 * 1024) {
      setErrorMessage(`Image size exceeds ${config.maxSizeMB}MB limit.`);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", targetFolder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image to Supabase Storage");
      }

      onChange(data.url);
    } catch (err: any) {
      setErrorMessage(err.message || "Upload failed. Please check network connection.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const oldUrl = value;
    onChange("");
    if (onDelete) onDelete();

    if (oldUrl && oldUrl.includes("supabase.co/storage")) {
      try {
        await fetch("/api/admin/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: oldUrl }),
        });
      } catch (err) {
        console.warn("Storage delete notice:", err);
      }
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Top Header & Dimension Guide Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        {label && (
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-terracotta" />
            {label}
          </label>
        )}
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase font-bold tracking-widest text-terracotta bg-terracotta-50 px-2 py-0.5 rounded-full border border-terracotta-100">
            {config.badge}
          </span>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[10px] text-charcoal/60 hover:text-terracotta underline font-medium"
          >
            {showUrlInput ? "Dropzone Mode" : "Paste URL"}
          </button>
        </div>
      </div>

      {/* Recommended Dimension Hint */}
      <p className="text-[11px] text-charcoal/55 font-light">
        {config.guide}
      </p>

      {/* Direct URL Input Mode */}
      {showUrlInput && (
        <div className="p-3 bg-cream-50 border border-aramyaBorder rounded-2xl space-y-1.5 animate-fadeIn">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">
            Direct Image URL / Supabase Link:
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://ikfoozxpwyregnxexmnu.supabase.co/storage/..."
              className="flex-1 px-3 py-2 text-xs border border-aramyaBorder rounded-xl bg-white text-charcoal focus:outline-none focus:border-terracotta font-mono"
            />
            {value && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-2 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl hover:bg-rose-100 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Drag-and-Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !value && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl transition-all duration-300 overflow-hidden flex flex-col items-center justify-center p-4 cursor-pointer text-center ${
          isDragging
            ? "border-terracotta bg-terracotta-50/50 scale-[0.99]"
            : value
            ? "border-aramyaBorder bg-white"
            : "border-aramyaBorder/80 bg-cream-50/60 hover:bg-cream-50 hover:border-terracotta/50"
        } ${value ? "min-h-[160px]" : "min-h-[140px]"}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/svg+xml"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        {/* Upload in progress overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-2 animate-fadeIn">
            <RefreshCw className="w-6 h-6 animate-spin text-terracotta" />
            <span className="text-xs uppercase font-bold tracking-widest text-charcoal">
              Uploading to Supabase Storage...
            </span>
          </div>
        )}

        {/* Image Preview */}
        {value ? (
          <div className="relative w-full flex flex-col items-center group">
            <div className={`relative w-full max-w-sm ${config.aspect} rounded-2xl overflow-hidden bg-cream-100 border border-aramyaBorder shadow-sm`}>
              <img
                src={value}
                alt="Uploaded preview"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-3.5 py-1.5 bg-white text-charcoal text-xs font-bold uppercase rounded-full shadow-md hover:bg-terracotta hover:text-white transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3.5 py-1.5 bg-rose-600 text-white text-xs font-bold uppercase rounded-full shadow-md hover:bg-rose-700 transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-2 text-[10px] text-charcoal/60 font-mono truncate max-w-full">
              <span className="truncate">{value}</span>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-terracotta hover:underline shrink-0 flex items-center gap-0.5"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : (
          /* Empty Drag & Drop State */
          <div className="space-y-2 py-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-aramyaBorder text-terracotta flex items-center justify-center mx-auto shadow-xs group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-charcoal">
                Click to upload or drag & drop
              </p>
              <p className="text-[10px] text-charcoal/50 font-light">
                PNG, JPG, WEBP or SVG up to {config.maxSizeMB}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 rounded-2xl animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

// Backwards-compatible export
export { ImageUpload as ImageUploadDropzone };
