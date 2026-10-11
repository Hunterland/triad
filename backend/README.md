# 🚀 TRIAD API

API backend do sistema **TRIAD**, voltada à gestão de eventos competitivos de dança, inscrições, brackets, rounds e julgamento TRIAD.

O projeto é construído com NestJS, Prisma, PostgreSQL e Swagger, com foco em organização modular, validação consistente, controle de acesso baseado em papéis (RBAC), rastreabilidade e regras de negócio para operação de batalhas.

---

## 🎯 Objetivo

A TRIAD API centraliza as operações administrativas e operacionais de um evento competitivo de dança, incluindo:

- autenticação e autorização;
- gestão de usuários administrativos;
- gestão de eventos;
- gestão de staff e vínculos com eventos;
- categorias de batalha;
- atletas e crews;
- inscrições, aprovação e cancelamento de participantes;
- geração e visualização de chaves eliminatórias;
- controle operacional de batalhas e rounds;
- cadastro e atribuição de juízes;
- configuração versionada de critérios de julgamento;
- scorecards por juiz e round;
- registro, edição e submissão de notas TRIAD.

---

## 🧱 Stack principal

- ⚙️ [NestJS](https://nestjs.com/)
- 🗃️ [Prisma ORM](https://www.prisma.io/)
- 🐘 PostgreSQL
- 📘 Swagger / OpenAPI
- ✅ `class-validator`
- 🔄 `class-transformer`
- 🔐 JWT para autenticação
- 🛡️ Guards e decorators para RBAC
- 🧪 Swagger como ambiente de validação manual de fluxos

---

## 🗂️ Estrutura do projeto

```text
src/
├── auth/
├── athletes/
├── brackets/
│   └── dto/
├── categories/
├── common/
├── crews/
├── event-participants/
├── events/
├── judging/
│   └── dto/
├── prisma/
├── staff/
├── users/
├── app.module.ts
└── main.ts
```

---

## 🧩 Organização por módulo

| Módulo               | Responsabilidade                                             |
| -------------------- | ------------------------------------------------------------ |
| `auth`               | Registro, login, JWT, guards e autorização por papéis        |
| `users`              | Gestão de usuários administrativos                           |
| `events`             | Gestão de eventos                                            |
| `staff`              | Staff members, vínculos `EventStaff` e atribuições de juízes |
| `categories`         | Categorias vinculadas a eventos                              |
| `athletes`           | Gestão de atletas                                            |
| `crews`              | Gestão de crews e membros                                    |
| `event-participants` | Inscrições de atletas em categorias de eventos               |
| `brackets`           | Geração de chave, batalhas, competidores e rounds            |
| `judging`            | Configuração TRIAD, critérios, scorecards, notas e submissão |
| `prisma`             | Acesso ao banco e integração com Prisma Client               |

---

## ✅ Funcionalidades atuais

### 🔐 Autenticação e autorização

- Registro de usuário.
- Login com emissão de JWT.
- Proteção de rotas com Bearer Token.
- Controle de acesso baseado em papéis.
- Papéis disponíveis:

```text
ADMIN
ORGANIZER
JUDGE
STAFF
ATHLETE
```

Os principais endpoints administrativos exigem perfis autorizados, especialmente:

```text
ADMIN
ORGANIZER
```

---

### 👤 Usuários

- Listar usuários.
- Buscar usuário por ID.
- Atualizar usuário.
- Desativar usuário logicamente.

---

### 📅 Eventos

- Criar evento.
- Listar eventos.
- Buscar evento por ID.
- Atualizar evento.
- Desativar evento.

---

### 🎧 Staff Members

- Criar membro de staff.
- Listar membros de staff.
- Buscar membro de staff por ID.
- Atualizar membro de staff.
- Desativar membro de staff.

Papéis operacionais de staff:

```text
JUDGE
MC
DJ
ORGANIZER
STAFF_SUPPORT
```

---

### 🔗 Event Staff

- Vincular um `StaffMember` a um evento.
- Definir papel operacional no evento.
- Informar área, ordem e liderança quando aplicável.
- Listar staff de um evento.
- Buscar vínculo específico.
- Atualizar vínculo.
- Desativar vínculo logicamente.

---

### 🏷️ Categorias

- Criar categoria vinculada a um evento.
- Listar categorias de um evento.
- Buscar categoria por ID.
- Atualizar categoria.
- Desativar categoria.

Cada categoria pode possuir:

- nome;
- slug;
- descrição;
- regras;
- faixa etária;
- nível;
- indicação de categoria individual ou em crew.

---

### 🕺 Atletas

- Criar atleta.
- Listar atletas.
- Buscar atleta por ID.
- Atualizar atleta.
- Desativar atleta.

---

### 👥 Crews

- Criar crew.
- Listar crews.
- Buscar crew por ID.
- Atualizar crew.
- Desativar crew.
- Adicionar membro à crew.
- Remover membro da crew.

---

### 📝 Inscrições

O módulo `event-participants` representa a inscrição de um atleta em uma categoria de um evento.

Funcionalidades:

- Criar inscrição.
- Listar inscrições.
- Buscar inscrição por ID.
- Atualizar inscrição.
- Aprovar inscrição.
- Reprovar inscrição.
- Cancelar inscrição.
- Validar evento, categoria, atleta e crew, quando aplicável.
- Bloquear inscrição duplicada.

A unicidade da inscrição considera:

```text
eventId + categoryId + athleteId
```

Constraint Prisma:

```prisma
@@unique([eventId, categoryId, athleteId])
```

---

## 🧱 Brackets, batalhas e rounds

O módulo `brackets` controla a estrutura eliminatória inicial das categorias.

### Tipos de bracket

```text
TOP8
TOP16
```

| Tipo    | Fase inicial    | Batalhas iniciais |
| ------- | --------------- | ----------------: |
| `TOP8`  | `QUARTER_FINAL` |                 4 |
| `TOP16` | `ROUND_OF_16`   |                 8 |

### Geração de brackets

A geração de chave:

- valida se evento e categoria existem e estão ativos;
- valida se a categoria pertence ao evento;
- valida a quantidade necessária de inscrições aprovadas;
- impede chave duplicada para o mesmo evento, categoria e tipo;
- cria automaticamente as batalhas iniciais;
- atribui dois competidores ativos por batalha:
  - `RED`;
  - `BLUE`.

### Status da batalha

Fluxo permitido:

```text
PENDING → ONGOING → FINISHED
```

Transições inválidas são bloqueadas, incluindo:

```text
PENDING → FINISHED
ONGOING → PENDING
ONGOING → ONGOING
FINISHED → PENDING
FINISHED → ONGOING
```

Uma batalha só pode iniciar quando possui exatamente dois competidores ativos.

### Rounds

Rounds são criados sequencialmente dentro de uma batalha.

Regras implementadas:

- rounds só podem ser criados em batalhas ativas com status `PENDING`;
- a quantidade deve ser um inteiro maior que zero;
- rounds são criados inicialmente com status `PENDING`;
- rounds possuem ordem sequencial;
- uma batalha não pode possuir duas estruturas ativas de rounds;
- não é possível criar rounds em batalha `ONGOING` ou `FINISHED`.

Constraint:

```prisma
@@unique([battleId, order])
```

### Status do round

Fluxo permitido:

```text
PENDING → ONGOING → FINISHED
```

Regras adicionais:

- um round só pode iniciar se a batalha estiver `ONGOING`;
- o primeiro round pode iniciar diretamente quando a batalha está em andamento;
- um round posterior só pode iniciar após o round anterior ser finalizado;
- rounds finalizados não podem retornar a estados anteriores;
- o scorecard só pode ser criado ou submetido para round `ONGOING`.

---

## ⚖️ Julgamento TRIAD

O módulo `judging` implementa a base de julgamento para batalhas.

Ele é composto por:

```text
JudgeAssignment
JudgingConfiguration
JudgeCriterion
JudgeScorecard
JudgeCriterionScore
```

### Atribuição de juízes

Um juiz é primeiro vinculado ao evento via `EventStaff` com:

```text
role: JUDGE
```

Depois, recebe uma atribuição ativa em uma categoria por meio de `JudgeAssignment`.

Funcionalidades:

- atribuir juiz a uma categoria;
- listar juízes de uma categoria;
- validar vínculo `EventStaff` ativo;
- validar papel `JUDGE`;
- validar evento e categoria compatíveis;
- bloquear atribuição duplicada;
- desativar atribuição por soft delete.

Constraint:

```prisma
@@unique([eventStaffId, categoryId])
```

---

### Configuração de julgamento

Cada categoria pode possuir versões de configuração de julgamento.

Tipos de interface disponíveis:

```text
LEVEL_A
LEVEL_B
TRIAD
CUSTOM
```

Finalidades disponíveis:

```text
BATTLE
PRESELECTION
```

Status disponíveis:

```text
DRAFT
PUBLISHED
ARCHIVED
```

Funcionalidades implementadas:

- criar configuração em `DRAFT`;
- criar critérios em uma configuração de rascunho;
- listar critérios ativos;
- atualizar critérios em `DRAFT`;
- reordenar critérios;
- desativar critério;
- criar nova versão a partir de uma configuração;
- publicar configuração;
- arquivar automaticamente versão publicada anterior da mesma categoria e finalidade;
- impedir edição de configuração/critério publicada;
- validar pesos antes da publicação.

Regras de publicação:

- deve existir pelo menos um critério ativo;
- a soma dos pesos ativos deve ser igual a `100.00`;
- a configuração publicada deve ser ativa;
- configurações publicadas são imutáveis;
- publicar nova versão arquiva a versão anterior publicada da mesma categoria e finalidade.

Exemplo TRIAD:

| Código           | Nome                     |       Peso |
| ---------------- | ------------------------ | ---------: |
| `PHYSICAL`       | Qualidade Física         |      33.34 |
| `ARTISTIC`       | Qualidade Artística      |      33.33 |
| `INTERPRETATIVE` | Qualidade Interpretativa |      33.33 |
| **Total**        |                          | **100.00** |

Constraints relevantes:

```prisma
@@unique([categoryId, purpose, version])
@@unique([judgingConfigurationId, code])
@@unique([judgingConfigurationId, order])
```

---

### Scorecards e notas

Um scorecard representa a avaliação de um juiz para um round específico.

O modelo relaciona:

```text
JudgeAssignment
→ JudgeScorecard
→ Round
→ JudgingConfiguration
→ JudgeCriterionScore
→ BattleCompetitor
→ JudgeCriterion
```

Status do scorecard:

```text
DRAFT
SUBMITTED
```

#### Criação de scorecard

A criação de scorecard valida:

- round existente e ativo;
- batalha em `ONGOING`;
- round em `ONGOING`;
- batalha com exatamente dois competidores ativos;
- `JudgeAssignment` ativa;
- juiz ativo no mesmo evento e categoria;
- configuração ativa `TRIAD`, `BATTLE` e `PUBLISHED`;
- critérios ativos na configuração;
- uma nota por combinação de competidor e critério;
- nota dentro da escala configurada no critério.

Para uma batalha com dois competidores e configuração TRIAD com três critérios:

```text
2 competidores × 3 critérios = 6 notas
```

O scorecard é criado em:

```text
status: DRAFT
```

Constraints:

```prisma
@@unique([judgeAssignmentId, roundId])
@@unique([judgeScorecardId, battleCompetitorId, judgeCriterionId])
```

Essas constraints garantem:

- apenas um scorecard por atribuição de juiz e round;
- apenas uma nota para cada combinação de scorecard, competidor e critério.

#### Edição de notas

Enquanto o scorecard estiver em `DRAFT`:

- uma nota pode ser atualizada;
- a nota deve pertencer ao scorecard informado;
- o critério deve pertencer à configuração vinculada;
- a nova nota deve respeitar `minScore` e `maxScore`.

Após submissão:

```text
SUBMITTED
```

as notas tornam-se imutáveis.

#### Submissão de scorecard

A submissão valida:

- scorecard ativo e em `DRAFT`;
- round e batalha ainda em `ONGOING`;
- exatamente dois competidores ativos;
- critérios ativos da configuração;
- scorecard completo;
- ausência de notas duplicadas;
- uma nota por competidor e critério;
- escalas válidas para todas as notas.

Quando válido:

```text
DRAFT → SUBMITTED
```

e o campo `submittedAt` é preenchido.

---

## 📌 Estado atual do backend

O backend possui uma base administrativa, operacional e de julgamento consolidada, com fluxos principais validados manualmente via Swagger.

| Story  | Descrição                                                | Estado                 |
| ------ | -------------------------------------------------------- | ---------------------- |
| US1.1  | Setup de projeto backend com NestJS, PostgreSQL e Prisma | Concluída              |
| US1.4  | Autenticação com JWT                                     | Concluída              |
| US1.5  | Perfis e papéis com RBAC                                 | Concluída              |
| US1.6  | CRUD básico de usuários administrativos                  | Concluída              |
| US2.1  | Cadastro de eventos                                      | Concluída              |
| US2.2  | Gestão de staff do evento                                | Parcialmente concluída |
| US2.3  | Cadastro de categorias de batalha                        | Concluída              |
| US2.4  | Cadastro de atletas                                      | Concluída              |
| US2.5  | Cadastro de crews e membros                              | Concluída              |
| US3.1  | Inscrição em categorias                                  | Concluída              |
| US3.2  | Aprovação de inscrições                                  | Concluída              |
| US4.1  | Geração de chaves TOP8/TOP16                             | Concluída              |
| US4.2  | Visualização da chave                                    | Concluída              |
| US4.3  | Controle de status de batalhas                           | Concluída              |
| US4.4  | Criação, consulta e operação de rounds                   | Concluída              |
| US5.1  | Cadastro de juízes e atribuições                         | Concluída              |
| US5.2  | Configuração de critérios TRIAD                          | Concluída              |
| US5.1b | Scorecard do juiz por round                              | Concluída              |
| US5.3  | Painel de julgamento com sliders (v1) — backend/API      | Concluída              |
| US5.5  | Cálculo de vencedor da batalha                           | Pendente               |
| US5.4  | Pré-seleção por categoria                                | Pendente               |
| US6.1  | Dashboard da mesa                                        | Pendente               |
| US6.2  | Dashboard público                                        | Pendente               |
| US6.3  | Atualização em tempo real via WebSocket                  | Pendente               |

> A interface Angular do painel visual com sliders ainda depende da US1.2. A US5.3 está concluída no escopo de backend/API: criação, carregamento, edição e submissão de scorecards.

---

## 🧪 Fluxos manuais validados

Os seguintes fluxos foram testados manualmente via Swagger:

### Segurança e administração

- registro e login com JWT;
- autenticação com Bearer Token;
- RBAC com perfis distintos;
- bloqueio de `ATHLETE` em rota administrativa;
- acesso de `ADMIN` a endpoints protegidos;
- CRUD administrativo de usuários;
- CRUD de eventos;
- CRUD de atletas;
- CRUD de crews;
- gestão de staff;
- vínculos de staff em eventos.

### Inscrições e brackets

- criação de inscrição;
- bloqueio de inscrição duplicada com `409 Conflict`;
- aprovação, reprovação e cancelamento de inscrição;
- geração de chave `TOP8`;
- geração de chave `TOP16`;
- visualização de chave por evento e categoria;
- persistência de competidores `RED` e `BLUE`;
- transição de batalha `PENDING → ONGOING → FINISHED`;
- bloqueio de transições inválidas de batalha;
- criação sequencial de rounds;
- listagem de rounds em ordem crescente;
- bloqueio de criação duplicada de rounds;
- bloqueio de criação de rounds em batalhas `ONGOING` ou `FINISHED`;
- transição de round `PENDING → ONGOING → FINISHED`;
- bloqueio de início de round quando a batalha não está em andamento;
- bloqueio de início de round posterior sem finalização do anterior.

### Julgamento

- criação de `JudgeAssignment`;
- bloqueio de atribuição duplicada de juiz;
- desativação lógica de atribuição;
- criação de configuração de julgamento em `DRAFT`;
- criação, edição, reordenação e desativação de critérios;
- publicação com pesos somando `100.00`;
- versionamento e clonagem de configuração;
- arquivamento de configuração publicada anterior;
- imutabilidade de configuração publicada;
- criação de scorecard em round `ONGOING`;
- criação transacional de scorecard e notas;
- validação de seis notas para dois competidores e três critérios;
- consulta de scorecards por round;
- bloqueio de scorecard duplicado por juiz e round;
- consulta individual de scorecard;
- atualização de nota em scorecard `DRAFT`;
- validação de escala de nota;
- submissão de scorecard;
- preenchimento de `submittedAt`;
- bloqueio de edição após `SUBMITTED`;
- bloqueio de nova submissão após `SUBMITTED`.

---

## 🧪 Dados de teste utilizados

O ambiente local foi validado com uma categoria de Breaking, bracket `TOP8`, batalha em andamento, round em andamento, juíza atribuída e configuração TRIAD publicada.

Exemplo do fluxo validado:

```text
Categoria ativa
  → 8 inscrições aprovadas
  → Bracket TOP8 gerado
  → Batalha com RED e BLUE
  → Batalha ONGOING
  → Round 1 ONGOING
  → JudgeAssignment ativa
  → Configuração TRIAD BATTLE PUBLISHED
  → Scorecard DRAFT criado
  → 6 notas persistidas
  → Nota editada
  → Scorecard SUBMITTED
  → Edição bloqueada
```

---

## 🧪 Padrões adotados

### ✅ Validação

As entradas usam DTOs com `class-validator` e `ValidationPipe`.

Configuração global recomendada:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }),
);
```

Princípios aplicados:

- payloads inválidos são rejeitados;
- UUIDs de rota são validados;
- enums são validados;
- notas possuem validação de formato e de limites;
- regras contextuais são validadas no service.

No NestJS, pipes podem transformar e validar dados antes da execução do handler; `ValidationPipe` integra-se ao `class-validator` para validação declarativa por decorators. [59]

---

### 🔐 Autenticação e RBAC

A autenticação usa JWT e a autorização utiliza guards com decorator de papéis.

Exemplo:

```ts
@Roles(RoleName.ADMIN, RoleName.ORGANIZER)
```

A regra de negócio também é validada no service, especialmente para assegurar:

- juiz ativo;
- vínculo válido no evento;
- atribuição válida na categoria;
- compatibilidade entre categoria, batalha, round e configuração de julgamento.

---

### 📘 Swagger e OpenAPI

O Swagger está disponível em:

```text
http://localhost:3000/docs
```

A documentação é gerada com decorators do NestJS e organizada por tags de domínio.

Tags atuais:

```text
auth
users
events
Staff Members
Event Staff
event-participants
categories
athletes
crews
Brackets
Judge Assignments
Judging Configurations
Judge Scorecards
```

O OpenAPI descreve APIs REST de forma independente de linguagem, e o NestJS gera a especificação a partir dos decorators das rotas, DTOs, parâmetros e respostas. [150][462]

---

### ♻️ Soft delete

Os principais módulos usam `isActive: false` para desativação lógica em vez de remoção física.

Essa estratégia é usada para preservar histórico de:

- usuários;
- eventos;
- categorias;
- atletas;
- crews;
- staff;
- vínculos de staff;
- inscrições;
- brackets;
- batalhas;
- rounds;
- atribuições de juízes;
- configurações e critérios aplicáveis;
- scorecards.

---

### 🗃️ Prisma e integridade

O Prisma é responsável pela modelagem relacional, acesso ao banco e constraints.

Exemplos de constraints relevantes:

```prisma
@@unique([eventId, categoryId, athleteId])
@@unique([eventId, categoryId, type])
@@unique([battleId, side])
@@unique([battleId, eventParticipantId])
@@unique([battleId, order])
@@unique([eventStaffId, categoryId])
@@unique([categoryId, purpose, version])
@@unique([judgingConfigurationId, code])
@@unique([judgingConfigurationId, order])
@@unique([judgeAssignmentId, roundId])
@@unique([judgeScorecardId, battleCompetitorId, judgeCriterionId])
```

Essas constraints complementam as validações do service e protegem a integridade mesmo em cenários de concorrência.

### 🔄 Fluxo após alterações no schema

Após alterar `prisma/schema.prisma`:

```bash
npx prisma format
npx prisma migrate dev --name nome-da-migration
npx prisma generate
```

Em desenvolvimento, migrations representam mudanças versionadas no contrato e no banco. Após mudanças no schema, o Prisma Client deve ser regenerado para refletir models, enums, relações e tipos atualizados.

---

## ▶️ Como rodar o projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/triad_db"
JWT_SECRET="sua_chave_jwt"
PORT=3000
```

