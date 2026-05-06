import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class FooterComponent {
  year = new Date().getFullYear();

  links = [
    { label: 'Servicios', href: '#servicios' },
    { label: 'Mantenimiento', href: '#servicios' },
    { label: 'Reparación', href: '#servicios' },
    { label: 'Instalación', href: '#servicios' },
    { label: 'Proceso', href: '#proceso' },
    { label: 'Contacto', href: '#contacto' },
  ];
}
