import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar';
import { HeroComponent } from './components/hero/hero';
import { ServicesComponent } from './components/services/services';
import { ProcessComponent } from './components/process/process';
import { CtaComponent } from './components/cta/cta';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, HeroComponent, ServicesComponent, ProcessComponent, CtaComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main>
      <app-hero></app-hero>
      <app-services></app-services>
      <app-process></app-process>
      <app-cta></app-cta>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`main { overflow: hidden; }`]
})
export class App {}
