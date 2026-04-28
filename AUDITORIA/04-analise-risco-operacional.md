# Análise de Risco Operacional — FMS / SoluClean

**Foco:** impacto financeiro/reputacional para a operação SoluClean (cleaning service).
**Lente:** o que pode dar errado em produção que **gera prejuízo de verdade**, não só "bug feio".

Para cada risco: cenário concreto, probabilidade × impacto, mitigação operacional (processo) e mitigação técnica (código).

---

## Matriz resumo

| # | Risco | Prob. | Impacto | Score | Prioridade |
|---|---|---|---|---|---|
| R1 | OS finalizada sem relatório → cliente contesta cobrança | Alta | R$ 500–5k por incidente | 9 | **AGORA** |
| R2 | IA queima crédito por uso descontrolado | Alta | R$ 500–3k/mês | 9 | **AGORA** |
| R3 | Cliente confunde status, liga reclamando | Muito alta | tempo do atendimento + churn | 8 | **AGORA** |
| R4 | OS sem chamado polui portal do cliente | Alta | confiança/percepção | 6 | Mês |
| R5 | Sincronização Ticket↔OS falha → cliente vê status errado | Média | R$ 200–2k por incidente | 7 | Mês |
| R6 | Orçamento aprovado expirado → você executa em base errada | Baixa | R$ 1k–10k por incidente | 6 | Mês |
| R7 | Multi-tenant leak quando onboardar 2ª empresa | Inevitável* | catastrófico | 10 | Pré-onboarding |
| R8 | Vazamento de Service Account (laptop perdido) | Baixa | catastrófico | 8 | Mês |
| R9 | Spam no `/api/contact` lota caixa de leads | Média | atrapalha vendas | 4 | Trimestre |
| R10 | Foto não sobe (técnico em campo) → laudo sem evidência | Alta | R$ 200–500 por incidente | 6 | Mês |

\* "Inevitável" no sentido de que será CRÍTICO quando acontecer; pode-se postergar mas não evitar.

---

## Risco 1 — OS finalizada sem relatório

**Cenário concreto:**
> Técnico foi atender Cliente Y, esqueceu de preencher o relatório (pressa, internet ruim). Clicou direto em "Finalizar OS". Sistema aceita. Admin emite cobrança 7 dias depois (R$ 1.200). Cliente contesta: "não tenho laudo, não pagar". Empresa fica sem documento, perde a discussão, abate ou desconta a cobrança.

**Probabilidade:** Alta — é o esquecimento mais comum em campo.
**Impacto financeiro:** R$ 500 a R$ 5.000 por evento, dependendo do ticket médio. Sem laudo, **risco também jurídico** se for serviço com obrigação contratual de relatório.
**Score:** 9/10 — combinação probabilidade × dinheiro.

**Mitigação operacional (processo):**
- Treinar técnicos: "OS sem relatório é igual a serviço não feito" — reforço nos huddles semanais.
- Admin **não emite cobrança** sem ver `reportId` na OS (confere antes de gerar fatura).
- Auditoria mensal das OS concluídas sem `reportId` → reabrir e pedir relatório retroativo.

**Mitigação técnica (código):**
- Bloquear `completeOrder` no Flutter (achado C1 do relatório).
- Cloud Function `onServiceOrderUpdate` rejeita transição → `concluida` sem `reportId` válido.
- Dashboard admin com alerta "OS concluídas sem relatório nos últimos 7 dias".

**Sinais para monitorar:**
- Query Firestore semanal: `service_orders.where(status, ==, 'concluida').where(reportId, ==, null)`.
- Volume normal: 0. Qualquer número > 0 é incidente.

---

## Risco 2 — IA queima crédito sem controle

**Cenário concreto:**
> Time cresce de 5 para 20 técnicos. Cada um gera 3 relatórios/dia, regenera 2x cada por curiosidade ou desconfiança. 20 × 3 × 3 = 180 chamadas/dia. A R$ 0,30 por chamada = **R$ 1.620/mês** só de IA. Pior, os relatórios ficam diferentes a cada regeneração, ninguém sabe qual é o oficial.

**Probabilidade:** Alta. Hoje é 3 técnicos, cresce sem você perceber.
**Impacto financeiro:** R$ 500 a R$ 3.000/mês recorrentes. Ou cota Gemini free (1500 req/dia) zera, sistema para.
**Score:** 9/10 — silencioso e composto.

