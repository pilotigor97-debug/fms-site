# Plano: nota 10 em todos os eixos do FMS

## Contexto

Auditoria de 2026-05-12 deu notas 5–8 em 9 eixos. Este plano lista o que muda em cada eixo, sequencia por fases (1 → 4), e marca **9 como target sólido** vs **10 como aspiração**.

**Honesto:** 10 em tudo é raro em SaaS — sempre tem trade-off (segurança max vs UX simples; performance vs ergonomia de código). Plano realista mira **9 em todos** com 10 em **Segurança** e **IA** (que viram diferencial competitivo do FMS).

**Já feito em 2026-05-12** (não reentrar):
- 4 críticos de segurança fechados + deploy em dev (lookupClientByCnpj/trackTicket/getQuoteClient/lookupCompanyByCnpj per-(companyId,IP) rate limit + structured log, ASAAS_WEBHOOK_TOKEN separado da API key, `canPurchase` enforcement em chargeCredits, PAYMENT_OVERDUE fix)
- Site `/[vertical]/` dinâmico + 6 verticais
- Site `/download` com guia de PWA iPhone
- Pipeline de ícone FMS (script + flutter_launcher_icons)

Notas pós-fixes estimadas: **Segurança 8→9.5, IA 7.5→8.5.** Os outros eixos não mudaram ainda.

---

## Roadmap por fase

| Fase | Foco | Duração | Mira |
|---|---|---|---|
| **1. Bloqueio de venda** | Críticos remanescentes que matam churn em 30d | 2-3 semanas | Tirar 5.5–6 pra 7.5 |
| **2. Polish profissional** | Tudo que separa MVP de produto pago a sério | 3-4 semanas | Tirar 7.5 pra 9 |
| **3. Best-in-class** | Features que viram diferencial vs Jobber/ServiceTitan | 6-8 semanas | Tirar 9 pra 10 onde possível |
| **4. Sustain 10** | Processo contínuo pra não regredir | Permanente | Manter 9-10 |

---

## Eixo a eixo

### 1. UX — 6.5 → 9 (target) / 10 (aspirado)

**Gap pra 9:**
- Form validation visual (asterisco em obrigatórios, validação inline em `onChanged`, mensagens humanizadas)
- Save buttons com disable durante async + protection contra double-click
- Loading states diferenciados (skeleton pra forms grandes, spinner pra rápido, ghost pra listas)
- Empty states motivacionais (técnico com 0 OS hoje vê "Próximo amanhã 09h. Você completou X esta semana")
- Error humanization layer global (zero `e.toString()` no UI)

**Ações concretas:**
1. **Form validation system** — criar `lib/widgets/form/`:
   - `RequiredField` widget que renderiza label com `*` + validator embutido
   - `InlineValidator` mixin que dispara onBlur
   - Aplicar em: ticket_form, service_order_form, report_form, quote_form, client_form, signup
2. **SaveButton widget** padrão: `onPressed: _saving ? null : _save` + spinner inline + texto "Salvando..."
3. **Skeleton library** (`lib/widgets/skeleton/`): SkeletonForm, SkeletonList, SkeletonDetail. Substituir 20+ `CircularProgressIndicator`
4. **Error layer** (`lib/utils/error_humanizer.dart`): mapeia HttpsException + PlatformException → mensagem PT + ação sugerida
5. **Empty state library**: `EmptyStateCard(icon, headline, body, ctaLabel, ctaAction)`

**Gap pra 10 (aspirado):** acessibilidade WCAG AA (screen readers, contrast ratio, tab order), animations de transição, micro-feedback (haptics + sound). Geralmente requer time de design dedicado.

---

### 2. Estabilidade — 5.5 → 9 (target) / 10 (aspirado)

**Gap pra 9:**
- Retry queue local pra todos os uploads (foto, áudio, autosave de relatório)
- Idempotency keys em todas as callables que criam recursos (signup, createOrder, createQuote)
- OCC explícito em mutations concorrentes (já tem em updateOrder, expandir)
- Smoke tests em todas CFs deployadas (3 ainda sem teste: polishReportText, computeEquipmentAlerts, sendPushOnAlertCritical)

**Ações concretas:**
1. **Persistent retry queue** (`lib/services/upload_queue_service.dart`):
   - Usar `sqflite` (já dep) pra persistência local
   - Tabela `pending_uploads(id, type, payload, attempts, last_error, created_at)`
   - Background isolate retenta com exponential backoff
   - UI mostra contador "3 uploads pendentes" no drawer
