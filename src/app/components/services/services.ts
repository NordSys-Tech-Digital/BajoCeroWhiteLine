import { Component, inject, computed, signal } from '@angular/core';
import { SiteDataService } from '../../services/site-data';

@Component({
	selector: 'app-services',
	templateUrl: './services.html',
	styleUrls: ['./services.scss'],
})
export class ServicesComponent {
	private siteData = inject(SiteDataService);

	// ✅ Datos reactivos desde la API
	readonly services = computed(() => this.siteData.services());

	// ✅ Estado local para el índice activo
	readonly activeIndex = signal(0);

	// ✅ CORRECCIÓN: Usar computed en lugar de 'get' para que sea callable con () en el template
	readonly activeService = computed(() => {
		const list = this.services();
		const index = this.activeIndex();
		return list && list.length > 0 ? list[index] : null;
	});

	setActive(i: number) {
		this.activeIndex.set(i);
	}

	// ✅ Helper para enlace dinámico de WhatsApp
	get whatsappLink(): string {
		const phone = this.siteData.data().contact.whatsapp.replace(/\D/g, '');
		return phone ? `https://wa.me/${phone}` : '#';
	}
}
