import { Component, inject, signal, OnInit } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { SiteDataService } from '../../services/site-data';
import { AdminServicesComponent } from '../admin-services/admin-services';
import { AdminHeroComponent } from '../admin-hero/admin-hero';
import { AdminProcessComponent } from '../admin-process/admin-process';
import { AdminContactComponent } from '../admin-contact/admin-contact';
import { AdminGalleryComponent } from '../admin-gallery/admin-gallery';
import { AdminFooterComponent } from '../admin-footer/admin-footer';

@Component({
	selector: 'app-admin-shell',
	imports: [NgClass, DatePipe, ReactiveFormsModule, AdminServicesComponent, AdminHeroComponent, AdminProcessComponent, AdminContactComponent, AdminGalleryComponent, AdminFooterComponent],
	templateUrl: './admin-shell.html',
	styleUrl: './admin-shell.scss',
})
export class AdminShellComponent implements OnInit {
	auth = inject(AuthService);
	siteData = inject(SiteDataService);
	private fb = inject(FormBuilder);

	activeTab = signal<'services' | 'hero' | 'process' | 'contact' | 'messages' | 'gallery' | 'footer'>('services');
	loginError = signal('');
	logging = signal(false);

	loginForm = this.fb.group({
		user: ['', Validators.required],
		pass: ['', Validators.required],
	});

	tabs = [
		{ id: 'services', label: 'Servicios', icon: '🔧' },
		{ id: 'hero', label: 'Hero', icon: '🏠' },
		{ id: 'process', label: 'Proceso', icon: '⚡' },
		{ id: 'contact', label: 'Contacto', icon: '📞' },
		{ id: 'messages', label: 'Mensajes', icon: '💬' },
	] as const;

	ngOnInit() { this.auth.checkSession(); }

	login() {
		if (this.loginForm.invalid) return;
		const { user, pass } = this.loginForm.value;
		this.loginError.set('');
		this.logging.set(true);

		this.auth.login(user!, pass!).subscribe(res => {
			this.logging.set(false);
			if (!res) this.loginError.set('Usuario o contraseña incorrectos');
		});
	}

	logout() { this.auth.logout(); }

	setTab(t: typeof this.activeTab extends { set(v: infer T): void } ? T : never) {
		this.activeTab.set(t);
	}

	get unread() { return this.siteData.unreadCount(); }
	get messages() { return this.siteData.messages(); }

	markRead(id: string) { this.siteData.markRead(id); }
	deleteMsg(id: string) { this.siteData.deleteMessage(id); }
	goToSite() { window.open('/', '_blank'); }
	resetData() { if (confirm('¿Restablecer datos?')) this.siteData.resetToDefaults(); }
}
