export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  title: string;
  description: string | null;
  price: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number | null;
  property_type: string;
  status: "available" | "rented";
  buildium_property_id: number | null;
  buildium_unit_id: number | null;
  buildium_last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  source: "upload" | "buildium";
  created_at: string;
}

export interface Inquiry {
  id?: string;
  property_id?: string | null;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  bedrooms: string[];
  message: string;
  buildium_prospect_id?: number | null;
  synced_to_buildium_at?: string | null;
  created_at?: string;
}

export interface MaintenanceRequest {
  id?: string;
  property_id?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  unit_number?: string | null;
  category: string;
  priority: "low" | "medium" | "high" | "emergency";
  title: string;
  description: string;
  status:
    | "new"
    | "triaged"
    | "in_progress"
    | "waiting_parts"
    | "scheduled"
    | "completed"
    | "cancelled";
  photo_urls?: string[];
  ai_category?: string | null;
  ai_priority?: string | null;
  ai_summary?: string | null;
  ai_triaged_at?: string | null;
  buildium_task_id?: number | null;
  buildium_last_synced_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BuildiumSyncLog {
  id: string;
  entity_type: "property" | "maintenance_request" | "inquiry";
  entity_id: string;
  direction: "to_buildium" | "from_buildium";
  buildium_id: number | null;
  status: "success" | "error" | "skipped";
  error_message: string | null;
  payload: Record<string, unknown> | null;
  created_at: string;
}