2. **Idempotency** em callables: cliente gera `requestId` (UUID v4), CF rejeita duplicata via doc `idempotency_keys/{requestId}` com TTL 24h
3. **OCC expansion**: aplicar pattern de `updateOrder` em `updateTicket`, `updateReport`, `updateQuote`
4. **Smoke tests Jest** pras 3 CFs sem cobertura — pelo menos happy path + 1 erro
5. **Auto-save banner não-discreto**: se >2 falhas consecutivas, banner amarelo no topo. >5 falhas: banner vermelho bloqueante

**Gap pra 10:** Chaos engineering periódico (Asaas down, Gemini down, Firestore down), CI que roda load test antes de deploy.

---

### 3. Performance — 7 → 9 (target) / 10 (aspirado)

**Gap pra 9:**
- Calendar com filtro de data obrigatório (hoje carrega todas as OSes)
- IA per-company rate limit (hoje só per-user)
- Aggregate queries em dashboards (hoje counta no client)
- Lazy loading em listas longas (tickets, OSes, manuais)

**Ações concretas:**
1. **Calendar pagination** — [calendar_view_screen.dart]:
   - Trocar `streamOrders().first` por `streamOrdersByMonth(year, month).first`
   - Service: `where(scheduledDate, isGreaterThanOrEqualTo, startMonth).where(..., isLessThan, endMonth)`
   - Re-buscar quando user troca de mês
2. **IA per-company rate limit** em `ai_credits.js::chargeCredits`:
   - Adicionar `enforceRateLimit(companyId, 60, 60_000)` (60 req/min por company)
   - Combina com per-user existente
3. **dailyCapBrl padrão** (não opt-in):
   - Signup grava `aiCredits.dailyCapBrl = 20` por default
   - Admin pode aumentar via UI
4. **Aggregate queries** em painel exec — Firestore tem `count()`, `sum()`, `avg()` nativos agora
5. **List pagination** com `cursor + limit(25)` em TicketsListScreen, OrdersListScreen

**Gap pra 10:** Performance budgets em CI (bundle size, FCP, TTI), Firestore index audit trimestral, edge caching pra reads públicos do portal.

---

### 4. Segurança — 8.5 (pós-fixes) → 9.5 (target) / 10 (aspirado)

**Gap pra 9.5:**
- Firebase App Check em modo soft (logging only, depois enforce)
- IP-rate-limit strict (hoje cai em `unknown_` silenciosamente — virar throw)
- Audit logs com retention/cleanup policy

**Ações concretas:**
1. **Firebase App Check** — multi-step:
   - Flutter: adicionar `firebase_app_check` ao pubspec, register em `main.dart` antes do `runApp`
   - DebugProvider em dev, AppAttest em iOS, PlayIntegrity em Android, ReCaptcha em web
   - CFs: `enforceAppCheck: true` em todas onCall (já é default em v2 mas verificar)
   - Migração: 2 semanas em modo "log only" pra detectar quebras, depois enforce
2. **public_helpers.js::checkIpRateLimit**: novo param `strict: true` que faz throw em vez de skip quando IP unknown. Aplicar nos signupCompany + lookupClientByCnpj
3. **Audit logs cleanup** — TTL 1 ano via TTL policy do Firestore (configurar via gcloud)
4. **Pen test profissional** (externo, ~$3-5k US) — 1x antes de lançar pra US

**Gap pra 10:** SOC 2 compliance (~$15-30k US, 6 meses), GDPR completo (DPO designado, processo de DSAR), Bug bounty program (HackerOne low-tier).

---

### 5. Mobile — 6 → 9 (target) / 10 (aspirado)

**Gap pra 9:**
- Desktop drag-drop offset quebrado (dispatch_lane.dart:118-132)
- Mobile drag sem descoberta (LongPressDraggable sem hint)
- Teclados errados (CNPJ não-numérico, sem máscara)
- Photo upload sem compressão (4MB sobe 4MB)
- Calendar pt_BR nunca testado em runtime

**Ações concretas:**
1. **Fix dispatch drag desktop**: refatorar `_onAcceptWithDetails` em [dispatch_lane.dart:118-132] pra usar `RenderBox.globalToLocal(details.offset)` corretamente — `details.offset` é canto do feedback, precisa somar `feedbackSize/2` pra centro
2. **Mobile drag tutorial overlay**: first-time UI hint via `SharedPreferences` flag `mobile_drag_hint_seen`. Mostra "Segure o card pra mover" como tooltip nos primeiros 3 dispatches
3. **inputFormatters por field**:
   - CNPJ: `MaskTextInputFormatter('##.###.###/####-##')` + `keyboardType: number`
   - Telefone: `MaskTextInputFormatter('(##) #####-####')` + `phone`
   - Email: `keyboardType: emailAddress`
   - Hora: `keyboardType: number`
