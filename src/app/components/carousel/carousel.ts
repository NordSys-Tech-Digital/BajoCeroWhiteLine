import { Component } from '@angular/core';
import { CAROUSEL_IMAGES } from '../../models/gallery-images';


@Component({
	selector: 'app-carousel',
	imports: [],
	templateUrl: './carousel.html',
	styleUrls: ['./carousel.scss'],
	standalone: true
})
export class CarouselComponent {
	images = CAROUSEL_IMAGES.map(img => `assets/img/${img}`);
	currentIndex = 0;

	next() {
		this.currentIndex = (this.currentIndex + 1) % this.images.length;
	}

	prev() {
		this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
	}
}
