import { Component } from '@angular/core';

@Component({
  selector: 'app-cta',
  standalone: true,
  templateUrl: './cta.html',
  styleUrl: './cta.scss'
})
export class CtaComponent {
  channels = [
    {
      icon: 'whatsapp',
      label: 'WhatsApp',
      value: '+57 300 123 4567',
      href: 'https://wa.me/573001234567',
      hint: 'Respuesta inmediata'
    },
    {
      icon: 'phone',
      label: 'Teléfono',
      value: '601 123 4567',
      href: 'tel:+576011234567',
      hint: 'Lun–Dom · 7am–9pm'
    },
    {
      icon: 'email',
      label: 'Correo',
      value: 'info@cryotech.co',
      href: 'mailto:info@cryotech.co',
      hint: 'Respuesta en 2h'
    },
  ];
}
