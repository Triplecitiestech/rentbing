"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface MaintenanceRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  unit_number: string | null;
  category: string;
  priority: string;
  title: string;
  description: string;
  status: string;
  property_id: string | null;
  created_at: string;
  updated_at: string;
  properties: { title: string; address: string } | null;
}

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "triaged", label: "Triaged" },
  { value: "in_progress", label: "In Progress" },
  { value: "waiting_parts", label: "Waiting on Parts" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "emergency", label: "Emergency" },
];

const STATUS_VARIANTS: Record<string, "default" | "primary" | "success" | "warning" | "danger"> = {
  new: "primary",
  triaged: "default",
  in_progress: "warning",
  waiting_parts: "warning",
  scheduled: "primary",
  completed: "success",
  cancelled: "danger",
};

const PRIORITY_VARIANTS: Record<string, "default" | "primary" | "success" | "warning" | "danger"> = {
  low: "default",
  medium: "primary",
  high: "warning",
  emergency: "danger",
};

export default function AdminMaintenancePage() {
  const { authHeaders } = useAdmin();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("open");

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/maintenance", {
        headers: authHeaders(),
      });
      const data = await res.json();
      setRequests(data.requests || []);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const updateRequest = async (
    id: string,
    field: "status" | "priority",
    value: string
  ) => {
    try {
      const res = await fetch("/api/admin/maintenance", {
        method: "PATCH",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ id, [field]: value }),
      });
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
        );
      }
    } catch {
      alert("Update failed");
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === "open")
      return !["completed", "cancelled"].includes(r.status);
    if (filter === "completed") return r.status === "completed";
    if (filter === "cancelled") return r.status === "cancelled";
    return true;
  });

  if (loading) {
    return <p className="text-secondary-400">Loading maintenance requests...</p>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Maintenance Requests</h1>
        <div className="flex gap-2">
          {["open", "completed", "cancelled", "all"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-primary-600/20 text-primary-400"
                  : "text-secondary-400 hover:bg-secondary-800 hover:text-white"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <Card padding="lg">
          <p className="text-center text-secondary-400">
            No {filter === "all" ? "" : filter} maintenance requests.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => {
            const expanded = expandedId === req.id;
            return (
              <Card key={req.id} padding="md">
                <div
                  className="flex cursor-pointer flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
                  onClick={() => setExpandedId(expanded ? null : req.id)}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold">{req.title}</h3>
                      <Badge variant={STATUS_VARIANTS[req.status] || "default"}>
                        {req.status.replace("_", " ")}
                      </Badge>
                      <Badge variant={PRIORITY_VARIANTS[req.priority] || "default"}>
                        {req.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-secondary-400">
                      {req.name} &middot; {req.category}
                      {req.properties && ` &middot; ${req.properties.title}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap text-xs text-secondary-500">
                      {new Date(req.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <svg
                      className={`h-4 w-4 text-secondary-500 transition-transform ${expanded ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {expanded && (
                  <div className="mt-4 border-t border-secondary-700/50 pt-4">
                    <div className="grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <span className="text-secondary-500">From: </span>
                        <span>{req.name}</span>
                      </div>
                      <div>
                        <span className="text-secondary-500">Email: </span>
                        <a
                          href={`mailto:${req.email}`}
                          className="text-primary-400 hover:underline"
                        >
                          {req.email}
                        </a>
                      </div>
                      {req.phone && (
                        <div>
                          <span className="text-secondary-500">Phone: </span>
                          <a
                            href={`tel:${req.phone}`}
                            className="text-primary-400 hover:underline"
                          >
                            {req.phone}
                          </a>
                        </div>
                      )}
                      {req.unit_number && (
                        <div>
                          <span className="text-secondary-500">Unit: </span>
                          <span>{req.unit_number}</span>
                        </div>
                      )}
                      {req.properties && (
                        <div>
                          <span className="text-secondary-500">
                            Property:{" "}
                          </span>
                          <span>
                            {req.properties.title} — {req.properties.address}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-secondary-500">Category: </span>
                        <span className="capitalize">{req.category}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-sm text-secondary-500">
                        Description:
                      </span>
                      <p className="mt-1 rounded-lg bg-secondary-800 p-3 text-sm text-secondary-200">
                        {req.description}
                      </p>
                    </div>

                    {/* Status & priority controls */}
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                      <div>
                        <label className="mb-1 block text-xs text-secondary-500">
                          Update Status
                        </label>
                        <select
                          value={req.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateRequest(req.id, "status", e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-lg border border-secondary-600 bg-secondary-800/50 px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option
                              key={opt.value}
                              value={opt.value}
                              className="bg-secondary-800"
                            >
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-secondary-500">
                          Update Priority
                        </label>
                        <select
                          value={req.priority}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateRequest(req.id, "priority", e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-lg border border-secondary-600 bg-secondary-800/50 px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {PRIORITY_OPTIONS.map((opt) => (
                            <option
                              key={opt.value}
                              value={opt.value}
                              className="bg-secondary-800"
                            >
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`mailto:${req.email}`, "_blank");
                          }}
                        >
                          Email Tenant
                        </Button>
                        {req.phone && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`tel:${req.phone}`, "_blank");
                            }}
                          >
                            Call
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
