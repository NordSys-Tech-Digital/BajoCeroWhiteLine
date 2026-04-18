export interface Service {
  id: string;
  icon: string;
  color: string;
  title: string;
  desc: string;
  items: string[];
  active: boolean;
}

export interface ProcessStep {
  id: string;
  num: string;
  icon: string;
  title: string;
  desc: string;
}

export interface HeroData {
  badge: string;
  headline: string;
  headlineHighlight: string;
  subtext: string;
  stats: { value: string; label: string }[];
}

export interface ContactInfo {
  whatsapp: string;
  phone: string;
  email: string;
  city: string;
  schedule: string;
}

export interface SiteData {
  hero: HeroData;
  services: Service[];
  steps: ProcessStep[];
  contact: ContactInfo;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  date: string;
  read: boolean;
}
