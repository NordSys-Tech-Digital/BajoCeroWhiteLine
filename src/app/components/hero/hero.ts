import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class HeroComponent {
  stats = [
    { value: '+500', label: 'Clientes atendidos' },
    { value: '24/7', label: 'Disponibilidad' },
    { value: '8+', label: 'Años de experiencia' },
    { value: '100%', label: 'Garantía de servicio' },
  ];
}
