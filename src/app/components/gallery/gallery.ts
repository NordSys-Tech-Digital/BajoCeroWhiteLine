import {
	Component,
	OnInit,
	OnDestroy,
	signal,
	computed,
	HostListener,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
	GalleryImage,
	GalleryCategory,
	GALLERY_IMAGES,
	GALLERY_CATEGORIES,
} from '../../models/gallery.models';

@Component({
	selector: 'app-gallery',
	imports: [NgClass, RouterLink],
	templateUrl: './gallery.html',
	styleUrl: './gallery.scss',
})
export class GalleryComponent implements OnInit, OnDestroy {
	readonly categories = GALLERY_CATEGORIES;

	activeCategory = signal<GalleryCategory>('todos');
	searchQuery = signal('');
	lightboxIndex = signal<number | null>(null);
	isLoaded = signal(false);
	viewMode = signal<'grid' | 'masonry'>('grid');

	// Filtered images based on active category + search
	filtered = computed(() => {
		const cat = this.activeCategory();
		const q = this.searchQuery().toLowerCase().trim();

		return GALLERY_IMAGES.filter(img => {
			const matchCat = cat === 'todos' || img.category === cat;
			const matchQ = !q ||
				img.title.toLowerCase().includes(q) ||
				(img.location?.toLowerCase().includes(q) ?? false);
			return matchCat && matchQ;
		});
	});

	// For lightbox navigation
	lightboxImage = computed(() => {
		const idx = this.lightboxIndex();
		if (idx === null) return null;
		return this.filtered()[idx] ?? null;
	});

	// Count per category
	countFor(cat: GalleryCategory): number {
		if (cat === 'todos') return GALLERY_IMAGES.length;
		return GALLERY_IMAGES.filter(i => i.category === cat).length;
	}

	ngOnInit() {
		// Stagger animation trigger
		setTimeout(() => this.isLoaded.set(true), 80);
	}

	ngOnDestroy() {
		this.closeLightbox();
	}

	// ── Category filter ────────────────────────────────────────────────────────

	setCategory(cat: GalleryCategory) {
		this.activeCategory.set(cat);
		this.lightboxIndex.set(null);
	}

	onSearch(event: Event) {
		this.searchQuery.set((event.target as HTMLInputElement).value);
	}

	clearSearch() {
		this.searchQuery.set('');
	}

	// ── Lightbox ───────────────────────────────────────────────────────────────

	openLightbox(index: number) {
		this.lightboxIndex.set(index);
		document.body.style.overflow = 'hidden';
	}

	closeLightbox() {
		this.lightboxIndex.set(null);
		document.body.style.overflow = '';
	}

	lightboxNext() {
		const idx = this.lightboxIndex();
		if (idx === null) return;
		this.lightboxIndex.set((idx + 1) % this.filtered().length);
	}

	lightboxPrev() {
		const idx = this.lightboxIndex();
		if (idx === null) return;
		const len = this.filtered().length;
		this.lightboxIndex.set((idx - 1 + len) % len);
	}

	// ── Keyboard ───────────────────────────────────────────────────────────────

	@HostListener('document:keydown', ['$event'])
	onKey(e: KeyboardEvent) {
		if (this.lightboxIndex() === null) return;
		if (e.key === 'Escape') this.closeLightbox();
		if (e.key === 'ArrowRight') this.lightboxNext();
		if (e.key === 'ArrowLeft') this.lightboxPrev();
	}

	// ── Image path helper ──────────────────────────────────────────────────────

	imgSrc(filename: string, thumb = false): string {
		// In production, swap for real paths:
		// return `assets/gallery/${thumb ? 'thumbs/' : ''}${filename}`;
		return `assets/img/${filename}`;
	}

	// ── View mode ──────────────────────────────────────────────────────────────

	toggleViewMode() {
		this.viewMode.update(v => v === 'grid' ? 'masonry' : 'grid');
	}

	// ── Share ──────────────────────────────────────────────────────────────────

	shareWhatsApp(img: GalleryImage) {
		const text = encodeURIComponent(`¡Mira este trabajo de CryoTech! ${img.title} - ${img.location}`);
		window.open(`https://wa.me/?text=${text}`, '_blank');
	}
}
