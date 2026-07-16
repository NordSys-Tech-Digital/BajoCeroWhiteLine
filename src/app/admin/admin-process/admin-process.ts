import { Component, inject, signal, OnInit } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ProcessStep } from '../../models/site.models';

function toStep(r: any): ProcessStep {
	return {
		id: r.id ?? r._id ?? '',
		num: r.num ?? '',
		icon: r.icon ?? '📞',
		title: r.title ?? '',
		desc: r.descripcion ?? r.desc ?? '',
	};
}

function stepToApi(s: any) {
	return { num: s.num, icon: s.icon, title: s.title, descripcion: s.desc };
}

@Component({
	selector: 'app-admin-process',
	imports: [NgTemplateOutlet, ReactiveFormsModule],
	templateUrl: './admin-process.html',
	styleUrl: './admin-process.scss',
})
export class AdminProcessComponent implements OnInit {
	private api = inject(ApiService);
	private fb = inject(FormBuilder);

	steps = signal<ProcessStep[]>([]);
	editingId = signal<string | null>(null);
	showNew = signal(false);
	saving = signal(false);
	loading = signal(false);

	icons = ['📞', '🔍', '📋', '✅', '⚡', '🔧', '💬', '🏠', '📅', '💡'];

	ngOnInit() { this.load(); }

	load() {
		this.loading.set(true);
		this.api.get<any[]>('process-steps').subscribe({
			next: raw => { this.steps.set(raw.map(toStep)); this.loading.set(false); },
			error: () => this.loading.set(false),
		});
	}

	buildForm(s?: Partial<ProcessStep>) {
		return this.fb.group({
			num: [s?.num ?? '', Validators.required],
			icon: [s?.icon ?? '📞', Validators.required],
			title: [s?.title ?? '', Validators.required],
			desc: [s?.desc ?? '', Validators.required],
		});
	}

	editForm = this.buildForm();
	newForm = this.buildForm();

	startEdit(s: ProcessStep) {
		this.editingId.set(s.id);
		this.showNew.set(false);
		this.editForm = this.buildForm(s);
	}

	cancelEdit() { this.editingId.set(null); }

	saveEdit(id: string) {
		if (this.editForm.invalid) { this.editForm.markAllAsTouched(); return; }
		this.saving.set(true);
		this.api.put(`process-steps/${id}`, stepToApi(this.editForm.value)).subscribe({
			next: (raw: any) => {
				this.steps.update(list => list.map(x => x.id === id ? toStep({ ...this.editForm.value, ...raw, id }) : x));
				this.editingId.set(null);
				this.saving.set(false);
			},
			error: () => this.saving.set(false),
		});
	}

	deleteStep(id: string) {
		if (!confirm('¿Eliminar este paso?')) return;
		this.api.delete(`process-steps/${id}`).subscribe({
			next: () => this.steps.update(list => list.filter(x => x.id !== id)),
		});
	}

	openNew() { this.newForm = this.buildForm(); this.showNew.set(true); this.editingId.set(null); }
	cancelNew() { this.showNew.set(false); }

	saveNew() {
		if (this.newForm.invalid) { this.newForm.markAllAsTouched(); return; }
		this.saving.set(true);
		this.api.post('process-steps', stepToApi(this.newForm.value)).subscribe({
			next: (raw: any) => {
				this.steps.update(list => [...list, toStep({ ...this.newForm.value, ...raw })]);
				this.showNew.set(false);
				this.saving.set(false);
			},
			error: () => this.saving.set(false),
		});
	}
}
