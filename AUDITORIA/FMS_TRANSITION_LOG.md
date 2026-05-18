# FMS Transition Log

> **Doc consolidado** das transições arquiteturais e decisões do FMS.
> Substitui múltiplos arquivos avulsos por 1 índice navegável. Cada
> chapter aponta pra arquivo dedicado quando o conteúdo merece doc
> próprio, ou contém inline quando é curto.
>
> **Como usar:** ler em ordem cronológica pra entender o histórico.
> Quando criar feature/refactor, adicionar chapter novo no fim com
> data, decisão, alternativas consideradas e referência ao commit/PR.

---

## Histórico arquitetural

### 2026-04-28 — Auditoria inicial pós-Fase 1

Status: Fase 1 + 5 sprints (Foundations, Polish+Timeline, Lucro+IA,
Operação Visual, Alertas) entregues em `feat/foundations`.

Auditoria documentou: produto 5.0 / UX 4.5 / estabilidade 3.5. Pronto
pra Brasil ~4.5 (sem billing + sem testes).

📄 Referências:
- [01-relatorio-achados.md](./01-relatorio-achados.md)
- [02-checklist-testes-manuais.md](./02-checklist-testes-manuais.md)
- [03-roteiro-seguranca-aplicacao.md](./03-roteiro-seguranca-aplicacao.md)
- [04-analise-risco-operacional.md](./04-analise-risco-operacional.md)

### 2026-05-12 — Plano i18n bilíngue PT/EN

Aprovado, **não implementado**.

📄 [05-plano-i18n-bilingue.md](./05-plano-i18n-bilingue.md)

### 2026-05-12 — Plano nota 10

UX 6.5→9 (8 fases) + Rental 4→9 (3 sprints). **Não implementado**.

📄 [06-plano-nota-10.md](./06-plano-nota-10.md)

### 2026-05-13 — Platform Console

Console interno (10 módulos, 5 fases). Fase 1 MVP em implementação.

📄 [07-arquitetura-platform-console.md](./07-arquitetura-platform-console.md)

### 2026-05-13 — Modelo por Vertical (Opção D)

Cada vertical ganha entidade nativa (Visit/Post/Project) em vez de
Ticket→OS forçado. Rental/HVAC mantém.

📄 [08-modelo-por-vertical.md](./08-modelo-por-vertical.md)

### 2026-05-17 — Brand film master entregue

45s · 9:16 vertical · Remotion. Master em `~/development/fms-brand-film/`.
Plus plano facilities brand film 75s em `~/development/fms-brand-film-facilities/`.

📄 README dos projetos brand film + screenshots.

### 2026-05-18 — Sessão controle financeiro Fase 1+2 + boot azul

Sessão intensa de ~14h. Entregou Fase 1+2 controle financeiro completo
(WAC, Supplier, Expense, Encargos CLT, LaborCostStrategy, ContractMargin
V2). Incidente boot azul pré-demo PROFAC.

📄 [10-auditoria-2026-05-18.md](./10-auditoria-2026-05-18.md) — auditoria executiva
📄 [13-bug-boot-azul-postmortem.md](./13-bug-boot-azul-postmortem.md) — postmortem

Commits relacionados em `feat/vertical-templates-phase-1.5`:
- `9861b0a` feat(financeiro): Fase 1+2 controle financeiro completo + fixes
- `d043669` docs(main): TODO comment Sprint 1 Bloco 1D home pós-login
- `a5aa2a4` feat(0F): feature flag global
- `340c4d3` feat(0E): backfill CF posts → positions + sites
- `067fa83` feat(0B): smoke_boot.sh + integrado nos deploys

---

## Roadmap em curso

Plano completo em `~/.claude/plans/hoje-nos-temos-os-async-ocean.md`.

