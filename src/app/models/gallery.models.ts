export interface GalleryImage {
  filename: string;
  title: string;
  category: GalleryCategory;
  description?: string;
  location?: string;
  date?: string;
}

export type GalleryCategory =
  | 'todos'
  | 'aires'
  | 'instalacion'
  | 'mantenimiento'
  | 'refrigeracion'
  | 'lavadoras';

export const GALLERY_CATEGORIES: { id: GalleryCategory; label: string; icon: string }[] = [
  { id: 'todos',          label: 'Todos',           icon: '🔷' },
  { id: 'aires',          label: 'Aires acond.',     icon: '❄️' },
  { id: 'instalacion',    label: 'Instalación',      icon: '⚡' },
  { id: 'mantenimiento',  label: 'Mantenimiento',    icon: '🔧' },
  { id: 'refrigeracion',  label: 'Refrigeración',    icon: '🧊' },
  { id: 'lavadoras',      label: 'Lavadoras',        icon: '🫧' },
];

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    filename: 'gallery-1.jpg',
    title: 'Compresor y serpentín de nevera',
    category: 'refrigeracion',
    description: 'Vista interna de la parte trasera de un refrigerador, mostrando el compresor y el serpentín cubiertos de polvo. Ideal para ilustrar la importancia del mantenimiento preventivo en sistemas de refrigeración.',
    location: 'Carnicería Belén',
    date: '2024-10'
  },
  {
    filename: 'gallery-2.jpg',
    title: 'Serpentín y ventilador de nevera',
    category: 'refrigeracion',
    description: 'Acercamiento al serpentín y ventilador de un refrigerador, evidenciando acumulación de suciedad. Útil para destacar la limpieza profunda de componentes internos.',
    location: 'Supertienda Norte',
    date: '2024-09'
  },
  {
    filename: 'gallery-3.jpg',
    title: 'Panel superior lavadora Whirlpool',
    category: 'lavadoras',
    description: 'Panel superior de una lavadora Whirlpool de carga superior, mostrando el display digital y controles. Perfecta para mostrar equipos modernos y diagnósticos electrónicos.',
    location: 'Apt. Envigado',
    date: '2024-08'
  },
  {
    filename: 'gallery-4.jpg',
    title: 'Unidad interior aire acondicionado central',
    category: 'aires',
    description: 'Unidad interior de un sistema de aire acondicionado central, con tuberías y válvulas expuestas. Excelente para resaltar instalaciones y revisiones técnicas de aires acondicionados industriales.',
    location: 'Hotel Bocagrande',
    date: '2024-10'
  },
  {
    filename: 'gallery-5.jpg',
    title: 'Limpieza de tambor de lavadora',
    category: 'lavadoras',
    description: 'Técnico lavando el tambor de una lavadora, enfatizando el proceso de limpieza y mantenimiento. Ideal para campañas de limpieza profunda de lavadoras.',
    location: 'Casa Sabaneta',
    date: '2024-09'
  },
  {
    filename: 'gallery-6.jpg',
    title: 'Técnico especialista en refrigeración',
    category: 'refrigeracion',
    description: 'Imagen promocional de un técnico revisando un refrigerador, con el texto “Técnicos Especialistas”. Perfecta para transmitir confianza y profesionalismo.',
    location: 'Oficina Poblado',
    date: '2024-07'
  },
  {
    filename: 'gallery-7.jpg',
    title: 'Interior de secadora abierta',
    category: 'mantenimiento',
    description: 'Interior de una secadora abierta, mostrando el ventilador y conductos de aire. Útil para explicar el mantenimiento y reparación de secadoras.',
    location: 'Res. El Poblado',
    date: '2024-10'
  },
  {
    filename: 'gallery-8.jpg',
    title: 'Limpieza manual de tambor',
    category: 'lavadoras',
    description: 'Mano limpiando el interior del tambor de una lavadora con una esponja. Resalta el detalle y dedicación en el servicio de limpieza.',
    location: 'Clínica Laureles',
    date: '2024-09'
  },
  {
    filename: 'gallery-9.jpg',
    title: 'Tambor de lavadora sucio',
    category: 'lavadoras',
    description: 'Tambor de lavadora con acumulación de suciedad, señalando la necesidad de mantenimiento. Ideal para mostrar el “antes” de una limpieza profesional.',
    location: 'Restaurante Centro',
    date: '2024-08'
  },
  {
    filename: 'gallery-10.jpg',
    title: 'Serpentín limpio de nevera',
    category: 'refrigeracion',
    description: 'Acercamiento al serpentín de un refrigerador, después de limpieza, mostrando el resultado del servicio.',
    location: 'Oficinas Unicentro',
    date: '2024-07'
  },
  {
    filename: 'gallery-11.jpg',
    title: 'Lavadora desarmada para mantenimiento',
    category: 'lavadoras',
    description: 'Lavadora desarmada, con el tambor externo retirado, lista para mantenimiento. Muestra el proceso técnico de desmontaje.',
    location: 'Apto. Laureles',
    date: '2024-10'
  },
  {
    filename: 'gallery-12.jpg',
    title: 'Tambor de lavadora sucio',
    category: 'lavadoras',
    description: 'Mano sosteniendo el tambor de lavadora, mostrando el estado de suciedad previo a la limpieza.',
    location: 'Consultorio Norte',
    date: '2024-09'
  },
  {
    filename: 'gallery-13.jpg',
    title: 'Tambor de lavadora limpio',
    category: 'lavadoras',
    description: 'Tambor de lavadora completamente limpio y brillante, ideal para mostrar el “después” de una limpieza profesional.',
    location: 'Heladería Palermo',
    date: '2024-08'
  },
  {
    filename: 'gallery-14.jpg',
    title: 'Tambor de lavadora con suciedad',
    category: 'lavadoras',
    description: 'Tambor de lavadora con suciedad, enfatizando el contraste con el resultado final tras el servicio.',
    location: 'Apt. Itagüí',
    date: '2024-10'
  },
  {
    filename: 'gallery-15.jpg',
    title: 'Unidad de refrigeración industrial',
    category: 'refrigeracion',
    description: 'Unidad de refrigeración industrial sobre una mesa de trabajo, con manómetros conectados. Perfecta para ilustrar servicios de reparación y recarga de gas.',
    location: 'Torre Empresarial',
    date: '2024-09'
  },
  {
    filename: 'gallery-16.jpg',
    title: 'Tambor de lavadora recién lavado',
    category: 'lavadoras',
    description: 'Tambor de lavadora recién lavado, listo para ser reinstalado. Refuerza la calidad del servicio de limpieza.',
    location: 'Edificio Envigado',
    date: '2024-08'
  },
];
