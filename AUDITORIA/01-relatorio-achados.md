# Auditoria FMS — Relatório de Achados

**Data:** 2026-04-28
**Escopo:** revisão de código (web Next.js + app Flutter do técnico)
**Não coberto:** Cloud Functions (`functions/`) e teste live do app

---

## Resumo executivo

O FMS está com a estrutura de domínio bem desenhada (state machine de Ticket, denormalização consciente, separação de portais por perfil), mas há **5 problemas críticos** que podem causar prejuízo operacional ou queima de custo de IA, e **um conjunto importante de gaps no nível Cloud Functions** que não consegui auditar nesta sessão (provavelmente onde mora a validação server-side que falta).

**Contagem por severidade:**
- CRÍTICO: 5
- ALTO: 11
- MÉDIO: 9
- Verificado e OK: 8

**Contexto importante:** o sistema hoje é **single-tenant** (`CompanyService.defaultCompanyId` em [firestore_service.dart:32](../../relatorio_tecnico/lib/services/firestore_service.dart)). Achados de "vazamento entre empresas" são **risco de roadmap** — viram CRÍTICO no dia que você onboardar a segunda empresa, mas hoje são ALTO. Tratei como ALTO no relatório com a etiqueta `[multi-tenant]` para você priorizar pré-onboarding.

**Tabela por dimensão:**

| Dimensão | CRÍTICO | ALTO | MÉDIO |
|---|---|---|---|
| Fluxo de domínio | 3 | 3 | 3 |
| Segurança aplicação | 0 | 5 | 2 |
| UX / mobile | 1 | 2 | 3 |
| IA | 1 | 1 | 1 |

---

## CRÍTICOS — aprofundamento técnico

### C1. OS pode ser finalizada sem relatório anexado

**Severidade:** CRÍTICO
**Arquivo:** [relatorio_tecnico/lib/providers/service_order_provider.dart:212-224](../../relatorio_tecnico/lib/providers/service_order_provider.dart)
**Dimensão:** fluxo de domínio

**O que está errado:**
```dart
Future<void> completeOrder(String orderId, {String? reportId}) async {
  await _firestoreService.updateServiceOrderStatus(
    orderId,
    OSStatus.concluida,
    extraFields: {
      'completedAt': Timestamp.now(),
      if (reportId != null) 'reportId': reportId,  // ← reportId é OPCIONAL
    },
  );
  await _syncLinkedTicket(orderId);
}
```

`reportId` é parâmetro nomeado opcional. Se o caller não passar (ou passar null), a OS vira `concluida` sem relatório. Não há `assert`, validação, ou query reverse-checking se existe um relatório com `serviceOrderId == orderId`.

**Como reproduzir:**
1. Logar como técnico
2. Abrir uma OS aceita
3. Não preencher relatório
4. Chamar `completeOrder(osId)` (botão "Finalizar" sem ter passado pela tela de relatório)
5. OS aparece como "Concluída" no admin, sem campo `reportId`

**Impacto no negócio:**
- Cliente recebe boleto sem laudo anexado → contesta cobrança.
- Sem evidência de antes/depois → cliente alega que serviço não foi feito.
- Sem assinatura → não há comprovação jurídica do atendimento.
- Auditoria pós-venda fica cega.

**Como corrigir:**

```dart
Future<void> completeOrder(String orderId, {String? reportId}) async {
  // Pré-condição: relatório obrigatório
  if (reportId == null) {
    final existing = await _firestoreService
        .getReportsByServiceOrderId(orderId)  // criar este método
        .first;
    if (existing.isEmpty) {
      throw const ServiceOrderException(
        'Não é possível finalizar OS sem relatório. '
        'Preencha o relatório técnico antes.',
      );
    }
    reportId = existing.first.id;
  }
  await _firestoreService.updateServiceOrderStatus(
    orderId,
    OSStatus.concluida,
    extraFields: {
      'completedAt': Timestamp.now(),
      'reportId': reportId,
    },
  );
  await _syncLinkedTicket(orderId);
}
```

E reforçar do lado servidor com Cloud Function `onServiceOrderUpdate` que rejeita transição para `concluida` sem `reportId` válido (a UI pode falhar; o backend é a verdade).

---

### C2. OS criada sem chamado fabrica chamado fake automaticamente

