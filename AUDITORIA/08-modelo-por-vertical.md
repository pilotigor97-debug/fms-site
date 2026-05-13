# Plano: Modelos de Execução por Vertical (Opção D)

## Contexto

Hoje TODOS os 6 verticais usam o MESMO modelo `Ticket → OS` que foi desenhado pro SoluClean (rental + manutenção de equipamentos). Funciona pra rental + HVAC. **Não cabe** pra cleaning/landscaping/facilities/remodeling — os conceitos são diferentes.

**Trigger**: user percebeu que pra escalar pra outros segmentos vai precisar mudar.

**Princípio central**: cada vertical ganha o **modelo nativo do seu setor**. Não força todos a usar Ticket→OS. Mas mantém **collections compartilhadas** onde faz sentido (clients, users, quotes, reports, payments, audit logs).

**Resultado pós-implementação**:
- Cleaning admin abre o app → vê "Contratos" e "Visitas Agendadas" (não Tickets nem OSes)
- Facilities admin → vê "Postos", "Escalas", "Ocorrências" (3 entidades distintas)
- Remodeling admin → vê "Obras" com "Fases" e "Diários de Obra"
- Rental/HVAC continua igual (modelo atual fica)

---

## Diagnóstico — match atual vs ideal

| Vertical | Modelo atual | Modelo ideal | Migration cost |
|---|---|---|---|
| **Rental** | Ticket → OS (diagnostico/execucao) | ✅ Igual ao atual | Nenhum |
| **HVAC** | Ticket → OS | ✅ Igual ao atual (+ ficha técnica equip) | Nenhum |
| **Cleaning** | Ticket → OS | Contract → ScheduledVisit (recorrente) | Baixo (poucos clientes) |
| **Landscaping** | Ticket → OS | Igual cleaning | Nulo (sem clientes) |
| **Facilities** | Ticket → OS | Posts → Shifts + Incidents (3 collections) | Nulo (sem clientes) |
| **Remodeling** | Ticket → OS | Project → Phase + DailyLog + ChangeOrder | Nulo (sem clientes) |

**Insight estratégico**: só rental tem dados em prod (SoluClean). Outros 5 verticais ainda estão em "vertical templates fase 1.5" sem clientes pagantes. Migration cost ≈ 0 — agora é a hora.

---

## Princípio arquitetural

```
TICKET (universal)         ──► não obrigatório
  customer request
  whatsapp/portal/etc

CLIENT (universal)         ──► não muda
USER (universal)           ──► não muda
QUOTE (universal)          ──► pode linkar a OS, Visit ou Project
REPORT (universal)         ──► pode linkar a OS, Visit ou Phase
PAYMENT (universal)        ──► não muda
AUDIT_LOG (universal)      ──► não muda

ENTIDADE DE EXECUÇÃO:
  rental/hvac:   service_orders/ (modelo atual) ← Ticket-driven
  cleaning:      visits/                        ← Contract-driven (recorrente)
  landscaping:   visits/ (mesma coleção)        ← idem
  facilities:    posts/ + shifts/ + incidents/  ← Roster-driven + Event log
  remodeling:    projects/ → phases/            ← Project-driven (longo prazo)
```

Coleções **universais ficam universais**. Diferença é só na **entidade de execução** (o que substitui OS).

**Roteamento de UI**: `company.settings.vertical` decide quais módulos aparecem no drawer e qual collection o app consulta. Já tem essa infra (Sprint Verticals Phase 1.5).

---

## Modelos detalhados

### A) Cleaning + Landscaping — `visits/` collection

**Schema:**
```
/visits/{id}
  companyId: string                   // tenant
  clientId: string                    // dono do imóvel/local
  contractId: string?                 // null se one-off, set se recorrente
  technicianId: string?               // pode ser unassigned

  // Agendamento
  scheduledDate: Timestamp
  estimatedDurationMinutes: number    // default 60
  
  // Status simplificado (5 valores, não 6 como OS)
  status: 'scheduled' | 'in_progress' | 'completed' | 'missed' | 'canceled'
  
  // Execução
  checkInAt: Timestamp?               // GPS check-in
  startedAt: Timestamp?
  completedAt: Timestamp?
  
  // Cleaning-specific
  checklistTemplateId: string?        // ref pra contracts/{id}.checklistTemplate
  checklistCompleted: { [taskId]: bool }
  photosBefore: string[]              // Storage paths
  photosAfter: string[]
  
  // Customer feedback
  customerRating: 1-5?
  customerComment: string?
  
  notes: string?
  createdAt, updatedAt, updatedBy
```

