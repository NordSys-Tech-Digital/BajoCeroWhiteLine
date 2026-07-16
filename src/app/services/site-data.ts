import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap, catchError, of, shareReplay } from 'rxjs';
import {
	Service,
	ProcessStep,
	HeroData,
	ContactInfo,
	SiteData,
	ContactMessage,
} from '../models/site.models';
import { ApiService } from './api.service';

// ── Mapeadores ───────────────────────────────────────────────────────────────
function toService(r: any): Service {
	return {
		id: r.id ?? r._id ?? String(Date.now()),
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

function toStep(r: any): ProcessStep {
	return {
		id: r.id ?? r._id ?? String(Date.now()),
		num: r.num ?? '',
		icon: r.icon ?? '📞',
		title: r.title ?? '',
		desc: r.descripcion ?? r.desc ?? '',
	};
}

function stepToApi(s: Omit<ProcessStep, 'id'> | ProcessStep) {
	return { num: s.num, icon: s.icon, title: s.title, descripcion: s.desc };
}

function toContact(r: any): ContactInfo {
	const src = Array.isArray(r) ? r[0] : r;
	return {
		id: src?.id ?? src?._id ?? 'default-contact-id',
		whatsapp: src?.whatsapp ?? '',
		phone: src?.phone ?? '',
		email: src?.email ?? '',
		city: src?.city ?? '',
		schedule: src?.schedule ?? '',
	};
}

function toHero(r: any): HeroData {
	const src = Array.isArray(r) ? r[0] : r;
	return {
		id: src?.id ?? src?._id ?? 'default-hero-id',
		badge: src?.badge ?? '✦ Servicio técnico certificado',
		headline: src?.headline ?? 'Especialistas en',
		headlineHighlight: src?.headlineHighlight ?? 'aires acondicionados',
		subtext: src?.subtext ?? 'Instalación, mantenimiento y reparación...',
		stats: Array.isArray(src?.stats) ? src.stats : [],
		active: src?.active ?? true,
		createdAt: src?.createdAt ?? new Date().toISOString(),
		updatedAt: src?.updatedAt ?? new Date().toISOString(),
	};
}

const DEFAULT_HERO: HeroData = {
	id: 'fallback-id',
	badge: '✦ Servicio técnico certificado',
	headline: 'Especialistas en',
	headlineHighlight: 'aires acondicionados',
	subtext: 'Instalación, mantenimiento y reparación de electrodomésticos.',
	stats: [
		{ value: '+500', label: 'Clientes atendidos' },
		{ value: '24/7', label: 'Disponibilidad' },
	],
	active: true,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

// ── Servicio Principal ───────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class SiteDataService {
	private http = inject(ApiService);

	// ✅ Bandera para evitar peticiones duplicadas
	private _isLoaded = false;

	// Estado reactivo
	private _services = signal<Service[]>([]);
	private _steps = signal<ProcessStep[]>([]);
	private _contact = signal<ContactInfo | null>(null);
	private _hero = signal<HeroData>(DEFAULT_HERO);
	private _messages = signal<ContactMessage[]>([]);

	// Lectura pública
	readonly data = computed<SiteData>(() => ({
		hero: this._hero(),
		steps: this._steps(),
		contact: this._contact() ?? { whatsapp: '', phone: '', email: '', city: '', schedule: '', id: 'default-contact-id' },
	}));

	readonly services = this._services.asReadonly();
	readonly messages = this._messages.asReadonly();
	readonly unreadCount = computed(() => this._messages().filter(m => !m.read).length);

	// ── Carga inicial ──────────────────────────────────────────────────────────
	loadAll() {
		// ✅ Si ya se cargó, no hace nada. Esto elimina las peticiones duplicadas al 100%.
		if (this._isLoaded) return;
		this._isLoaded = true;

		this.loadHero();
		this.loadServices();
		this.loadSteps();
		this.loadContact();
	}

	// ── 1. Hero ────────────────────────────────────────────────────────────────
	loadHero() {
		this.http.get<any>(`hero`).pipe(
			catchError(() => of(null))
		).subscribe(raw => {
			if (raw) this._hero.set(toHero(raw));
		});
	}

	updateHero(hero: HeroData): Observable<any> {
		return this.http.put(`hero/${hero.id}`, hero).pipe(
			tap(() => this._hero.set(hero))
		);
	}

	// ── 2. Services ────────────────────────────────────────────────────────────
	loadServices() {
		this.http.get<any[]>(`services`).pipe(
			catchError(() => of([]))
		).subscribe(raw => {
			this._services.set(raw.map(toService));
		});
	}

	// ── 3. Process Steps ───────────────────────────────────────────────────────
	loadSteps() {
		this.http.get<any[]>(`process-steps`).pipe(
			catchError(() => of([]))
		).subscribe(raw => this._steps.set(raw.map(toStep)));
	}


	deleteStep(id: string): Observable<any> {
		return this.http.delete(`process-steps/${id}`).pipe(
			tap(() => this._steps.update(list => list.filter(x => x.id !== id)))
		);
	}

	// ── 4. Contact ─────────────────────────────────────────────────────────────
	loadContact() {
		this.http.get<any>(`contact`).pipe(
			catchError(() => of(null))
		).subscribe(raw => {
			if (raw) this._contact.set(toContact(raw));
		});
	}

	updateContact(c: ContactInfo): Observable<any> {
		return this.http.put(`contact/${c.id}`, c).pipe(
			tap(() => this._contact.set(c))
		);
	}

	// ── 5. Messages ────────────────────────────────────────────────────────────
	addMessage(msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) {
		const m: ContactMessage = {
			...msg,
			id: 'm' + Date.now(),
			date: new Date().toISOString(),
			read: false,
		};
		this._messages.update(ms => [m, ...ms]);
	}

	// ✅ Función reparada (estaba rota por el copy-paste)
	markRead(id: string) {
		this._messages.update(ms => ms.map(m => m.id === id ? { ...m, read: true } : m));
	}

	deleteMessage(id: string) {
		this._messages.update(ms => ms.filter(m => m.id !== id));
	}

	resetToDefaults() {
		this._hero.set(DEFAULT_HERO);
		this._isLoaded = false; // Permitir recarga si se resetea
		this.loadAll();
	}
}
