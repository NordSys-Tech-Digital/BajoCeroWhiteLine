import { Component, inject, signal, OnInit } from '@angular/core';
import { NgClass, NgTemplateOutlet, SlicePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Service } from '../../models/site.models';

function toService(r: any): Service {
	return {
		id: r.id ?? r._id ?? '',
		icon: r.icon ?? '🔧',
		color: r.color ?? 'blue',
		title: r.title ?? '',
		desc: r.desc ?? '',
		items: Array.isArray(r.items) ? r.items : [],
		active: r.active ?? true,
		createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
		updatedAt: r.updatedAt ? new Date(r.updatedAt) : new Date(),
	};
}

@Component({
	selector: 'app-admin-services',
	imports: [NgClass, NgTemplateOutlet, SlicePipe, ReactiveFormsModule],
	templateUrl: './admin-services.html',
	styleUrls: ['./admin-services.scss'],
})
export class AdminServicesComponent implements OnInit {
	private api = inject(ApiService);
	private fb = inject(FormBuilder);

	services = signal<Service[]>([]);
	editingId = signal<string | null>(null);
	showNewForm = signal(false);
	saving = signal(false);
	loading = signal(false);

	colors = ['blue', 'teal', 'amber', 'ice'];
	icons = ['❄️', '🔧', '⚡', '🧊', '💧', '🫧', '🏠', '🔌', '🌡️', '🛠️', '💨', '🔩'];

	// ── Ciclo de vida ──────────────────────────────────────────────────────────

	ngOnInit() { this.load(); }

	load() {
		this.loading.set(true);
		this.api.get<any[]>('services').subscribe({
			next: raw => { this.services.set(raw.map(toService)); this.loading.set(false); },
			error: () => this.loading.set(false),
		});
	}

	// ── Formulario ─────────────────────────────────────────────────────────────
	buildForm(s?: Partial<Service>) {
		return this.fb.group({
			icon: [s?.icon ?? '🔧', Validators.required],
			color: [s?.color ?? 'blue', Validators.required],
			title: [s?.title ?? '', Validators.required],
			desc: [s?.desc ?? '', Validators.required],
			active: [s?.active ?? true],
			items: this.fb.array(
				(s?.items?.length ? s.items : ['']).map(i => this.fb.control(i, Validators.required))
			),
		});
	}

	editForm = this.buildForm();
	newForm = this.buildForm();

	getItems(form: ReturnType<typeof this.buildForm>) {
		return form.get('items') as FormArray;
	}

	addItem(form: ReturnType<typeof this.buildForm>) {
		this.getItems(form).push(this.fb.control('', Validators.required));
	}

	removeItem(form: ReturnType<typeof this.buildForm>, i: number) {
		if (this.getItems(form).length > 1) this.getItems(form).removeAt(i);
	}

	// ── Editar ─────────────────────────────────────────────────────────────────

	startEdit(s: Service) {
		this.editingId.set(s.id);
		this.showNewForm.set(false);
		this.editForm = this.buildForm(s);
	}

	cancelEdit() { this.editingId.set(null); }

	saveEdit(id: string) {
		if (this.editForm.invalid) { this.editForm.markAllAsTouched(); return; }
		const v = this.editForm.value;
		const body: Service = { id, ...v, items: (v.items as string[]).filter(Boolean) } as Service;

		this.saving.set(true);
		this.api.put(`services/${id}`, body).subscribe({
			next: (raw: any) => {
				this.services.update(list => list.map(x => x.id === id ? toService({ ...body, ...raw }) : x));
				this.editingId.set(null);
				this.saving.set(false);
			},
			error: () => this.saving.set(false),
		});
	}

	// ── Toggle activo ──────────────────────────────────────────────────────────

	toggleActive(id: string) {
		this.api.patch(`services/${id}/toggle`).subscribe({
			next: () => this.services.update(list =>
				list.map(x => x.id === id ? { ...x, active: !x.active } : x)
			),
		});
	}

	// ── Eliminar ───────────────────────────────────────────────────────────────

	deleteService(id: string) {
		if (!confirm('¿Eliminar este servicio?')) return;
		this.api.delete(`services/${id}`).subscribe({
			next: () => this.services.update(list => list.filter(x => x.id !== id)),
		});
	}

	// ── Nuevo servicio ─────────────────────────────────────────────────────────

	openNew() { this.newForm = this.buildForm(); this.showNewForm.set(true); this.editingId.set(null); }
	cancelNew() { this.showNewForm.set(false); }

	saveNew() {
		if (this.newForm.invalid) { this.newForm.markAllAsTouched(); return; }
		const v = this.newForm.value;
		const body = { ...v, items: (v.items as string[]).filter(Boolean) };

		this.saving.set(true);
		this.api.post('services', body).subscribe({
			next: raw => {
				this.services.update(list => [...list, toService(raw)]);
				this.showNewForm.set(false);
				this.saving.set(false);
			},
			error: () => this.saving.set(false),
		});
	}
}
