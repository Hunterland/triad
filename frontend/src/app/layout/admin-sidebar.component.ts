
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="layout-sidebar">
      <div class="layout-sidebar-logo">
        <a routerLink="/admin/dashboard" class="layout-topbar-logo">
          <span class="triad-logo">T</span>
          <span class="triad-brand">
            <strong>TRIAD</strong>
            <small>Gestão de Eventos</small>
          </span>
        </a>
      </div>

      <nav aria-label="Menu principal">
        <ul class="layout-menu">
          <li class="layout-root-menuitem">
            <div class="layout-menuitem-root-text">Principal</div>
            <ul>
              <li>
                <a
                  routerLink="/admin/dashboard"
                  routerLinkActive="active-route"
                  [routerLinkActiveOptions]="{ exact: true }"
                  (click)="navigate.emit()"
                >
                  <i class="pi pi-home"></i>
                  <span>Dashboard</span>
                </a>
              </li>
            </ul>
          </li>

          <li class="layout-root-menuitem">
            <div class="layout-menuitem-root-text">Gestão</div>
            <ul>
              @for (item of plannedItems; track item.label) {
                <li>
                  <span
                    class="planned-menu-item"
                    [title]="item.label + ' — módulo ainda não disponível'"
                  >
                    <i [class]="item.icon"></i>
                    <span>{{ item.label }}</span>
                    <i class="pi pi-lock planned-lock"></i>
                  </span>
                </li>
              }
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  `,
  styles: `
    .layout-sidebar-logo {
      display: flex;
      align-items: center;
      padding: 1.25rem 1.5rem;
    }

    .layout-sidebar-logo .layout-topbar-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
    }

    .triad-logo {
      display: grid;
      place-items: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.75rem;
      background: var(--primary-color);
      color: var(--primary-contrast-color);
      font-size: 1.25rem;
      font-weight: 800;
    }

    .triad-brand {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .triad-brand strong {
      letter-spacing: 0.15em;
    }

    .triad-brand small {
      font-size: 0.7rem;
      opacity: 0.7;
    }

    .planned-menu-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      opacity: 0.55;
      cursor: not-allowed;
    }

    .planned-lock {
      margin-left: auto;
      font-size: 0.75rem;
    }
  `,
})
export class AdminSidebarComponent {
  @Output() navigate = new EventEmitter<void>();

  readonly plannedItems = [
    { label: 'Eventos', icon: 'pi pi-calendar' },
    { label: 'Batalhas', icon: 'pi pi-sitemap' },
    { label: 'Competidores', icon: 'pi pi-users' },
    { label: 'Avaliações', icon: 'pi pi-chart-bar' },
    { label: 'Usuários', icon: 'pi pi-user' },
  ];
}
