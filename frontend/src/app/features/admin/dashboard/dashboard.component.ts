import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <section class="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="mb-2 text-sm font-medium text-emerald-700">VISÃO GERAL</p>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Acompanhe as informações e as principais áreas de gestão do TRIAD.
        </p>
      </div>

      <div
        class="flex items-center gap-2 rounded-lg border border-slate-200
               bg-white px-3 py-2 text-sm text-slate-500"
      >
        <i class="pi pi-chart-line text-emerald-600"></i>
        <span>Painel administrativo</span>
      </div>
    </section>

    <section
      aria-label="Indicadores do sistema"
      class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
    >
      @for (item of indicators; track item.title) {
        <article
          class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm
                 transition-shadow hover:shadow-md"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm font-medium text-slate-500">
                {{ item.title }}
              </p>
              <p class="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                {{ item.value }}
              </p>
            </div>

            <div
              class="flex h-11 w-11 items-center justify-center rounded-xl
                     bg-emerald-50 text-emerald-700"
            >
              <i [class]="item.icon + ' text-xl'"></i>
            </div>
          </div>

          <div class="mt-5 border-t border-slate-100 pt-3">
            <p class="text-xs leading-5 text-slate-500">
              {{ item.description }}
            </p>
          </div>
        </article>
      }
    </section>

    <section class="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-3">
      <article class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg
                   bg-emerald-50 text-emerald-700"
          >
            <i class="pi pi-compass text-lg"></i>
          </div>
          <div>
            <h2 class="font-semibold text-slate-900">Bem-vindo ao TRIAD</h2>
            <p class="mt-1 text-sm text-slate-500">Gestão de Eventos</p>
          </div>
        </div>

        <p class="mt-5 text-sm leading-7 text-slate-600">
          Este é o ponto central de acesso às ferramentas administrativas do sistema. As próximas
          etapas vão conectar os indicadores e os módulos aos dados reais disponibilizados pela API.
        </p>

        <div
          class="mt-5 flex items-start gap-3 rounded-lg border border-emerald-100
                 bg-emerald-50/70 p-4"
        >
          <i class="pi pi-info-circle mt-0.5 text-emerald-700"></i>
          <p class="text-sm leading-6 text-slate-600">
            Os indicadores permanecerão sem valores até que sejam integrados aos serviços do
            backend.
          </p>
        </div>
      </article>

      <article class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg
                   bg-slate-100 text-slate-700"
          >
            <i class="pi pi-th-large text-lg"></i>
          </div>
          <h2 class="font-semibold text-slate-900">Módulos do sistema</h2>
        </div>

        <ul class="mt-5 space-y-4">
          @for (module of modules; track module.label) {
            <li class="flex items-center gap-3">
              <i [class]="module.icon + ' w-5 text-center text-slate-500'"></i>
              <span class="flex-1 text-sm text-slate-700">
                {{ module.label }}
              </span>
              <span
                class="rounded-full bg-slate-100 px-2.5 py-1 text-xs
                       font-medium text-slate-500"
              >
                Planejado
              </span>
            </li>
          }
        </ul>
      </article>
    </section>
  `,
})
export class DashboardComponent {
  readonly indicators = [
    {
      title: 'Eventos',
      value: '—',
      description: 'Aguardando integração com a API',
      icon: 'pi pi-calendar',
    },
    {
      title: 'Batalhas',
      value: '—',
      description: 'Aguardando integração com a API',
      icon: 'pi pi-sitemap',
    },
    {
      title: 'Competidores',
      value: '—',
      description: 'Aguardando integração com a API',
      icon: 'pi pi-users',
    },
    {
      title: 'Avaliações',
      value: '—',
      description: 'Aguardando integração com a API',
      icon: 'pi pi-chart-bar',
    },
  ];

  readonly modules = [
    { label: 'Gestão de eventos', icon: 'pi pi-calendar' },
    { label: 'Batalhas e confrontos', icon: 'pi pi-sitemap' },
    { label: 'Competidores', icon: 'pi pi-users' },
    { label: 'Avaliação dos jurados', icon: 'pi pi-chart-bar' },
  ];
}
