import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MetricsOverviewComponent } from './features/leads/components/metrics-overview/metrics-overview.component';
import { LeadFilterComponent } from './features/leads/components/lead-filter/lead-filter.component';
import { LeadFormComponent } from './features/leads/components/lead-form/lead-form.component';
import { LeadListComponent } from './features/leads/components/lead-list/lead-list.component';

@NgModule({
  declarations: [
    AppComponent,
    MetricsOverviewComponent,
    LeadFilterComponent,
    LeadFormComponent,
    LeadListComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
