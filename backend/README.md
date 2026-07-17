# 🚀 TRIAD API

API backend do sistema **TRIAD**, voltada para gestão de eventos competitivos de dança, autenticação, usuários, staff, categorias, atletas, crews e inscrições. O projeto está sendo construído com NestJS, Prisma e Swagger, com foco em organização modular, validação consistente, RBAC e documentação clara da API.

## 🎯 Objetivo

A API centraliza as operações do sistema TRIAD, incluindo autenticação, gestão de usuários administrativos, gestão de eventos, gestão de staff do evento, categorias de batalha, atletas, crews e inscrições em categorias por evento.

## 🧱 Stack principal

- ⚙️ NestJS
- 🗃️ Prisma ORM
- 🐘 PostgreSQL
- 📘 Swagger / OpenAPI
- ✅ class-validator
- 🔄 class-transformer
- 🔐 JWT para autenticação
- 🛡️ Guards para autorização por papéis (RBAC)

## 🗂️ Estrutura do projeto

```bash
src/
├── auth/
├── common/
├── events/
├── categories/
├── athletes/
├── crews/
├── event-participants/
├── prisma/
├── staff/
├── users/
├── app.module.ts
└── main.ts
```

## 🧩 Organização por módulo

- 🔐 `auth`: autenticação, registro, login e emissão de token JWT.
- 👤 `users`: gerenciamento de usuários administrativos.
- 📅 `events`: gerenciamento de eventos.
- 🎧 `staff`: gerenciamento de membros de staff e vínculo de staff por evento.
- 🏷️ `categories`: gerenciamento de categorias de batalha por evento.
- 🕺 `athletes`: gerenciamento de atletas.
- 👥 `crews`: gerenciamento de crews e estrutura coletiva.
- 📝 `event-participants`: inscrições de atletas em categorias de um evento.
- 🗄️ `prisma`: acesso ao banco e integração com Prisma Client.

## ✅ Funcionalidades atuais

### 🔐 Autenticação

- Registro de usuário.
- Login com autenticação JWT.
- Proteção de rotas com Bearer Token.
- Controle de acesso por papéis com RBAC.

### 👤 Usuários

- Listar usuários.
- Buscar usuário por ID.
- Atualizar usuário.
- Desativar usuário.

### 📅 Eventos

- Criar evento.
- Listar eventos.
- Buscar evento por ID.
- Atualizar evento.
- Desativar evento.

### 🎧 Staff Members

- Criar membro de staff.
- Listar membros de staff.
- Buscar membro de staff por ID.
- Atualizar membro de staff.
- Desativar membro de staff.

### 🔗 Event Staff

- Vincular membro de staff a um evento.
- Listar staff de um evento.
- Buscar vínculo específico de staff em um evento.
- Atualizar vínculo de staff no evento.
- Desativar vínculo de staff no evento.

### 🏷️ Categories

- Criar categoria vinculada a evento.
- Listar categorias.
- Buscar categoria por ID.
- Atualizar categoria.
- Desativar categoria.

### 🕺 Athletes

- Criar atleta.
- Listar atletas.
- Buscar atleta por ID.
- Atualizar atleta.
- Desativar atleta.

### 👥 Crews

- Criar crew.
- Listar crews.
- Buscar crew por ID.
- Atualizar crew.
- Desativar crew.
- Fluxo base preparado para suporte a participação coletiva.

### 📝 Event Participants

- Criar inscrição de atleta em categoria de evento.
- Listar inscrições.
- Buscar inscrição por ID.
- Atualizar inscrição.
- Cancelar inscrição.
- Validar existência de evento, categoria, atleta e crew quando informada.
- Bloquear inscrição duplicada do mesmo atleta na mesma categoria para o mesmo evento.

## 📌 Estado atual do backend

O backend já possui a base de autenticação, documentação e módulos principais de operação administrativa consolidada, com Swagger ativo e testes manuais realizados via interface da API.

A `US3.1 — Inscrição em categorias` foi validada com sucesso no backend, incluindo:

- 🔐 autenticação com JWT;
- 🛡️ autorização por papéis;
- ✅ criação de inscrição válida;
- 🚫 bloqueio de duplicidade com retorno `409 Conflict`.

## 🎭 Modelagem de staff

O módulo de staff foi modelado com duas entidades principais:

| Entidade | Papel |
|---|---|
| `StaffMember` | Representa a pessoa cadastrada no sistema. |
| `EventStaff` | Representa o vínculo da pessoa com um evento e um papel específico. |

Essa separação permite reutilizar a mesma pessoa em vários eventos e manter o histórico de atuação por papel, como `JUDGE`, `MC`, `DJ`, `ORGANIZER` e `STAFF_SUPPORT`.

## 🧾 Modelagem de inscrições

O módulo `event-participants` representa a inscrição de um atleta em uma categoria de um evento, podendo opcionalmente referenciar uma `crew` quando aplicável.

A unicidade da inscrição considera a combinação de:

- 📅 evento
- 🏷️ categoria
- 🕺 atleta

Isso evita duplicidade no processo de credenciamento.

## 🧪 Padrões adotados

### ✅ Validação

As entradas da API usam DTOs com `class-validator` e `ValidationPipe` global com:

- `whitelist`
- `transform`
- `forbidNonWhitelisted`

Isso ajuda a rejeitar payloads inválidos e manter consistência dos dados.

### 🔐 Autenticação e autorização

