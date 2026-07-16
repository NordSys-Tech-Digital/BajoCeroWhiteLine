import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
	selector: 'app-admin-contact',
	imports: [ReactiveFormsModule],
	templateUrl: './admin-contact.html',
	styleUrl: './admin-contact.scss',
})
export class AdminContactComponent implements OnInit {
	private api = inject(ApiService);
	private fb = inject(FormBuilder);

	saved = signal(false);
	saving = signal(false);
	loading = signal(false);

	private contactId = '';

	form = this.fb.group({
		whatsapp: ['', Validators.required],
		phone: ['', Validators.required],
		email: ['', [Validators.required, Validators.email]],
		city: ['', Validators.required],
		schedule: ['', Validators.required],
	});

	ngOnInit() {
		this.loading.set(true);
		this.api.get<any>('contact').subscribe({
			next: raw => {
				const src = Array.isArray(raw) ? raw[0] : raw;
				this.contactId = src?.id ?? '';
				this.form.patchValue(src);
				this.loading.set(false);
			},
			error: () => this.loading.set(false),
		});
	}

	save() {
		if (this.form.invalid) { this.form.markAllAsTouched(); return; }
		this.saving.set(true);

		this.api.put(`contact/${this.contactId}`, this.form.value).subscribe({
			next: () => {
				this.saving.set(false);
				this.saved.set(true);
				setTimeout(() => this.saved.set(false), 2500);
			},
			error: () => this.saving.set(false),
		});
	}
}
