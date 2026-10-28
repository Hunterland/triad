import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="layout-topbar">
      <div class="layout-topbar-logo-container">
        <button
          type="button"
          class="layout-menu-button layout-topbar-action"
          aria-label="Abrir ou fechar menu"
          (click)="menuToggle.emit()"
        >
          <i class="pi pi-bars"></i>
        </button>

        <span class="topbar-section-title">Área administrativa</span>
      </div>

      <div class="layout-topbar-actions">
        <div class="topbar-user">
          <span class="topbar-avatar">{{ userInitial }}</span>

          <div class="topbar-user-info">
            <span class="topbar-user-name">{{ userLabel }}</span>
            <small>Usuário autenticado</small>
          </div>
        </div>

        <p-button
          label="Sair"
          icon="pi pi-sign-out"
          severity="secondary"
          [outlined]="true"
          (onClick)="auth.logout()"
        />
      </div>
    </div>
  `,
  styles: `
    .topbar-section-title {
      font-size: 1rem;
      font-weight: 600;
    }

    .layout-topbar-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .topbar-user {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 0;
    }

    .topbar-avatar {
      display: grid;
      place-items: center;
      width: 2.5rem;
      height: 2.5rem;
      flex-shrink: 0;
      border-radius: 50%;
      background: var(--primary-color);
      color: var(--primary-contrast-color);
      font-weight: 700;
    }

    .topbar-user-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .topbar-user-name {
      max-width: 14rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .topbar-user-info small {
      font-size: 0.75rem;
      opacity: 0.7;
    }

    @media (max-width: 575px) {
      .topbar-section-title,
      .topbar-user-info {
        display: none;
      }

      .layout-topbar-actions {
        gap: 0.5rem;
      }
    }
  `,
})
export class AdminTopbarComponent {
  @Output() menuToggle = new EventEmitter<void>();

  readonly auth = inject(AuthService);

  get userLabel(): string {
    const user = this.auth.currentUser();
    return user?.displayName || user?.email || 'Usuário';
  }

  get userInitial(): string {
    return this.userLabel.trim().charAt(0).toUpperCase() || 'U';
  }
}
