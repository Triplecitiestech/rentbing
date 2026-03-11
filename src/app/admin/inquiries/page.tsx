"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface Inquiry {
  id: string;
  first_name: string;
  last_name: string | null;
  phone: string;
  email: string;
  bedrooms: string[];
  message: string | null;
  property_id: string | null;
  created_at: string;
  properties: { title: string; address: string } | null;
}

export default function AdminInquiriesPage() {
  const { authHeaders } = useAdmin();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/inquiries", {
        headers: authHeaders(),
      });
      const data = await res.json();
      setInquiries(data.inquiries || []);
    } catch {
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;

    try {
      const res = await fetch(`/api/admin/inquiries?id=${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
      }
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) {
    return <p className="text-secondary-400">Loading inquiries...</p>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <Badge variant="primary">{inquiries.length} total</Badge>
      </div>

      {inquiries.length === 0 ? (
        <Card padding="lg">
          <p className="text-center text-secondary-400">
            No inquiries received yet.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => {
            const expanded = expandedId === inq.id;
            return (
              <Card key={inq.id} padding="md">
                <div
                  className="flex cursor-pointer flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                  onClick={() =>
                    setExpandedId(expanded ? null : inq.id)
                  }
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold">
                        {inq.first_name} {inq.last_name || ""}
                      </h3>
                      {inq.properties && (
                        <Badge variant="default">
                          {inq.properties.title}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-secondary-400">
                      {inq.email} &middot; {inq.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-secondary-500">
                      {new Date(inq.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
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
                        <span className="text-secondary-500">Email: </span>
                        <a
                          href={`mailto:${inq.email}`}
                          className="text-primary-400 hover:underline"
                        >
                          {inq.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-secondary-500">Phone: </span>
                        <a
                          href={`tel:${inq.phone}`}
                          className="text-primary-400 hover:underline"
                        >
                          {inq.phone}
                        </a>
                      </div>
                      {inq.bedrooms && inq.bedrooms.length > 0 && (
                        <div>
                          <span className="text-secondary-500">
                            Bedrooms:{" "}
                          </span>
                          <span>{inq.bedrooms.join(", ")}</span>
                        </div>
                      )}
                      {inq.properties && (
                        <div>
                          <span className="text-secondary-500">
                            Property:{" "}
                          </span>
                          <span>{inq.properties.title}</span>
                        </div>
                      )}
                    </div>
                    {inq.message && (
                      <div className="mt-3">
                        <span className="text-sm text-secondary-500">
                          Message:
                        </span>
                        <p className="mt-1 rounded-lg bg-secondary-800 p-3 text-sm text-secondary-200">
                          {inq.message}
                        </p>
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`mailto:${inq.email}`, "_blank");
                        }}
                      >
                        Reply via Email
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${inq.phone}`, "_blank");
                        }}
                      >
                        Call
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(inq.id);
                        }}
                      >
                        Delete
                      </Button>
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
