import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./app-home/app-home').then(m => m.AppHomeComponent)
	},
	{
		path: 'admin',
		loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
	},
	{
		path: 'galeria',
		loadComponent: () => import('./components/gallery/gallery').then(m => m.GalleryComponent)
	},
	{ path: '**', redirectTo: '' }
];
