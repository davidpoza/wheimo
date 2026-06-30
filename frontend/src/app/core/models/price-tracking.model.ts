export interface PriceTracker {
  id: number;
  name: string;
  fetcherType: string;
  params: Record<string, unknown>;
  active: boolean;
  createdAt: string;
}

export interface PriceReading {
  id: number;
  readingDate: string;
  locationKey: string;
  value: number;
}

export interface FetcherType {
  type: string;
  label: string;
  paramSchema: {
    products?: Array<{ id: string; label: string }>;
    aggregations?: Array<{ id: string; label: string }>;
    fields?: string[];
  };
}

export interface FetchResult {
  trackerId?: number;
  status: 'ok' | 'error';
  newReadings?: number;
  message?: string;
  triggered?: number;
  results?: FetchResult[];
}
