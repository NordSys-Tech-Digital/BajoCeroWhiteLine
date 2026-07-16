import { Component, inject, computed } from '@angular/core';
import { SiteDataService } from '../../services/site-data';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.html',
	styleUrls: ['./footer.scss']
})
export class FooterComponent {
	private siteData = inject(SiteDataService);

	readonly year = new Date().getFullYear();

	// ✅ Reactividad garantizada: se actualiza cuando llegan los datos de la API
	readonly contact = computed(() => this.siteData.data().contact);

	// Enlaces del footer (estáticos, a menos que tu CMS los gestione dinámicamente)
	readonly links = [
		{ label: 'Inicio', href: '/#inicio' },
		{ label: 'Servicios', href: '/#servicios' },
		{ label: 'Proceso', href: '/#proceso' },
		{ label: 'Contacto', href: '/#formulario' }
	];

	// ✅ Helpers para formateo seguro de teléfonos (evita errores si el formato no coincide)
	formatWhatsapp(phone: string): string {
		if (!phone) return '';
		const clean = phone.replace(/\D/g, '');
		// Formato colombiano esperado: 57 300 123 4567 (12 dígitos)
		const match = clean.match(/^(\d{2})(\d{3})(\d{3})(\d{4})$/);
		return match ? `${match[1]} ${match[2]} ${match[3]} ${match[4]}` : phone;
	}

	formatPhone(phone: string): string {
		if (!phone) return '';
		const clean = phone.replace(/\D/g, '');
		// Formato local esperado: 601 123 4567 o 300 123 4567 (10 dígitos)
		const match = clean.match(/^(\d{3})(\d{3})(\d{4})$/);
		return match ? `${match[1]} ${match[2]} ${match[3]}` : phone;
	}
}
