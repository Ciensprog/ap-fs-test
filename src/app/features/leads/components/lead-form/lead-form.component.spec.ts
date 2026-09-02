import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LeadFormComponent } from './lead-form.component';

describe('LeadFormComponent', () => {
  let component: LeadFormComponent;
  let fixture: ComponentFixture<LeadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeadFormComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LeadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the lead form component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with invalid status when required fields are empty', () => {
    component.leadForm.controls['name'].setValue('');
    component.leadForm.controls['email'].setValue('');
    expect(component.leadForm.valid).toBeFalsy();
  });

  it('should validate email format properly', () => {
    const emailControl = component.leadForm.controls['email'];
    emailControl.setValue('correo-invalido');
    expect(emailControl.hasError('email')).toBeTruthy();

    emailControl.setValue('correo@valido.com');
    expect(emailControl.hasError('email')).toBeFalsy();
  });

  it('should validate budget must be greater than zero', () => {
    const budgetControl = component.leadForm.controls['budget'];
    budgetControl.setValue(0);
    expect(budgetControl.hasError('min')).toBeTruthy();

    budgetControl.setValue(150000);
    expect(budgetControl.hasError('min')).toBeFalsy();
  });

  it('should emit saveLead event when valid form is submitted', () => {
    spyOn(component.saveLead, 'emit');

    component.leadForm.controls['name'].setValue('Juan Pérez');
    component.leadForm.controls['email'].setValue('juan@example.com');
    component.leadForm.controls['phone'].setValue('7000-5555');
    component.leadForm.controls['source'].setValue('Facebook');
    component.leadForm.controls['status'].setValue('Nuevo');
    component.leadForm.controls['budget'].setValue(200000);
    component.leadForm.controls['project'].setValue('Torres del Valle');

    component.onSubmit();

    expect(component.saveLead.emit).toHaveBeenCalledWith({
      name: 'Juan Pérez',
      email: 'juan@example.com',
      phone: '7000-5555',
      source: 'Facebook',
      status: 'Nuevo',
      budget: 200000,
      project: 'Torres del Valle',
    });
  });
});
