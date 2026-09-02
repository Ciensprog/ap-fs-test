import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Lead,
  LeadFilters,
  PaginatedLeadsResponse,
  DashboardSummary,
  LeadStatus,
} from '../models/lead.model';

@Injectable({
  providedIn: 'root',
})
export class LeadService {
  private apiUrl = environment.apiUrl;
  private mockLeadsStore: Lead[] = [];

  // State Subjects
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * GET /api/dashboard/summary
   * Returns calculated indicators (totalLeads, averageBudget, reservedLeads, conversionRate, byStatus, bySource, byProject)
   */
  getDashboardSummary(): Observable<DashboardSummary> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http
      .get<DashboardSummary>(`${this.apiUrl}/dashboard/summary`)
      .pipe(
        tap(() => this.loadingSubject.next(false)),
        catchError((err) => {
          if (environment.useMockFallback) {
            console.warn(
              'API backend unreachable. Using local mock calculated indicators.',
              err,
            );
            this.loadingSubject.next(false);
            return of(this.calculateMockSummary());
          }
          this.loadingSubject.next(false);
          this.errorSubject.next(
            'Error al cargar los indicadores del dashboard.',
          );
          return throwError(() => err);
        }),
      );
  }

  /**
   * GET /api/leads
   * Paginated and filtered leads list
   */
  getLeads(filters: LeadFilters = {}): Observable<PaginatedLeadsResponse> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    let params = new HttpParams();
    if (filters.status) params = params.set('status', filters.status);
    if (filters.source) params = params.set('source', filters.source);
    if (filters.project) params = params.set('project', filters.project);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.order) params = params.set('order', filters.order);

    return this.http
      .get<PaginatedLeadsResponse>(`${this.apiUrl}/leads`, { params })
      .pipe(
        map((res) => {
          const data = res.data;
          if (Array.isArray(data)) {
            // return {
            //   leads: data,
            //   total: data.length,
            //   page: 1,
            //   limit: data.length,
            //   totalPages: 1,
            // };
            return res;
          }
          return data;
        }),
        tap(() => this.loadingSubject.next(false)),
        catchError((err) => {
          if (environment.useMockFallback) {
            console.warn(
              'API backend unreachable. Filtering local mock data.',
              err,
            );
            this.loadingSubject.next(false);
            return of(this.getFilteredMockLeads(filters));
          }
          this.loadingSubject.next(false);
          this.errorSubject.next('Error al obtener la lista de leads.');
          return throwError(() => err);
        }),
      );
  }

  /**
   * POST /api/leads
   * Create a new lead
   */
  createLead(lead: Omit<Lead, '_id' | 'id' | 'createdAt'>): Observable<Lead> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.post<Lead>(`${this.apiUrl}/leads`, lead).pipe(
      tap((newLead) => {
        this.loadingSubject.next(false);
        if (environment.useMockFallback) {
          this.mockLeadsStore.unshift(newLead);
        }
      }),
      catchError((err) => {
        if (environment.useMockFallback) {
          console.warn('API backend unreachable. Mocking lead creation.', err);
          this.loadingSubject.next(false);
          const mockCreated: Lead = {
            ...lead,
            _id: 'mock_' + Date.now(),
            id: 'mock_' + Date.now(),
            createdAt: new Date().toISOString(),
          };
          this.mockLeadsStore.unshift(mockCreated);
          return of(mockCreated);
        }
        this.loadingSubject.next(false);
        this.errorSubject.next('Error al registrar el nuevo lead.');
        return throwError(() => err);
      }),
    );
  }

  /**
   * PATCH /api/leads/:id/status
   * Update commercial status of a lead
   */
  updateLeadStatus(id: string, newStatus: LeadStatus): Observable<Lead> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http
      .patch<Lead>(`${this.apiUrl}/leads/${id}/status`, { status: newStatus })
      .pipe(
        tap(() => {
          this.loadingSubject.next(false);
          if (environment.useMockFallback) {
            const index = this.mockLeadsStore.findIndex(
              (l) => l._id === id || l.id === id,
            );
            if (index !== -1) {
              this.mockLeadsStore[index].status = newStatus;
            }
          }
        }),
        catchError((err) => {
          if (environment.useMockFallback) {
            console.warn(
              'API backend unreachable. Mocking status update.',
              err,
            );
            this.loadingSubject.next(false);
            const index = this.mockLeadsStore.findIndex(
              (l) => l._id === id || l.id === id,
            );
            if (index !== -1) {
              this.mockLeadsStore[index].status = newStatus;
              return of(this.mockLeadsStore[index]);
            }
            const updatedMock: Lead = {
              _id: id,
              id: id,
              name: 'Lead ' + id,
              email: 'lead@example.com',
              source: 'Website',
              status: newStatus,
              budget: 150000,
              project: 'Residencial Altavista',
              createdAt: new Date().toISOString(),
            };
            return of(updatedMock);
          }
          this.loadingSubject.next(false);
          this.errorSubject.next('Error al actualizar el estado del lead.');
          return throwError(() => err);
        }),
      );
  }

  private getFilteredMockLeads(filters: LeadFilters): PaginatedLeadsResponse {
    let result = [...this.mockLeadsStore];

    if (filters.status) {
      result = result.filter((l) => l.status === filters.status);
    }
    if (filters.source) {
      result = result.filter((l) => l.source === filters.source);
    }
    if (filters.project) {
      result = result.filter((l) => l.project === filters.project);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q),
      );
    }

    // Sorting
    const sortBy = filters.sortBy || 'createdAt';
    const order = filters.order || 'desc';
    result.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === 'createdAt') {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      }
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const total = result.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedLeads = result.slice(startIndex, startIndex + limit);

    return {
      data: paginatedLeads,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
      success: true,
    };
  }

  private calculateMockSummary(): DashboardSummary {
    const totalLeads = this.mockLeadsStore.length;
    if (totalLeads === 0) {
      return {
        data: {
          totalLeads: 0,
          averageBudget: 0,
          reservedLeads: 0,
          conversionRate: 0,
          byStatus: [],
          bySource: [],
          byProject: [],
        },
        success: true,
      };
    }

    const totalBudget = this.mockLeadsStore.reduce(
      (acc, l) => acc + (l.budget || 0),
      0,
    );
    const averageBudget = Math.round(totalBudget / totalLeads);
    const reservedLeads = this.mockLeadsStore.filter(
      (l) => l.status === 'Reservado',
    ).length;
    const conversionRate = Math.round((reservedLeads / totalLeads) * 100);

    const countByField = (key: keyof Lead) => {
      const counts: Record<string, number> = {};
      this.mockLeadsStore.forEach((l) => {
        const val = String(l[key] || 'N/A');
        counts[val] = (counts[val] || 0) + 1;
      });
      return Object.entries(counts).map(([label, count]) => ({ label, count }));
    };

    return {
      data: {
        totalLeads,
        averageBudget,
        reservedLeads,
        conversionRate,
        byStatus: countByField('status'),
        bySource: countByField('source'),
        byProject: countByField('project'),
      },
      success: true,
    };
  }
}
