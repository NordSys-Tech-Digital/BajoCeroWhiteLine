import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Service,
  ProcessStep,
  HeroData,
  ContactInfo,
  SiteData,
  ContactMessage,
} from '../models/site.models';

const API = environment.apiUrl;

// ── Mapeadores: normalizan los campos del backend al modelo del frontend ───────

function toService(r: any): Service {
  return {
    id:     r.id     ?? r._id ?? String(Date.now()),
    icon:   r.icon   ?? '🔧',
    color:  r.color  ?? 'blue',
    title:  r.title  ?? '',
    desc:   r.desc   ?? '',
    items:  Array.isArray(r.items) ? r.items : [],
    active: r.active ?? true,
  };
}

function toStep(r: any): ProcessStep {
  return {
    id:    r.id    ?? r._id ?? String(Date.now()),
    num:   r.num   ?? '',
    icon:  r.icon  ?? '📞',
    title: r.title ?? '',
    desc:  r.descripcion ?? r.desc ?? '',   // la API usa "descripcion"
  };
}

function stepToApi(s: Omit<ProcessStep, 'id'> | ProcessStep) {
  return { num: s.num, icon: s.icon, title: s.title, descripcion: s.desc };
}

function toContact(r: any): ContactInfo {
  const src = Array.isArray(r) ? r[0] : r;
  return {
    whatsapp: src?.whatsapp ?? '',
    phone:    src?.phone    ?? '',
    email:    src?.email    ?? '',
    city:     src?.city     ?? '',
    schedule: src?.schedule ?? '',
  };
}

// ── Default hero (no hay endpoint todavía en la API) ─────────────────────────

const DEFAULT_HERO: HeroData = {
  badge:             '✦ Servicio técnico certificado',
  headline:          'Especialistas en',
  headlineHighlight: 'aires acondicionados',
  subtext:           'Instalación, mantenimiento y reparación de electrodomésticos para hogares y empresas. Técnicos certificados con respuesta en menos de 2 horas.',
  stats: [
    { value: '+500', label: 'Clientes atendidos' },
    { value: '24/7', label: 'Disponibilidad' },
    { value: '8+',   label: 'Años de experiencia' },
    { value: '100%', label: 'Garantía de servicio' },
  ],
};

