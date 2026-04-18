import { Component, inject } from '@angular/core';
import { SiteDataService } from '../../services/site-data';

@Component({
  selector: 'app-process',
  templateUrl: './process.html',
  styleUrl: './process.scss'
})
export class ProcessComponent {
  siteData = inject(SiteDataService);
  get steps() { return this.siteData.data().steps; }
}