**Status enum** (`lib/models/visit_model.dart`):
```dart
enum VisitStatus {
  scheduled,    // agendada, técnico não chegou
  inProgress,   // checkin feito, executando
  completed,    // todas tasks do checklist done + fotos OK
  missed,       // técnico não foi (no-show)
  canceled,     // cliente cancelou OU clima OU outros
}
```

**Sem** `diagnostico/execucao/retorno` (não fazem sentido pra cleaning).

**Materialização automática**: já existe `materializeRecurringContracts` CF (commit a19f27a). Adaptar pra criar `visits/` em vez de `service_orders/` quando `company.settings.vertical ∈ ['cleaning', 'landscaping']`.

**Ticket SUMME do drawer cleaning/landscaping**, mas continua existindo como **collection compartilhada** pra one-off requests. Se cliente fala "preciso de uma faxina extra fora do contrato", admin abre TICKET → vira VISIT one-off (sem contractId).

### B) Facilities — `posts/` + `shifts/` + `incidents/`

**3 collections distintas**, conceitos fundamentalmente diferentes.

#### `posts/` — Estações/postos da operação

```
/posts/{id}
  companyId
  clientId               // qual prédio/cliente este posto serve
  name: string           // "Portaria principal", "Recepção", "Garagem nível 2"
  type: 'portaria_24h' | 'portaria_12h' | 'recepcao' | 'seguranca_patrimonial'
  rosterTemplate: {      // template de escala
    monday: [{ startHour: 7, endHour: 19 }, { startHour: 19, endHour: 7 }],
    // ... dia da semana
  }
  active: bool
  createdAt, updatedAt
```

#### `shifts/` — Turnos efetivamente atribuídos

```
/shifts/{id}
  companyId
  postId                 // qual posto
  technicianId           // qual vigilante/porteiro
  startTime: Timestamp
  endTime: Timestamp
  status: 'scheduled' | 'in_progress' | 'completed' | 'no_show' | 'covered_by_other'
  checkInAt: Timestamp?  // bate-ponto chegada
  checkOutAt: Timestamp?
  coveredBy: userId?     // se outro técnico cobriu
  rondas: [              // ronda checkpoints
    { checkpointId, qrScannedAt, expectedAt }
  ]
  notes: string?
```

#### `incidents/` — Log de ocorrências

```
/incidents/{id}
  companyId
  postId                 // onde aconteceu
  shiftId                // durante qual turno
  reportedBy: userId     // porteiro que registrou
  
  category: 'visitante' | 'entrega' | 'manutencao' | 'seguranca' | 'outros'
  severity: 'info' | 'warning' | 'critical'
  
  title: string          // resumo curto
  description: string    // detalhe
  photos: string[]
  occurredAt: Timestamp
  
  followupRequired: bool
  followupAction: string?
  followupCompletedAt: Timestamp?
  followupBy: userId?
  
  createdAt, updatedAt
```

**Roteamento facilities**: ticket continua existindo (cliente final pode abrir ocorrência via portal), mas converte pra `incident/` automaticamente.

### C) Remodeling — `projects/` + subcollection `phases/` + `daily_logs/`

#### `projects/` — Obras

```
/projects/{id}
  companyId
  clientId                // dono da obra
  
  name: string            // "Reforma Apto 302 Edifício Mar Azul"
  address: string         // local da obra (pode diferir do endereço do cliente)
  
  status: 'planning' | 'in_progress' | 'paused' | 'completed' | 'canceled'
  startedAt: Timestamp?
  expectedEndDate: Timestamp?
  actualEndDate: Timestamp?
  
  budgetTotal: number     // soma dos quotes
  spentTotal: number      // soma das despesas
  
  responsiblePmId: userId  // PM/mestre de obra responsável
  
  notes, createdAt, updatedAt, updatedBy
```

#### `projects/{id}/phases/{phaseId}` — Fases (subcollection)

```
/projects/{projectId}/phases/{phaseId}
  name: string            // "Demolição", "Alvenaria", "Elétrica", "Acabamento"
  order: number           // 1, 2, 3...
  
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  startedAt, completedAt
  expectedDurationDays: number
  
  team: [userId]          // equipe alocada
  budget: number          // orçamento da etapa
  notes
```

#### `projects/{id}/daily_logs/{logId}` — Diários de obra (subcollection)

```
/projects/{projectId}/daily_logs/{logId}
  date: Timestamp
  reportedBy: userId
  
  weather: 'sunny' | 'cloudy' | 'rain' | 'storm'
  team: [userId]          // quem estava no canteiro
  hoursWorked: number     // total homem-hora
  
  workDone: string        // texto livre — "Concluído contrapiso quarto 1, iniciado quarto 2"
  blockers: string?       // "Falta cimento — esperando entrega"
  photos: string[]
  
  createdAt
```

