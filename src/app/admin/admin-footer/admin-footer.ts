import { Component } from '@angular/core';
import { FooterDataService } from '../../services/footer-data.service';

@Component({
  selector: 'admin-footer',
  templateUrl: './admin-footer.html',
  styleUrl: './admin-footer.scss',
})
export class AdminFooterComponent {
  data = this.footerData.getData();
  constructor(private footerData: FooterDataService) {}

  updateField(field: string, value: string) {
    this.footerData.setData({ [field]: value });
    this.data = this.footerData.getData();
  }
}
