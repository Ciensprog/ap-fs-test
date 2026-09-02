export type LeadStatus =
  | 'Nuevo'
  | 'Contactado'
  | 'Calificado'
  | 'Reservado'
  | 'Descartado';

export type LeadSource = 'Facebook' | 'Instagram' | 'Website' | 'Referido';

export type LeadProject =
  | 'Residencial Altavista'
  | 'Torres del Valle'
  | 'Vista Verde';

export interface ResponseAPI<T> {
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  success: boolean;
}

export interface Lead {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  source: LeadSource | string;
  status: LeadStatus | string;
  budget: number;
  project: LeadProject | string;
  createdAt: string;
  updatedAt?: string;
}

export interface GroupedCount {
  label: string;
  count: number;
}

export type DashboardSummary = ResponseAPI<{
  totalLeads: number;
  averageBudget: number;
  reservedLeads: number;
  conversionRate: number;
  byStatus: GroupedCount[];
  bySource: GroupedCount[];
  byProject: GroupedCount[];
}>;

export interface LeadFilters {
  status?: string;
  source?: string;
  project?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'budget';
  order?: 'asc' | 'desc';
}

export type PaginatedLeadsResponse = ResponseAPI<Lead[]>;
