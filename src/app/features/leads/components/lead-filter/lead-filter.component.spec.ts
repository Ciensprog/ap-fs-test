import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LeadFilterComponent } from './lead-filter.component';

describe('LeadFilterComponent', () => {
  let component: LeadFilterComponent;
  let fixture: ComponentFixture<LeadFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeadFilterComponent],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LeadFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create LeadFilterComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filterChange with debounced search input after 300ms', fakeAsync(() => {
    spyOn(component.filterChange, 'emit');

    const inputEvent = { target: { value: 'Carlos' } } as unknown as Event;
    component.onSearchInput(inputEvent);

    // Initial check: shouldn't have emitted immediately due to debounce
    expect(component.filterChange.emit).not.toHaveBeenCalled();

    // Advance time by 300ms
    tick(300);

    expect(component.filterChange.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        search: 'Carlos',
      }),
    );
  }));
});
