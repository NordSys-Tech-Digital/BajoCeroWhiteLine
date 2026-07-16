import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { GalleryImage } from '../../models/gallery.models';

// ── Función mapeadora (igual que toService en tu ejemplo) ─────────────────────
function toGalleryImage(r: any): GalleryImage {
	return {
		filename: r.filename ?? '',
		title: r.title ?? r.originalname ?? 'Sin título',
		category: r.category ?? 'todos',
		description: r.description ?? '',
		location: r.location ?? '',
		date: r.createdAt
			? new Date(r.createdAt).toLocaleDateString('es-CO')
			: new Date().toLocaleDateString('es-CO'),
	};
}

@Component({
	selector: 'app-admin-gallery',
	// imports: [ /* Agrega aquí los módulos que necesites si es standalone */ ],
	templateUrl: './admin-gallery.html',
	styleUrls: ['./admin-gallery.scss'],
})
export class AdminGalleryComponent implements OnInit {
	private api = inject(ApiService);
	private http = inject(HttpClient); // Usado específicamente para FormData

	// ── Estado con Signals ──────────────────────────────────────────────────────
	images = signal<GalleryImage[]>([]);
	uploading = signal(false);
	loading = signal(false);
	error = signal<string | null>(null);

	selectedFiles: FileList | null = null;

	// ── Ciclo de vida ───────────────────────────────────────────────────────────
	ngOnInit() {
		this.load();
	}

	// ── Carga de datos ──────────────────────────────────────────────────────────
	load() {
		this.loading.set(true);
		this.error.set(null);

		// Asumimos que ApiService ya tiene configurado el basePath: 'http://localhost:4000/api/v1/bajo-cero/'
		this.api.get<any[]>('gallery').subscribe({
			next: (raw) => {
				this.images.set(raw.map(toGalleryImage));
				this.loading.set(false);
			},
			error: () => {
				this.error.set('Error al cargar la galería desde el servidor');
				this.loading.set(false);
			},
		});
	}

	// ── Manejo de archivos ──────────────────────────────────────────────────────
	onFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		this.selectedFiles = input.files;
	}

	uploadImages() {
		if (!this.selectedFiles || this.selectedFiles.length === 0) return;

		this.uploading.set(true);
		this.error.set(null);

		const formData = new FormData();
		Array.from(this.selectedFiles).forEach(file => formData.append('files', file));

		// Usamos HttpClient directo para evitar conflictos de headers JSON en ApiService
		this.http.post<any>('http://localhost:4000/api/v1/bajo-cero/gallery/files', formData).subscribe({
			next: () => {
				this.load(); // Recargamos desde el backend para asegurar consistencia
				this.selectedFiles = null;

				// Limpiar el input file visualmente
				const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
				if (fileInput) fileInput.value = '';
			},
			error: () => {
				this.error.set('Error al subir las imágenes. Inténtalo de nuevo.');
				this.uploading.set(false);
			},
			complete: () => {
				this.uploading.set(false);
			}
		});
	}

	// ── Eliminar ────────────────────────────────────────────────────────────────
	deleteImage(id: string) {
		if (!confirm('¿Estás seguro de que deseas eliminar esta imagen?')) return;

		this.api.delete(`gallery/${id}`).subscribe({
			next: () => {
				// Actualización optimista de la UI
				this.images.update(list => list.filter(img => img.filename !== id));
			},
			error: () => {
				this.error.set('Error al eliminar la imagen del servidor');
			}
		});
	}
}