A autenticação usa JWT, enquanto a autorização usa Guards e decorator de papéis para restringir endpoints administrativos a perfis autorizados, como `ADMIN` e `ORGANIZER`.

Nos testes do módulo de inscrições:

- `ATHLETE` recebeu `403 Forbidden`;
- `ADMIN` acessou a listagem com `200 OK`.

Isso confirmou o funcionamento do RBAC.

### 📘 Documentação

O projeto usa Swagger via `@nestjs/swagger` para documentar endpoints, DTOs e respostas, incluindo DTOs específicos de response para melhorar a visualização dos schemas.

### ♻️ Soft delete

Os módulos principais usam desativação lógica com `isActive: false` em vez de remoção física, o que preserva histórico e abre espaço para futura reativação de registros.

### 🧭 Organização do Swagger

A documentação está organizada por tags de domínio, permitindo navegação por módulos como:

- `auth`
- `users`
- `events`
- `staff-members`
- `event-staff`
- `event-participants`
- `categories`
- `athletes`
- `crews`

## 🗃️ Prisma

O Prisma é responsável pela modelagem e acesso ao banco de dados, incluindo relacionamentos entre entidades e tratamento de constraints como:

- unicidade em e-mail;
- vínculos por evento;
- unicidade da inscrição por atleta, categoria e evento.

### 🔄 Fluxo comum com Prisma

```bash
npx prisma migrate dev --name nome-da-migration
npx prisma generate
```

## ▶️ Como rodar o projeto

### 1️⃣ Instalar dependências

```bash
npm install
```

### 2️⃣ Configurar variáveis de ambiente

Criar um arquivo `.env` na raiz do projeto com as variáveis necessárias, especialmente a conexão com o banco de dados.

Exemplo:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/triad_db"
JWT_SECRET="sua_chave_jwt"
PORT=3000
```

### 3️⃣ Rodar migrations e gerar client

```bash
npx prisma migrate dev
npx prisma generate
```

### 4️⃣ Executar em ambiente de desenvolvimento

```bash
npm run start:dev
```

## 📚 Documentação Swagger

Com a aplicação rodando, a documentação fica disponível em:

```bash
http://localhost:3000/docs
```

A interface permite:

- 👀 visualizar endpoints;
- 🧪 testar requisições;
- 🔑 autenticar via Bearer Token quando necessário.

## 🌐 Exemplos de endpoints

### 🔐 Auth

```http
POST /auth/register
POST /auth/login
```

### 👤 Users

```http
GET   /users
GET   /users/{id}
PATCH /users/{id}
PATCH /users/{id}/deactivate
```

### 📅 Events

```http
POST  /events
GET   /events
GET   /events/{id}
PATCH /events/{id}
PATCH /events/{id}/deactivate
```

### 🎧 Staff Members

```http
POST  /staff-members
GET   /staff-members
GET   /staff-members/{id}
PATCH /staff-members/{id}
PATCH /staff-members/{id}/deactivate
```

### 🔗 Event Staff

```http
POST  /events/{eventId}/staff
GET   /events/{eventId}/staff
GET   /events/{eventId}/staff/{id}
PATCH /events/{eventId}/staff/{id}
PATCH /events/{eventId}/staff/{id}/deactivate
```

### 🏷️ Categories

```http
POST  /categories
GET   /categories
GET   /categories/{id}
PATCH /categories/{id}
PATCH /categories/{id}/deactivate
```

### 🕺 Athletes

```http
POST  /athletes
GET   /athletes
GET   /athletes/{id}
PATCH /athletes/{id}
PATCH /athletes/{id}/deactivate
```

### 👥 Crews

```http
POST  /crews
GET   /crews
GET   /crews/{id}
PATCH /crews/{id}
PATCH /crews/{id}/deactivate
```

### 📝 Event Participants

```http
POST  /event-participants
GET   /event-participants
GET   /event-participants/{id}
PATCH /event-participants/{id}
PATCH /event-participants/{id}/cancel
```

## 📦 DTOs de response

O projeto utiliza DTOs específicos para resposta em partes da API para tornar os contratos mais claros no Swagger e separar DTOs de entrada de DTOs de saída.

Esse padrão deve continuar sendo expandido para os módulos novos à medida que o backend evolui.

## ✅ Testes manuais já validados

Os fluxos abaixo já foram validados manualmente via Swagger:

- 🔐 login com JWT;
- 🛡️ proteção de rotas com Bearer Token;
- 👮 RBAC com perfis distintos;
- 📋 listagem de inscrições com `ADMIN`;
- 🚫 bloqueio de acesso de `ATHLETE` em rota administrativa;
- 🕺 criação de atleta;
- 📝 criação de inscrição válida em `event-participants`;
- ⛔ bloqueio de inscrição duplicada com `409 Conflict`.
  

## 🧰 Qualidade e manutenção

Práticas adotadas ou recomendadas no projeto:

- uso de DTOs para validação e documentação;
- services com tratamento de conflito e recurso não encontrado;
- separação modular por domínio;
- uso de JWT + RBAC;
- soft delete para preservar histórico;
- documentação centralizada via Swagger.

## 📝 Observações finais

Este backend está em evolução incremental, com foco em consolidar primeiro a base operacional e os módulos centrais do domínio TRIAD.

No estado atual, já estão funcionalmente estabelecidos no backend:

- 🔐 autenticação;
- 🛡️ RBAC;
- 🧩 gestão administrativa principal;
- 📝 fluxo inicial de inscrições.
