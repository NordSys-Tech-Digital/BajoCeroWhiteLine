import { Component, inject, computed } from '@angular/core';
import { SiteDataService } from '../../services/site-data';

@Component({
  selector: 'app-cta',
  templateUrl: './cta.html',
  styleUrl: './cta.scss'
})
export class CtaComponent {
  siteData = inject(SiteDataService);

  channels = computed(() => {
    const c = this.siteData.data().contact;
    return [
      { icon: 'whatsapp', label: 'WhatsApp', value: '+' + c.whatsapp, href: 'https://wa.me/' + c.whatsapp, hint: 'Respuesta inmediata' },
      { icon: 'phone',    label: 'Teléfono', value: c.phone, href: 'tel:+57' + c.phone, hint: c.schedule },
      { icon: 'email',    label: 'Correo',   value: c.email, href: 'mailto:' + c.email, hint: 'Respuesta en 2h' },
    ];
  });
}
