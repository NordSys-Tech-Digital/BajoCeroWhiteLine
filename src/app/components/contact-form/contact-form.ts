import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { SiteDataService } from '../../services/site-data';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss'
})
export class ContactFormComponent {
  private fb = inject(FormBuilder);
  private siteData = inject(SiteDataService);

  submitted = signal(false);
  sending = signal(false);

  get services() { return this.siteData.activeServices(); }

  form = this.fb.group({
    name:    ['', [Validators.required, Validators.minLength(2)]],
    phone:   ['', [Validators.required, Validators.pattern(/^[0-9\s\+\-]{7,15}$/)]],
    email:   ['', [Validators.email]],
    service: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  isInvalid(field: string) {
    const c = this.form.get(field);
    return c?.invalid && (c?.dirty || c?.touched);
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.sending.set(true);
    setTimeout(() => {
      const v = this.form.value;
      this.siteData.addMessage({
        name: v.name!, phone: v.phone!, email: v.email || '',
        service: v.service!, message: v.message!
      });
      this.sending.set(false);
      this.submitted.set(true);
      this.form.reset();
    }, 1200);
  }

  reset() { this.submitted.set(false); }
}
