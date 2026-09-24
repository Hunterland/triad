# 🚀 TRIAD API

API backend do sistema **TRIAD**, voltada para gestão de eventos competitivos de dança, autenticação, usuários, staff, categorias, atletas, crews, inscrições, chaves de batalha e rounds. O projeto está sendo construído com NestJS, Prisma e Swagger, com foco em organização modular, validação consistente, RBAC e documentação clara da API.

## 🎯 Objetivo

A API centraliza as operações do sistema TRIAD, incluindo:

- autenticação e autorização;
- gestão de usuários administrativos;
- gestão de eventos;
- gestão de staff por evento;
- categorias de batalha;
- atletas e crews;
- inscrições e aprovação de participantes;
- geração e visualização de chaves de batalha;
- controle de status de batalhas;
- criação e consulta de rounds por batalha.

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
├── brackets/
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
- 🧱 `brackets`: geração, visualização e operação inicial de chaves, batalhas e rounds.
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
- Aprovar, reprovar ou cancelar inscrições conforme o fluxo administrativo.
- Validar existência de evento, categoria, atleta e crew quando informada.
- Bloquear inscrição duplicada do mesmo atleta na mesma categoria para o mesmo evento.

### 🧱 Brackets, Batalhas e Rounds

- Gerar chave de batalha por evento, categoria e tipo.
- Suporte inicial para chaves `TOP8` e `TOP16`.
- Validar evento e categoria ativos.
- Validar se a categoria pertence ao evento informado.
- Validar a quantidade exata de inscrições aprovadas necessária para a chave.
- Impedir geração de chave ativa duplicada para o mesmo evento, categoria e tipo.
- Criar automaticamente as batalhas iniciais da chave.
- Consultar a chave ativa por evento e categoria.
- Retornar dados estruturados de `bracket`, `event`, `category` e `battles`.
- Atualizar o status operacional de batalhas.
- Criar rounds sequenciais para uma batalha pendente.
- Listar rounds ativos de uma batalha em ordem crescente.

#### Fluxo de status de batalha

O fluxo permitido para uma batalha é:

```text
PENDING → ONGOING → FINISHED
```

Transições inválidas são bloqueadas, incluindo:

```text
PENDING → FINISHED
ONGOING → PENDING
FINISHED → PENDING
FINISHED → ONGOING
```

#### Regras de criação de rounds

- Rounds só podem ser criados em batalha ativa com status `PENDING`.
- A quantidade deve ser um número inteiro entre `1` e `10`.
- Os rounds são criados com `status: PENDING`.
- Os rounds recebem ordem sequencial: `1`, `2`, `3` e assim por diante.
- Uma batalha não pode possuir mais de uma estrutura ativa de rounds.
- Não é permitido criar rounds para batalhas `ONGOING` ou `FINISHED`.

## 📌 Estado atual do backend

O backend possui uma base administrativa e operacional consolidada, com Swagger ativo e fluxos principais testados manualmente.

As histórias concluídas até o momento incluem:

| Story | Descrição | Estado |
|---|---|---|
| US1.1 | Setup de projeto backend com NestJS, PostgreSQL e Prisma | Concluída |
| US1.4 | Autenticação com JWT | Concluída |
| US1.5 | Perfis e papéis com RBAC | Concluída |
| US1.6 | CRUD básico de usuários administrativos | Concluída |
| US2.1 | Cadastro de eventos | Concluída |
| US2.3 | Cadastro de categorias de batalha | Concluída |
| US2.4 | Cadastro de atletas | Concluída |
| US2.5 | Cadastro de crews e membros | Concluída |
| US3.1 | Inscrição em categorias | Concluída |
| US3.2 | Aprovação de inscrições | Concluída |
| US4.1 | Geração de chaves TOP8/TOP16 | Concluída |
| US4.2 | Visualização da chave | Concluída |
| US4.3 | Controle de status de batalhas | Concluída |
| US4.4 | Criação de rounds por batalha | Concluída |

O módulo de gestão de staff por evento possui a base de modelagem e backend pronta, mas ainda pode receber refinamentos de regras de negócio.

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

- 📅 evento;
- 🏷️ categoria;
- 🕺 atleta.

Isso evita duplicidade no processo de credenciamento.

## 🧱 Modelagem de brackets e rounds

O módulo `brackets` representa o fluxo eliminatório inicial da competição.

### Bracket

Uma chave pertence a um evento e a uma categoria, podendo ser do tipo:

```text
TOP8
TOP16
```

A geração cria as batalhas iniciais de acordo com o tamanho da chave:

| Tipo da chave | Fase inicial | Batalhas iniciais |
|---|---|---:|
| `TOP8` | `QUARTER_FINAL` | 4 |
| `TOP16` | `ROUND_OF_16` | 8 |

### Battle

Cada batalha pertence a uma chave e possui:

- fase;
- ordem dentro da fase;
- status;
- estado ativo;
- timestamps de criação e atualização.

### Round

Cada round pertence a uma única batalha e possui:

- ordem sequencial dentro da batalha;
- status próprio;
- estado ativo;
- timestamps de criação e atualização.

A constraint abaixo impede rounds de mesma ordem em uma mesma batalha:

```prisma
@@unique([battleId, order])
```

## 🧪 Padrões adotados

### ✅ Validação

As entradas da API usam DTOs com `class-validator` e `ValidationPipe` global com:

- `whitelist`;
- `transform`;
- `forbidNonWhitelisted`.

Isso ajuda a rejeitar payloads inválidos e manter consistência dos dados.

