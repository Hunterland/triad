import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <main class="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <header
        class="mx-auto flex max-w-5xl flex-wrap items-center
               justify-between gap-4 border-b border-slate-800 pb-6"
      >
        <div>
          <h1 class="text-2xl font-bold tracking-wide">TRIAD</h1>

          <p class="mt-1 text-sm text-slate-400">
            Painel de Gestão de Eventos
          </p>
        </div>

        <div class="flex items-center gap-4">
          @if (auth.currentUser(); as user) {
            <span class="text-sm text-slate-300">
              {{ user.displayName || user.email }}
            </span>
          }

          <p-button
            label="Sair"
            icon="pi pi-sign-out"
            severity="secondary"
            [outlined]="true"
            (onClick)="auth.logout()"
          />
        </div>
      </header>

      <section
        class="mx-auto mt-8 max-w-5xl rounded-2xl border
               border-slate-800 bg-slate-900 p-8"
      >
        <h2 class="text-xl font-semibold">Dashboard</h2>

        <p class="mt-3 text-slate-300">
          Login realizado com sucesso.
        </p>

        @if (auth.currentUser()) {
          <p class="mt-2 text-sm text-slate-400">
            Dados do usuário carregados na sessão.
          </p>
        } @else {
          <p class="mt-2 text-sm text-amber-400">
            Os dados do usuário não estão disponíveis.
            Precisamos conferir a resposta do login.
          </p>
        }
      </section>
    </main>
  `,
})
export class DashboardComponent {
  readonly auth = inject(AuthService);
}
