import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LeadService } from './core/services/lead.service';
import {
  DashboardSummary,
  Lead,
  LeadFilters,
  LeadStatus,
} from './core/models/lead.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Alto Porte - Seguimiento de Leads Inmobiliarios';

  summary: DashboardSummary['data'] | null = null;
  leads: Lead[] = [];
  totalLeads: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;

  currentFilters: LeadFilters = {
    status: '',
    source: '',
    project: '',
    search: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    order: 'desc',
  };

  loadingSummary: boolean = false;
  loadingLeads: boolean = false;
  submittingLead: boolean = false;
  errorLeads: string | null = null;

  showFormModal: boolean = false;
  toastMessage: { text: string; type: 'success' | 'error' } | null = null;

  private destroy$ = new Subject<void>();

  constructor(private leadService: LeadService) {}

  ngOnInit() {
    this.loadDashboardSummary();
    this.loadLeads();
  }

  loadDashboardSummary() {
    this.loadingSummary = true;
    this.leadService
      .getDashboardSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.summary = res.data;
          this.loadingSummary = false;
        },
        error: (err) => {
          console.error('Error al cargar métricas:', err);
          this.loadingSummary = false;
        },
      });
  }

  loadLeads() {
    this.loadingLeads = true;
    this.errorLeads = null;
    this.leadService
      .getLeads(this.currentFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.leads = response.data;
          this.totalLeads = response.pagination?.total ?? 0;
          this.currentPage = response.pagination?.page ?? 1;
          this.totalPages = response.pagination?.totalPages ?? 1;
          this.limit = response.pagination?.limit ?? 10;
          this.loadingLeads = false;
        },
        error: (err) => {
          console.error('Error al cargar leads:', err);
          this.errorLeads =
            'No se pudo conectar con el servidor para cargar los datos.';
          this.loadingLeads = false;
        },
      });
  }

  onFilterChange(newFilters: LeadFilters) {
    this.currentFilters = {
      ...this.currentFilters,
      ...newFilters,
      page: 1,
    };
    this.loadLeads();
  }

  onPageChange(page: number) {
    this.currentFilters.page = page;
    this.loadLeads();
  }

  onLimitChange(limit: number) {
    this.currentFilters.limit = limit;
    this.currentFilters.page = 1;
    this.loadLeads();
  }

  onSortChange(sortConfig: {
    sortBy: 'createdAt' | 'budget';
    order: 'asc' | 'desc';
  }) {
    this.currentFilters.sortBy = sortConfig.sortBy;
    this.currentFilters.order = sortConfig.order;
    this.loadLeads();
  }

  onSaveLead(newLeadData: Omit<Lead, '_id' | 'id' | 'createdAt'>) {
    this.submittingLead = true;
    this.leadService
      .createLead(newLeadData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.submittingLead = false;
          this.showFormModal = false;
          this.showToast('Lead registrado con éxito', 'success');
          this.loadLeads();
          this.loadDashboardSummary();
        },
        error: (err) => {
          this.submittingLead = false;
          this.showToast('Ocurrió un error al guardar el lead', 'error');
        },
      });
  }

  onStatusUpdate(event: { id: string; status: LeadStatus }) {
    this.leadService
      .updateLeadStatus(event.id, event.status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showToast(`Estado actualizado a "${event.status}"`, 'success');
          this.loadLeads();
          this.loadDashboardSummary();
        },
        error: (err) => {
          this.showToast('Error al actualizar el estado', 'error');
        },
      });
  }

  openModal() {
    this.showFormModal = true;
  }

  closeModal() {
    this.showFormModal = false;
  }

  private showToast(text: string, type: 'success' | 'error') {
    this.toastMessage = { text, type };
    setTimeout(() => {
      this.toastMessage = null;
    }, 3500);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
