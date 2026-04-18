import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
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
