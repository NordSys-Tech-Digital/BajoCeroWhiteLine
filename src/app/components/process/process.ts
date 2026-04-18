import { Component } from '@angular/core';

@Component({
  selector: 'app-process',
  standalone: true,
  templateUrl: './process.html',
  styleUrl: './process.scss'
})
export class ProcessComponent {
  steps = [
    {
      num: '01',
      icon: '📞',
      title: 'Solicita el servicio',
      desc: 'Contáctanos por WhatsApp, teléfono o formulario online. Te respondemos en minutos.',
    },
    {
      num: '02',
      icon: '🔍',
      title: 'Diagnóstico gratuito',
      desc: 'Nuestro técnico visita tu hogar o empresa y evalúa el equipo sin costo adicional.',
    },
    {
      num: '03',
      icon: '📋',
      title: 'Cotización clara',
      desc: 'Recibes una cotización detallada y transparente. Sin sorpresas ni costos ocultos.',
    },
    {
      num: '04',
      icon: '✅',
      title: 'Solución garantizada',
      desc: 'Ejecutamos el servicio con garantía escrita. Tu satisfacción es nuestra prioridad.',
    },
  ];
}