**Roadmap nota 8 — 20 semanas (~470h):**
- Sprint 0 (2 sem): Investigação + setup processo + antecipações
- Sprint 1 (4 sem): Bugs críticos + Financeiro Fase 3 + Home v1-Lite
- Sprint 2 (4 sem): Migração v2 + Bundle Contract + Roles + Dashboard Exec
- Sprint 3 (4 sem): Performance + Polish + Prod + Pentest
- Sprint 4 (4 sem, opcional): Command Center Enterprise Home

**Status atual (2026-05-18, fim de sessão):**
- ✅ Sprint 0 Fase A — top ROI (16h): 0F + 0E + 0B done
- ⏳ Sprint 0 Fase B: 0A postmortem (✓ este arquivo + 13-) + 0G doc consolidado (✓ este arquivo)
- ⏳ Sprint 0 Fase C (opcional): 0D Theme v3 (adiar se Sprint 4 não confirmado)

---

## Chapters

### Chapter 1 — Auditoria executiva 2026-05-18

📄 [10-auditoria-2026-05-18.md](./10-auditoria-2026-05-18.md)

**Resumo:** nota média 5.4/10. Top 20 críticos. Mira nota 7.5 em 3 meses
+ 4 extras pra Command Center.

### Chapter 2 — Bug Boot Azul Postmortem 2026-05-18

📄 [13-bug-boot-azul-postmortem.md](./13-bug-boot-azul-postmortem.md)

**Resumo:** app não bootou pré-demo. Root cause: processo (cache stale +
build incremental + service worker), não código. Mitigações
implementadas (smoke_boot.sh, flutter clean, preview channels).

### Chapter 3 — ERP v2 Transição (em curso)

**Resumo:** modelo Facilities migrando de `Cliente → ClientLocation →
Post → Shift → Incident` (v1) pra `Cliente → Contract → Site → Position
→ Allocation → Shift → Incident` (v2).

Status:
- ✅ Layer v2 criada (sites/, positions/, employee_allocations/)
- ✅ CF `materializeShifts` lê allocations
- ✅ Shim `PostService.getPost` fallback positions (Fase 1.5)
- ✅ CF `backfillPositionsFromPosts` (Sprint 0 Bloco 0E)
- ⏳ Sprint 2 Bloco 2A: migrar UI + deletar PostModel/posts/

### Chapter 4 — Controle Financeiro Arquitetura

**Resumo:** Fase 1 (WAC + price history), Fase 2 (Supplier + Expense +
Encargos CLT + LaborCostStrategy + ContractMargin V2), Fase 3 (P&L
snapshot + cash flow + export) — TODO Sprint 1.

**Decisões-chave:**
- 1 contrato pode ter múltiplas linhas de serviço (Sprint 2)
- Encargos modular CLT completo (INSS 20% + FGTS 8% + Sistema S 5.8% +
  RAT 2% + Incra 0.2% + Sebrae 0.6% + Salário-educação 2.5% + Provisões
  13º/férias ~22%) ≈ 50% sobre salário
- Benefícios rateados por horas trabalhadas (Maria 60h Atlas + 40h
  Solaris → benefits proporcionalmente)
- `ContractMarginService` tem V1 (legacy) e V2 (cross-vertical) com
  feature flag `useNewMarginCalc`
- `LaborCostStrategy` por vertical (`company.settings.vertical` resolve
  shifts-based / visits-based / project-based / service-order-based)

📁 Models em `lib/models/{supplier,expense,employee_compensation,
item_price_history}_model.dart`.
📁 Services em `lib/services/{supplier,expense,employee_compensation,
benefit_proration,item_price_history,labor_cost/}.dart`.
📁 CFs em `functions/{facilities/price_history_writer,
finance/expense_to_cost_center}.js`.

### Chapter 5 — Design System v3 (Sprint 4 — adiado)

**Status:** placeholder. Antecipado pro Sprint 0 mas Igor escolheu adiar
(otimização O1) — Theme v3 só vale se Sprint 4 (Command Center) for
confirmado. Caso contrário, telas Sprint 1-3 ficam no design atual.

