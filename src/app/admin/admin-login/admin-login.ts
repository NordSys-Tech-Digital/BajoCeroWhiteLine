import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { SiteDataService } from '../../services/site-data';

@Component({
	selector: 'app-admin-login',
	imports: [ReactiveFormsModule],
	templateUrl: './admin-login.html',
	styleUrls: ['./admin-login.scss'],
})
export class AdminLoginComponent implements OnInit {
	auth = inject(AuthService);
	private fb = inject(FormBuilder);

	activeTab = signal<'services' | 'hero' | 'process' | 'contact' | 'messages' | 'gallery' | 'footer'>('services');
	loginError = signal('');
	logging = signal(false);

	loginForm = this.fb.group({
		user: ['', Validators.required],
		pass: ['', Validators.required],
	});

	ngOnInit() { this.auth.checkSession(); }

	login() {
		if (this.loginForm.invalid) return;
		const { user, pass } = this.loginForm.value;
		this.loginError.set('');
		this.logging.set(true);

		this.auth.login(user!, pass!).subscribe(res => {
			this.logging.set(false);
			if (!res) this.loginError.set('Usuario o contraseña incorrectos');
		});
	}

	logout() { this.auth.logout(); }

	setTab(t: typeof this.activeTab extends { set(v: infer T): void } ? T : never) {
		this.activeTab.set(t);
	}
}
