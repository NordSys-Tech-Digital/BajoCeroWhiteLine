import {
	Component,
	OnInit,
	OnDestroy,
	signal,
	computed,
	HostListener,
	inject,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import {
	GalleryImage,
	GalleryCategory,
	GALLERY_CATEGORIES,
} from '../../models/gallery.models';

const API = environment.apiUrl;

@Component({
	selector: 'app-gallery',
	imports: [NgClass, RouterLink],
	templateUrl: './gallery.html',
	styleUrl: './gallery.scss',
})
export class GalleryComponent implements OnInit, OnDestroy {
	private http = inject(HttpClient);

	readonly categories = GALLERY_CATEGORIES;

	activeCategory = signal<GalleryCategory>('todos');
	searchQuery = signal('');
	lightboxIndex = signal<number | null>(null);
	isLoaded = signal(false);
	viewMode = signal<'grid' | 'masonry'>('grid');

	// Imágenes cargadas desde la API
	private _images = signal<GalleryImage[]>([]);

	filtered = computed(() => {
		const cat = this.activeCategory();
		const q = this.searchQuery().toLowerCase().trim();

		return this._images().filter(img => {
			const matchCat = cat === 'todos' || img.category === cat;
			const matchQ = !q ||
				img.title.toLowerCase().includes(q) ||
				(img.location?.toLowerCase().includes(q) ?? false);
			return matchCat && matchQ;
		});
	});

	lightboxImage = computed(() => {
		const idx = this.lightboxIndex();
		return idx !== null ? (this.filtered()[idx] ?? null) : null;
	});

	countFor(cat: GalleryCategory): number {
		if (cat === 'todos') return this._images().length;
		return this._images().filter(i => i.category === cat).length;
	}

	ngOnInit() {
		this.loadGallery();
		setTimeout(() => this.isLoaded.set(true), 80);
	}

	ngOnDestroy() { this.closeLightbox(); }

	// ── Carga desde API ────────────────────────────────────────────────────────
	// GET /gallery

	loadGallery() {
		this.http.get<any[]>(`${API}/gallery`).pipe(
			catchError(() => of([]))
		).subscribe(raw => {
			this._images.set(raw.map(r => ({
				id: r.id ?? r._id ?? '',
				// La API devuelve la URL completa o solo el filename
				filename: r.url ?? r.filename ?? r.file ?? '',
				title: r.title ?? r.filename ?? '',
				category: r.category ?? 'todos',
				location: r.location ?? '',
				date: r.date ?? '',
			})));
		});
	}

	// ── Subida de imagen ───────────────────────────────────────────────────────
	// POST /gallery/files   multipart/form-data, campo: "files"

	uploadImage(file: File, meta: { title: string; category: string; location?: string; date?: string }) {
		const formData = new FormData();
		formData.append('files', file);                // campo exacto que espera la API
		// Si la API acepta metadata junto al archivo, la agregamos
		Object.entries(meta).forEach(([k, v]) => { if (v) formData.append(k, v); });

		return this.http.post<any>(`${API}/gallery/files`, formData).pipe(
			catchError(err => { console.error('uploadImage', err); return of(null); })
		);
	}

	// ── Eliminar imagen ────────────────────────────────────────────────────────
	// DELETE /gallery/:id

	deleteImage(id: string) {
		return this.http.delete<any>(`${API}/gallery/${id}`).pipe(
			catchError(err => { console.error('deleteImage', err); return of(null); })
		);
	}

	// ── Filtros ────────────────────────────────────────────────────────────────

	setCategory(cat: GalleryCategory) {
		this.activeCategory.set(cat);
		this.lightboxIndex.set(null);
	}

	onSearch(event: Event) {
		this.searchQuery.set((event.target as HTMLInputElement).value);
	}

	clearSearch() { this.searchQuery.set(''); }

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
		this.lightboxIndex.set((idx - 1 + this.filtered().length) % this.filtered().length);
	}

	@HostListener('document:keydown', ['$event'])
	onKey(e: KeyboardEvent) {
		if (this.lightboxIndex() === null) return;
		if (e.key === 'Escape') this.closeLightbox();
		if (e.key === 'ArrowRight') this.lightboxNext();
		if (e.key === 'ArrowLeft') this.lightboxPrev();
	}

	toggleViewMode() {
		this.viewMode.update(v => v === 'grid' ? 'masonry' : 'grid');
	}

	imgSrc(filename: string): string {
		// Si ya viene como URL completa la devolvemos tal cual
		if (filename.startsWith('http')) return filename;
		return `${API}/gallery/files/${filename}`;
	}

	shareWhatsApp(img: GalleryImage) {
		const text = encodeURIComponent(`¡Mira este trabajo de CryoTech! ${img.title}${img.location ? ' - ' + img.location : ''}`);
		window.open(`https://wa.me/?text=${text}`, '_blank');
	}
}
