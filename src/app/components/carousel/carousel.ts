import {
	Component,
	Input,
	OnInit,
	OnDestroy,
	signal,
	computed,
	HostListener,
	inject,
} from '@angular/core';
import { GalleryService } from '../../services/gallery.service'; // Ajusta la ruta

export interface CarouselSlide {
	src: string;
	alt?: string;
	title?: string;
	subtitle?: string;
}

@Component({
	selector: 'app-carousel',
	templateUrl: './carousel.html',
	styleUrl: './carousel.scss',
	standalone: true,
})
export class CarouselComponent implements OnInit, OnDestroy {
	private galleryService = inject(GalleryService);

	@Input() autoplayInterval = 5000;
	@Input() showThumbnails = true;
	@Input() showCaptions = true;

	// ✅ Estado reactivo
	readonly current = signal(0);
	readonly isAnimating = signal(false);
	readonly isPaused = signal(false);
	readonly isFullscreen = signal(false);
	readonly progress = signal(0);

	// ✅ Datos dinámicos desde la API de Galería
	readonly slides = signal<CarouselSlide[]>([]);
	readonly total = computed(() => this.slides().length);
	readonly prev = computed(() => (this.current() - 1 + this.total()) % this.total());
	readonly next = computed(() => (this.current() + 1) % this.total());

	private autoplayTimer: ReturnType<typeof setInterval> | null = null;
	private progressTimer: ReturnType<typeof setInterval> | null = null;

	// Touch / drag state
	private touchStartX = 0;
	private isDragging = false;

	ngOnInit() {
		this.loadGalleryImages();
	}

	private loadGalleryImages() {

		const mappedSlides: CarouselSlide[] = this.galleryService.getImages().map((img) => ({
			src: `/assets/img/${img.filename}`, // Ajusta esta ruta según cómo sirva los archivos tu backend
			alt: img.title || 'Imagen de galería',
			title: img.title || img.filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
			subtitle: img.description || '',
		}));
		this.slides.set(mappedSlides);
		this.startAutoplay();

	}

	ngOnDestroy() {
		this.stopAutoplay();
	}

	// ─── Navigation ────────────────────────────────────────────────────────────

	goTo(index: number) {
		if (this.isAnimating() || index === this.current() || this.total() <= 1) return;
		this.isAnimating.set(true);
		this.current.set(index);
		this.resetProgress();
		setTimeout(() => this.isAnimating.set(false), 550); // Coincide con $trans-speed en SCSS
	}

	goNext() { this.goTo(this.next()); }
	goPrev() { this.goTo(this.prev()); }

	// ─── Autoplay ──────────────────────────────────────────────────────────────

	private startAutoplay() {
		this.stopAutoplay();
		if (this.isPaused() || this.total() <= 1) return;

		this.progress.set(0);
		let elapsed = 0;
		const tick = 50;

		this.progressTimer = setInterval(() => {
			if (!this.isPaused() && !document.hidden) { // Pausa si la pestaña no está activa
				elapsed += tick;
				this.progress.set((elapsed / this.autoplayInterval) * 100);
				if (elapsed >= this.autoplayInterval) {
					elapsed = 0;
					this.progress.set(0);
					this.goNext();
				}
			}
		}, tick);
	}

	private stopAutoplay() {
		if (this.progressTimer) {
			clearInterval(this.progressTimer);
			this.progressTimer = null;
		}
	}

	private resetProgress() {
		this.stopAutoplay();
		this.startAutoplay();
	}

	pauseAutoplay() { this.isPaused.set(true); }
	resumeAutoplay() { this.isPaused.set(false); }

	// ─── Keyboard ──────────────────────────────────────────────────────────────

	@HostListener('document:keydown', ['$event'])
	onKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') this.goNext();
		if (e.key === 'ArrowLeft') this.goPrev();
		if (e.key === 'Escape' && this.isFullscreen()) this.toggleFullscreen();
	}

	// ─── Touch / Swipe ─────────────────────────────────────────────────────────

	onTouchStart(e: TouchEvent) {
		this.touchStartX = e.touches[0].clientX;
		this.isDragging = true;
		this.pauseAutoplay();
	}

	onTouchEnd(e: TouchEvent) {
		if (!this.isDragging) return;
		const dx = e.changedTouches[0].clientX - this.touchStartX;
		if (Math.abs(dx) > 40) {
			dx < 0 ? this.goNext() : this.goPrev();
		}
		this.isDragging = false;
		this.resumeAutoplay();
	}

	onMouseDown(e: MouseEvent) {
		this.touchStartX = e.clientX;
		this.isDragging = true;
		this.pauseAutoplay();
	}

	@HostListener('document:mouseup', ['$event']) // Cambiado a document para capturar si suelta fuera
	onMouseUp(e: MouseEvent) {
		if (!this.isDragging) return;
		const dx = e.clientX - this.touchStartX;
		if (Math.abs(dx) > 50) {
			dx < 0 ? this.goNext() : this.goPrev();
		}
		this.isDragging = false;
		this.resumeAutoplay();
	}

	// ─── Fullscreen ────────────────────────────────────────────────────────────

	toggleFullscreen() {
		this.isFullscreen.update(v => !v);
		// Bloquear scroll del body en modo pantalla completa
		document.body.style.overflow = this.isFullscreen() ? 'hidden' : '';
	}
}