4. **Photo compression** antes do upload — `flutter_image_compress` (~50KB lib), comprimir pra 1200px max + quality 80
5. **Calendar runtime test**: abrir tablet emulator, navegar pra calendar, verificar pt_BR. Adicionar smoke test widget
6. **Touch targets ≥48dp** em todos botões mobile (auditar via `flutter analyze --suggestions`)

**Gap pra 10:** Gesture-driven workflows (swipe pra completar OS, pull-to-refresh tactil), offline indicator persistente, dark mode native, dynamic font scale respect.

---

### 6. IA — 8.5 (pós-fixes) → 9.5 (target) / 10 (aspirado)

**Gap pra 9.5:**
- Per-user rate limit hoje permite 5 técnicos coordenados estourarem quota
- Pricing strict (`getPricing` retorna default se doc não existe — fix em `ai_credits.js:280-282`)
- Prompt versioning (gravar `prompt_version` em ai_usage_log)
- Visibility do gasto pro user antes de chamar IA

**Ações concretas:**
1. **Per-company rate limit** (já mencionado em Performance acima)
2. **Pricing strict** em `ai_credits.js::getPricing`: throw se doc não existe (forçar admin configurar antes). Backfill: script que cria docs default em todas companies
3. **Prompt versioning**: 
   - Cada feature tem `prompts/{feature}/{version}.txt` versionado
   - `ai_usage_log` grava `promptVersion` por chamada
   - A/B test framework: 10% das chamadas usam `version: experimental`
4. **UI: saldo + custo estimado** antes do botão:
   - Audio recorder: "Esta gravação consome 1 crédito (R$ 0.10). Você tem 47."
   - Polish: "1 crédito. Você tem 47."
5. **Cost guard frontend**: balance + dailyCapBrl visível em settings page

**Gap pra 10:** Multi-modal (foto → descrição via IA), proactive insights ("este equipamento já teve 3 chamados em 30 dias, considere preventiva"), customer-facing IA (cliente pergunta status, IA responde via timeline pública). Esses são features de produto novas, não defesa.

---

### 7. Escalabilidade — 5.5 → 9 (target) / 10 (aspirado)

**Gap pra 9:**
- SendGrid free tier (100/dia) — estoura com 30 clientes ativos
- FCM sem TTL — pushes de 2 semanas atrás chegam agora
- Calendar carrega tudo na RAM (já em Performance)
- EquipmentAlerts pode estourar com 200 companies (já tem chunking, testar)

**Ações concretas:**
1. **SendGrid paid** ($15/mo para 40k emails) OU **Postmark** ($15/mo) OU **Resend** ($20/mo). Decidir e atualizar Mail Extension
2. **FCM TTL** em `push_notifications.js`:
   - Push padrão: `android.ttl: 3600` (1h) — alerta perde valor depois disso
   - Push de status: `android.ttl: 86400` (24h)
3. **Notification grouping**: `android.notification.tag: alertType_companyId` pra agrupar alertas críticos
4. **Stress test computeEquipmentAlerts**: criar 200 companies sintéticas em dev, rodar trigger, medir tempo. Se >300s, aumentar `COMPANY_CONCURRENCY` ou refatorar pra Pub/Sub
5. **Backup strategy** documentada: monthly export pra Cloud Storage (cron CF já existe), retention 12 meses

**Gap pra 10:** Multi-region failover (Firestore tem mas precisa testar), CDN pra portal público, queue-based processing pra picos (Pub/Sub em vez de Firestore triggers diretas).

---

### 8. Experiência operacional — 6 → 9 (target) / 10 (aspirado)

**Gap pra 9:**
- Técnico em campo offline perde dado (audio, photo, autosave) — overlap com Estabilidade
- Role gating com furos (botão Polir IA visível pro técnico, _PartDialog mostra custo pro técnico)
- Empty states desmotivadores
- Ônibus factor: SoluClean = único caso real, qualquer regression em rental quebra
- Sem visibility do "próximo passo" em cada tela

