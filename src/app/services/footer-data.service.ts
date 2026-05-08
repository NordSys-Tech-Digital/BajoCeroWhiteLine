import { Injectable, signal } from '@angular/core';

export interface FooterData {
  brandText: string;
  description: string;
  links: { label: string; href: string }[];
  whatsapp: string;
  phone: string;
  email: string;
  location: string;
  copyright: string;
  madeIn: string;
}

@Injectable({ providedIn: 'root' })
export class FooterDataService {
  private data = signal<FooterData>({
    brandText: 'CryoTech',
    description: 'Especialistas en aires acondicionados y línea blanca para hogares y empresas en toda la ciudad.',
    links: [
      { label: 'Servicios', href: '#servicios' },
      { label: 'Mantenimiento', href: '#servicios' },
      { label: 'Reparación', href: '#servicios' },
      { label: 'Instalación', href: '#servicios' },
      { label: 'Proceso', href: '#proceso' },
      { label: 'Contacto', href: '#contacto' },
    ],
    whatsapp: '573001234567',
    phone: '6011234567',
    email: 'info@cryotech.co',
    location: 'Cali, Colombia',
    copyright: '© ' + new Date().getFullYear() + ' CryoTech — Todos los derechos reservados',
    madeIn: 'Hecho con ❤️ en Colombia',
  });

  getData() {
    return this.data();
  }

  setData(newData: Partial<FooterData>) {
    this.data.set({ ...this.data(), ...newData });
  }
}