**Severidade:** CRÍTICO
**Arquivo:** [relatorio_tecnico/lib/providers/service_order_provider.dart:97-99 e 141-187](../../relatorio_tecnico/lib/providers/service_order_provider.dart)
**Dimensão:** fluxo de domínio + UX cliente

**O que está errado:**
```dart
final ticketId =
    order.linkedTicketId ?? await _createTicketFromOrder(order);
```

Quando admin cria OS direta, o método `_createTicketFromOrder` cria um `TicketModel` com:
- `subject: order.serviceType` (ex: "Manutenção corretiva")
- `description: 'Chamado criado automaticamente a partir da OS'`
- `origin: TicketOrigin.admin`
- `status: TicketStatus.aberto`

Esse chamado fake aparece no portal do cliente como se fosse um chamado dele. Ele recebe (no portal/email) um ticket que ele não abriu, com texto auto-gerado.

**Como reproduzir:**
1. Logar como admin
2. Criar OS direta para cliente X (sem selecionar chamado existente)
3. Logar no portal como cliente X
4. Ver chamado novo que ele não abriu, com texto "Chamado criado automaticamente a partir da OS"

**Impacto:**
- Cliente confuso ("eu abri esse chamado?").
- Fere expectativa de portal de auto-atendimento.
- Pode disparar workflow de notificação (email/WhatsApp) avisando "Você abriu um chamado" — mas ele não abriu.
- Ruído nos relatórios de "chamados abertos por cliente".

**Como corrigir:**

Opção A (recomendada — política):
```dart
// service_order_provider.dart
Future<String> createOrder(ServiceOrderModel order) async {
  if (order.linkedTicketId == null) {
    throw const ServiceOrderException(
      'Toda OS exige Chamado prévio. Abra ou selecione um chamado.',
    );
  }
  // ... resto
}
```
E adicionar na UI do admin um seletor obrigatório de chamado, com botão "Criar chamado rápido" que abre formulário de chamado de verdade (com dados que o admin preenche conscientemente).

Opção B (técnica — manter, mas marcar):
- Adicionar campo `Ticket.systemGenerated: bool` que oculta esse chamado do portal do cliente e dos relatórios "abertos por cliente".
- Mostrar no admin com badge "auto" para diferenciar.

**Decisão de produto que o dono precisa tomar:** OS sem chamado deve ser permitida ou não? Se sim, então cliente não deve ver. Se não, exigir chamado. A solução atual cria poluição.

---

### C3. IA: regeneração sem rate limit + auto-disparo silencioso

**Severidade:** CRÍTICO
**Arquivo:** [relatorio_tecnico/lib/screens/reports/elaborated_report_screen.dart:60-96, 149-152](../../relatorio_tecnico/lib/screens/reports/elaborated_report_screen.dart)
**Dimensão:** IA + custo

**O que está errado — duas camadas:**

**(a) Auto-disparo:** ao abrir a tela, se `elaboratedReport` está vazio, chama IA automaticamente sem confirmação:
```dart
Future<void> _initialize() async {
  final existing = widget.report.elaboratedReport;
  if (existing != null && existing.isNotEmpty) {
    _loadFromMap(existing);
    setState(() => _loading = false);
  } else {
    await _callElaborate();  // ← chama IA sem perguntar
  }
}
```

**(b) Botão "Regenerar" sem debounce/rate limit:**
```dart
IconButton(
  icon: const Icon(Icons.refresh_outlined),
  tooltip: 'Regenerar com IA',
  onPressed: _callElaborate,  // ← sem proteção contra cliques múltiplos
)
```

**Como reproduzir:**
- (a) Técnico ou admin curioso entra em qualquer relatório → IA gasta tokens automaticamente, mesmo se a pessoa só queria espiar.
- (b) Admin clica 5x rápido em "Regenerar" → 5 chamadas paralelas. Em hora de Wi-Fi ruim, o usuário acha que travou e clica de novo.

**Impacto:**
- Custo direto: a uma média de R$ 0,30 por chamada (Claude Sonnet, ~3k tokens), 100 admin/dia × 3 cliques médios = R$ 90/dia em IA inútil.
- Cota Gemini free tier (1500 req/dia) zera em pouco tempo se o time crescer.
- Documentos sucessivamente regenerados criam relatórios diferentes para a mesma OS (qual é o oficial?).

**Como corrigir:**

