import { Component, OnInit } from '@angular/core';
import { FooterDataService } from '../../services/footer-data.service';
import { SiteDataService } from '../../services/site-data';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.html',
	styleUrls: ['./footer.scss']
})
export class FooterComponent implements OnInit {
	data = this.footerData.getData();
	contact = this.siteData.data().contact;
	year = new Date().getFullYear();

	constructor(
		private footerData: FooterDataService,
		private siteData: SiteDataService
	) { }

	ngOnInit(): void {}

	get links() { return this.data.links; }
}
