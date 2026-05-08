import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SiteDataService } from '../../services/site-data';

@Component({
	selector: 'app-admin-contact',
	imports: [ReactiveFormsModule],
	templateUrl: './admin-contact.html',
	styleUrl: './admin-contact.scss'
})
export class AdminContactComponent implements OnInit {
	private siteData = inject(SiteDataService);
	private fb = inject(FormBuilder);
	saved = false;

	private LABELS_KEY = 'cryotech_contact_labels';

	labels = {
		whatsapp: 'WhatsApp (solo números, sin +)',
		phone: 'Teléfono fijo',
		email: 'Correo electrónico',
		city: 'Ciudad',
		schedule: 'Horario de atención',
	};

	form = this.fb.group({
		whatsapp: ['', Validators.required],
		phone: ['', Validators.required],
		email: ['', [Validators.required, Validators.email]],
		city: ['', Validators.required],
		schedule: ['', Validators.required],
	});

	ngOnInit() {
		this.form.patchValue(this.siteData.data().contact);
		this.loadLabels();
	}

	loadLabels() {
		const saved = localStorage.getItem(this.LABELS_KEY);
		if (saved) {
			try {
				this.labels = { ...this.labels, ...JSON.parse(saved) };
			} catch { }
		}
	}

	updateLabel(field:
		'whatsapp' |
		'phone' |
		'email' |
		'city' |
		'schedule'
		, value: string) {
		this.labels[field] = value;
		this.saveLabels();
	}

	saveLabels() {
		localStorage.setItem(this.LABELS_KEY, JSON.stringify(this.labels));
	}

	save() {
		if (this.form.invalid) { this.form.markAllAsTouched(); return; }
		this.siteData.updateContact(this.form.value as any);
		this.saveLabels();
		this.saved = true;
		setTimeout(() => this.saved = false, 2500);
	}
}
