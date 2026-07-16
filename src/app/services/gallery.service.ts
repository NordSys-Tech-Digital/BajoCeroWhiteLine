import { Injectable, signal } from '@angular/core';
import { GalleryImage, GalleryCategory } from '../models/gallery.models';

@Injectable({ providedIn: 'root' })
export class GalleryService {
	private images = signal<GalleryImage[]>([]);

	getImages() {
		return this.images();
	}

	setImages(images: GalleryImage[]) {
		this.images.set(images);
	}

	addImage(image: GalleryImage) {
		this.images.set([...this.images(), image]);
	}

	removeImage(filename: string) {
		this.images.set(this.images().filter(img => img.filename !== filename));
	}
}
