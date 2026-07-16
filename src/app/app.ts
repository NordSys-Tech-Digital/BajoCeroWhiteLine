import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth';
import { SiteDataService } from './services/site-data';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	template: `<router-outlet></router-outlet>`,
})
export class App implements OnInit {
	private auth = inject(AuthService);
	private siteData = inject(SiteDataService);

	ngOnInit() {
		this.auth.checkSession();
		this.siteData.loadAll();
	}
}
