
# TRIAD Frontend

Frontend do **TRIAD — Gestão de Eventos**, uma aplicação web desenvolvida para fornecer uma interface de gerenciamento de eventos, com autenticação de usuários e acesso a um painel administrativo.

O projeto utiliza Angular, TypeScript, PrimeNG e Tailwind CSS, com uma estrutura organizada por funcionalidades e componentes reutilizáveis.

## Tecnologias utilizadas

- **Angular 20** — framework para construção da aplicação.
- **TypeScript** — tipagem estática e organização do código.
- **PrimeNG 20** — componentes de interface.
- **PrimeIcons** — biblioteca de ícones.
- **Tailwind CSS 4** — estilização utilitária.
- **SCSS** — estilos personalizados e organização visual.
- **RxJS** — gerenciamento de operações assíncronas e requisições HTTP.

## Estado atual do frontend

### Funcionalidades implementadas

- [x] Tela de login com e-mail e senha.
- [x] Integração do login com a API backend.
- [x] Armazenamento local do token de autenticação.
- [x] Persistência dos dados do usuário no navegador.
- [x] Indicador de carregamento durante a autenticação.
- [x] Tela de transição após o login bem-sucedido.
- [x] Proteção de rotas para usuários autenticados.
- [x] Redirecionamento para o login quando não existe sessão.
- [x] Redirecionamento de usuários autenticados para o dashboard ao acessar o login.
- [x] Dashboard administrativo com estrutura visual inicial.
- [x] Layout administrativo com organização de componentes.
- [x] Barra superior com identificação do usuário e opção de logout.
- [x] Encerramento da sessão e redirecionamento para o login.
- [x] Persistência da sessão durante a atualização da página, enquanto o token permanece armazenado.
- [x] Configuração do Tailwind CSS e integração com os estilos do PrimeNG.
- [x] Rodapé institucional com a identificação TRIAD — Gestão de Eventos.

### Em desenvolvimento

- [ ] Implementação das telas de gerenciamento de eventos.
- [ ] Integração das funcionalidades do dashboard com os dados reais da API.
- [ ] Implementação das funcionalidades de gerenciamento de usuários.
- [ ] Desenvolvimento das interfaces de competições, batalhas e confrontos.
- [ ] Implementação das interfaces de avaliação e gerenciamento de scorecards.
- [ ] Aplicação de permissões por perfil de usuário nas funcionalidades da interface.
- [ ] Ampliação dos testes automatizados e validação dos fluxos principais.

> O estado das funcionalidades em desenvolvimento deve ser atualizado conforme novas telas e integrações forem concluídas.

## Requisitos

Antes de executar o projeto, instale:

- Node.js em versão compatível com Angular 20.
- npm.
- A API backend do TRIAD configurada e disponível para conexão.

## Instalação

Clone o repositório e acesse a pasta do frontend:

```bash
git clone https://github.com/Hunterland/triad.git
cd triad/frontend
```

Instale as dependências:

```bash
npm install
```

## Executando em desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm start
```

Ou execute diretamente pelo Angular CLI:

```bash
ng serve
```

Acesse a aplicação em:

http://localhost:4200/

A aplicação será recompilada automaticamente conforme os arquivos forem alterados.

## Build

Para gerar a compilação de produção:

```bash
npm run build
```

Os arquivos gerados ficam no diretório `dist/`.

## Testes

Para executar os testes unitários configurados no projeto:

```bash
npm test
```

O framework e o executor de testes utilizados dependem da configuração atual do workspace Angular.

## Estrutura do projeto

A aplicação está organizada por responsabilidades, separando autenticação, funcionalidades administrativas, componentes de layout e estilos.

```text
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── auth/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   └── admin/
│   │   ├── layout/
│   │   └── app.routes.ts
│   ├── styles/
│   ├── tailwind.css
│   ├── styles.scss
│   └── ...
├── angular.json
├── package.json
├── .postcssrc.json
└── README.md
```

**Principais responsabilidades:**

- `core/auth/`: autenticação, gerenciamento de sessão e proteção de acesso.
- `features/auth/`: telas e fluxos relacionados à autenticação.
- `features/admin/`: funcionalidades da área administrativa.
- `layout/`: componentes estruturais, como barra superior e layout do painel.
- `styles/`: estilos globais e componentes visuais reutilizáveis.

## Integração com o backend

O frontend consome a API REST do TRIAD para autenticação e demais funcionalidades disponibilizadas pelo backend.

A URL da API deve ser definida nos arquivos de ambiente da aplicação. O backend precisa estar em execução e configurado para permitir requisições originadas do frontend.

## Próximos passos

1. Consolidar o layout administrativo e sua responsividade.
2. Implementar as telas de gerenciamento de eventos.
3. Integrar as funcionalidades administrativas aos endpoints existentes.
4. Desenvolver os fluxos de competições, confrontos e avaliações.
5. Implementar controle de acesso visual de acordo com os perfis.
6. Ampliar a cobertura de testes e validar os fluxos de autenticação.

---

**TRIAD — Gestão de Eventos**

Frontend desenvolvido com Angular e TypeScript.
