import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MetricsOverviewComponent } from './features/leads/components/metrics-overview/metrics-overview.component';
import { LeadFilterComponent } from './features/leads/components/lead-filter/lead-filter.component';
import { LeadFormComponent } from './features/leads/components/lead-form/lead-form.component';
import { LeadListComponent } from './features/leads/components/lead-list/lead-list.component';

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [
        AppComponent,
        MetricsOverviewComponent,
        LeadFilterComponent,
        LeadFormComponent,
        LeadListComponent,
      ],
    }),
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Alto Porte - Seguimiento de Leads Inmobiliarios'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual(
      'Alto Porte - Seguimiento de Leads Inmobiliarios',
    );
  });

  it('should render header with ALTO PORTE brand text', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-text h2')?.textContent).toContain(
      'ALTO PORTE',
    );
  });
});