// ── Servicio principal ────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class SiteDataService {
  private http = inject(HttpClient);

  // Estado reactivo
  private _services = signal<Service[]>([]);
  private _steps    = signal<ProcessStep[]>([]);
  private _contact  = signal<ContactInfo>({ whatsapp: '', phone: '', email: '', city: '', schedule: '' });
  private _hero     = signal<HeroData>(DEFAULT_HERO);
  private _messages = signal<ContactMessage[]>([]);

  // Lectura pública
  readonly data = computed<SiteData>(() => ({
    hero:     this._hero(),
    services: this._services(),
    steps:    this._steps(),
    contact:  this._contact(),
  }));

  readonly activeServices  = computed(() => this._services().filter(s => s.active));
  readonly messages        = this._messages.asReadonly();
  readonly unreadCount     = computed(() => this._messages().filter(m => !m.read).length);

  // ── Carga inicial ────────────────────────────────────────────────────────────

  loadAll() {
    this.loadServices();
    this.loadSteps();
    this.loadContact();
  }

  // ── Servicios ────────────────────────────────────────────────────────────────
  // GET  /bajo-cero/services
  // POST /bajo-cero/services         body: { icon, color, title, desc, items[], active }
  // PUT  /bajo-cero/services/:id     body: mismo
  // PATCH /bajo-cero/services/:id/toggle
  // DELETE /bajo-cero/services/:id

  loadServices() {
    this.http.get<any[]>(`${API}/services`).pipe(
      catchError(() => of([]))
    ).subscribe(raw => this._services.set(raw.map(toService)));
  }

  addService(s: Omit<Service, 'id'>): Observable<Service> {
    return this.http.post<any>(`${API}/services`, s).pipe(
      tap(raw => {
        const created = toService(raw);
        this._services.update(list => [...list, created]);
      })
    );
  }

  updateService(s: Service): Observable<Service> {
    return this.http.put<any>(`${API}/services/${s.id}`, s).pipe(
      tap(raw => {
        const updated = toService({ ...s, ...raw });
        this._services.update(list => list.map(x => x.id === s.id ? updated : x));
      })
    );
  }

  toggleService(id: string): Observable<any> {
    return this.http.patch<any>(`${API}/services/${id}/toggle`, {}).pipe(
      tap(() => this._services.update(list =>
        list.map(x => x.id === id ? { ...x, active: !x.active } : x)
      ))
    );
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete<any>(`${API}/services/${id}`).pipe(
      tap(() => this._services.update(list => list.filter(x => x.id !== id)))
    );
  }

  // ── Pasos del proceso ────────────────────────────────────────────────────────
  // GET    /bajo-cero/process-steps
  // POST   /bajo-cero/process-steps   body: { num, icon, title, descripcion }
  // PUT    /bajo-cero/process-steps/:id
  // DELETE /bajo-cero/process-steps/:id

  loadSteps() {
    this.http.get<any[]>(`${API}/process-steps`).pipe(
      catchError(() => of([]))
    ).subscribe(raw => this._steps.set(raw.map(toStep)));
  }

  addStep(s: Omit<ProcessStep, 'id'>): Observable<ProcessStep> {
    return this.http.post<any>(`${API}/process-steps`, stepToApi(s)).pipe(
      tap(raw => {
        const created = toStep({ ...stepToApi(s), ...raw });
        this._steps.update(list => [...list, created]);
      })
    );
  }

  updateStep(s: ProcessStep): Observable<ProcessStep> {
    return this.http.put<any>(`${API}/process-steps/${s.id}`, stepToApi(s)).pipe(
      tap(raw => {
        const updated = toStep({ ...stepToApi(s), ...raw, id: s.id });
        this._steps.update(list => list.map(x => x.id === s.id ? updated : x));
      })
    );
  }

  deleteStep(id: string): Observable<any> {
    return this.http.delete<any>(`${API}/process-steps/${id}`).pipe(
      tap(() => this._steps.update(list => list.filter(x => x.id !== id)))
    );
  }

  // ── Contacto ─────────────────────────────────────────────────────────────────
  // GET /bajo-cero/contact
  // PUT /bajo-cero/contact/    (barra al final tal como está en el Postman)

  loadContact() {
    this.http.get<any>(`${API}/contact`).pipe(
      catchError(() => of(null))
    ).subscribe(raw => {
      if (raw) this._contact.set(toContact(raw));
    });
  }

  updateContact(c: ContactInfo): Observable<any> {
    return this.http.put<any>(`${API}/contact/`, c).pipe(
      tap(() => this._contact.set(c))
    );
  }

  // ── Hero ─────────────────────────────────────────────────────────────────────
  // No hay endpoint en la API todavía → se guarda en memoria.

  updateHero(hero: HeroData) {
    this._hero.set(hero);
  }

  // ── Mensajes (no hay endpoint bajo-cero para esto todavía) ──────────────────
  // Se mantiene en memoria mientras el backend no lo exponga.

  addMessage(msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) {
    const m: ContactMessage = {
      ...msg,
      id:   'm' + Date.now(),
      date: new Date().toISOString(),
      read: false,
    };
    this._messages.update(ms => [m, ...ms]);
  }

  markRead(id: string) {
    this._messages.update(ms => ms.map(m => m.id === id ? { ...m, read: true } : m));
  }

  deleteMessage(id: string) {
    this._messages.update(ms => ms.filter(m => m.id !== id));
  }

  // Fallback para el panel admin (restablecer defaults locales)
  resetToDefaults() {
    this._hero.set(DEFAULT_HERO);
    this.loadAll();
  }
}