#### `projects/{id}/change_orders/{coId}` — Alterações de escopo

```
/projects/{projectId}/change_orders/{coId}
  requestedBy: 'client' | 'contractor'
  description: string     // "Cliente quer trocar piso de cerâmica por porcelanato"
  costDelta: number       // +R$ 1.500 ou -R$ 800
  daysDelta: number       // +3 dias ou -1
  
  status: 'proposed' | 'approved' | 'rejected'
  approvedAt, approvedBy
  
  createdAt
```

**Ticket pra remodeling**: ENTRADA do funil ainda usa Ticket ("cliente pede reforma"). Após orçamento aprovado, vira **Project**. Ticket é arquivado.

### D) Rental + HVAC — SEM MUDANÇA

Mantém:
- `tickets/` (TicketStatus, TicketOrigin, TicketPriority)
- `service_orders/` (OSStatus, OSType)

Único ajuste: **HVAC ganha campo extra em `equipment/`** com ficha técnica (BTU, gás, modelo, último PMOC, etc). Mas estrutura de Ticket→OS fica igual.

---

## UI changes per vertical

### Drawer (já é vertical-aware via `vertical_modules.dart`)

| Vertical | Itens no drawer |
|---|---|
| **rental/hvac** | OPERAÇÃO (Chamados, OSes, Despacho, Calendário) — **igual hoje** |
| **cleaning** | OPERAÇÃO (Contratos, Visitas Hoje, Visitas Próximas, Calendário) — esconde Chamados |
| **landscaping** | Igual cleaning, EN |
| **facilities** | OPERAÇÃO (Postos, Escala, Ocorrências) + ADM (Contratos) |
| **remodeling** | OPERAÇÃO (Obras, Fases em Andamento) + ADM (Orçamentos) |

### Telas novas (criar por vertical)

| Vertical | Tela | Substitui |
|---|---|---|
| cleaning | `VisitsListScreen` | ServiceOrdersListScreen (quando vertical=cleaning) |
| cleaning | `VisitDetailScreen` | ServiceOrderFormScreen |
| facilities | `PostsListScreen` (gestão de postos) | — novo |
| facilities | `RosterScreen` (escala visual semanal) | — novo |
| facilities | `IncidentsListScreen` | — novo |
| facilities | `IncidentDetailScreen` | — novo |
| remodeling | `ProjectsListScreen` | — novo |
| remodeling | `ProjectDetailScreen` (com tabs: fases / diário / orçamentos / change orders) | — novo |
| remodeling | `DailyLogFormScreen` | — novo |

### Telas que ficam (universal — não mudam)

- ClientsListScreen + ClientFormScreen
- QuotesListScreen + QuoteFormScreen (linka a OS, Visit, ou Project via `linkedTo: { type, id }`)
- ReportsListScreen + ReportFormScreen (linka idem)
- TeamManagementScreen
- ContractsListScreen — adaptar pra mostrar contratos diferentes por vertical
- Manuais
- Settings / Branding / AI Credits

---

## Migration strategy

### Backward compat

Para tenants existentes que usam o modelo atual (rental SoluClean):
- Nada muda. Continuam em `service_orders/` com TicketStatus/OSStatus.
- Cleaning tenants (se existirem): migration script copia OSes recorrentes pra `visits/` mantendo dados. Marca antigos como "legacy:true".

### Quando o vertical muda? (decisão de produto)

**Vertical é IMUTÁVEL** (já é regra hoje — ver `firestore.rules:84-87`). Tenant escolhe no signup e fica. Trocar de vertical = migration manual via Platform Console.

Pra novo tenant: ao signupCompany com vertical específico, app já decide qual collection usar (`visits` ou `service_orders` etc).

### Compartilhamento entre verticais

Edge case: tenant **multi-vertical** (ex: empresa de facilities QUE TAMBÉM faz cleaning como serviço adicional). Hoje não suportado (1 vertical por company). **Decisão**: não suportar multi-vertical agora. Se necessário, criam segunda company com vertical diferente.

---

## Roadmap (5 fases — 1 vertical por fase)

### Fase 1 — Foundation + Cleaning (1-2 sprints)

**Pré-trabalho** (refactor universal):
- Renomear `OSStatus.label` no domínio de rental pra deixar mais óbvio
- Adicionar campo `linkedTo: { type, id }` em quotes/reports pra apontar pra ScheduledVisit/Project (não só OS)
- Generalizar `materializeRecurringContracts` CF pra criar `visits/` quando vertical=cleaning

