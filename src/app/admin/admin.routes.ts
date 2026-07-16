import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
	{
		// Login es independiente — no usa el layout con sidebar
		path: 'login',
		loadComponent: () => import('./admin-login/admin-login').then(m => m.AdminLoginComponent)
	},
	{
		// Layout principal con sidebar — todas las secciones son hijos
		path: '',
		loadComponent: () => import('./admin').then(m => m.AdminComponent),
		children: [
			{ path: '', redirectTo: 'services', pathMatch: 'full' },
			{ path: 'services', loadComponent: () => import('./admin-services/admin-services').then(m => m.AdminServicesComponent) },
			{ path: 'hero', loadComponent: () => import('./admin-hero/admin-hero').then(m => m.AdminHeroComponent) },
			{ path: 'process', loadComponent: () => import('./admin-process/admin-process').then(m => m.AdminProcessComponent) },
			{ path: 'contact', loadComponent: () => import('./admin-contact/admin-contact').then(m => m.AdminContactComponent) },
			//   { path: 'messages', loadComponent: () => import('./admin-messages/admin-messages').then(m => m.AdminMessagesComponent) },
			{ path: 'gallery', loadComponent: () => import('./admin-gallery/admin-gallery').then(m => m.AdminGalleryComponent) },
		]
	},
	{ path: '**', redirectTo: 'login' }
];