```dart
Future<void> _initialize() async {
  final existing = widget.report.elaboratedReport;
  if (existing != null && existing.isNotEmpty) {
    _loadFromMap(existing);
  } else {
    // Não chama IA automaticamente. Mostra botão "Gerar com IA"
    // e deixa o usuário decidir.
    setState(() => _needsGeneration = true);
  }
  setState(() => _loading = false);
}

// No build, quando _needsGeneration == true:
// ElevatedButton.icon(icon: Icon(Icons.auto_awesome),
//   label: Text('Gerar relatório com IA (custo ~R\$ 0,30)'),
//   onPressed: _callElaborate)

// E para regenerar, debounce + confirmação:
DateTime? _lastGenerationAt;
Future<void> _callElaborate() async {
  if (_lastGenerationAt != null &&
      DateTime.now().difference(_lastGenerationAt!).inSeconds < 10) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Aguarde 10s entre gerações.')),
    );
    return;
  }
  _lastGenerationAt = DateTime.now();
  // ...
}
```

E no servidor (`elaborateReport` Cloud Function), implementar **rate limit por usuário** com a coleção `ai_usage` que já existe no rules ([firestore.rules:163-168](../../relatorio_tecnico/firestore.rules)):

```javascript
// functions/elaborateReport.ts (pseudocódigo)
const userUsage = await db.doc(`ai_usage/${uid}/months/${yyyymm}`).get();
const reportGenerationsToday = userUsage.data()?.[`${today}.elaborate_count`] ?? 0;
if (reportGenerationsToday >= 20) {
  throw new HttpsError('resource-exhausted',
    'Limite de gerações por dia atingido. Edite manualmente.');
}
```

---

### C4. IA: erro bruto exposto ao usuário (vaza stack trace)

**Severidade:** CRÍTICO
**Arquivo:** [relatorio_tecnico/lib/screens/reports/elaborated_report_screen.dart:91-92, 175-177](../../relatorio_tecnico/lib/screens/reports/elaborated_report_screen.dart)

**O que está errado:**
```dart
} catch (e) {
  setState(() => _error = e.toString());  // ← exception bruta
}
// ...
Text('Erro ao elaborar relatório:\n$_error', textAlign: TextAlign.center),
```

`e.toString()` em `FirebaseFunctionsException` mostra coisas como:
```
[firebase_functions/internal] INTERNAL: Error: Failed to call OpenAI:
{"error":{"message":"Rate limit exceeded for ...","type":"rate_limit_error"}}
```

Inclui:
- Detalhes da Cloud Function que ninguém precisa ver.
- Mensagens do provider de IA (OpenAI/Anthropic/Gemini) com possíveis IDs internos.
- Em alguns casos, pedaços do prompt no traceback.

**Impacto:**
- Vaza qual provider você está usando (informação de competitor intelligence).
- Vaza estado interno (rate limit, que indica volume de uso).
- Quebra confiança ("o sistema é instável").

**Como corrigir:**
```dart
} on FirebaseFunctionsException catch (e) {
  setState(() => _error = _humanizeError(e));
} catch (e) {
  setState(() => _error = 'Não foi possível gerar o relatório. Tente em alguns minutos.');
}

String _humanizeError(FirebaseFunctionsException e) {
  switch (e.code) {
    case 'resource-exhausted':
      return 'Limite de gerações atingido. Tente novamente em alguns minutos ou edite manualmente.';
    case 'unauthenticated':
      return 'Sua sessão expirou. Faça login novamente.';
    case 'unavailable':
      return 'Serviço de IA indisponível agora. Edite o relatório manualmente.';
    default:
      return 'Não foi possível gerar o relatório. Você pode editar manualmente abaixo.';
  }
}
```

Aplicar o mesmo padrão em `_save` (linha 117) e `_exportPdf` (linha 134).

---

### C5. Cliente vê status técnico bruto ("pendente", "aguardandoDecisao")

**Severidade:** CRÍTICO (UX)
**Arquivos:** [report_model.dart:376-383](../../relatorio_tecnico/lib/models/report_model.dart), enums em ticket_model.dart, quote_model.dart
**Dimensão:** UX cliente

**O que está errado:**

Os enums `TicketStatus`, `OSStatus`, `ReportStatus`, `QuoteStatus` são usados diretamente como rótulos em UI. Onde existe `statusLabel`, ele apenas capitaliza:
```dart
String get statusLabel {
  switch (status) {
    case ReportStatus.pendente:
      return 'Pendente';
    case ReportStatus.concluido:
      return 'Concluído';
  }
}
```

