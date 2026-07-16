import { Component, inject, computed } from '@angular/core';
import { SiteDataService } from '../../services/site-data';

@Component({
	selector: 'app-hero',
	templateUrl: './hero.html',
	styleUrl: './hero.scss',
})
export class HeroComponent {
	private siteData = inject(SiteDataService);

	// ✅ Computados: Se recalculan automáticamente cuando el signal interno cambia
	readonly hero = computed(() => this.siteData.data().hero);
	readonly contact = computed(() => this.siteData.data().contact);

	// ✅ Helpers para generar enlaces limpios (elimina espacios, guiones, etc.)
	get whatsappLink(): string {
		const phone = this.contact().whatsapp.replace(/\D/g, '');
		return phone ? `https://wa.me/${phone}` : '#';
	}

	get phoneLink(): string {
		const phone = this.contact().phone.replace(/\D/g, '');
		return phone ? `tel:+${phone}` : '#';
	}
}