### 🔐 Autenticação e autorização

A autenticação usa JWT, enquanto a autorização usa Guards e decorator de papéis para restringir endpoints administrativos a perfis autorizados, principalmente `ADMIN` e `ORGANIZER`.

Nos testes realizados:

- `ATHLETE` recebeu `403 Forbidden` em rota administrativa;
- `ADMIN` acessou listagens protegidas com `200 OK`;
- rotas administrativas de brackets exigem perfil autorizado.

### 📘 Documentação

O projeto usa Swagger via `@nestjs/swagger` para documentar endpoints, DTOs e respostas. DTOs específicos de response são utilizados para tornar os contratos de saída mais claros e facilitar o consumo futuro por frontend.

O Swagger também é utilizado como ambiente de testes manuais dos fluxos implementados. O OpenAPI fornece um contrato independente de linguagem para descrever endpoints, parâmetros, corpos e respostas da API. [150]

### ♻️ Soft delete

Os módulos principais usam desativação lógica com `isActive: false` em vez de remoção física, o que preserva histórico e abre espaço para futura reativação de registros.

### 🧭 Organização do Swagger

A documentação está organizada por tags de domínio, permitindo navegação por módulos como:

- `auth`;
- `users`;
- `events`;
- `staff-members`;
- `event-staff`;
- `event-participants`;
- `categories`;
- `athletes`;
- `crews`;
- `brackets`.

## 🗃️ Prisma

O Prisma é responsável pela modelagem e acesso ao banco de dados, incluindo relacionamentos entre entidades e tratamento de constraints como:

- unicidade em e-mail;
- vínculos por evento;
- unicidade da inscrição por atleta, categoria e evento;
- unicidade de chave por evento, categoria e tipo;
- unicidade de ordem de round por batalha.

### 🔄 Fluxo comum com Prisma

Após alterar `schema.prisma`, execute:

```bash
npx prisma format
npx prisma migrate dev --name nome-da-migration
npx prisma generate
```

O `migrate dev` cria/aplica a migration no ambiente local; `generate` atualiza os tipos e delegates do Prisma Client conforme o schema, incluindo novos models e enums. [361]

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

### 🧱 Brackets

```http
POST  /brackets/generate
GET   /brackets/event/{eventId}/category/{categoryId}

PATCH /brackets/battles/{battleId}/status

POST  /brackets/battles/{battleId}/rounds
GET   /brackets/battles/{battleId}/rounds
```

## 📦 DTOs de response

O projeto utiliza DTOs específicos para resposta em partes da API para tornar os contratos mais claros no Swagger e separar DTOs de entrada de DTOs de saída.

Esse padrão já está aplicado em endpoints de visualização de chave e rounds, e deve continuar sendo expandido à medida que o backend evolui.

## ✅ Testes manuais já validados

Os fluxos abaixo já foram validados manualmente via Swagger:

- 🔐 login com JWT;
- 🛡️ proteção de rotas com Bearer Token;
- 👮 RBAC com perfis distintos;
- 📋 listagem de inscrições com `ADMIN`;
- 🚫 bloqueio de acesso de `ATHLETE` em rota administrativa;
- 🕺 criação de atleta;
- 📝 criação de inscrição válida em `event-participants`;
- ⛔ bloqueio de inscrição duplicada com `409 Conflict`;
- ✅ aprovação, reprovação e cancelamento de inscrições;
- 🧱 geração de chaves `TOP8` e `TOP16`;
- 👀 visualização da chave por evento e categoria;
- 🔄 transição válida de batalha: `PENDING → ONGOING → FINISHED`;
- 🚫 bloqueio de transições inválidas de batalha;
- 🚫 bloqueio de status de batalha inválido;
- 📌 persistência dos status de batalha;
- 🧩 criação de rounds sequenciais;
- 📋 listagem de rounds em ordem crescente;
- 🚫 bloqueio de rounds duplicados na mesma batalha;
- 🚫 bloqueio de criação de rounds para batalhas `ONGOING` ou `FINISHED`;
- 🚫 validação de quantidade inválida de rounds;
- 🚫 retorno `404` para batalha inexistente ou inativa ao criar/listar rounds.

## 🧰 Qualidade e manutenção

Práticas adotadas ou recomendadas no projeto:

- uso de DTOs para validação e documentação;
- services com tratamento de conflito, recurso não encontrado e regras de transição;
- separação modular por domínio;
- uso de JWT + RBAC;
- soft delete para preservar histórico;
- documentação centralizada via Swagger;
- response DTOs para contratos de saída;
- migrations versionadas via Prisma;
- validação de estados de batalha e integridade de rounds.

## 📝 Observações finais

Este backend está em evolução incremental, com foco em consolidar primeiro a base operacional e os módulos centrais do domínio TRIAD.

No estado atual, estão funcionalmente estabelecidos no backend:

- 🔐 autenticação;
- 🛡️ RBAC;
- 🧩 gestão administrativa principal;
- 📝 inscrições e aprovação;
- 🧱 geração e visualização de chaves;
- 🔄 controle de status de batalhas;
- 🧩 criação e listagem de rounds.

Os próximos passos naturais do backlog estão na Sprint 5, com o módulo de julgamento:

- cadastro e atribuição de juízes;
- configuração de critérios TRIAD;
- painel de julgamento;
- cálculo do vencedor da batalha.

O avanço automático na chave, rankings, dashboards em tempo real, check-in, PWA e recursos operacionais avançados permanecem planejados para as sprints seguintes.
