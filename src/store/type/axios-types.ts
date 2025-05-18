// types/axios.ts
export interface AxiosError<T = unknown> extends Error {
  isAxiosError: boolean;
  config: unknown;
  code?: string;
  request?: unknown;
  response?: {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: unknown;
  };
  toJSON: () => object;
}

// You can add more specific types or interfaces as needed
export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}
