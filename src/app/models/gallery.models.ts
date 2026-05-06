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
  { filename: 'aire-01.jpg', title: 'Instalación split Samsung 12k',  category: 'aires',         location: 'Apto. Laureles',   date: '2024-10' },
  { filename: 'aire-02.jpg', title: 'Mini-split LG Inverter',         category: 'aires',         location: 'Oficina Poblado',  date: '2024-09' },
  { filename: 'aire-03.jpg', title: 'Sistema central Carrier',        category: 'aires',         location: 'Hotel Bocagrande', date: '2024-08' },
  { filename: 'inst-01.jpg', title: 'Canalización y tuberías',        category: 'instalacion',   location: 'Edificio Envigado', date: '2024-10' },
  { filename: 'inst-02.jpg', title: 'Instalación York 18k BTU',       category: 'instalacion',   location: 'Consultorio Norte', date: '2024-09' },
  { filename: 'inst-03.jpg', title: 'Montaje de unidad exterior',     category: 'instalacion',   location: 'Torre Empresarial', date: '2024-07' },
  { filename: 'mant-01.jpg', title: 'Limpieza profunda de filtros',   category: 'mantenimiento', location: 'Res. El Poblado',   date: '2024-10' },
  { filename: 'mant-02.jpg', title: 'Revisión de compresor',          category: 'mantenimiento', location: 'Clínica Laureles',  date: '2024-09' },
  { filename: 'mant-03.jpg', title: 'Recarga de gas refrigerante',    category: 'mantenimiento', location: 'Restaurante Centro', date: '2024-08' },
  { filename: 'mant-04.jpg', title: 'Mantenimiento preventivo',       category: 'mantenimiento', location: 'Oficinas Unicentro', date: '2024-07' },
  { filename: 'ref-01.jpg',  title: 'Reparación nevera industrial',   category: 'refrigeracion', location: 'Carnicería Belén',  date: '2024-10' },
  { filename: 'ref-02.jpg',  title: 'Cámara fría supermercado',       category: 'refrigeracion', location: 'Supertienda Norte', date: '2024-09' },
  { filename: 'ref-03.jpg',  title: 'Conservador de helados',         category: 'refrigeracion', location: 'Heladería Palermo', date: '2024-08' },
  { filename: 'lav-01.jpg',  title: 'Reparación lavadora LG front',   category: 'lavadoras',     location: 'Apt. Envigado',     date: '2024-10' },
  { filename: 'lav-02.jpg',  title: 'Mantenimiento Samsung WF',       category: 'lavadoras',     location: 'Casa Sabaneta',     date: '2024-09' },
  { filename: 'lav-03.jpg',  title: 'Cambio de rodamiento Mabe',      category: 'lavadoras',     location: 'Apt. Itagüí',       date: '2024-08' },
];
