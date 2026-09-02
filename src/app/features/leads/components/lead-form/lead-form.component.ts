import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Lead } from '../../../../core/models/lead.model';

@Component({
  selector: 'app-lead-form',
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.css'],
})
export class LeadFormComponent implements OnInit {
  @Input() submitting: boolean = false;
  @Output() saveLead = new EventEmitter<
    Omit<Lead, '_id' | 'id' | 'createdAt'>
  >();
  @Output() cancel = new EventEmitter<void>();

  leadForm!: FormGroup;
  submitted = false;

  statusOptions = [
    'Nuevo',
    'Contactado',
    'Calificado',
    'Reservado',
    'Descartado',
  ];
  sourceOptions = ['Facebook', 'Instagram', 'Website', 'Referido'];
  projectOptions = ['Residencial Altavista', 'Torres del Valle', 'Vista Verde'];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.leadForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      source: ['Website', Validators.required],
      status: ['Nuevo', Validators.required],
      budget: [150000, [Validators.required, Validators.min(1)]],
      project: ['Residencial Altavista', Validators.required],
    });
  }

  get f() {
    return this.leadForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.leadForm.invalid) {
      return;
    }

    const formValues = this.leadForm.value;
    this.saveLead.emit({
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      phone: formValues.phone ? formValues.phone.trim() : undefined,
      source: formValues.source,
      status: formValues.status,
      budget: Number(formValues.budget),
      project: formValues.project,
    });
  }

  onCancel() {
    this.cancel.emit();
  }
}
