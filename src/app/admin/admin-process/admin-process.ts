import { Component, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SiteDataService } from '../../services/site-data';
import { ProcessStep } from '../../models/site.models';

@Component({
  selector: 'app-admin-process',
  imports: [ReactiveFormsModule, NgTemplateOutlet],
  templateUrl: './admin-process.html',
  styleUrl: './admin-process.scss'
})
export class AdminProcessComponent {
  private siteData = inject(SiteDataService);
  private fb = inject(FormBuilder);

  get steps() { return this.siteData.data().steps; }
  editingId = signal<string | null>(null);
  showNew = signal(false);
  icons = ['📞','🔍','📋','✅','⚡','🔧','💬','🏠','📅','💡'];

  buildForm(s?: Partial<ProcessStep>) {
    return this.fb.group({
      num:   [s?.num   || '', Validators.required],
      icon:  [s?.icon  || '📞', Validators.required],
      title: [s?.title || '', Validators.required],
      desc:  [s?.desc  || '', Validators.required],
    });
  }

  editForm = this.buildForm();
  newForm  = this.buildForm();

  startEdit(s: ProcessStep) { this.editingId.set(s.id); this.showNew.set(false); this.editForm = this.buildForm(s); }
  cancelEdit() { this.editingId.set(null); }
  saveEdit(id: string) {
    if (this.editForm.invalid) return;
    this.siteData.updateStep({ id, ...this.editForm.value } as ProcessStep);
    this.editingId.set(null);
  }
  deleteStep(id: string) { if (confirm('¿Eliminar este paso?')) this.siteData.deleteStep(id); }
  openNew() { this.showNew.set(true); this.newForm = this.buildForm(); this.editingId.set(null); }
  cancelNew() { this.showNew.set(false); }
  saveNew() {
    if (this.newForm.invalid) return;
    this.siteData.addStep(this.newForm.value as Omit<ProcessStep,'id'>);
    this.showNew.set(false);
  }
}