**Ações concretas:**
1. **Offline-first architecture** (já contemplado em Estabilidade)
2. **Role gating audit completo**:
   - Grep `_isAdminOrDiretor` + auditar TODOS os screens com preço/lucro/custo/IA
   - Wrap em `if (user.isAdmin) ... else SizedBox.shrink()`
   - Especifico: `report_form_screen.dart:1779-1780` (Polir IA), `_PartDialog` (Custo un.)
   - **Campo novo** `users/{uid}.canRecordAudio: bool` pro admin habilitar áudio por técnico
3. **Motivational empty states** — pattern "estado vazio mostra próximo passo concreto":
   - 0 OS hoje: "Próximo: amanhã 09h SoluClean LTDA. [Ver detalhe]"
   - 0 manuais cadastrados: "Sem manuais ainda. [Subir o primeiro] reduz tempo de diagnóstico em ~40%"
   - 0 clientes: "Cadastre o primeiro cliente pra começar"
4. **Beta com 3 tenants reais não-SoluClean** — uma cleaning + uma facilities + uma rental (não-SoluClean). Identifica regressões que SoluClean não vê
5. **Drawer admin com collapse** quando >12 items

**Gap pra 10:** Customer success embed (no app, mini-guides contextuais), Slack/Email digest diário pro admin, IA assistant proativo no drawer ("Você tem 3 alertas críticos hoje").

---

### 9. Padrão EUA — 5 → 8 (target) / 9 (aspirado)

**Gap pra 8:**
- "4.200 equipes" e "v4.2" fictícios — credibilidade zerada quando notado
- /recursos é stub (sem screenshots, sem video)
- Sem case study real (mesmo se for só SoluClean, vira social proof)
- Telefone fake `+55 (11) 4000-0182`
- Senha mínima 6 chars (US/SOC2 exige 8+)
- Cleaning só (US precisa landscaping/HVAC equivalente, hoje só copy de landing)

**Ações concretas:**
1. **Retirar fakes**:
   - Remove "4.200 equipes" da home OU substituir por "Em uso por equipes de limpeza, locação e HVAC no Brasil"
   - Remove "v4.2"
   - Telefone real ou remover
2. **Completar /recursos** com:
   - 4 screenshots reais do app (dispatch board, OS form, report polish, equipment alerts)
   - 1 video 30s do dispatch (Loom)
   - Comparação "antes (planilha) / depois (FMS)" com print real
3. **Case study SoluClean**:
   - Página `/clientes/soluclean` com: foto do dono, 3 métricas reais (tempo gasto antes/depois, lucro/mês, churn), quote de 2 frases
   - Logo da SoluClean na home strip
4. **Password policy upgrade**: min 8 chars + 1 número (front + back), strength meter visual
5. **HVAC ficha de equipamento** — primeira feature visível pra um vertical não-cleaning:
   - Campo `equipmentSpecs: { model, brand, btuCapacity, refrigerant, lastPmocDate }` em equipment_model
   - UI HVAC-specific de "ficha técnica" em equipment_detail
   - Tira HVAC de vaporware
6. **Sales-led flow real** — `/contato` form com vertical preset, captura via Calendly link (não só form submit + 1 dia)
7. **Stripe acceptance** se for tentar US — Asaas é só BR

**Gap pra 9:**
- 3 case studies de verticais diferentes
- 5 reviews G2/Capterra (precisa ter 5+ clientes pagantes primeiro)
- Integração nativa QuickBooks/Xero (US accounting)
- Suporte 24/5 ou pelo menos chat ativo (Intercom)

**Gap pra 10 (aspirado):** SOC 2 Type II, integrações com top-3 ferramentas que cada vertical usa, marca reconhecida no nicho, eventos/podcasts.

---

## Fases consolidadas

### Fase 1 — Bloqueio de venda (2-3 semanas)

Foco: tirar tudo que faz cliente cancelar nos primeiros 30 dias.

- [ ] Form validation system + SaveButton padrão
- [ ] Retry queue local pra uploads
- [ ] Fix dispatch drag desktop (dispatch_lane.dart:118-132)
- [ ] inputFormatters mobile (CNPJ, telefone, hora)
- [ ] IA per-company rate limit + pricing strict
- [ ] Calendar pagination obrigatória
- [ ] Role gating audit (Polir IA, custo de peça, canRecordAudio)
- [ ] SendGrid paid ou Postmark
- [ ] FCM TTL config
- [ ] Photo compression antes upload
- [ ] Senha 8 chars + strength meter

