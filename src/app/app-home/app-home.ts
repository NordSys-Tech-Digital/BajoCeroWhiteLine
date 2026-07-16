import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar';
import { HeroComponent } from '../components/hero/hero';
import { ServicesComponent } from '../components/services/services';
import { ProcessComponent } from '../components/process/process';
import { ContactFormComponent } from '../components/contact-form/contact-form';
import { CtaComponent } from '../components/cta/cta';
import { FooterComponent } from '../components/footer/footer';
import { CarouselComponent } from '../components/carousel/carousel';
import { SiteDataService } from '../services/site-data';

@Component({
	selector: 'app-home',
	imports: [
		NavbarComponent, HeroComponent, ServicesComponent, ProcessComponent,
		ContactFormComponent, CtaComponent, FooterComponent, CarouselComponent
	],
	template: `
    <app-navbar></app-navbar>
    <main>
      <app-hero></app-hero>
      <app-services></app-services>
      <app-process></app-process>
      <app-carousel
        [autoplayInterval]="6000"
        [showThumbnails]="true"
        [showCaptions]="true">
      </app-carousel>
      <app-contact-form></app-contact-form>
      <app-cta></app-cta>
    </main>
    <app-footer></app-footer>
  `,
	styles: [`main { overflow: hidden; }`]
})
export class AppHomeComponent implements OnInit {
	private siteData = inject(SiteDataService);
	private hasLoaded = false;

	ngOnInit() {
		if (!this.hasLoaded) {
			this.siteData.loadAll();
			this.hasLoaded = true;
		}
	}
}