### 3. Aplicar migrations e gerar Prisma Client

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Executar em desenvolvimento

```bash
npm run start:dev
```

---

## 📚 Swagger

Com a aplicação rodando:

```text
http://localhost:3000/docs
```

A interface permite:

- visualizar endpoints;
- inspecionar schemas;
- autenticar com Bearer Token;
- executar requisições;
- validar respostas e erros;
- testar fluxos de negócio manualmente.

---

## 🌐 Principais endpoints

### 🔐 Autenticação

```http
POST /auth/register
POST /auth/login
```

### 👤 Usuários

```http
GET   /users
GET   /users/{id}
PATCH /users/{id}
PATCH /users/{id}/deactivate
```

### 📅 Eventos

```http
POST  /events
GET   /events
GET   /events/{id}
PATCH /events/{id}
PATCH /events/{id}/deactivate
```

### 🎧 Staff e vínculos

```http
POST  /staff-members
GET   /staff-members
GET   /staff-members/{id}
PATCH /staff-members/{id}
PATCH /staff-members/{id}/deactivate

POST  /events/{eventId}/staff
GET   /events/{eventId}/staff
GET   /events/{eventId}/staff/{id}
PATCH /events/{eventId}/staff/{id}
PATCH /events/{eventId}/staff/{id}/deactivate
```

