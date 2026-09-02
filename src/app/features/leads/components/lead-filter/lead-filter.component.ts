import {
  Component,
  EventEmitter,
  OnInit,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { LeadFilters } from '../../../../core/models/lead.model';

@Component({
  selector: 'app-lead-filter',
  templateUrl: './lead-filter.component.html',
  styleUrls: ['./lead-filter.component.css'],
})
export class LeadFilterComponent implements OnInit, OnDestroy {
  @Output() filterChange = new EventEmitter<LeadFilters>();
  @Output() openNewLeadModal = new EventEmitter<void>();

  filters: LeadFilters = {
    status: '',
    source: '',
    project: '',
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
  };

  statusOptions = [
    'Nuevo',
    'Contactado',
    'Calificado',
    'Reservado',
    'Descartado',
  ];
  sourceOptions = ['Facebook', 'Instagram', 'Website', 'Referido'];
  projectOptions = ['Residencial Altavista', 'Torres del Valle', 'Vista Verde'];

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchValue) => {
        this.filters.search = searchValue;
        this.onFilterChange();
      });
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchSubject.next(target.value);
  }

  onFilterChange() {
    this.filterChange.emit({ ...this.filters });
  }

  onReset() {
    this.filters = {
      status: '',
      source: '',
      project: '',
      search: '',
      sortBy: 'createdAt',
      order: 'desc',
    };
    this.onFilterChange();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
