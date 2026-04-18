import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SiteDataService } from '../../services/site-data';

@Component({
  selector: 'app-admin-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-contact.html',
  styleUrl: './admin-contact.scss'
})
export class AdminContactComponent implements OnInit {
  private siteData = inject(SiteDataService);
  private fb = inject(FormBuilder);
  saved = false;

  form = this.fb.group({
    whatsapp: ['', Validators.required],
    phone:    ['', Validators.required],
    email:    ['', [Validators.required, Validators.email]],
    city:     ['', Validators.required],
    schedule: ['', Validators.required],
  });

  ngOnInit() { this.form.patchValue(this.siteData.data().contact); }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.siteData.updateContact(this.form.value as any);
    this.saved = true;
    setTimeout(() => this.saved = false, 2500);
  }
}
