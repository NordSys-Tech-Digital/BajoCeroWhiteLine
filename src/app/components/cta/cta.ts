import { Component, inject, computed } from '@angular/core';
import { SiteDataService } from '../../services/site-data';

@Component({
	selector: 'app-cta',
	templateUrl: './cta.html',
	styleUrl: './cta.scss'
})
export class CtaComponent {
	private siteData = inject(SiteDataService);

	readonly channels = computed(() => {
		const c = this.siteData.data().contact;

		// ✅ Limpieza robusta: elimina todo lo que no sea número para los enlaces
		const cleanWhatsapp = c.whatsapp ? c.whatsapp.replace(/\D/g, '') : '';
		const cleanPhone = c.phone ? c.phone.replace(/\D/g, '') : '';

		return [
			{
				icon: 'whatsapp',
				label: 'WhatsApp',
				value: c.whatsapp || 'No disponible',
				href: cleanWhatsapp ? `https://wa.me/${cleanWhatsapp}` : '#',
				hint: 'Respuesta inmediata',
				isExternal: true
			},
			{
				icon: 'phone',
				label: 'Teléfono',
				value: c.phone || 'No disponible',
				href: cleanPhone ? `tel:+${cleanPhone}` : '#',
				hint: c.schedule || 'Horario no disponible',
				isExternal: false
			},
			{
				icon: 'email',
				label: 'Correo',
				value: c.email || 'No disponible',
				href: c.email ? `mailto:${c.email}` : '#',
				hint: 'Respuesta en 2h',
				isExternal: false
			},
		];
	});
}