Mas "Pendente" do ponto de vista do **sistema** é diferente de "Pendente" do ponto de vista do **cliente**. O cliente não sabe se "Pendente" significa:
- Estamos esperando ele aprovar algo
- Estamos esperando o técnico chegar
- Estamos esperando o orçamento sair
- Travado por nossa culpa

**Como reproduzir:**
1. Cliente abre chamado, vai ao portal.
2. Vê status: "Aguardando Decisão" (TicketStatus.aguardandoDecisao).
3. Cliente: "decisão de quem? minha? de vocês?"
4. Cliente liga reclamando.

**Impacto:**
- Volume de ligações desnecessárias para o atendimento.
- Cliente sente sistema confuso.
- Risco de cliente não aprovar orçamento porque não entendeu que era ele que tinha que clicar.

**Como corrigir — duas funções por enum:**

```dart
extension TicketStatusUI on TicketStatus {
  /// Label técnico — uso interno (admin/técnico).
  String get internalLabel { /* o que já existe */ }

  /// Label voltado ao cliente — diz O QUE ele precisa fazer.
  String get clientLabel {
    switch (this) {
      case TicketStatus.aberto: return 'Recebemos seu chamado';
      case TicketStatus.aguardandoDecisao: return 'Estamos avaliando';
      case TicketStatus.aguardandoAprovacao: return 'Aguardando sua aprovação';
      case TicketStatus.aprovado: return 'Aprovado — em execução';
      case TicketStatus.concluido: return 'Concluído';
      case TicketStatus.cancelado: return 'Cancelado';
    }
  }

  /// Texto explicando a próxima ação esperada.
  String get clientActionHint {
    switch (this) {
      case TicketStatus.aguardandoAprovacao:
        return 'Abra o orçamento e clique em Aprovar.';
      case TicketStatus.aprovado:
        return 'Nosso técnico vai entrar em contato.';
      // ...
    }
  }
}
```

E na tela do portal, mostrar `clientLabel` + `clientActionHint` em destaque.

---

## ALTOS

### A1. Service Account Firebase em arquivo `.env.local` no disco

**Arquivo:** [fms-site/.env.local](../.env.local) (referência ao padrão visto em `.env.example`)

**Status:** `.gitignore` cobre corretamente `.env*.local` e `.env` ([fms-site/.gitignore:27-29](../.gitignore)). **Não vai para o repo.**

**O que ainda é risco:**
- Cópia em backup do Mac (Time Machine, iCloud Drive).
- Cópia em outro projeto se você der `cp -R`.
- Roubo/perda do laptop.
- Compartilhamento acidental por screen-share gravada.

**Como corrigir:**
1. Garantir que App Hosting use **secrets gerenciados** (Firebase Secret Manager) em produção, não a env var copiada.
2. Em dev local, considerar usar o Firebase Emulator com Application Default Credentials em vez do private key direto.
3. Documentar no `README.md` que `.env.local` nunca deve sair do laptop.
4. Periodicamente girar a chave (a cada 90 dias).

### A2. `[multi-tenant]` Firestore Rules permitem qualquer usuário ler todos os tickets/OS/reports

**Arquivo:** [relatorio_tecnico/firestore.rules:55, 68, 76, 104](../../relatorio_tecnico/firestore.rules)

```
match /clients/{clientId}    { allow read: if isSignedIn(); }
match /service_orders/{...}  { allow read: if isSignedIn(); }
match /reports/{reportId}    { allow read: if isSignedIn(); }
match /tickets/{ticketId}    { allow read: if isSignedIn() || isClientOf(...); }
```

Hoje, com 1 tenant, isso só significa que **qualquer técnico vê tudo de qualquer cliente atendido pela SoluClean** — pode ser intencional. Mas:
- No dia 1 do segundo tenant, fica vazamento total.
- Já hoje, um técnico desonesto pode exportar a base inteira de clientes pela query.

**Correção (preparar o terreno):**
```
function isMyCompany(companyId) {
  return request.auth.token.companyId == companyId;
}

match /clients/{clientId} {
  allow read: if isSignedIn() && isMyCompany(resource.data.companyId);
}
```

E atualizar o backend de auth (signup/login) para incluir custom claim `companyId` no token.

