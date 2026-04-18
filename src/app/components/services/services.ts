import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { SiteDataService } from '../../services/site-data';

@Component({
  selector: 'app-services',
  imports: [NgClass],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class ServicesComponent {
  siteData = inject(SiteDataService);
  activeIndex = 0;
  get services() { return this.siteData.activeServices(); }
  setActive(i: number) { this.activeIndex = i; }
  getClasses(i: number, color: string): Record<string, boolean> {
    return { active: this.activeIndex === i, [color]: true };
  }
}
