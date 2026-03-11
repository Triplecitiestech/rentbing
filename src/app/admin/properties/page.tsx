"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAdmin } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface PropertyImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
}

interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  description: string | null;
  price: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number | null;
  property_type: string;
  status: string;
  featured: boolean;
  image_count: number;
  created_at: string;
}

type EditingProperty = Partial<Property> & { id?: string };

export default function AdminPropertiesPage() {
  const { authHeaders } = useAdmin();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditingProperty | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Image management state
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(
    async (propertyId: string) => {
      setLoadingImages(true);
      try {
        const res = await fetch(
          `/api/admin/images?property_id=${propertyId}`,
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
    },
    [authHeaders]
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editing?.id) return;

    setUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append("property_id", editing.id);
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
        fetchImages(editing.id);
        fetchProperties();
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

  const handleImageDelete = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await fetch(`/api/admin/images?id=${imageId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok && editing?.id) {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
        fetchProperties();
      }
    } catch {
      alert("Delete failed");
    }
  };

  const setAsHero = async (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const [moved] = newImages.splice(index, 1);
    newImages.unshift(moved);
    setImages(newImages);
    await saveImageOrder(newImages);
  };

  const saveImageOrder = async (orderedImages: PropertyImage[]) => {
    const order = orderedImages.map((img, i) => ({
      id: img.id,
      sort_order: i,
    }));
    try {
      await fetch("/api/admin/images", {
        method: "PATCH",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ order }),
      });
    } catch {
      alert("Failed to save order");
      if (editing?.id) fetchImages(editing.id);
    }
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);

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
    await saveImageOrder(images);
  };

  const fetchProperties = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/properties", {
        headers: authHeaders(),
      });
      const data = await res.json();
      setProperties(data.properties || []);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setMessage(null);

    const isNew = !editing.id;
    const method = isNew ? "POST" : "PATCH";

    try {
      const res = await fetch("/api/admin/properties", {
        method,
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: isNew
            ? "Property created — you can now add images below"
            : "Property updated",
        });
        fetchProperties();
        if (isNew && data.property?.id) {
          // Stay in edit mode so user can add images
          setEditing({ ...editing, ...data.property });
          setImages([]);
        } else {
          setEditing(null);
        }
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch {
      setMessage({ type: "error", text: "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (
      !confirm(
        `Delete "${title}"? This will also delete all its images. This cannot be undone.`
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/properties?id=${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
        setMessage({ type: "success", text: `"${title}" deleted` });
      }
    } catch {
      setMessage({ type: "error", text: "Delete failed" });
    }
  };

  const startNew = () => {
    setEditing({
      title: "",
      address: "",
      city: "Binghamton",
      state: "NY",
      zip: "13901",
      description: "",
      price: "",
      bedrooms: 1,
      bathrooms: 1,
      square_feet: null,
      property_type: "Apartment",
      status: "available",
      featured: false,
    });
  };

  const startEdit = (p: Property) => {
    setEditing({ ...p });
    setUploadResult(null);
    fetchImages(p.id);
  };

  if (loading) {
    return <p className="text-secondary-400">Loading properties...</p>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Button onClick={startNew}>Add Property</Button>
      </div>

      {message && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-emerald-600/20 text-emerald-400"
              : "bg-red-600/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Edit/Create form */}
      {editing && (
        <Card className="mb-6" padding="md">
          <h2 className="mb-4 text-lg font-semibold">
            {editing.id ? "Edit Property" : "New Property"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-secondary-300">
                Title *
              </label>
              <input
                value={editing.title || ""}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
                className="w-full rounded-lg border border-secondary-600 bg-secondary-800/50 px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 132 Washington Street"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-secondary-300">
                Price *
              </label>
              <input
                value={editing.price || ""}
                onChange={(e) =>
                  setEditing({ ...editing, price: e.target.value })
                }
                className="w-full rounded-lg border border-secondary-600 bg-secondary-800/50 px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. $700–$775/bedroom + utilities"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-secondary-300">
                Address *
              </label>
              <input
                value={editing.address || ""}
                onChange={(e) =>
                  setEditing({ ...editing, address: e.target.value })
                }
                className="w-full rounded-lg border border-secondary-600 bg-secondary-800/50 px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="132 Washington Street"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-secondary-300">
                City
              </label>
              <input
                value={editing.city || "Binghamton"}
                onChange={(e) =>
                  setEditing({ ...editing, city: e.target.value })
                }
                className="w-full rounded-lg border border-secondary-600 bg-secondary-800/50 px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm text-secondary-300">
                  State
                </label>
                <input
                  value={editing.state || "NY"}
                  onChange={(e) =>
                    setEditing({ ...editing, state: e.target.value })
                  }
                  className="w-full rounded-lg border border-secondary-600 bg-secondary-800/50 px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-secondary-300">
                  ZIP
                </label>
                <input
                  value={editing.zip || "13901"}
                  onChange={(e) =>
                    setEditing({ ...editing, zip: e.target.value })
                  }
                  className="w-full rounded-lg border border-secondary-600 bg-secondary-800/50 px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-1 block text-sm text-secondary-300">
                  Bedrooms
                </label>
                <input
                  type="number"
                  min={0}
                  value={editing.bedrooms ?? 1}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      bedrooms: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-lg border border-secondary-600 bg-secondary-800/50 px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-secondary-300">
                  Bathrooms
                </label>
                <input
                  type="number"
                  min={0}
                  value={editing.bathrooms ?? 1}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      bathrooms: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-lg border border-secondary-600 bg-secondary-800/50 px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-secondary-300">
                  Sq Ft
                </label>
                <input
                  type="number"
                  min={0}
                  value={editing.square_feet ?? ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      square_feet: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                  className="w-full rounded-lg border border-secondary-600 bg-secondary-800/50 px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm text-secondary-300">
                  Type
                </label>
                <select
                  value={editing.property_type || "Apartment"}
                  onChange={(e) =>
                    setEditing({ ...editing, property_type: e.target.value })
                  }
                  className="w-full rounded-lg border border-secondary-600 bg-secondary-800/50 px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Apartment" className="bg-secondary-800">
                    Apartment
                  </option>
                  <option value="House" className="bg-secondary-800">
                    House
                  </option>
                  <option value="Duplex" className="bg-secondary-800">
                    Duplex
                  </option>
                  <option value="Townhouse" className="bg-secondary-800">
                    Townhouse
                  </option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-secondary-300">
                  Status
                </label>
                <select
                  value={editing.status || "available"}
                  onChange={(e) =>
                    setEditing({ ...editing, status: e.target.value })
                  }
                  className="w-full rounded-lg border border-secondary-600 bg-secondary-800/50 px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="available" className="bg-secondary-800">
                    Available
                  </option>
                  <option value="rented" className="bg-secondary-800">
                    Rented
                  </option>
                </select>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-3 text-sm text-secondary-300">
                <input
                  type="checkbox"
                  checked={!!editing.featured}
                  onChange={(e) =>
                    setEditing({ ...editing, featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-secondary-600 bg-secondary-800 text-primary-500 focus:ring-primary-500"
                />
                <span>
                  <strong className="text-white">Featured on Home Page</strong>
                  <span className="ml-2 text-secondary-500">— This property will appear in the featured section on the main page</span>
                </span>
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-secondary-300">
                Description
              </label>
              <textarea
                value={editing.description || ""}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
                rows={4}
                className="w-full resize-y rounded-lg border border-secondary-600 bg-secondary-800/50 px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Property description..."
              />
            </div>
          </div>

          {/* Image management — only available after property is saved */}
          {editing.id && (
            <div className="mt-6 border-t border-secondary-700/50 pt-6">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold">Property Images</h3>
                  <p className="text-xs text-secondary-500">
                    The first image is the <strong className="text-primary-400">hero/cover photo</strong> shown on listings and the home page.
                    Drag to reorder or click &quot;Set as Hero&quot; on any image.
                  </p>
                  <p className="mt-1 text-xs text-secondary-600">
                    Recommended: <strong className="text-secondary-400">1600x1200px or larger</strong> (4:3 ratio). Images are auto-optimized to max 2000x2000px JPEG.
                    For best results, upload photos at least 1200px wide to avoid blur.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="primary">{images.length} images</Badge>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="property-file-upload"
                  />
                  <Button
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    isLoading={uploading}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload Images"}
                  </Button>
                </div>
              </div>

              {uploadResult && (
                <p
                  className={`mb-3 text-sm ${uploadResult.startsWith("Error") ? "text-red-400" : "text-emerald-400"}`}
                >
                  {uploadResult}
                </p>
              )}

              {loadingImages ? (
                <p className="text-sm text-secondary-400">Loading images...</p>
              ) : images.length === 0 ? (
                <div className="rounded-lg border border-dashed border-secondary-600 p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                  <p className="mt-2 text-sm text-secondary-400">
                    No images yet. Click &quot;Upload Images&quot; to add photos.
                  </p>
                  <p className="mt-1 text-xs text-secondary-600">
                    Supports JPEG, PNG, WebP, HEIC/HEIF. Max 20MB per file.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
                          : index === 0
                            ? "border-primary-500/50 ring-1 ring-primary-500/30"
                            : "border-secondary-700/50 hover:border-secondary-500"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.image_url}
                        alt={img.alt_text || "Property photo"}
                        className="aspect-square w-full object-cover"
                      />
                      {/* Always-visible hero label */}
                      {index === 0 && (
                        <div className="absolute left-2 top-2">
                          <Badge variant="success">Hero / Cover</Badge>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex flex-col justify-between bg-black/0 transition-colors group-hover:bg-black/50">
                        <div className="flex justify-between p-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <Badge variant={index === 0 ? "success" : "default"}>
                            {index === 0 ? "Hero" : `#${index + 1}`}
                          </Badge>
                          <button
                            onClick={() => handleImageDelete(img.id)}
                            className="rounded-full bg-red-600 p-1 text-white transition-colors hover:bg-red-700"
                            title="Delete image"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="text-xs text-white/70">Drag to reorder</span>
                          {index !== 0 && (
                            <button
                              onClick={() => setAsHero(index)}
                              className="rounded bg-primary-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-primary-700"
                            >
                              Set as Hero
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!editing.id && (
            <p className="mt-4 text-xs text-secondary-500">
              Save the property first, then you can add images.
            </p>
          )}

          <div className="mt-4 flex gap-3">
            <Button onClick={handleSave} isLoading={saving}>
              {editing.id ? "Save Changes" : "Create Property"}
            </Button>
            <Button variant="ghost" onClick={() => { setEditing(null); setImages([]); setUploadResult(null); }}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Properties list */}
      <div className="space-y-3">
        {properties.length === 0 ? (
          <Card padding="lg">
            <p className="text-center text-secondary-400">
              No properties yet. Click &quot;Add Property&quot; to create one.
            </p>
          </Card>
        ) : (
          properties.map((p) => (
            <Card key={p.id} padding="md">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold">{p.title}</h3>
                    <Badge
                      variant={
                        p.status === "available" ? "success" : "warning"
                      }
                    >
                      {p.status}
                    </Badge>
                    {p.featured && (
                      <Badge variant="primary">Featured</Badge>
                    )}
                  </div>
                  <p className="text-sm text-secondary-400">
                    {p.address}, {p.city}, {p.state} {p.zip}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-secondary-500">
                    <span>{p.bedrooms} bed / {p.bathrooms} bath</span>
                    {p.square_feet && <span>{p.square_feet} sqft</span>}
                    <span>{p.price}</span>
                    <span>{p.image_count} photos</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(p)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(p.id, p.title)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
