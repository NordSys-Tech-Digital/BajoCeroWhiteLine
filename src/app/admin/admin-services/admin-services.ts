import { Component, inject, signal } from '@angular/core';
import { NgClass, NgTemplateOutlet, SlicePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SiteDataService } from '../../services/site-data';
import { Service } from '../../models/site.models';

@Component({
  selector: 'app-admin-services',
  imports: [NgClass, NgTemplateOutlet, SlicePipe, ReactiveFormsModule],
  templateUrl: './admin-services.html',
  styleUrl: './admin-services.scss'
})
export class AdminServicesComponent {
  private siteData = inject(SiteDataService);
  private fb = inject(FormBuilder);

  get services() { return this.siteData.data().services; }
  editingId = signal<string | null>(null);
  showNewForm = signal(false);

  colors = ['blue', 'teal', 'amber', 'ice'];
  icons = ['❄️','🔧','⚡','🧊','💧','🫧','🏠','🔌','🌡️','🛠️','💨','🔩'];

  buildForm(s?: Partial<Service>) {
    return this.fb.group({
      icon:  [s?.icon  || '🔧', Validators.required],
      color: [s?.color || 'blue', Validators.required],
      title: [s?.title || '', Validators.required],
      desc:  [s?.desc  || '', Validators.required],
      active: [s?.active ?? true],
      items: this.fb.array((s?.items || ['']).map(i => this.fb.control(i, Validators.required)))
    });
  }

  editForm = this.buildForm();
  newForm  = this.buildForm();

  getItems(form: ReturnType<typeof this.buildForm>) {
    return form.get('items') as FormArray;
  }

  addItem(form: ReturnType<typeof this.buildForm>) {
    this.getItems(form).push(this.fb.control('', Validators.required));
  }

  removeItem(form: ReturnType<typeof this.buildForm>, i: number) {
    if (this.getItems(form).length > 1) this.getItems(form).removeAt(i);
  }

  startEdit(s: Service) {
    this.editingId.set(s.id);
    this.showNewForm.set(false);
    this.editForm = this.buildForm(s);
  }

  cancelEdit() { this.editingId.set(null); }

  saveEdit(id: string) {
    if (this.editForm.invalid) { this.editForm.markAllAsTouched(); return; }
    const v = this.editForm.value;
    this.siteData.updateService({ id, ...v, items: v.items!.filter(Boolean) } as Service);
    this.editingId.set(null);
  }

  toggleActive(id: string) { this.siteData.toggleService(id); }
  deleteService(id: string) {
    if (confirm('¿Eliminar este servicio?')) this.siteData.deleteService(id);
  }

  openNew() { this.showNewForm.set(true); this.newForm = this.buildForm(); this.editingId.set(null); }
  cancelNew() { this.showNewForm.set(false); }

  saveNew() {
    if (this.newForm.invalid) { this.newForm.markAllAsTouched(); return; }
    const v = this.newForm.value;
    this.siteData.addService({ ...v, items: v.items!.filter(Boolean) } as Omit<Service,'id'>);
    this.showNewForm.set(false);
  }
}
