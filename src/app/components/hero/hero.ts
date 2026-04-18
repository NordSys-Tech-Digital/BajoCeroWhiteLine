import { Component, inject } from '@angular/core';
import { SiteDataService } from '../../services/site-data';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class HeroComponent {
  siteData = inject(SiteDataService);
  hero = this.siteData.data().hero;

  get stats() { return this.siteData.data().hero.stats; }
}
