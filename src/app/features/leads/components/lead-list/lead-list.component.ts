import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Lead, LeadStatus } from '../../../../core/models/lead.model';

@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.css'],
})
export class LeadListComponent {
  @Input() leads: Lead[] = [];
  @Input() totalLeads: number = 0;
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() limit: number = 10;
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() sortBy: 'createdAt' | 'budget' = 'createdAt';
  @Input() order: 'asc' | 'desc' = 'desc';

  @Output() pageChange = new EventEmitter<number>();
  @Output() limitChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<{
    sortBy: 'createdAt' | 'budget';
    order: 'asc' | 'desc';
  }>();
  @Output() statusUpdate = new EventEmitter<{
    id: string;
    status: LeadStatus;
  }>();
  @Output() retry = new EventEmitter<void>();

  statusOptions: LeadStatus[] = [
    'Nuevo',
    'Contactado',
    'Calificado',
    'Reservado',
    'Descartado',
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'Nuevo':
        return 'badge-blue';
      case 'Contactado':
        return 'badge-amber';
      case 'Calificado':
        return 'badge-purple';
      case 'Reservado':
        return 'badge-emerald';
      case 'Descartado':
        return 'badge-rose';
      default:
        return 'badge-slate';
    }
  }

  onStatusSelect(lead: Lead, event: Event) {
    const target = event.target as HTMLSelectElement;
    const newStatus = target.value as LeadStatus;
    const leadId = lead._id || lead.id;
    if (leadId && newStatus && newStatus !== lead.status) {
      this.statusUpdate.emit({ id: leadId, status: newStatus });
    }
    target.value = '';
  }

  toggleSort(field: 'createdAt' | 'budget') {
    if (this.sortBy === field) {
      const newOrder = this.order === 'asc' ? 'desc' : 'asc';
      this.sortChange.emit({ sortBy: field, order: newOrder });
    } else {
      this.sortChange.emit({ sortBy: field, order: 'desc' });
    }
  }

  onPageClick(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  onLimitSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.limitChange.emit(Number(target.value));
  }
}
