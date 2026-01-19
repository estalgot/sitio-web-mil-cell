"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface ImageUploaderProps {
  onImagesChange?: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export function ImageUploader({ onImagesChange, maxImages = 6 }: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const newImages: UploadedImage[] = [];
      const remainingSlots = maxImages - images.length;

      Array.from(files)
        .slice(0, remainingSlots)
        .forEach((file) => {
          if (file.type.startsWith("image/")) {
            const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            newImages.push({
              id,
              file,
              preview: URL.createObjectURL(file),
            });
          }
        });

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesChange?.(updatedImages);
    },
    [images, maxImages, onImagesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeImage = useCallback(
    (id: string) => {
      const updatedImages = images.filter((img) => img.id !== id);
      const removedImage = images.find((img) => img.id === id);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview);
      }
      setImages(updatedImages);
      onImagesChange?.(updatedImages);
    },
    [images, onImagesChange]
  );

  return (
    <div className="w-full space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all duration-300",
          isDragging
            ? "border-primary bg-primary/10 scale-[1.01]"
            : "border-border/50 bg-input/30 hover:border-primary/40 hover:bg-primary/5",
          images.length >= maxImages && "pointer-events-none opacity-50"
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={images.length >= maxImages}
        />
        <div className="flex flex-col items-center gap-3 text-center">
          <div className={cn(
            "rounded-2xl p-4 transition-all duration-300",
            isDragging ? "bg-primary/20" : "bg-muted/50"
          )}>
            <Upload className={cn(
              "h-7 w-7 transition-colors",
              isDragging ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {isDragging ? "Suelta aquí" : "Arrastra tus fotos"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              o haz clic para seleccionar ({images.length}/{maxImages})
            </p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="animate-scale-in group relative aspect-square overflow-hidden rounded-xl bg-muted/50"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <img
                src={image.preview}
                alt={`Imagen ${index + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <button
                onClick={() => removeImage(image.id)}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-md transition-all hover:bg-destructive group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                <ImageIcon className="h-2.5 w-2.5" />
                <span>{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-primary/10 border border-primary/20 px-4 py-2.5">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-foreground text-xs">{images.length} foto{images.length !== 1 ? 's' : ''} lista{images.length !== 1 ? 's' : ''}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              images.forEach((img) => URL.revokeObjectURL(img.preview));
              setImages([]);
              onImagesChange?.([]);
            }}
            className="text-xs text-muted-foreground hover:text-destructive h-7 px-2"
          >
            Eliminar
          </Button>
        </div>
      )}
    </div>
  );
}
