import { Component, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SiteDataService } from '../../services/site-data';
import { ProcessStep } from '../../models/site.models';

@Component({
  selector: 'app-admin-process',
  imports: [NgTemplateOutlet, ReactiveFormsModule],
  templateUrl: './admin-process.html',
  styleUrl: './admin-process.scss',
})
export class AdminProcessComponent {
  private siteData = inject(SiteDataService);
  private fb       = inject(FormBuilder);

  get steps() { return this.siteData.data().steps; }

  editingId = signal<string | null>(null);
  showNew   = signal(false);
  saving    = signal(false);

  icons = ['📞','🔍','📋','✅','⚡','🔧','💬','🏠','📅','💡'];

  buildForm(s?: Partial<ProcessStep>) {
    return this.fb.group({
      num:   [s?.num   ?? '',   Validators.required],
      icon:  [s?.icon  ?? '📞', Validators.required],
      title: [s?.title ?? '',   Validators.required],
      desc:  [s?.desc  ?? '',   Validators.required],
    });
  }

  editForm = this.buildForm();
  newForm  = this.buildForm();

  startEdit(s: ProcessStep) {
    this.editingId.set(s.id);
    this.showNew.set(false);
    this.editForm = this.buildForm(s);
  }

  cancelEdit() { this.editingId.set(null); }

  saveEdit(id: string) {
    if (this.editForm.invalid) { this.editForm.markAllAsTouched(); return; }
    this.saving.set(true);
    this.siteData.updateStep({ id, ...this.editForm.value } as ProcessStep).subscribe({
      next:  () => { this.editingId.set(null); this.saving.set(false); },
      error: () => this.saving.set(false),
    });
  }

  deleteStep(id: string) {
    if (!confirm('¿Eliminar este paso?')) return;
    this.siteData.deleteStep(id).subscribe();
  }

  openNew()   { this.newForm = this.buildForm(); this.showNew.set(true); this.editingId.set(null); }
  cancelNew() { this.showNew.set(false); }

  saveNew() {
    if (this.newForm.invalid) { this.newForm.markAllAsTouched(); return; }
    this.saving.set(true);
    this.siteData.addStep(this.newForm.value as Omit<ProcessStep, 'id'>).subscribe({
      next:  () => { this.showNew.set(false); this.saving.set(false); },
      error: () => this.saving.set(false),
    });
  }
}
