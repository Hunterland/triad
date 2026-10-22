import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-950">
      <p-button label="TRIAD funcionando" icon="pi pi-check" />
    </div>
  `,
})
export class App {}
