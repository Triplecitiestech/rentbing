"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

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
          text: isNew ? "Property created" : "Property updated",
        });
        setEditing(null);
        fetchProperties();
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
    });
  };

  const startEdit = (p: Property) => {
    setEditing({ ...p });
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
          <div className="mt-4 flex gap-3">
            <Button onClick={handleSave} isLoading={saving}>
              {editing.id ? "Save Changes" : "Create Property"}
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>
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
