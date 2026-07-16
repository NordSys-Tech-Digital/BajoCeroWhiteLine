export interface Service {
	id: string;
	icon: string;
	color: string;
	title: string;
	desc: string;
	items: string[];
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface ProcessStep {
	id: string;
	num: string;
	icon: string;
	title: string;
	desc: string;
}
export interface HeroStat {
	label: string;
	value: string;
}

export interface HeroData {
	id: string;
	badge: string;
	headline: string;
	headlineHighlight: string;
	subtext: string;
	stats: HeroStat[];
	active?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface ContactInfo {
	id: string; // Necesario para el PUT
	whatsapp: string;
	phone: string;
	email: string;
	city: string;
	schedule: string;
}

export interface SiteData {
	hero: HeroData;
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
