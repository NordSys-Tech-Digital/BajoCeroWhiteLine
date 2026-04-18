import { Injectable, signal, computed } from '@angular/core';
import { SiteData, Service, ProcessStep, ContactMessage } from '../models/site.models';

const STORAGE_KEY = 'cryotech_site_data';
const MESSAGES_KEY = 'cryotech_messages';

const DEFAULT_DATA: SiteData = {
  hero: {
    badge: '✦ Servicio técnico certificado',
    headline: 'Especialistas en',
    headlineHighlight: 'aires acondicionados',
    subtext: 'Instalación, mantenimiento y reparación de electrodomésticos para hogares y empresas. Técnicos certificados con respuesta en menos de 2 horas.',
    stats: [
      { value: '+500', label: 'Clientes atendidos' },
      { value: '24/7', label: 'Disponibilidad' },
      { value: '8+', label: 'Años de experiencia' },
      { value: '100%', label: 'Garantía de servicio' },
    ]
  },
  services: [
    { id: 's1', icon: '❄️', color: 'blue',  active: true, title: 'Mantenimiento aire acondicionado', desc: 'Limpieza de filtros, revisión de gas refrigerante, inspección eléctrica y calibración para máxima eficiencia.', items: ['Limpieza profunda de filtros', 'Revisión de gas refrigerante', 'Inspección de componentes', 'Prueba de funcionamiento'] },
    { id: 's2', icon: '🔧', color: 'teal',  active: true, title: 'Reparación aire acondicionado', desc: 'Diagnóstico profesional y solución de fallas en equipos split, centralizados y portátiles de todas las marcas.', items: ['Diagnóstico sin costo', 'Cambio de compresor', 'Reparación de fugas', 'Recarga de refrigerante'] },
    { id: 's3', icon: '⚡', color: 'amber', active: true, title: 'Instalación', desc: 'Instalación segura y eficiente de aires split, minisplit y sistemas centralizados con acabados profesionales.', items: ['Instalación split y mini-split', 'Canalización eléctrica', 'Tuberías de drenaje', 'Pruebas de presión'] },
    { id: 's4', icon: '🧊', color: 'ice',   active: true, title: 'Neveras y refrigeración', desc: 'Servicio técnico para neveras residenciales y comerciales, cámaras frías y equipos de refrigeración industrial.', items: ['Limpieza de condensador', 'Cambio de termostato', 'Reparación de compresor', 'Sellado de puertas'] },
    { id: 's5', icon: '💧', color: 'blue',  active: true, title: 'Calentadores de agua', desc: 'Mantenimiento y reparación de calentadores eléctricos y a gas de todas las marcas y capacidades.', items: ['Revisión de resistencias', 'Limpieza de tanque', 'Cambio de válvulas', 'Ajuste de termostato'] },
    { id: 's6', icon: '🫧', color: 'teal',  active: true, title: 'Lavadoras y secadoras', desc: 'Reparación especializada en lavadoras de carga frontal y superior, Samsung, LG, Mabe, Whirlpool y más.', items: ['Diagnóstico electrónico', 'Cambio de rodamientos', 'Reparación de bomba', 'Mantenimiento general'] },
  ],
  steps: [
    { id: 'p1', num: '01', icon: '📞', title: 'Solicita el servicio', desc: 'Contáctanos por WhatsApp, teléfono o formulario online. Te respondemos en minutos.' },
    { id: 'p2', num: '02', icon: '🔍', title: 'Diagnóstico gratuito', desc: 'Nuestro técnico visita tu hogar o empresa y evalúa el equipo sin costo adicional.' },
    { id: 'p3', num: '03', icon: '📋', title: 'Cotización clara', desc: 'Recibes una cotización detallada y transparente. Sin sorpresas ni costos ocultos.' },
    { id: 'p4', num: '04', icon: '✅', title: 'Solución garantizada', desc: 'Ejecutamos el servicio con garantía escrita. Tu satisfacción es nuestra prioridad.' },
  ],
  contact: {
    whatsapp: '573001234567',
    phone: '6011234567',
    email: 'info@cryotech.co',
    city: 'Cali, Colombia',
    schedule: 'Lun–Dom · 7am–9pm'
  }
};

@Injectable({ providedIn: 'root' })
export class SiteDataService {
  private _data = signal<SiteData>(this.load());
  private _messages = signal<ContactMessage[]>(this.loadMessages());

  readonly data = this._data.asReadonly();
  readonly messages = this._messages.asReadonly();
  readonly unreadCount = computed(() => this._messages().filter(m => !m.read).length);
  readonly activeServices = computed(() => this._data().services.filter(s => s.active));

  private load(): SiteData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULT_DATA, ...JSON.parse(raw) } : DEFAULT_DATA;
    } catch { return DEFAULT_DATA; }
  }

  private loadMessages(): ContactMessage[] {
    try {
      const raw = localStorage.getItem(MESSAGES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data()));
  }

  private saveMessages() {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(this._messages()));
  }

  updateHero(hero: SiteData['hero']) {
    this._data.update(d => ({ ...d, hero }));
    this.save();
  }

  updateContact(contact: SiteData['contact']) {
    this._data.update(d => ({ ...d, contact }));
    this.save();
  }

  // Services
  addService(s: Omit<Service, 'id'>) {
    const service: Service = { ...s, id: 's' + Date.now() };
    this._data.update(d => ({ ...d, services: [...d.services, service] }));
    this.save();
  }

  updateService(updated: Service) {
    this._data.update(d => ({ ...d, services: d.services.map(s => s.id === updated.id ? updated : s) }));
    this.save();
  }

  deleteService(id: string) {
    this._data.update(d => ({ ...d, services: d.services.filter(s => s.id !== id) }));
    this.save();
  }

  toggleService(id: string) {
    this._data.update(d => ({ ...d, services: d.services.map(s => s.id === id ? { ...s, active: !s.active } : s) }));
    this.save();
  }

  reorderServices(services: Service[]) {
    this._data.update(d => ({ ...d, services }));
    this.save();
  }

  // Steps
  addStep(step: Omit<ProcessStep, 'id'>) {
    const s: ProcessStep = { ...step, id: 'p' + Date.now() };
    this._data.update(d => ({ ...d, steps: [...d.steps, s] }));
    this.save();
  }

  updateStep(updated: ProcessStep) {
    this._data.update(d => ({ ...d, steps: d.steps.map(s => s.id === updated.id ? updated : s) }));
    this.save();
  }

  deleteStep(id: string) {
    this._data.update(d => ({ ...d, steps: d.steps.filter(s => s.id !== id) }));
    this.save();
  }

  // Messages
  addMessage(msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) {
    const m: ContactMessage = { ...msg, id: 'm' + Date.now(), date: new Date().toISOString(), read: false };
    this._messages.update(ms => [m, ...ms]);
    this.saveMessages();
  }

  markRead(id: string) {
    this._messages.update(ms => ms.map(m => m.id === id ? { ...m, read: true } : m));
    this.saveMessages();
  }

  deleteMessage(id: string) {
    this._messages.update(ms => ms.filter(m => m.id !== id));
    this.saveMessages();
  }

  resetToDefaults() {
    this._data.set(DEFAULT_DATA);
    this.save();
  }
}
