import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { finalize } from 'rxjs';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ButtonModule, CardModule, InputTextModule, PasswordModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast />

    @if (transitioning()) {
      <div class="login-transition" role="status" aria-live="polite">
        <div class="transition-content">
          <h1>TRIAD</h1>

          <span class="transition-spinner" aria-hidden="true"></span>

          <p>Acessando o painel...</p>
          <span class="transition-subtitle"> Preparando seu ambiente de trabalho </span>
        </div>
      </div>
    } @else {
      <div class="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <p-card header="TRIAD" class="w-full max-w-md">
          <form class="space-y-5" (ngSubmit)="onSubmit()">
            <div class="space-y-2">
              <label for="email" class="block text-sm text-slate-300"> E-mail </label>

              <input
                pInputText
                id="email"
                type="email"
                class="w-full"
                [(ngModel)]="email"
                name="email"
                autocomplete="username"
                required
              />
            </div>

            <div class="space-y-2">
              <label for="password" class="block text-sm text-slate-300"> Senha </label>

              <p-password
                inputId="password"
                [(ngModel)]="password"
                name="password"
                autocomplete="current-password"
                [feedback]="false"
                [toggleMask]="true"
                [fluid]="true"
              />
            </div>

            <p-button
              type="submit"
              label="Entrar"
              [loading]="loading()"
              [disabled]="loading() || transitioning()"
              styleClass="w-full"
            />
          </form>
        </p-card>
      </div>
    }
  `,
  styles: `
    .login-transition {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: grid;
      place-items: center;
      min-height: 100vh;
      background: #020617;
      color: #fff;
      animation: transition-fade-in 250ms ease-out;
    }

    .transition-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 2rem;
      text-align: center;
    }

    .transition-content h1 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: 0.2em;
    }

    .transition-spinner {
      width: 2.5rem;
      height: 2.5rem;
      border: 3px solid #334155;
      border-top-color: #818cf8;
      border-radius: 50%;
      animation: transition-spin 700ms linear infinite;
    }

    .transition-content p {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
    }

    .transition-subtitle {
      color: #94a3b8;
      font-size: 0.875rem;
    }

    @keyframes transition-spin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes transition-fade-in {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .transition-spinner {
        animation-duration: 1.5s;
      }

      .login-transition {
        animation: none;
      }
    }
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  email = '';
  password = '';

  readonly loading = signal(false);
  readonly transitioning = signal(false);

  onSubmit(): void {
    if (!this.email.trim() || !this.password || this.loading() || this.transitioning()) {
      return;
    }

    this.loading.set(true);

    this.auth
      .login(this.email.trim(), this.password)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.transitioning.set(true);

          setTimeout(() => {
            void this.router.navigate(['/admin/dashboard']).then((navigated) => {
              if (!navigated) {
                this.transitioning.set(false);
              }
            });
          }, 2500);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Falha no login',
            detail: error?.error?.message ?? 'Credenciais inválidas.',
          });
        },
      });
  }
}
