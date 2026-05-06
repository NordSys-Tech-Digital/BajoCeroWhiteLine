import { GALLERY_IMAGES } from '../../models/gallery-images';

export class GalleryComponent {
  images = GALLERY_IMAGES.map(img => `assets/img/${img}`);
}
