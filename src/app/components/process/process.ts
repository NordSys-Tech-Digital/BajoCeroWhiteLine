import { Component, inject, computed } from '@angular/core';
import { SiteDataService } from '../../services/site-data';

@Component({
  selector: 'app-process',
  templateUrl: './process.html',
  styleUrl: './process.scss'
})
export class ProcessComponent {
  private siteData = inject(SiteDataService);

  // ✅ Usamos computed para reactividad total y consistencia con el template
  readonly steps = computed(() => this.siteData.data().steps);
}
