import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { HeroData } from '../../models/site.models';

// ── Función mapeadora ──────────────────────────────────────────────────────────
function toHero(r: any): HeroData {
	return {
		id: r.id ?? r._id ?? '',
		badge: r.badge ?? '',
		headline: r.headline ?? '',
		headlineHighlight: r.headlineHighlight ?? '',
		subtext: r.subtext ?? '',
		stats: Array.isArray(r.stats) ? r.stats.map((s: any) => ({
			label: s.label ?? '',
			value: s.value ?? ''
		})) : [],
		active: r.active ?? true,
		createdAt: r.createdAt,
		updatedAt: r.updatedAt,
	};
}

@Component({
	selector: 'app-admin-hero',
	imports: [ReactiveFormsModule],
	templateUrl: './admin-hero.html',
	styleUrl: './admin-hero.scss',
})
export class AdminHeroComponent implements OnInit {
	private api = inject(ApiService);
	private fb = inject(FormBuilder);

	// ── Estado con Signals ──────────────────────────────────────────────────────
	loading = signal(false);
	saving = signal(false);
	saved = signal(false);
	error = signal<string | null>(null);

	// Necesitamos guardar el ID del registro para poder hacer el PUT después
	heroId = signal<string>('');

	// ── Formulario ──────────────────────────────────────────────────────────────
	form = this.fb.group({
		badge: ['', Validators.required],
		headline: ['', Validators.required],
		headlineHighlight: ['', Validators.required],
		subtext: ['', Validators.required],
		stats: this.fb.array([]),
	});

	get statsArray() {
		return this.form.get('stats') as FormArray;
	}

	// ── Ciclo de vida ───────────────────────────────────────────────────────────
	ngOnInit() {
		this.load();
	}

	// ── Carga de datos ──────────────────────────────────────────────────────────
	load() {
		this.loading.set(true);
		this.error.set(null);

		this.api.get<any>('hero').subscribe({
			next: (res) => {
				// La API podría devolver un objeto único o un array con un solo elemento
				const rawData = Array.isArray(res) ? res[0] : res;

				if (rawData) {
					const hero = toHero(rawData);
					this.heroId.set(hero.id);

					// Patch de los campos simples
					this.form.patchValue({
						badge: hero.badge,
						headline: hero.headline,
						headlineHighlight: hero.headlineHighlight,
						subtext: hero.subtext,
					});

					// Reconstrucción limpia del FormArray de stats
					this.statsArray.clear();
					hero.stats.forEach((s: any) => {
						this.statsArray.push(
							this.fb.group({
								value: [s.value, Validators.required],
								label: [s.label, Validators.required],
							})
						);
					});
				}
				this.loading.set(false);
			},
			error: () => {
				this.error.set('No se pudo cargar la información del Hero');
				this.loading.set(false);
			},
		});
	}

	// ── Manejo del FormArray ────────────────────────────────────────────────────
	addStat() {
		this.statsArray.push(
			this.fb.group({
				value: ['', Validators.required],
				label: ['', Validators.required],
			})
		);
	}

	removeStat(i: number) {
		if (this.statsArray.length > 1) {
			this.statsArray.removeAt(i);
		}
	}

	// ── Guardar cambios ─────────────────────────────────────────────────────────
	save() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		if (!this.heroId()) {
			this.error.set('No se ha podido identificar el registro a actualizar');
			return;
		}

		this.saving.set(true);
		this.error.set(null);

		// Construimos el payload exacto que espera tu endpoint de Postman
		const payload = {
			...this.form.value,
			stats: this.statsArray.controls.map((ctrl) => ctrl.value),
		};

		this.api.put(`hero/${this.heroId()}`, payload).subscribe({
			next: () => {
				this.saved.set(true);
				this.saving.set(false);
				setTimeout(() => this.saved.set(false), 2500);
			},
			error: () => {
				this.error.set('Error al guardar los cambios en el servidor');
				this.saving.set(false);
			},
		});
	}
}