**Cleaning UI**:
- `lib/models/visit_model.dart` (novo)
- `lib/services/visit_service.dart` (CRUD)
- `lib/screens/saas/visits_list_screen.dart` (substitui ServiceOrdersList quando vertical=cleaning)
- `lib/screens/saas/visit_form_screen.dart`
- Drawer: esconde "Chamados" + renomeia "OSes" → "Visitas"

**Firestore**:
- Nova rule pra `visits/`
- Nova index `visits (companyId, scheduledDate)` + `(companyId, technicianId, scheduledDate)`

**Test**: criar contrato semanal pra SoluClean (fake cleaning tenant em dev), verificar materialização.

### Fase 2 — Landscaping (½ sprint)

Mesma estrutura de cleaning. Reuso da collection `visits/` e modelos. Diferença é só copy/labels EN e features (weather-aware, route optimization — Fase 5).

### Fase 3 — Facilities (2-3 sprints — maior trabalho)

**Novas collections**: posts/ + shifts/ + incidents/

**Novas screens**: 4 (Posts list, Roster visual, Incidents list, Incident detail).

**CFs novas**:
- `materializeShiftsFromRoster` (agendada — cria shifts dos próximos 7 dias a cada noite)
- `notifyShiftMissed` (trigger — alerta admin se shift começa sem check-in em 15min)

**Mobile-first**: porteiro registra incident pelo celular com foto, hora automática.

### Fase 4 — Remodeling (2-3 sprints)

**Novas collections**: projects/ + subs (phases, daily_logs, change_orders)

**Novas screens**: ProjectsList + ProjectDetail (com tabs) + DailyLogForm

**Quote workflow muda**: quote agora pode ser por FASE (não obra inteira), ou geral. UI escolhe.

### Fase 5 — Polish + Cross-cutting

- Analytics cross-vertical (MRR por vertical, top performers)
- Sales-led signup com escolha de modelo de execução
- Bulk migration tool (admin pode reclassificar dados antigos)
- AI prompts ajustados pra vocabulário específico (mestre de obra ≠ porteiro)

---

## Estimativa de esforço

| Fase | Esforço focado | Calendário sozinho | Com 1 dev |
|---|---|---|---|
| 1 — Cleaning | 25-35h | 2 semanas | 1 semana |
| 2 — Landscaping | 8-12h | 3-4 dias | 2 dias |
| 3 — Facilities | 40-50h | 3 semanas | 2 semanas |
| 4 — Remodeling | 40-50h | 3 semanas | 2 semanas |
| 5 — Polish | 20-30h | 1-2 semanas | 1 semana |

**Total**: ~130-180h focado. ~10-12 semanas sozinho. ~6-7 semanas com 1 dev.

---

## Arquivos a criar/modificar

### Novos (estimativa: ~3500 linhas)

**Backend (`opspilot/functions/`)**:
- `visits/` directory — handlers + materialization
- `posts.js`, `shifts.js`, `incidents.js` — CRUD + queries
- `projects.js` — Project + Phase + DailyLog handlers
- Adapt `materializeRecurringContracts.js` pra escolher visits/ vs service_orders/

**Flutter (`opspilot/lib/`)**:
- `models/visit_model.dart`
- `models/post_model.dart`, `shift_model.dart`, `incident_model.dart`
- `models/project_model.dart`, `phase_model.dart`, `daily_log_model.dart`
- `services/visit_service.dart`, `post_service.dart`, `shift_service.dart`, `incident_service.dart`, `project_service.dart`
- Screens correspondentes (~10 novas screens)

**Firestore**:
- `firestore.rules` — match blocks pra todas as 5 novas collections
- `firestore.indexes.json` — ~10 composite indexes novos

### Modificações (estimativa: ~800 linhas)

- `lib/widgets/app_drawer.dart` — branches mais ricos por vertical
- `lib/verticals/vertical_modules.dart` — adicionar módulos posts/shifts/incidents/projects
- `lib/models/quote_saas_model.dart` — campo `linkedTo: { type, id }` polimorfico
- `lib/models/report_saas_model.dart` — idem
- `firestore.rules` — ajustar regras de quote/report pra polimorfismo
- Existing `materializeRecurringContracts` CF — branch por vertical

---

## Riscos & mitigações

