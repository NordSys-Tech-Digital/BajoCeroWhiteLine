import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SiteDataService } from '../../services/site-data';

@Component({
	selector: 'app-admin-hero',
	imports: [ReactiveFormsModule],
	templateUrl: './admin-hero.html',
	styleUrl: './admin-hero.scss',
})
export class AdminHeroComponent implements OnInit {
	private siteData = inject(SiteDataService);
	private fb = inject(FormBuilder);

	// El hero no tiene endpoint en la API todavía — se guarda en memoria.
	saved = signal(false);

	form = this.fb.group({
		badge: ['', Validators.required],
		headline: ['', Validators.required],
		headlineHighlight: ['', Validators.required],
		subtext: ['', Validators.required],
		stats: this.fb.array([]),
	});

	get statsArray() { return this.form.get('stats') as FormArray; }

	ngOnInit() {
		const h = this.siteData.data().hero;
		this.form.patchValue({
			badge: h.badge,
			headline: h.headline,
			headlineHighlight: h.headlineHighlight,
			subtext: h.subtext,
		});
		h.stats.forEach(s =>
			this.statsArray.push(this.fb.group({
				value: [s.value, Validators.required],
				label: [s.label, Validators.required],
			}))
		);
	}

	addStat() {
		this.statsArray.push(this.fb.group({ value: ['', Validators.required], label: ['', Validators.required] }));
	}

	removeStat(i: number) {
		if (this.statsArray.length > 1) this.statsArray.removeAt(i);
	}

	save() {
		if (this.form.invalid) { this.form.markAllAsTouched(); return; }
		this.siteData.updateHero(this.form.value as any);
		this.saved.set(true);
		setTimeout(() => this.saved.set(false), 2500);
	}
}