### A3. `[multi-tenant]` Storage Rules sem filtro de companyId

**Arquivo:** [relatorio_tecnico/storage.rules:36-53](../../relatorio_tecnico/storage.rules)

O próprio comentário no código já diz: *"Quando existir mais de um tenant, esse match vira `match /{companyId}/photos_before/...` com check `companyId == request.auth.token.companyId`."* Mesma situação que A2 — risco roadmap, virar CRÍTICO no dia do segundo tenant.

### A4. Sincronização Ticket↔OS é best-effort (sem transação)

**Arquivo:** [relatorio_tecnico/lib/providers/service_order_provider.dart:240-255](../../relatorio_tecnico/lib/providers/service_order_provider.dart)

```dart
Future<void> _syncLinkedTicket(String orderId) async {
  try {
    // ... atualiza ticket
  } catch (_) {
    // Best-effort
  }
}
```

Se o sync falhar (rede caindo no momento exato), OS fica `concluida` mas Ticket continua `emDiagnostico`. Cliente vê "em diagnóstico" no portal enquanto técnico já saiu.

**Correção:** usar `WriteBatch` ou `Transaction` para atualizar OS + Ticket atomicamente. Se quer manter best-effort por performance, ao menos enfileirar em uma collection `pending_syncs` para retry posterior por Cloud Function scheduled.

### A5. Validação de orçamento expirado/cancelado depende da Cloud Function (não auditada)

**Arquivo:** [relatorio_tecnico/lib/services/client_portal_service.dart:260-276](../../relatorio_tecnico/lib/services/client_portal_service.dart)

`approveQuote` envia apenas `quoteId + cnpjPrefix`. Toda a validação (status == enviado, não expirado, não cancelado) está em `/api/approveQuote` (Cloud Function). **Não consegui auditar.** Risco se essa função aceitar:
- Quote com `status: cancelado`
- Quote criado há 60 dias quando `validityDays = 30`
- Quote re-enviado mas com items diferentes do original

**Ação:** abrir issue para auditar `functions/approveQuote.{ts,js}` em sessão separada. Garantir transação Firestore com release explícito.

### A6. Validação MIME de upload depende só do header (spoofável)

**Arquivo:** [relatorio_tecnico/storage.rules:38-40](../../relatorio_tecnico/storage.rules)

`request.resource.contentType.matches('image/.*')` checa o header enviado pelo client, não o magic byte. Um `.exe` renomeado e enviado com `Content-Type: image/jpeg` passa.

**Correção:** Cloud Function `onObjectFinalized` que abre os primeiros 8 bytes e valida (`FFD8FF` = JPEG, `89504E47` = PNG). Se inválido, deletar.

### A7. Logs com PII (email, uid) em produção

**Arquivo:** [fms-site/app/api/auth/signup/route.ts:90, 119, 175, 182](../app/api/auth/signup/route.ts)

`console.error('[signup] erro createUser:', e)` e `console.log(...email...uid...)`. Vão para Cloud Logging com PII — sob LGPD você não pode logar email indefinidamente sem propósito.

**Correção:** logar apenas o ID de correlação do request, não o email/uid. Se precisar de PII para debug, mover para Cloud Trace com retenção curta.

### A8. Sem `loading.tsx` / `error.tsx` em rotas Next.js → tela em branco

**Arquivos:** `app/workspace/`, `app/portal/`, etc — faltam.

Em fetch lento ou erro, usuário vê tela branca. No celular do cliente em 4G, isso parece "site quebrado".

**Correção:** criar `loading.tsx` (skeleton) e `error.tsx` (mensagem + botão "Tentar novamente") em cada segmento de rota. Next.js trata automaticamente.

### A9. Sem rate limit em `/api/contact` — formulário sales aberto a spam

**Arquivo:** [fms-site/app/api/contact/route.ts](../app/api/contact/route.ts)

Sem reCAPTCHA, sem rate limit por IP. Bot pode lotar a caixa de leads.

**Correção:** middleware com `Upstash Ratelimit` ou simples Map com TTL no Redis. Limite: 3 requests/IP/hora.

### A10. Botões de submit sem `disabled` durante envio (duplo clique)

**Arquivos:** `app/(auth)/criar-conta/page.tsx:194`, formulários do Flutter.

Em conexão lenta, usuário clica 3x → cria 3 contas/3 chamados.

**Correção:** `disabled={loading || !canSubmit}` + spinner no botão.

