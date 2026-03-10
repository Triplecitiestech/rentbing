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
  created_at: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  sort_order: number;
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
  created_at?: string;
}
