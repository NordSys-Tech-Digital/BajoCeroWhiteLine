import { Component, inject } from '@angular/core';
import { RouterModule, RouterLinkActive } from '@angular/router';

@Component({
	selector: 'app-admin',
	imports: [RouterModule, RouterLinkActive],
	templateUrl: './admin.html',
	styleUrl: './admin.scss',
})
export class AdminComponent {
	tabs = [
		{ id: 'services', label: 'Servicios', icon: '🔧' },
		{ id: 'hero', label: 'Hero', icon: '🏠' },
		{ id: 'process', label: 'Proceso', icon: '⚡' },
		{ id: 'contact', label: 'Contacto', icon: '📞' },
		{ id: 'messages', label: 'Mensajes', icon: '💬' },
		{ id: 'gallery', label: 'Galería', icon: '🖼️' },
	] as const;

	goToSite() { window.open('/', '_blank'); }
}