### 📝 Inscrições

```http
POST  /event-participants
GET   /event-participants
GET   /event-participants/{id}
PATCH /event-participants/{id}
PATCH /event-participants/{id}/approve
PATCH /event-participants/{id}/reject
PATCH /event-participants/{id}/cancel
```

### 🧱 Brackets, batalhas e rounds

```http
POST  /brackets/generate
GET   /brackets/event/{eventId}/category/{categoryId}

PATCH /brackets/battles/{battleId}/status

POST  /brackets/battles/{battleId}/rounds
GET   /brackets/battles/{battleId}/rounds

PATCH /brackets/rounds/{roundId}/status
```

### ⚖️ Atribuição de juízes

```http
POST  /judge-assignments/category/{categoryId}
GET   /judge-assignments/category/{categoryId}
PATCH /judge-assignments/category/{categoryId}/{assignmentId}/deactivate
```

### ⚙️ Configurações de julgamento

```http
POST   /judging-configurations/category/{categoryId}
GET    /judging-configurations/category/{categoryId}

POST   /judging-configurations/{configurationId}/criteria
GET    /judging-configurations/{configurationId}/criteria
PATCH  /judging-configurations/{configurationId}/criteria/reorder
PATCH  /judging-configurations/{configurationId}/criteria/{criterionId}
DELETE /judging-configurations/{configurationId}/criteria/{criterionId}

POST   /judging-configurations/{configurationId}/publish
POST   /judging-configurations/{configurationId}/versions
```

