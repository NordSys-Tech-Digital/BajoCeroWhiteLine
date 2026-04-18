import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly contactPhone = '+57 318 469 5060';
  readonly whatsappLink =
    'https://api.whatsapp.com/send?phone=573184695060&text=Hola,%20quiero%20cotizar%20un%20servicio%20de%20aire%20acondicionado';

  readonly featuredServices = [
    {
      title: 'Instalacion profesional',
      description:
        'Montaje seguro para hogar y empresa con verificacion de presion, consumo y rendimiento termico.',
      badge: 'Desde 4 horas',
      icon: '01'
    },
    {
      title: 'Mantenimiento preventivo',
      description:
        'Limpieza profunda de unidad interna y externa, ajuste electrico y checklist tecnico para mayor vida util.',
      badge: 'Plan semestral',
      icon: '02'
    },
    {
      title: 'Reparacion especializada',
      description:
        'Diagnostico y solucion de fallas en compresor, tarjeta, fuga de gas, sensores y drenajes.',
      badge: 'Atencion prioritaria',
      icon: '03'
    }
  ];

  readonly coverage = [
    'Atencion residencial y corporativa',
    'Tecnicos certificados y uniformados',
    'Visitas programadas o urgentes',
    'Soporte por WhatsApp en minutos'
  ];

  readonly stats = [
    { value: '8+', label: 'Anios de experiencia' },
    { value: '5.200+', label: 'Servicios ejecutados' },
    { value: '97%', label: 'Clientes recurrentes' }
  ];

  readonly testimonials = [
    {
      quote:
        'Nos apoyan en mantenimiento mensual de oficinas y siempre responden rapido. El rendimiento del sistema mejoro notablemente.',
      author: 'Lina M.',
      role: 'Administracion, Torre Empresarial'
    },
    {
      quote:
        'Excelente instalacion, trabajo limpio y puntual. Nos explicaron el uso ideal para ahorrar energia.',
      author: 'Carlos R.',
      role: 'Propietario residencial'
    }
  ];
}
