export type ServiceType =
  | "maintenance"
  | "repair"
  | "inspection"
  | "oil_change"
  | "tire_change"
  | "other";

export type ServiceRecord = {
  id: string;
  vehicle_id: string;
  user_id: string;
  service_type: ServiceType;
  title: string;
  description?: string;
  service_date: string;
  odometer?: number;
  cost?: number;
  currency: string;
  service_provider?: string;
  invoice_url?: string;
  notes?: string;
  next_service_date?: string;
  next_service_odometer?: number;
  created_at: string;
  updated_at: string;
};