**Mitigação operacional:**
- Definir política: "regenerar IA = caso excepcional, justificar". Treinar o time.
- Revisar `ai_usage` quinzenalmente. Quem está acima da média explicar.
- Considerar: criar 1 versão IA por OS, depois é edição manual.

**Mitigação técnica:**
- Achado C3: rate limit no client (debounce 10s) + servidor (`ai_usage` counter, máx 20/dia/usuário).
- Botão "Regenerar" mostra contador: "Você gerou 3 de 5 versões hoje".
- Não auto-disparar IA ao abrir tela — exige clique.

**Sinais:**
- Custo mensal Anthropic/OpenAI/Gemini bate o orçamento previsto.
- Top 5 usuários no `ai_usage`. Se 1 usuário >> média, conversar.

---

## Risco 3 — Cliente confunde status, liga reclamando

**Cenário concreto:**
> Cliente abre chamado. Volta ao portal 2 dias depois. Vê status: **"Aguardando Decisão"**. Pensa: "decisão de quem? eu já decidi!". Liga no atendimento. Atendente explica que é decisão **da SoluClean** (avaliando se faz diagnóstico ou orçamento direto). Cliente irritado: "esse sistema é confuso". Repete em escala: 50 chamados/mês × 30% que ligam = 15 ligações/mês desnecessárias = ~5h de atendimento perdidas.

**Probabilidade:** Muito alta — acontece todo dia.
**Impacto:** Tempo do atendimento (custo direto) + percepção ruim (custo indireto, churn).
**Score:** 8/10 — afeta NPS sem você perceber.

**Mitigação operacional:**
- Atendimento tem script: "Se cliente ligar perguntando status, perguntar exatamente o que ele viu na tela. Anotar.".
- Coletar 10 prints de "status que confundiu cliente" e usar como base de microcópia.

**Mitigação técnica (achado C5):**
- Extension `clientLabel` em todos os enums com texto que diz **o que o cliente precisa fazer agora**.
- "Aguardando Decisão" → "Estamos avaliando seu chamado".
- "Aguardando Aprovação" → "**Aguardando você aprovar o orçamento** ➜ [link]".
- Linha do tempo no portal — cliente vê histórico, não só status atual.

**Sinais:**
- Volume de ligações por motivo "dúvida sobre status".
- Tempo médio entre orçamento enviado e aprovado: se > 3 dias, cliente provavelmente não viu a notificação.

---

## Risco 4 — OS sem chamado polui portal do cliente

**Cenário concreto:**
> Admin cria OS direto para Cliente X (atendimento por telefone, fora do fluxo normal). Sistema cria automaticamente um chamado fake com texto "Chamado criado automaticamente a partir da OS". Esse chamado aparece no portal do cliente X. Cliente vê, fica confuso ("eu não abri esse chamado"), liga reclamando. Pior: se a notificação por email/WhatsApp foi disparada, ele recebeu "Você abriu um chamado", mas não abriu.

**Probabilidade:** Alta sempre que admin usa atalho.
**Impacto:** Confusão, ligações, percepção de descontrole.
**Score:** 6/10.

**Mitigação operacional:**
- Treinar admin: "OS direta = exceção. Use só para atendimentos por telefone urgentes."
- Avisar cliente por telefone ANTES de criar a OS direta: "vou registrar para a equipe, você vai ver no portal."

**Mitigação técnica (achado C2):**
- Decisão de produto: ou força chamado prévio (Opção A — recomendado) ou marca o chamado fake como `systemGenerated: true` e oculta do portal.

**Sinais:**
- Quantidade de tickets com `description == 'Chamado criado automaticamente a partir da OS'`.
- Reclamações no atendimento por "chamado que eu não abri".

---

## Risco 5 — Sincronização Ticket↔OS falha

**Cenário concreto:**
> Técnico finaliza OS com Wi-Fi instável. Atualização da OS sobe (`status: concluida`). Mas o `_syncLinkedTicket` falha silenciosamente (try/catch → ignore). Ticket continua `emDiagnostico`. Cliente vê portal: "Em diagnóstico" mesmo com OS finalizada. Cliente cobra: "você disse que finalizou ontem". Suporte abre Firestore, vê inconsistência, sincroniza manualmente. Em escala: 1 caso por semana = ~50/ano.

**Probabilidade:** Média (depende muito de qualidade de Wi-Fi/4G dos técnicos).
**Impacto:** R$ 200–2.000 por evento (atendimento extra, descontentamento, ocasional desconto).
**Score:** 7/10.

