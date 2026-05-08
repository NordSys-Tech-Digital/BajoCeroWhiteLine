import { Component } from '@angular/core';
import { FooterDataService } from '../../services/footer-data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class FooterComponent {
  data = this.footerData.getData();
  year = new Date().getFullYear();
  constructor(private footerData: FooterDataService) {}
  get links() { return this.data.links; }
}
