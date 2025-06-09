export interface SalesRecord {
  id: string;
  date: string;
  packs: number;
  totalSales: number;
  eventName?: string; // Only for Events section
  wastage?: number; // Wastage amount for all sections
}

export interface Analytics {
  totalPacks: number;
  totalSales: number;
  averageSales: number;
  recordCount: number;
  totalWastage: number;
  wastePercentage: number;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface FilterOptions {
  dateRange: DateRange | null;
  searchTerm: string;
  year: string;
  month: string;
}

export type SectionType = 'cafeteria' | 'events' | 'pressbar';

export interface SectionConfig {
  name: string;
  icon: string;
  description: string;
  hasEventName: boolean;
  note: string;
}