| Risco | Mitigação |
|---|---|
| Quote/Report polimórfico fica confuso (linka a 3 tipos diferentes) | Campo `linkedTo: { type: 'service_order' \| 'visit' \| 'project_phase', id: string }`. Type-check via switch no UI. |
| Analytics cross-vertical complica (MRR por vertical, top tenants) | Aggregação agendada noturna em `platform_metrics_daily` (já planejado no Console). Cada métrica decide qual coleção somar baseado em `company.settings.vertical`. |
| Tenant que MUDA vertical perde acesso aos dados antigos | Vertical é imutável (já é regra). Mudança = ticket de suporte + migration manual via Console. |
| Code drift entre verticais (3 modelos diferentes pra manter) | Compartilhar máximo possível via mixins/interfaces. Status enums vivem em models, validação fica no service. Tests por vertical. |
| AI prompts ficam confusos (vocabulary mistura) | `verticals.json` já tem `aiContext.{pt,en}` por vertical. Reusar pattern. |

---

## Critério de sucesso por fase

### Fase 1 (Cleaning) ✅ quando:
- Cleaning tenant abre app → vê drawer com "Contratos" + "Visitas" (sem Chamados)
- Cria contrato semanal → 4 visitas auto-materializadas pra próximas 4 semanas
- Técnico abre visita do dia → check-in GPS → faz checklist → fotos antes/depois → conclui
- Customer rating disponível
- Admin vê analytics: % visitas concluídas, NPS médio, tempo médio de execução

### Fase 3 (Facilities) ✅ quando:
- Admin cria posto "Portaria 24h Edifício X"
- Define escala (turno A: vigilante José 0-12h, turno B: vigilante Maria 12-24h)
- Sistema auto-cria shifts pros próximos 7 dias
- Vigilante abre app → vê seu turno do dia → check-in QR no posto
- Durante turno, registra ocorrência ("Caminhão de mudança entrou 14h, saiu 17h")
- Admin vê dashboard: postos ativos, ocorrências de hoje, shifts sem check-in

---

## NÃO faz parte deste plano

1. **Suporte a multi-vertical** (1 tenant rodando cleaning + facilities simultâneo) — não suportado, criar 2 companies
2. **Migration de tenant entre verticais** — manual via Platform Console quando solicitado
3. **Cross-vertical analytics** (1 dashboard mostrando TODOS verticais juntos pro dono) — coberto pelo Platform Console Fase 2
4. **Time tracking detalhado por shift** (facilities folha de pagamento) — Fase 5 ou separado
5. **Integração com ERP/contabilidade** — fora de escopo
6. **App nativo iOS** — PWA + Android continua suficiente

---

## Decisões pendentes pro dono

1. **`visits/` collection vs `service_orders/` com discriminator** — recomendo collection separada (cleaner, sem if-else por toda parte)
2. **Ticket fica em cleaning?** — recomendo MANTER mas esconder do drawer (admin pode acessar via URL direta pra one-off requests, principalmente do portal cliente)
3. **Quote vinculado a Visit faz sentido?** — sim pra one-off (cliente pede faxina especial, admin gera quote → executa visit). Não pra recorrente (já tem contrato).
4. **Cleaning também precisa de "Project" pra trabalhos longos?** (ex: limpeza pós-obra de 3 dias) — recomendo NÃO. Modela como N visits sequenciais com mesmo contractId.

---

## Verificação end-to-end (após Fase 1)

1. Em [Platform Console](https://fms-site--opspilot-dev.us-central1.hosted.app/admin), criar tenant cleaning manual (ou via signup `/criar-conta?vertical=cleaning`)
2. Logar como diretor desse tenant → drawer mostra "Contratos" + "Visitas" (não "Chamados")
3. Criar contrato recorrente semanal pra um cliente teste
4. Verificar Firestore: doc em `visits/` criado automaticamente pra próxima segunda-feira
5. Logar como técnico → app mostra visita do dia → check-in → checklist → conclui
6. Cliente acessa portal → vê histórico de visitas com foto antes/depois + opção de rating
7. Admin vê analytics: 1 visita concluída esta semana

---

## Conexão com outros planos

- **Platform Console (AUDITORIA/07)**: Fase 5 (bulk operations) ganha tool pra migrate vertical de tenants
- **Nota 10 (AUDITORIA/06)**: melhora Op Exp + EUA — facilities/remodeling deixam de ser vaporware
- **i18n (AUDITORIA/05)**: cada vertical novo precisa de strings traduzidas — `visits.scheduled = "Scheduled"` etc

Antes de começar Fase 1, deve estar pronto:
- Platform Console Fase 1 (✅ done)
- HVAC: ficha técnica de equipamento (não cobre neste plano, mas independente)

Pode rodar em paralelo:
- i18n bilíngue (string keys novos podem ser criados durante esta refatoração)
