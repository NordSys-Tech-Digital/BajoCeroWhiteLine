import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./app-home/app-home').then(m => m.AppHomeComponent)
	},
	{
		path: 'admin',
		loadComponent: () => import('./admin/admin-shell/admin-shell').then(m => m.AdminShellComponent)
	},
	{
		path: 'galeria',
		loadComponent: () => import('./components/gallery/gallery').then(m => m.GalleryComponent)
	},
	{ path: '**', redirectTo: '' }
];
