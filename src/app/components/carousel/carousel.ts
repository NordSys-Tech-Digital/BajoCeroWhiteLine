import {
	Component,
	Input,
	OnInit,
	OnDestroy,
	signal,
	computed,
	HostListener,
	ElementRef,
	ViewChild,
	AfterViewInit,
} from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { CAROUSEL_IMAGES } from '../../models/gallery-images';

export interface CarouselSlide {
	src: string;
	alt?: string;
	title?: string;
	subtitle?: string;
}

@Component({
	selector: 'app-carousel',
	imports: [NgClass, NgStyle],
	templateUrl: './carousel.html',
	styleUrl: './carousel.scss',
	standalone: true,
})
export class CarouselComponent implements OnInit, OnDestroy, AfterViewInit {
	@Input() autoplayInterval = 5000;
	@Input() showThumbnails = true;
	@Input() showCaptions = true;

	@ViewChild('track') trackRef!: ElementRef<HTMLElement>;

	// Build slides from the gallery-images model
	slides: CarouselSlide[] = CAROUSEL_IMAGES.map((img, i) => ({
		src: `assets/img/${img}`,
		alt: `Imagen ${i + 1}`,
		title: img.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
		subtitle: '',
	}));

	current = signal(0);
	isAnimating = signal(false);
	isPaused = signal(false);
	isFullscreen = signal(false);

	progress = signal(0);

	total = computed(() => this.slides.length);
	prev = computed(() => (this.current() - 1 + this.total()) % this.total());
	next = computed(() => (this.current() + 1) % this.total());

	private autoplayTimer: ReturnType<typeof setInterval> | null = null;
	private progressTimer: ReturnType<typeof setInterval> | null = null;

	// Touch / drag state
	private touchStartX = 0;
	private touchStartY = 0;
	private isDragging = false;

	ngOnInit() {
		this.startAutoplay();
	}

	ngAfterViewInit() { }

	ngOnDestroy() {
		this.stopAutoplay();
	}

	// ─── Navigation ────────────────────────────────────────────────────────────

	goTo(index: number) {
		if (this.isAnimating() || index === this.current()) return;
		this.isAnimating.set(true);
		this.current.set(index);
		this.resetProgress();
		setTimeout(() => this.isAnimating.set(false), 600);
	}

	goNext() {
		this.goTo(this.next());
	}

	goPrev() {
		this.goTo(this.prev());
	}

	// ─── Autoplay ──────────────────────────────────────────────────────────────

	private startAutoplay() {
		this.stopAutoplay();
		if (this.isPaused()) return;

		this.progress.set(0);
		let elapsed = 0;
		const tick = 50;

		this.progressTimer = setInterval(() => {
			if (!this.isPaused()) {
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
		if (this.autoplayTimer) { clearInterval(this.autoplayTimer); this.autoplayTimer = null; }
		if (this.progressTimer) { clearInterval(this.progressTimer); this.progressTimer = null; }
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
		if (e.key === 'Escape' && this.isFullscreen()) this.isFullscreen.set(false);
	}

	// ─── Touch / Swipe ─────────────────────────────────────────────────────────

	onTouchStart(e: TouchEvent) {
		this.touchStartX = e.touches[0].clientX;
		this.touchStartY = e.touches[0].clientY;
		this.isDragging = true;
		this.pauseAutoplay();
	}

	onTouchEnd(e: TouchEvent) {
		if (!this.isDragging) return;
		const dx = e.changedTouches[0].clientX - this.touchStartX;
		const dy = e.changedTouches[0].clientY - this.touchStartY;
		if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
			dx < 0 ? this.goNext() : this.goPrev();
		}
		this.isDragging = false;
		this.resumeAutoplay();
	}

	// ─── Mouse drag ────────────────────────────────────────────────────────────

	onMouseDown(e: MouseEvent) {
		this.touchStartX = e.clientX;
		this.isDragging = true;
		this.pauseAutoplay();
	}

	@HostListener('mouseup', ['$event'])
	onMouseUp(e: MouseEvent) {
		if (!this.isDragging) return;
		const dx = e.clientX - this.touchStartX;
		if (Math.abs(dx) > 50) dx < 0 ? this.goNext() : this.goPrev();
		this.isDragging = false;
		this.resumeAutoplay();
	}

	// ─── Fullscreen ────────────────────────────────────────────────────────────

	toggleFullscreen() { this.isFullscreen.update(v => !v); }

	getSlideClass(index: number): Record<string, boolean> {
		const c = this.current();
		const p = this.prev();
		const n = this.next();
		return {
			'slide': true,
			'active': index === c,
			'is-prev': index === p,
			'is-next': index === n,
			'inactive': index !== c && index !== p && index !== n,
		};
	}
}
