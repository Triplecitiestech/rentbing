// Rent Bing type definitions

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthCheckResult {
  status: "healthy" | "degraded" | "down";
  services: Record<string, ServiceHealth>;
  timestamp: string;
}

export interface ServiceHealth {
  status: "healthy" | "degraded" | "down" | "unconfigured";
  latency?: number;
  message?: string;
}
