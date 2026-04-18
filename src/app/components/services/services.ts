import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [NgClass],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class ServicesComponent {
  activeIndex = 0;

  services = [
    { icon: '❄️', color: 'blue',  title: 'Mantenimiento aire acondicionado', desc: 'Limpieza de filtros, revisión de gas refrigerante, inspección eléctrica y calibración para máxima eficiencia.', items: ['Limpieza profunda de filtros', 'Revisión de gas refrigerante', 'Inspección de componentes', 'Prueba de funcionamiento'] },
    { icon: '🔧', color: 'teal',  title: 'Reparación aire acondicionado', desc: 'Diagnóstico profesional y solución de fallas en equipos split, centralizados y portátiles de todas las marcas.', items: ['Diagnóstico sin costo', 'Cambio de compresor', 'Reparación de fugas', 'Recarga de refrigerante'] },
    { icon: '⚡', color: 'amber', title: 'Instalación', desc: 'Instalación segura y eficiente de aires split, minisplit y sistemas centralizados con acabados profesionales.', items: ['Instalación split y mini-split', 'Canalización eléctrica', 'Tuberías de drenaje', 'Pruebas de presión'] },
    { icon: '🧊', color: 'ice',   title: 'Neveras y refrigeración', desc: 'Servicio técnico para neveras residenciales y comerciales, cámaras frías y equipos de refrigeración industrial.', items: ['Limpieza de condensador', 'Cambio de termostato', 'Reparación de compresor', 'Sellado de puertas'] },
    { icon: '💧', color: 'blue',  title: 'Calentadores de agua', desc: 'Mantenimiento y reparación de calentadores eléctricos y a gas de todas las marcas y capacidades.', items: ['Revisión de resistencias', 'Limpieza de tanque', 'Cambio de válvulas', 'Ajuste de termostato'] },
    { icon: '🫧', color: 'teal',  title: 'Lavadoras y secadoras', desc: 'Reparación especializada en lavadoras de carga frontal y superior, Samsung, LG, Mabe, Whirlpool y más.', items: ['Diagnóstico electrónico', 'Cambio de rodamientos', 'Reparación de bomba', 'Mantenimiento general'] },
  ];

  setActive(i: number) { this.activeIndex = i; }

  getClasses(i: number, color: string): Record<string, boolean> {
    return { active: this.activeIndex === i, [color]: true };
  }
}
