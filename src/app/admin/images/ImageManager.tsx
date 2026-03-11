"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface Property {
  id: string;
  title: string;
  address: string;
}

interface PropertyImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
}

interface ImageManagerProps {
  adminKey: string;
}

export default function ImageManager({ adminKey }: ImageManagerProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const authHeaders = useCallback(
    () => ({ Authorization: `Bearer ${adminKey}` }),
    [adminKey]
  );

  // Fetch properties list on mount
  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data) => setProperties(data.properties || []))
      .catch(() => setProperties([]));
  }, []);

  // Fetch images for selected property
  const fetchImages = useCallback(async () => {
    if (!selectedPropertyId) return;
    setLoadingImages(true);
    try {
      const res = await fetch(
        `/api/admin/images?property_id=${selectedPropertyId}`,
        { headers: authHeaders() }
      );
      if (res.ok) {
        const data = await res.json();
        setImages(data.images || []);
      }
    } catch {
      setImages([]);
    } finally {
      setLoadingImages(false);
    }
  }, [selectedPropertyId, authHeaders]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedPropertyId) return;

    setUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append("property_id", selectedPropertyId);
    Array.from(files).forEach((file) => formData.append("images", file));

    try {
      const res = await fetch("/api/admin/images", {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setUploadResult(
          `${data.message}${data.errors ? ` | Errors: ${data.errors.join(", ")}` : ""}`
        );
        fetchImages();
      } else {
        setUploadResult(`Error: ${data.error}`);
      }
    } catch {
      setUploadResult("Upload failed — network error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;

    try {
      const res = await fetch(`/api/admin/images?id=${imageId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
      }
    } catch {
      alert("Delete failed");
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const [moved] = newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, moved);
    setImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);

    const order = images.map((img, i) => ({ id: img.id, sort_order: i }));
    try {
      await fetch("/api/admin/images", {
        method: "PATCH",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ order }),
      });
    } catch {
      alert("Failed to save order");
      fetchImages();
    }
  };

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);

  return (
    <div className="min-h-screen bg-secondary-950 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold">Property Image Manager</h1>

        {/* Property selector */}
        <Card className="mb-6" padding="md">
          <label
            htmlFor="property"
            className="mb-1.5 block text-sm font-medium text-secondary-300"
          >
            Select Property
          </label>
          <select
            id="property"
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="w-full rounded-lg border border-secondary-600 bg-secondary-800/50 px-4 py-2.5 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="" className="bg-secondary-800">
              Choose a property...
            </option>
            {properties.map((p) => (
              <option key={p.id} value={p.id} className="bg-secondary-800">
                {p.title} — {p.address}
              </option>
            ))}
          </select>
        </Card>

        {selectedProperty && (
          <>
            {/* Upload area */}
            <Card className="mb-6" padding="md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedProperty.title}
                  </h2>
                  <p className="text-sm text-secondary-400">
                    {selectedProperty.address}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="primary">{images.length} images</Badge>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
                    multiple
                    onChange={handleUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    isLoading={uploading}
                    disabled={uploading}
                  >
                    {uploading ? "Converting & Uploading..." : "Upload Images"}
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-xs text-secondary-500">
                Supports JPEG, PNG, WebP, HEIC/HEIF. HEIC files are
                automatically converted to JPEG. Max 20MB per file.
              </p>
              {uploadResult && (
                <p
                  className={`mt-2 text-sm ${uploadResult.startsWith("Error") ? "text-red-400" : "text-emerald-400"}`}
                >
                  {uploadResult}
                </p>
              )}
            </Card>

            {/* Image grid */}
            {loadingImages ? (
              <p className="text-center text-secondary-400">
                Loading images...
              </p>
            ) : images.length === 0 ? (
              <Card padding="lg">
                <p className="text-center text-secondary-400">
                  No images yet. Upload some above.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`group relative cursor-grab overflow-hidden rounded-lg border transition-all ${
                      draggedIndex === index
                        ? "border-primary-500 opacity-50"
                        : "border-secondary-700/50 hover:border-secondary-500"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.image_url}
                      alt={img.alt_text || "Property photo"}
                      className="aspect-square w-full object-cover"
                    />
                    <div className="absolute inset-0 flex flex-col justify-between bg-black/0 transition-colors group-hover:bg-black/40">
                      <div className="flex justify-between p-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <Badge variant={index === 0 ? "success" : "default"}>
                          {index === 0 ? "Cover" : `#${index + 1}`}
                        </Badge>
                        <button
                          onClick={() => handleDelete(img.id)}
                          className="rounded-full bg-red-600 p-1 text-white transition-colors hover:bg-red-700"
                          title="Delete image"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                        Drag to reorder
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