**Resultado esperado**: notas sobem pra UX 8, Estabilidade 7.5, Performance 8, Mobile 8, IA 9, Escalabilidade 7.5, Op Exp 8.

### Fase 2 — Polish profissional (3-4 semanas)

Foco: tudo que separa MVP de "produto pago a sério".

- [ ] Skeleton library + loading state diferenciados
- [ ] Error humanization layer global
- [ ] Empty states motivacionais
- [ ] Mobile drag tutorial overlay
- [ ] Firebase App Check soft mode
- [ ] Aggregate queries em dashboards
- [ ] Auto-save banner urgente em >2 falhas
- [ ] /recursos completa com screenshots + video
- [ ] Retirar "4.200 equipes" + v4.2 + telefone fake
- [ ] Case study SoluClean publicado
- [ ] Notification grouping FCM
- [ ] Smoke tests Jest pras 3 CFs sem teste

**Resultado esperado**: UX 9, Estabilidade 9, Performance 9, Segurança 9.5, Mobile 9, IA 9.5, Escalabilidade 8.5, Op Exp 8.5, US 7.

### Fase 3 — Best-in-class (6-8 semanas)

Foco: features que viram diferencial vs concorrentes.

- [ ] HVAC ficha de equipamento + PMOC scheduler
- [ ] Facilities escala 24h/12h + livro ocorrências
- [ ] Remodeling timeline de etapas
- [ ] Rental inspeção entrada/saída fotográfica
- [ ] Prompt versioning + A/B framework IA
- [ ] Multi-modal IA (foto → descrição)
- [ ] App Check enforce
- [ ] Beta com 3 tenants reais não-SoluClean
- [ ] Penetration test profissional
- [ ] Idempotency keys em callables
- [ ] Customer success embed (mini-guides contextuais)
- [ ] Stripe integration (se US)

**Resultado esperado**: 9 em todos os eixos, 10 em Segurança e IA.

### Fase 4 — Sustain 10 (contínuo)

- Pen test anual
- Performance budgets em CI
- Audit log retention policy
- Backup verification mensal
- G2/Capterra após 5 clientes
- Quarterly architecture review

---

## Estimativa de esforço

Sem time dedicado, pelo ritmo atual (1 dev = você, com bursts de claude):

| Fase | Trabalho ininterrupto | Realisticamente |
|---|---|---|
| Fase 1 | 2-3 semanas (~40h focused) | 4-6 semanas |
| Fase 2 | 3-4 semanas (~60h focused) | 6-8 semanas |
| Fase 3 | 6-8 semanas (~120h focused) | 12-16 semanas |
| Fase 4 | contínuo | contínuo |

**Total Fase 1+2+3** ≈ 6-9 meses calendário no ritmo atual. Aceleração realista: contratar 1 dev fullstack + 1 designer 6 meses → 3-4 meses.

---

## Eixos onde 10 é INVIÁVEL hoje (assumir 9)

1. **Padrão EUA**: 10 requer SOC 2 Type II ($30k+, 6+ meses), 50+ clientes pagantes, marca reconhecida. Plano realista: 8-9.
2. **Escalabilidade**: 10 requer multi-region, edge caching, queue-based architecture — overengineering pra <500 companies. Plano: 9.
3. **Experiência operacional**: 10 requer customer success team. Plano: 9.

Os outros 6 eixos têm 10 alcançável com investimento + tempo.

---

## NÃO faz parte deste plano

1. **Re-arquitetura do app** — codebase atual é sólida, não é refactor que falta
2. **Migrar de Firestore pra Postgres** — não justificado no horizonte de 2 anos
3. **Multi-region failover** — overengineering pra MVP
4. **App nativo iOS** ($99 Apple Dev + dev time) — PWA cobre por enquanto, decidido em sessão anterior
5. **Tradução completa pra EN** — plano de i18n separado em [AUDITORIA/05-plano-i18n-bilingue.md], retomar quando relevante
6. **Marketing automation** (Hubspot, Mailchimp) — depois de 10 clientes pagantes

---

## Próximos 3 passos sugeridos (se quiser começar hoje)

1. **Fix dispatch drag desktop** ([dispatch_lane.dart:118-132]) — bug crítico isolado, 2-3h, libera dispatch web
2. **Form validation system** — base pra refatorar todos os forms, 1-2 dias, melhora UX em 6 telas de uma vez
3. **inputFormatters mobile** (CNPJ, telefone) — 2-3h, conserta data quality + corrige busca quebrada
