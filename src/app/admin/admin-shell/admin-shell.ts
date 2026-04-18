import { Component, inject, signal, OnInit } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminServicesComponent } from '../admin-services/admin-services';
import { AdminHeroComponent } from '../admin-hero/admin-hero';
import { AdminProcessComponent } from '../admin-process/admin-process';
import { AdminContactComponent } from '../admin-contact/admin-contact';
import { SiteDataService } from '../../services/site-data';

@Component({
  selector: 'app-admin-shell',
  imports: [NgClass, DatePipe, ReactiveFormsModule, AdminServicesComponent, AdminHeroComponent, AdminProcessComponent, AdminContactComponent],
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.scss'
})
export class AdminShellComponent implements OnInit {
  auth = inject(AuthService);
  siteData = inject(SiteDataService);
  private fb = inject(FormBuilder);

  activeTab = signal<'services' | 'hero' | 'process' | 'contact' | 'messages'>('services');
  loginError = signal('');

  loginForm = this.fb.group({
    user: ['', Validators.required],
    pass: ['', Validators.required]
  });

  ngOnInit() { this.auth.checkSession(); }

  login() {
    const { user, pass } = this.loginForm.value;
    if (!this.auth.login(user!, pass!)) {
      this.loginError.set('Usuario o contraseña incorrectos');
    }
  }

  logout() { this.auth.logout(); }

  tabs = [
    { id: 'services', label: 'Servicios', icon: '🔧' },
    { id: 'hero',     label: 'Hero',      icon: '🏠' },
    { id: 'process',  label: 'Proceso',   icon: '⚡' },
    { id: 'contact',  label: 'Contacto',  icon: '📞' },
    { id: 'messages', label: 'Mensajes',  icon: '💬' },
  ] as const;

  setTab(t: typeof this.activeTab extends { set(v: infer T): void } ? T : never) {
    this.activeTab.set(t);
  }

  get unread() { return this.siteData.unreadCount(); }
  get messages() { return this.siteData.messages(); }

  markRead(id: string) { this.siteData.markRead(id); }
  deleteMsg(id: string) { this.siteData.deleteMessage(id); }

  goToSite() { window.open('/', '_blank'); }
  resetData() {
    if (confirm('¿Restablecer todos los datos a los valores por defecto?')) {
      this.siteData.resetToDefaults();
    }
  }
}
