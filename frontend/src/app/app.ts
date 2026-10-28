import { Component, inject, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    @if (isNavigating()) {
      <div class="route-loading" role="status" aria-label="Carregando página">
        <span class="route-spinner"></span>
        <span class="sr-only">Carregando página...</span>
      </div>
    }

    <router-outlet />
  `,
  styles: `
    .route-loading {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      display: grid;
      place-items: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: var(--surface-card, #fff);
      box-shadow: 0 2px 12px rgb(0 0 0 / 12%);
    }

    .route-spinner {
      width: 1.5rem;
      height: 1.5rem;
      border: 3px solid var(--surface-border, #e5e7eb);
      border-top-color: var(--primary-color, #6366f1);
      border-radius: 50%;
      animation: route-spin 0.7s linear infinite;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @keyframes route-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class App {
  private readonly router = inject(Router);

  readonly isNavigating = signal(false);

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isNavigating.set(true);
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isNavigating.set(false);
      }
    });
  }
}
