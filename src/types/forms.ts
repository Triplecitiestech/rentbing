export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  status: "new" | "contacted" | "resolved";
  created_at?: string;
}

export interface RentalInquiry {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  property_name?: string | null;
  move_in_date?: string | null;
  message: string;
  status: "new" | "contacted" | "qualified" | "converted";
  created_at?: string;
}

export interface RentalApplicationStep1 {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  current_address: string;
}

export interface RentalApplicationStep2 {
  employer: string;
  job_title: string;
  monthly_income: number;
  employment_duration: string;
}

export interface RentalApplicationStep3 {
  previous_landlord_name: string;
  previous_landlord_phone: string;
  previous_address: string;
  reason_for_leaving: string;
}

export interface RentalApplicationStep4 {
  desired_property: string;
  desired_move_in: string;
  lease_term: string;
  num_occupants: number;
  pets: string;
}

export interface RentalApplication {
  id?: string;
  step1: RentalApplicationStep1;
  step2: RentalApplicationStep2;
  step3: RentalApplicationStep3;
  step4: RentalApplicationStep4;
  consent: boolean;
  status: "draft" | "submitted" | "reviewing" | "approved" | "denied";
  created_at?: string;
}

export interface MaintenanceRequest {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  property_address: string;
  unit_number?: string | null;
  category: string;
  priority: "low" | "medium" | "high" | "emergency";
  description: string;
  photo_urls?: string[];
  status: "new" | "in_progress" | "completed";
  created_at?: string;
}
