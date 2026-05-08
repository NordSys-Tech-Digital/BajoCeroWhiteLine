import { Component, signal } from '@angular/core';
import { GalleryService } from '../../services/gallery.service';
import { GalleryImage, GalleryCategory, GALLERY_CATEGORIES } from '../../models/gallery.models';

@Component({
  selector: 'admin-gallery',
  templateUrl: './admin-gallery.html',
  styleUrl: './admin-gallery.scss',
})
export class AdminGalleryComponent {
  readonly categories = GALLERY_CATEGORIES;
  images = signal<GalleryImage[]>([]);
  uploading = signal(false);
  error = signal<string | null>(null);
  selectedFiles: FileList | null = null;

  constructor(private galleryService: GalleryService) {
    this.images.set(this.galleryService.getImages());
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFiles = input.files;
  }

  async uploadImages() {
    if (!this.selectedFiles || this.selectedFiles.length === 0) return;
    this.uploading.set(true);
    this.error.set(null);
    const formData = new FormData();
    Array.from(this.selectedFiles).forEach(file => formData.append('files', file));
    try {
      const response = await fetch('https://api-nutriapp.fly.dev/api/v1/upload/files', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.codigo === 0 && Array.isArray(data.rutas)) {
        data.rutas.forEach((img: any) => {
          const galleryImg: GalleryImage = {
            filename: img.filename,
            title: img.originalname,
            category: 'todos', // El admin puede editar luego
            description: '',
            location: '',
            date: new Date().toLocaleDateString('es-CO')
          };
          this.galleryService.addImage(galleryImg);
        });
        this.images.set(this.galleryService.getImages());
      } else {
        this.error.set('Error al subir imágenes');
      }
    } catch (e) {
      this.error.set('Error de red o servidor');
    } finally {
      this.uploading.set(false);
    }
  }

  removeImage(filename: string) {
    this.galleryService.removeImage(filename);
    this.images.set(this.galleryService.getImages());
  }
}
