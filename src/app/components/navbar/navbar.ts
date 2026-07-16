import { Component, HostListener, signal, inject, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { SiteDataService } from '../../services/site-data';

@Component({
	selector: 'app-navbar',
	imports: [NgClass, RouterLink, RouterLinkActive],
	templateUrl: './navbar.html',
	styleUrls: ['./navbar.scss'],
})
export class NavbarComponent implements OnInit {
	private siteData = inject(SiteDataService);
	private router = inject(Router);

	scrolled = signal(false);
	menuOpen = signal(false);

	navLinks = [
		{ label: 'Inicio', routerLink: '/', fragment: 'inicio' },
		{ label: 'Servicios', routerLink: '/', fragment: 'servicios' },
		{ label: 'Galería', routerLink: '/galeria', fragment: null },
		{ label: 'Proceso', routerLink: '/', fragment: 'proceso' },
		{ label: 'Contacto', routerLink: '/', fragment: 'formulario' },
	];

	ngOnInit() {
		// Aseguramos que los datos de contacto estén cargados para el navbar
	}

	@HostListener('window:scroll')
	onScroll() {
		this.scrolled.set(window.scrollY > 40);
	}

	toggleMenu() {
		this.menuOpen.update(v => !v);
		this.updateBodyScroll(this.menuOpen());
	}

	private updateBodyScroll(isOpen: boolean) {
		// Pequeño delay para permitir que la animación CSS del menú inicie sin saltos
		setTimeout(() => {
			document.body.style.overflow = isOpen ? 'hidden' : '';
			document.body.classList.toggle('menu-open', isOpen);
		}, 50);
	}

	navigate(link: typeof this.navLinks[0], event: MouseEvent) {
		this.menuOpen.set(false);
		this.updateBodyScroll(false);

		// Si tiene fragmento, prevenimos el salto brusco por defecto y usamos scroll suave
		if (link.fragment) {
			event.preventDefault();
			this.router.navigate([link.routerLink], { fragment: link.fragment }).then(() => {
				setTimeout(() => {
					const element = document.getElementById(link.fragment!);
					if (element) {
						element.scrollIntoView({ behavior: 'smooth', block: 'start' });
					}
				}, 100);
			});
		}
	}

	// ── Getters dinámicos para contacto (adiós hardcodeo) ──────────────────────
	get contact() {
		return this.siteData.data().contact;
	}

	get whatsappLink() {
		const phone = this.contact.whatsapp.replace(/\D/g, ''); // Deja solo números
		return phone ? `https://wa.me/${phone}` : '#';
	}

	get phoneLink() {
		const phone = this.contact.phone.replace(/\D/g, '');
		return phone ? `tel:+${phone}` : '#';
	}
}