### 📝 Scorecards

```http
POST  /rounds/{roundId}/scorecards
GET   /rounds/{roundId}/scorecards

GET   /scorecards/{scorecardId}
PATCH /scorecards/{scorecardId}/criterion-scores/{criterionScoreId}
POST  /scorecards/{scorecardId}/submit
```

---

## 🧰 Qualidade e manutenção

Práticas adotadas ou recomendadas:

- DTOs para validação e documentação;
- `ValidationPipe` global;
- services com regras de negócio centralizadas;
- separação modular por domínio;
- JWT e RBAC;
- soft delete para preservação de histórico;
- constraints compostas no banco;
- transações Prisma para operações dependentes;
- documentação OpenAPI centralizada;
- testes manuais via Swagger;
- response DTOs para contratos claros;
- migrations versionadas via Prisma;
- validação de estados de batalha, round e scorecard;
- imutabilidade após publicação de configuração e submissão de scorecard.

---

## 📝 Próximos passos

As próximas entregas prioritárias do backlog são:

1. **US5.5 — Cálculo de vencedor da batalha**
   - consolidar avaliações submetidas;
   - definir critério de decisão e desempate;
   - persistir resultado de round e batalha.

2. **US1.2 — Setup do frontend Angular + Tailwind**
   - iniciar interface administrativa;
   - implementar painel visual de juiz com sliders TRIAD;
   - consumir endpoints de scorecards.

