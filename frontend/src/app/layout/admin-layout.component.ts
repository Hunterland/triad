import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from './admin-sidebar.component';
import { AdminTopbarComponent } from './admin-topbar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, AdminSidebarComponent, AdminTopbarComponent],
  template: `
    <div
      class="layout-wrapper layout-static"
      [class.layout-mobile-active]="menuOpen"
      [class.layout-static-inactive]="!menuOpen && desktopMenuCollapsed"
    >
      <app-admin-topbar (menuToggle)="toggleMenu()" />

      <app-admin-sidebar (navigate)="closeMobileMenu()" />

      <div class="layout-main-container">
        <div class="layout-main">
          <router-outlet />
        </div>

        <footer class="layout-footer">
          <span>TRIAD — Gestão de Eventos</span>
        </footer>
      </div>

      <button
        type="button"
        class="layout-mask"
        aria-label="Fechar menu"
        (click)="closeMobileMenu()"
      ></button>
    </div>
  `,
})
export class AdminLayoutComponent {
  menuOpen = false;
  desktopMenuCollapsed = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMobileMenu(): void {
    this.menuOpen = false;
  }
}
