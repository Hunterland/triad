import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ButtonModule, CardModule, InputTextModule, PasswordModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast />

    <div class="flex min-h-screen items-center justify-center bg-slate-950">
      <p-card header="TRIAD" class="w-full max-w-md">
        <form class="space-y-5" (ngSubmit)="onSubmit()">
          <div class="space-y-2">
            <label class="block text-sm text-slate-300">E-mail</label>
            <input
              pInputText
              type="email"
              class="w-full"
              [(ngModel)]="email"
              name="email"
              required
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm text-slate-300">Senha</label>
            <p-password
              [(ngModel)]="password"
              name="password"
              [feedback]="false"
              [toggleMask]="true"
              class="w-full"
              inputStyleClass="w-full"
            />
          </div>

          <p-button type="submit" label="Entrar" [loading]="loading()" styleClass="w-full" />
        </form>
      </p-card>
    </div>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  email = '';
  password = '';
  loading = signal(false);

  onSubmit(): void {
    if (!this.email || !this.password) {
      return;
    }

    this.loading.set(true);

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        this.loading.set(false);

        this.messageService.add({
          severity: 'error',
          summary: 'Falha no login',
          detail: error?.error?.message ?? 'Credenciais inválidas.',
        });
      },
    });
  }
}