**Mitigação operacional:**
- Job mensal: query de OS concluídas onde Ticket.status ≠ esperado. Sincronizar em massa.
- Dashboard admin com "OS finalizadas hoje cujo chamado está em estado incompatível".

**Mitigação técnica (achado A4):**
- Substituir `_syncLinkedTicket` por `WriteBatch` ou `Transaction` Firestore — operação atômica.
- Se mantiver best-effort por performance, enfileirar falhas em `pending_syncs` e Cloud Function scheduled processa.

**Sinais:**
- Query semanal: OS `concluida` cujo Ticket linkedTicketId está em estado < `concluido`.
- Idade: se > 24h, é falha de sync.

---

## Risco 6 — Orçamento expirado aprovado

**Cenário concreto:**
> Você emitiu orçamento R$ 5.000 com validade 7 dias. Cliente demorou 30 dias. Em paralelo, peça encareceu (R$ 5.500 hoje). Cliente clica "Aprovar" no link antigo. Sistema aceita (não valida expiração). Você executa pelo preço antigo, perde R$ 500 de margem. Em volume: 1 caso/mês = R$ 6k/ano de margem queimada.

**Probabilidade:** Baixa-média. Depende de validação na Cloud Function `approveQuote` (não pude auditar — gap A5 do relatório).
**Impacto:** R$ 1.000 a R$ 10.000 por evento (depende do tamanho do orçamento e variação do custo).
**Score:** 6/10.

**Mitigação operacional:**
- Política: orçamento velho = re-emitir com novo preço. Avisar cliente.
- Notificação automática 1 dia antes da expiração: "Seu orçamento vence amanhã".

**Mitigação técnica:**
- Auditar `functions/approveQuote` — confirmar que valida `status == enviado` e `createdAt + validityDays > now`.
- Se não valida, adicionar a validação **e** retornar erro `quote-expired` ao cliente.
- UI do portal: orçamento expirado mostra "Expirado em [data]" + botão "Solicitar novo orçamento" em vez de "Aprovar".

**Sinais:**
- Quotes com `approvedAt - createdAt > validityDays * 24h`. Hoje: pode ser 0, mas depende da Cloud Function.

---

## Risco 7 — Multi-tenant leak quando onboardar 2ª empresa

**Cenário concreto:**
> Você fecha primeiro contrato com outro cleaner regional (Empresa B). Ela usa o FMS. Técnico da Empresa A (SoluClean) entra no app no dia seguinte e vê a lista completa de clientes da Empresa B na tela. Empresa B descobre, processa, cancela contrato, reembolso integral, indenização. Reputação queimada no mercado de FMS para o segmento.

**Probabilidade:** **Inevitável** se você onboardar com as rules atuais. Vai vazar no primeiro dia.
**Impacto:** Catastrófico — perda do contrato, multa, reputação.
**Score:** 10/10 — pré-onboarding obrigatório.

**Mitigação operacional:**
- **Não onboardar** Empresa B até A2/A3 estarem implementados.
- Auditoria pré-onboarding: rodar Bloco 3 do roteiro de segurança com 2 empresas fake. Confirmar que técnico A não vê dados de B.

**Mitigação técnica (achados A2 + A3):**
- Adicionar custom claim `companyId` no Firebase token via Cloud Function de signup.
- Atualizar Firestore Rules: cada read filtra por `companyId == request.auth.token.companyId`.
- Atualizar Storage Rules: mesma lógica em `match /{companyId}/...`.
- Auditar todas as queries no Flutter/Next.js: garantir que filtram por companyId no client (defense in depth).

**Sinais:**
- Antes de onboardar Empresa B, confirmar: ✅ Bloco 3 inteiro do roteiro passa.

---

## Risco 8 — Vazamento de Service Account

**Cenário concreto:**
> Mac roubado num restaurante. Ladrão acessa `/Users/fernandes/development/fms-site/.env.local`. Tem `FIREBASE_PRIVATE_KEY`. Em poucos minutos, escreve script Node que se autentica como Admin SDK e baixa toda a base Firestore + Storage. Vende dados ou contata seus clientes diretamente para extorsão.

**Probabilidade:** Baixa, mas catastrófica.
**Impacto:** LGPD (multa até R$ 50M ou 2% do faturamento), perda de todos os clientes, fim do negócio.
**Score:** 8/10 — improvável mas terminal.