**Tokens propostos** (quando ativar):
- bg `#0A0E1A`, surface `#131825`, accent `#2C7AFF`
- Status verde `#10B981` / amber `#F59E0B` / vermelho `#EF4444`
- Inter Display 11/12/13/14/16/20/24 (mais densos que atual)
- Spacing 4/8/12/16/24/32/48

### Chapter 6 — Feature Flags Global

**Status:** implementado Sprint 0 Bloco 0F (commit `a5aa2a4`).

📁 [lib/config/feature_flags.dart](../../opspilot/lib/config/feature_flags.dart)

**Flags conhecidas:**
- `useNewMarginCalc` — ContractMargin V2 cross-vertical (Sprint 0)
- `useNewHome` — Home pós-login v1-Lite (Sprint 1 Bloco 1D)
- `useCommandCenter` — Command Center Enterprise (Sprint 4)
- `useAuditSearch` — Audit Search UI (Sprint 2 Bloco 2D)
- `useBundleContract` — Bundle Contract (Sprint 2 Bloco 2B)

**Storage:** `companies/{cid}.settings.featureFlags.<flagName>`. Default
`false`. Backward compat: lê forma legada (`settings.<flagName>`) se a
nova não existir.

**URL override (dev):** `?ff=cc,nh,ncm` (aliases: cc → useCommandCenter,
nh → useNewHome, ncm → useNewMarginCalc, as → useAuditSearch, bc →
useBundleContract).

**Princípio:** rollback de feature agora é virar bit, não `git stash`.
Lição direta do incidente 2026-05-18.

### Chapter 7 — Command Center Enterprise (Sprint 4 — futuro)

**Status:** especificado no roadmap, não implementado.

**Resumo:** redesign completo do shell (sidebar enterprise + header +
breadcrumbs + busca global + Home Desktop Command Center 9 widgets +
Home Mobile Cockpit + Bottom Nav 5 items + Theme v3).

**Inspiração:** TradingView, Stripe, Linear, Bloomberg, SAP Fiori,
ServiceTitan, Monday Enterprise.

**Princípio:** "O que precisa da minha atenção AGORA?" — não "aqui estão
gráficos aleatórios". Cor = status, nunca decorativa.

📄 Especificação completa no plan file `~/.claude/plans/hoje-nos-temos-os-async-ocean.md`
seção "SPRINT 4".

### Chapter 8 — Processo de branches e deploy (regras pós-2026-05-18)

**Princípios:**

1. **Toda mudança em `main.dart`, `AppDrawer`, route resolvers**: branch
   isolada + feature flag + preview channel + smoke obrigatório. ZERO
   exceção.
2. **Mudanças >2 arquivos com UI/rota**: branch isolada.
3. **`git stash -u` antes de experimentar**: recuperação trivial.
4. **Smoke `boot.sh` antes de qualquer deploy pra dev**: bloqueia bundle
   parcial / asset faltando.
5. **`flutter clean` em todo build pra deploy**: nunca depender de
   incremental cache.
6. **Reverter rápido > debugar lento** em janela crítica.

**Comandos padronizados:**

```bash
# Preview channel pra feature isolada
firebase hosting:channel:deploy <feature> --only dev --expires 7d -P opspilot-dev

# Deploy dev (com smoke automático integrado)
cd ~/development/opspilot && ./scripts/deploy_dev.sh

# Sync fms-site (build:flutter com clean já integrado)
cd ~/development/fms-site && npm run build:flutter && firebase deploy --only apphosting -P opspilot-dev

# Backup stash antes de operação destrutiva
git stash show -p > /tmp/backup-stash-$(date +%Y%m%d-%H%M).patch
```

---

## Convenções de doc

- Numeração `NN-titulo.md` mantida pra histórico (01-08 + 10 + 13).
- 11 e 12 reservados (controle-financeiro-arquitetura e roadmap-nota-8
  — quando criar como docs próprios).
- Este arquivo (`FMS_TRANSITION_LOG.md`) sem número — é índice/log
  consolidado.
- Adicionar entry cronológico no "Histórico arquitetural" sempre que
  algo grande mudar.
