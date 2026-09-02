import { Component, Input } from '@angular/core';
import { DashboardSummary } from '../../../../core/models/lead.model';

@Component({
  selector: 'app-metrics-overview',
  templateUrl: './metrics-overview.component.html',
  styleUrls: ['./metrics-overview.component.css'],
})
export class MetricsOverviewComponent {
  @Input() summary: DashboardSummary['data'] | null = null;
  @Input() loading: boolean = false;

  getPercentage(count: number, total: number): number {
    if (!total || total === 0) return 0;
    return Math.round((count / total) * 100);
  }
}
