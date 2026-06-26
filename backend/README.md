# TRIAD API

API backend do sistema **TRIAD**, voltada para gestão de eventos, autenticação, usuários e equipe de staff. O projeto está sendo construído com NestJS, Prisma e Swagger, com foco em organização modular, validação consistente e documentação clara da API.

## Objetivo

A API centraliza as operações do sistema TRIAD, incluindo autenticação, gestão de usuários, gestão de eventos e gestão de staff do evento, com vínculos entre membros da equipe e eventos específicos.

## Stack principal

- NestJS
- Prisma ORM
- PostgreSQL
- Swagger / OpenAPI
- class-validator
- class-transformer
- JWT para autenticação[web:602][web:568][web:531]

## Estrutura do projeto

```bash
src/
├── auth/
├── common/
├── events/
├── prisma/
├── staff/
│   ├── dto/
│   ├── event-staff.controller.ts
│   ├── event-staff.service.ts
│   ├── staff-members.controller.ts
│   ├── staff-members.service.ts
│   └── staff.module.ts
├── users/
├── app.module.ts
└── main.ts
```

### Organização por módulo

- `auth`: autenticação e login.
- `users`: gerenciamento de usuários.
- `events`: gerenciamento de eventos.
- `staff`: gerenciamento de membros de staff e vínculo de staff por evento.
- `prisma`: acesso ao banco e integração com Prisma Client.

## Funcionalidades atuais

### Autenticação

- Registro de usuário.
- Login com autenticação JWT.

### Usuários

- Listar usuários.
- Buscar usuário por ID.
- Atualizar usuário.
- Desativar usuário.

### Eventos

- Criar evento.
- Listar eventos.
- Buscar evento por ID.
- Atualizar evento.
- Desativar evento.

### Staff Members

- Criar membro de staff.
- Listar membros de staff.
- Buscar membro de staff por ID.
- Atualizar membro de staff.
- Desativar membro de staff.

### Event Staff

- Vincular membro de staff a um evento.
- Listar staff de um evento.
- Buscar vínculo específico de staff em um evento.
- Atualizar vínculo de staff no evento.
- Desativar vínculo de staff no evento.

## Modelagem de staff

O módulo de staff foi modelado com duas entidades principais:

| Entidade | Papel |
|---|---|
| `StaffMember` | Representa a pessoa cadastrada no sistema. |
| `EventStaff` | Representa o vínculo da pessoa com um evento e um papel específico. |

Essa separação permite reutilizar a mesma pessoa em vários eventos e manter o histórico de atuação por papel, como `JUDGE`, `MC`, `DJ`, `ORGANIZER` e `STAFF_SUPPORT`.

## Padrões adotados

### Validação

As entradas da API usam DTOs com `class-validator` e `ValidationPipe` global com `whitelist`, `transform` e `forbidNonWhitelisted`, o que ajuda a rejeitar payloads inválidos e manter consistência dos dados.

### Documentação

O projeto usa Swagger via `@nestjs/swagger` para documentar endpoints, DTOs e respostas, incluindo DTOs específicos de response para melhorar a visualização dos schemas.

### Soft delete

Os módulos principais usam desativação lógica com `isActive: false` em vez de remoção física, o que preserva histórico e abre espaço para futura reativação de registros.

### Organização do Swagger

A ordem de exibição das seções no Swagger foi controlada manualmente por meio de `document.tags` no `main.ts`, o que permite definir a ordem visual de tags como `auth`, `users`, `events`, `Staff Members` e `Event Staff`.

## Prisma

O Prisma é responsável pela modelagem e acesso ao banco de dados, incluindo relacionamentos entre entidades e tratamento de constraints como unicidade em e-mail e vínculo único entre evento, staff member e papel.

### Fluxo comum com Prisma

```bash
npx prisma migrate dev --name nome-da-migration
npx prisma generate
```

## Como rodar o projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Criar um arquivo `.env` na raiz do projeto com as variáveis necessárias, especialmente a conexão com o banco de dados.

Exemplo:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/triad_db"
JWT_SECRET="sua_chave_jwt"
PORT=3000
```

### 3. Rodar migrations e gerar client

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Executar em ambiente de desenvolvimento

```bash
npm run start:dev
```

## Documentação Swagger

Com a aplicação rodando, a documentação fica disponível em:

```bash
http://localhost:3000/docs
```

Ela permite visualizar endpoints, testar requisições e autenticar via Bearer Token quando necessário.

## Exemplos de endpoints

### Auth

```http
POST /auth/register
POST /auth/login
```

### Users

```http
GET   /users
GET   /users/{id}
PATCH /users/{id}
PATCH /users/{id}/deactivate
```

### Events

```http
POST  /events
GET   /events
GET   /events/{id}
PATCH /events/{id}
PATCH /events/{id}/deactivate
```

### Staff Members

```http
POST  /staff-members
GET   /staff-members
GET   /staff-members/{id}
PATCH /staff-members/{id}
PATCH /staff-members/{id}/deactivate
```

### Event Staff

```http
POST  /events/{eventId}/staff
GET   /events/{eventId}/staff
GET   /events/{eventId}/staff/{id}
PATCH /events/{eventId}/staff/{id}
PATCH /events/{eventId}/staff/{id}/deactivate
```

## DTOs de response

O projeto passou a utilizar DTOs específicos para resposta, como:

- `StaffMemberResponseDto`
- `EventStaffResponseDto`
- `EventSummaryResponseDto`

Isso melhora a clareza dos contratos expostos no Swagger e ajuda a separar DTOs de entrada de DTOs de saída.

## Próximos passos sugeridos

- Padronizar todas as tags do Swagger.
- Adicionar filtros de listagem por `isActive` e `role`.
- Criar endpoint de reativação para recursos com soft delete.
- Evoluir regras de negócio para bloquear vínculos com evento ou staff inativo, se essa for a política do sistema.

## Qualidade e manutenção

Algumas práticas já adotadas ou recomendadas no projeto:

- uso de DTOs para validação e documentação;
- services com tratamento de conflito e recurso não encontrado;
- separação modular por domínio;
- uso de DTOs de response para contratos mais claros;
- documentação centralizada via Swagger.

## Observações finais

Este backend está em evolução incremental, com foco em primeiro consolidar a base do domínio principal do sistema TRIAD e depois ampliar funcionalidades sem perder organização, previsibilidade e qualidade de documentação.
