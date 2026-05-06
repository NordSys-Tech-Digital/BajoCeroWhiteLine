import { Component, HostListener, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
	selector: 'app-navbar',
	imports: [NgClass, RouterLink, RouterLinkActive],
	templateUrl: './navbar.html',
	styleUrl: './navbar.scss',
})
export class NavbarComponent {
	scrolled = signal(false);
	menuOpen = signal(false);

	navLinks = [
		{ label: 'Inicio', routerLink: '/', fragment: 'inicio' },
		{ label: 'Servicios', routerLink: '/', fragment: 'servicios' },
		{ label: 'Galería', routerLink: '/galeria', fragment: null },
		{ label: 'Proceso', routerLink: '/', fragment: 'proceso' },
		{ label: 'Contacto', routerLink: '/', fragment: 'formulario' },
	];

	@HostListener('window:scroll')
	onScroll() { this.scrolled.set(window.scrollY > 40); }

	toggleMenu() { this.menuOpen.update(v => !v); }

	navigate(link: typeof this.navLinks[0]) {
		this.menuOpen.set(false);
		if (link.fragment) {
			setTimeout(() => {
				document.getElementById(link.fragment!)
					?.scrollIntoView({ behavior: 'smooth' });
			}, 80);
		}
	}
}