**Mitigação operacional:**
- FileVault habilitado no Mac (Disk Encryption). **Confirmar agora.**
- Senha do Mac forte + Touch ID.
- Time Machine criptografada (não armazenar `.env.local` em backup unencrypted).
- Procedimento de incidente documentado: rotação de chave em < 30min.

**Mitigação técnica (achado A1):**
- Migrar de `.env.local` para Firebase Secret Manager em produção.
- Em dev, usar Firebase Emulator com Application Default Credentials (gcloud login) em vez de Service Account.
- Rotação trimestral programada.

**Sinais:**
- Alert no GCP: uso anormal do Service Account fora do horário comercial.
- Cloud Audit Logs: alerta se Admin SDK lê > 1k docs em < 1min.

---

## Risco 9 — Spam no formulário de contato

**Cenário concreto:**
> Bot descobre o `/api/contact`. Manda 5.000 emails fake de "Quero conversar" em 1h. Email da equipe de vendas fica bloqueado. Lead de verdade fica perdido na enxurrada.

**Probabilidade:** Média (depende de bot encontrar a URL).
**Impacto:** Baixo. Atrapalha vendas por algumas horas. Sem perda direta de receita.
**Score:** 4/10.

**Mitigação operacional:**
- Triagem: filtro no inbox por palavras suspeitas.
- Verificar com vendas: "Hoje recebeu mais leads do que normal?".

**Mitigação técnica (achado A9):**
- reCAPTCHA v3 ou Turnstile (Cloudflare) no formulário.
- Rate limit por IP em `middleware.ts` (Upstash, ou simples Map em memória).

**Sinais:**
- Volume diário de leads de `/api/contact`. Padrão estável é ~5/dia, pulo para 100 = ataque.

---

## Risco 10 — Foto não sobe → laudo sem evidência

**Cenário concreto:**
> Técnico em obra, sem Wi-Fi, com 4G fraco. Tira 5 fotos de antes/depois (8MB cada). Tenta upload. App trava ou foto perde. Técnico finaliza relatório só com 1 foto. Admin emite laudo. Cliente contesta: "vocês limparam mesmo? cadê as fotos?" Resposta: "tivemos problema na foto". Cliente desconta R$ 500.

**Probabilidade:** Alta em campo.
**Impacto:** R$ 200–500 por evento. Em volume: significativo.
**Score:** 6/10.

**Mitigação operacional:**
- Treinar técnicos: tirar foto E confirmar que subiu (ver checkmark) antes de sair do local.
- Política: relatório com < 2 fotos antes/depois é incompleto, voltar para preencher.

**Mitigação técnica (achado A11):**
- Compressão antes de upload (`flutter_image_compress`, qualidade 70, max 1280×720). Foto cai de 8MB para ~200KB.
- `OfflineUploadQueue` (já existe no Flutter) com retry automático.
- Indicador de upload pendente na tela: "3 fotos aguardando sincronização".

**Sinais:**
- Reports onde `photosBefore.length + photosAfter.length < 2` na média semanal.
- Erros de upload no log do Flutter.

---

## Decisões que dependem de você (não-técnicas)

Algumas escolhas mudam toda a estratégia. Decida e me avise para os próximos sprints:

1. **Multi-tenant — quando?** Se for este ano, A2/A3 são prioridade pré-onboarding. Se for daqui 1+ ano, pode esperar.
2. **OS sem chamado — permite ou não?** (achado C2). Se permitir, marcar como `systemGenerated`. Se não, exigir chamado.
3. **IA — limite por usuário/mês?** Sugiro 50 gerações/usuário/mês como teto. Sua equipe topa?
4. **PDF de relatório — disclaimer "Gerado por IA"?** Para cliente saber. Sugiro sim, transparência > opacidade.
5. **Treinamento técnicos — quem assume?** Os achados R1, R3, R10 são metade processo, metade código. Precisa alguém da operação rodar treinamento bimestral.

---

## Próximos passos sugeridos (1 sprint = 2 semanas)

**Sprint 1 — proteger receita ($$$ direto):**
- R1, R2, R3 → C1, C3, C5 do relatório.

**Sprint 2 — robustez:**
- R4, R5, R10 → C2, A4, A11.

**Sprint 3 — preparar crescimento:**
- R7, R8 → A1, A2, A3.

**Backlog contínuo:**
- R6, R9 → A5, A9.

Esses 9 itens cobrem ~90% do risco operacional mapeado.
