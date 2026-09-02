import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { LeadService } from './lead.service';
import { DashboardSummary, Lead } from '../models/lead.model';

describe('LeadService', () => {
  let service: LeadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LeadService],
    });
    service = TestBed.inject(LeadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch dashboard summary indicators', () => {
    const mockSummary: DashboardSummary = {
      data: {
        totalLeads: 10,
        averageBudget: 174000,
        reservedLeads: 2,
        conversionRate: 20,
        byStatus: [{ label: 'Nuevo', count: 2 }],
        bySource: [{ label: 'Facebook', count: 3 }],
        byProject: [{ label: 'Residencial Altavista', count: 4 }],
      },
      success: true,
    };

    service.getDashboardSummary().subscribe((summary) => {
      expect(summary.data.totalLeads).toBe(10);
      expect(summary.data.averageBudget).toBe(174000);
      expect(summary.data.reservedLeads).toBe(2);
      expect(summary.data.conversionRate).toBe(20);
    });

    const req = httpMock.expectOne(
      'http://localhost:3000/api/dashboard/summary',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockSummary);
  });

  it('should post a new lead successfully', () => {
    const newLeadInput = {
      name: 'Prueba Test',
      email: 'test@example.com',
      phone: '7000-9999',
      source: 'Website',
      status: 'Nuevo',
      budget: 180000,
      project: 'Vista Verde',
    };

    const mockResponse: Lead = {
      ...newLeadInput,
      _id: 'mock_123',
      createdAt: '2026-08-25T10:00:00.000Z',
    };

    service.createLead(newLeadInput).subscribe((createdLead) => {
      expect(createdLead.name).toBe('Prueba Test');
      expect(createdLead._id).toBe('mock_123');
    });

    const req = httpMock.expectOne('http://localhost:3000/api/leads');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newLeadInput);
    req.flush(mockResponse);
  });
});