3. **US4.5 — Avanço automático na chave**
   - avançar vencedor para a próxima fase;
   - depender do resultado consolidado da batalha.

4. **US6.1 e US6.2 — Dashboards**
   - dashboard de mesa;
   - dashboard público/telão.

5. **US6.3 — Atualização em tempo real**
   - WebSocket para atualizações de julgamento, mesa e telão.

6. **US5.4 — Pré-seleção por categoria**
   - classificação Top N quando houver mais participantes aprovados do que vagas na chave.

7. **US5.6 e US7.4 — Auditoria**
   - trilha de eventos de julgamento;
   - logs operacionais e de segurança.

---

## 📌 Observações finais

O backend TRIAD já possui uma base funcional para organizar um evento de Breaking desde o cadastro administrativo até a avaliação estruturada de um round por um juiz.

No estado atual, estão consolidados:

```text
Autenticação e RBAC
→ Eventos, categorias, atletas e crews
→ Inscrições e aprovação
→ Brackets TOP8/TOP16
→ Batalhas e rounds operacionais
→ Juízes e atribuições
→ Configurações TRIAD versionadas e publicadas
→ Scorecards por round
→ Notas por competidor e critério
→ Edição em rascunho
→ Submissão e bloqueio de alterações
```

O próximo marco funcional é consolidar scorecards submetidos para determinar vencedores de rounds e batalhas.