### A11. Foto sem compressão antes do upload no Flutter

**Arquivo:** [relatorio_tecnico/lib/services/storage_service.dart](../../relatorio_tecnico/lib/services/storage_service.dart) — `uploadPickedImage`

Foto de 8MB em 3G demora 30s+ e pode falhar. Técnico tira a foto de novo e o `OfflineUploadQueue` acaba com duplicata.

**Correção:** `flutter_image_compress` antes do upload (qualidade 70, max 1280×720). Imagem cai para ~200KB, indistinguível em laudos.

---

## MÉDIOS (compactos)

| # | Achado | Arquivo |
|---|---|---|
| M1 | Paginação sem cursor — `limit(200)` fixo, impossível ver tickets antigos | [firestore_service.dart:38-46](../../relatorio_tecnico/lib/services/firestore_service.dart) |
| M2 | Sem busca/filtro nas listagens (admin acha chamado #4821 só rolando) | `app/workspace/page.tsx` |
| M3 | Sem breadcrumb / posição de scroll perdida ao voltar | `app/workspace/layout.tsx` |
| M4 | Sem timeline pro cliente (vê só status atual, não histórico) | portal cliente |
| M5 | `inputMode` ausente em emails/telefones (mobile abre teclado errado) | `criar-conta/page.tsx` |
| M6 | Relatório técnico sem autosave — perda em queda de conexão | `report_form_screen.dart` |
| M7 | Denormalização de `technicianName` → admin troca nome, OS antigas ficam com nome velho | `service_order_model.dart` |
| M8 | Notificações WhatsApp/email sem retry — falha silenciosa | `whatsapp_service.dart` |
| M9 | Mistura terminológica ("chamado", "ticket", "OS", "job") na UI | múltiplos |

---

## Verificado e OK (não retestar)

1. **`.gitignore`** cobre `.env*.local`, `.env`, `.firebase/` — segredos não vão para o repo. ✅
2. **`isClientOf(clientId)`** nas rules de tickets/quotes ([firestore.rules:104, 113](../../relatorio_tecnico/firestore.rules)) garante que cliente do portal só vê seus próprios docs. ✅
3. **`isAdmin()`/`isDiretor()`** corretamente exigidos para writes destrutivos (delete client, delete equipment, delete debit_note). ✅
4. **`escapeHtml()`** no `/api/contact` previne XSS no email do lead. ✅
5. **Zod schemas** rigorosos em signup. ✅
6. **`ai_chats/{userId}`** nas rules — cada user só vê próprio chat. ✅
7. **`parts_price_list`** read-only via rules — só admin script edita. ✅
8. **Versão gate (`app_config`)** no boot do Flutter — você consegue forçar update remotamente. ✅

---

## Gaps de auditoria nesta sessão (próxima sessão)

1. **`functions/`** (Cloud Functions) — onde provavelmente moram `elaborateReport`, `approveQuote`, `lookupTicketByNumber`, `clientRegister`. **A maioria das validações server-side desejadas mora aqui.** Sem auditoria, o relatório fica capenga. **Recomendo abrir essa sessão antes da próxima release.**
2. **Cloud Functions de notificação** (WhatsApp/email) — retry, dead-letter, idempotência.
3. **`fms-site/app/api/auth/login/route.ts`** completo — não li o login flow inteiro.
4. **Site institucional** — leads form, microsite. Audit secundário, baixa prioridade.

---

## Priorização para sprint (se for atacar 1 sprint)

**Semana 1 — proteger receita e custo de IA:**
- C1 (OS sem relatório) — bloquear no client + Cloud Function
- C3 (IA sem rate limit) — adicionar debounce no client + counter na Cloud Function
- C4 (erro bruto da IA) — humanizar mensagens
- C5 (status técnico exposto) — extension `clientLabel` em todos os enums

**Semana 2 — UX e robustez:**
- C2 (OS sem chamado) — decisão de produto + implementação
- A4 (sync best-effort) — transação Firestore
- A8 (loading/error) — criar arquivos Next.js
- A11 (compressão de foto) — `flutter_image_compress`

**Semana 3 — preparar multi-tenant:**
- A2, A3 (Firestore + Storage rules com `companyId`)
- A1 (rotação de chave + secrets gerenciados)

Os MÉDIOS podem entrar em backlog regular — nada exige correção urgente.
