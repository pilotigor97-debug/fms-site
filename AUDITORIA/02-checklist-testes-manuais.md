# Checklist de Testes Manuais — FMS

**Como usar:** sua equipe roda esses testes em ambiente de **staging/dev**, não produção. Cada teste tem ID, perfil que executa, passos numerados e resultado esperado. Marque **OK / FALHA / N/A** e anote o que viu na coluna observações.

**Pré-requisitos antes de começar:**
- 3 logins ativos: 1 admin, 1 técnico, 1 cliente do portal.
- Para Bloco D (multi-tenant), 2 admins de empresas diferentes — pode pular se ainda for single-tenant.
- 1 celular Android + 1 iPhone para Bloco E.
- IA com créditos de teste OU desabilitar testes do Bloco F (custos reais).
- Gateway de WhatsApp/email **desligado** (combinado com você) para não enviar mensagens reais.

**Convenção:**
- ⏱️ = teste deve durar < 10s. Se passar, é problema de performance.
- 🔁 = teste para rodar 2x para flagar inconsistência.
- ⚠️ = potencial impacto em dados — rodar com calma.

---

## A. Smoke (login + tela inicial) — 6 testes

| ID | Perfil | Passos | Esperado | OK/FALHA | Obs |
|---|---|---|---|---|---|
| A.1 | Admin | 1. Abrir `/login` 2. Login com credencial admin 3. Aguardar redirect | Cai em workspace/dashboard, vê menu lateral com chamados, OS, relatórios, clientes | | |
| A.2 | Técnico | 1. Abrir app Flutter 2. Login técnico 3. Ver tela inicial | Vê lista das OS atribuídas a ele (em ordem cronológica) | | |
| A.3 | Cliente | 1. Abrir `/portal` 2. Login com email + senha do cliente | Vê chamados que ele abriu, status humano (não enum bruto) | | |
| A.4 | Admin | Login com senha errada | Mensagem clara em português, sem stack trace | | |
| A.5 | — | Tentar acessar `/workspace` sem estar logado | Redireciona para `/login`, não mostra tela em branco | | |
| A.6 | Admin | ⏱️ Login → ver dashboard inicial | Carrega em < 5s | | |

---

## B. Fluxo feliz — Chamado → OS → Relatório → Orçamento → Aprovação → Finalização — 12 testes

> **Setup:** crie cliente fake "Cliente Teste B" antes deste bloco.

| ID | Perfil | Passos | Esperado | OK/FALHA | Obs |
|---|---|---|---|---|---|
| B.1 | Cliente | Abrir chamado: descrição "Máquina parada", categoria "Manutenção" | Recebe número de chamado. Status visível: "Recebemos seu chamado" (humano, não "ABERTO") | | |
| B.2 | Admin | Vê chamado novo na fila. Atribuir técnico João | Status muda para "Em análise". Técnico recebe na fila dele | | |
| B.3 | Admin | Criar OS de diagnóstico ligada ao chamado B.1, técnico João, data hoje | OS aparece com `linkedTicketId` correto. Chamado transiciona para "Em diagnóstico" | | |
| B.4 | Técnico | Abrir OS → "Aceitar" → "Iniciar deslocamento" → "Iniciar serviço" | Cada clique transiciona o status. Timestamps registrados | | |
| B.5 | Técnico | Preencher relatório: descrição, 2 fotos antes, 2 fotos depois, peças usadas, assinatura | Relatório salva. OS mostra `reportId`. ⚠️ confirmar no Firestore | | |
| B.6 | Técnico | Finalizar OS | OS status = `concluida`. Chamado transiciona para "Aguardando orçamento" ou "Concluído" conforme regra | | |
| B.7 | Admin | Criar orçamento para o chamado: 1 item (peça R$200) + 1 serviço (mão de obra R$100). Validade 7 dias | Orçamento criado, status `em_edicao` | | |
| B.8 | Admin | Enviar orçamento para o cliente | Status do orçamento muda para `enviado`. Cliente recebe notificação (sandboxed — verificar log apenas) | | |
| B.9 | Cliente | Ver orçamento no portal. Aprovar | Recebe número de confirmação. Status do chamado vai para "Aprovado" | | |
| B.10 | Admin | Vê fluxo completo no admin | Chamado, OS, relatório e orçamento todos vinculados, com timeline coerente | | |
| B.11 | Admin | Gerar PDF do relatório | PDF tem todos os campos, fotos, e marca "Gerado por IA" se foi (v. Bloco F) | | |
| B.12 | Cliente | Receber PDF/link no portal e abrir | PDF abre, conteúdo confere, sem dados de outros clientes | | |

---

## C. Casos negativos (erros, dados inválidos, ações fora de ordem) — 14 testes

| ID | Perfil | Passos | Esperado | OK/FALHA | Obs |
|---|---|---|---|---|---|
| C.1 | Cliente | Abrir chamado com todos os campos vazios | Validação inline em cada campo, mensagem em português, **sem** stack trace | | |
| C.2 | Cliente | Email inválido ("aa@") | Mensagem "Email inválido" antes de submit, ou no submit. Não criar chamado | | |
| C.3 | Cliente | Descrição com 10.000 caracteres (cole texto longo) | Truncado ou erro educativo. Não derrubar página | | |
| C.4 | Admin | 🔁 Criar OS, clicar "Salvar" rapidamente 3x | **Apenas 1 OS criada.** Botão deve desabilitar após primeiro clique | | |
| C.5 | Admin | Criar OS com data passada (3 meses atrás) | Aceita ou avisa? Não pode criar OS no passado sem confirmação explícita | | |
| C.6 | Técnico | Tentar finalizar OS **sem** ter preenchido relatório | **Bloqueio.** Mensagem: "Preencha relatório antes de finalizar". (Hoje passa — esse é o crítico C1 do relatório) | | |
| C.7 | Admin | Criar OS sem selecionar chamado existente | Verifica comportamento: hoje cria chamado fake automático (crítico C2). Decisão de produto | | |
| C.8 | Cliente | Aprovar orçamento expirado (orçamento criado há 30 dias com validade 7 dias) | **Bloqueio.** Mensagem: "Orçamento expirado. Solicite novo orçamento" | | |
| C.9 | Cliente | Aprovar orçamento já cancelado/rejeitado | Bloqueio similar a C.8 | | |
| C.10 | Cliente | Tentar aprovar mesmo orçamento 2x | Segunda vez: "Já aprovado em [data] sob confirmação #X" | | |
| C.11 | Técnico | ⚠️ Preencher relatório, **ligar modo avião antes de salvar**, voltar à tela | App deve restaurar dados (autosave local) ou avisar "Sem conexão. Dados salvos localmente, vamos sincronizar quando voltar" | | |
| C.12 | Técnico | Upload de foto, ⚠️ **ligar modo avião durante upload** | App deve enfileirar para sync posterior, não perder a foto | | |
| C.13 | Admin | Editar orçamento já enviado e aprovado | Não permitir edição. Forçar criação de novo orçamento | | |
| C.14 | Admin | Cancelar OS já concluída | Bloquear ou exigir motivo + carimbo de auditoria. Não deve sumir do histórico | | |

---

## D. Multi-tenant — só rodar quando tiver 2+ empresas — 8 testes

> **Hoje (single-tenant):** pular D.1 a D.7. Rodar só D.8 (técnico vê dados de cliente B). Esses testes viram CRÍTICOS no dia que onboardar segunda empresa.

| ID | Perfil | Passos | Esperado | OK/FALHA | Obs |
|---|---|---|---|---|---|
| D.1 | Admin emp.A | Listar clientes | Vê só clientes da empresa A. Empresa B invisível | | |
| D.2 | Admin emp.A | Tentar acessar URL do chamado da empresa B (copiar `/tickets/abc123` de outra sessão) | 403 ou redireciona, não mostra dados | | |
| D.3 | Técnico emp.A | Listar OS | Só OS da empresa A | | |
| D.4 | Técnico emp.A | URL da OS de outra empresa | 403 | | |
| D.5 | Cliente emp.A | Login no portal, listar chamados | Só os próprios chamados da empresa A | | |
| D.6 | Cliente emp.A | URL de chamado de outro cliente da empresa A | 403 | | |
| D.7 | — | Devtools no Flutter, query Firestore direto: `db.collection('clients').get()` | Só docs da empresa A retornados. Storage Rules + Firestore Rules barram acesso | | |
| D.8 | Técnico (single-tenant hoje) | Vê todas as OS de todos os clientes? | Hoje sim — confirmar se é intencional. Se não, adicionar filtro por técnico assignado | | |

---

## E. Mobile (técnico em campo) — 10 testes

> **Setup:** dois celulares (Android + iOS preferencialmente). Modo avião disponível.

| ID | Dispositivo | Passos | Esperado | OK/FALHA | Obs |
|---|---|---|---|---|---|
| E.1 | Android | Login → ver lista de OS | Carrega rápido (< 5s), texto legível sem zoom | | |
| E.2 | Android | Tirar foto antes (10MB+) e fazer upload | Comprime antes de enviar (ver tamanho final < 1MB) e mostra progresso | | |
| E.3 | Android | ⚠️ Upload em 3G simulado (Settings → Cellular → 3G only) | Não trava, mostra progresso, retoma se falhar | | |
| E.4 | Android | Modo avião no meio do upload de foto | Foto fica enfileirada, sincroniza quando voltar | | |
| E.5 | iOS | Mesma sequência E.1–E.4 | Idem | | |
| E.6 | Android | Preencher relatório (3 telas), trocar app, voltar 1min depois | Dados preservados, não recomeça do zero | | |
| E.7 | Android | Campo email, telefone, CNPJ — abrir teclado | Teclado correto: email mostra "@", telefone mostra dígitos, CNPJ mostra dígitos | | |
| E.8 | Android | Botão "Finalizar OS" — clicar com luva grossa (simulação: clicar com canto da unha) | Botão tem área grande o suficiente, não erra | | |
| E.9 | Android | Sob sol forte (sair na rua), verificar contraste das cores | Texto legível, status visíveis | | |
| E.10 | Android | Bateria baixa (< 15%) — usar app por 5 min com upload | Não derruba o uso, gerencia upload de forma econômica | | |

---

## F. IA — geração de relatório — 8 testes

> ⚠️ **Cada teste consome crédito real**. Faça em sequência sem repetir.

| ID | Perfil | Passos | Esperado | OK/FALHA | Obs |
|---|---|---|---|---|---|
| F.1 | Técnico | Preencher relatório com dados básicos. Abrir tela "Relatório elaborado com IA" | **HOJE chama IA automaticamente** (crítico C3). Verificar se há botão de confirmação primeiro | | |
| F.2 | Técnico | Receber relatório gerado | Texto em português, formal, baseado nos campos preenchidos. **Não inventa peças/marcas** que não estavam no input | | |
| F.3 | Técnico | Editar manualmente uma seção e salvar | Aceita edição. Texto editado não é sobrescrito por nova geração | | |
| F.4 | Técnico | 🔁 Clicar "Regenerar" 5x rapidamente | **Hoje:** dispara 5 vezes (problema). **Esperado:** debounce de 10s entre cliques | | |
| F.5 | Técnico | Abrir relatório, copiar texto gerado, exportar PDF | PDF tem rodapé "✨ Relatório elaborado com assistência de IA" — **hoje não tem** | | |
| F.6 | — | Forçar erro: derrubar internet durante geração | Mensagem em português: "Não conseguimos gerar agora. Edite manualmente.". **Não pode** mostrar `FirebaseFunctionsException: ...` | | |
| F.7 | Admin | Verificar `ai_usage` no Firestore após F.1–F.5 | Contadores de uso por usuário existem e estão corretos | | |
| F.8 | Cliente | Abrir relatório (PDF) recebido por email/portal | Vê o conteúdo. Idealmente, vê nota "elaborado com auxílio de IA" para transparência | | |

---

## G. Portal do cliente — 12 testes

| ID | Passos | Esperado | OK/FALHA | Obs |
|---|---|---|---|---|
| G.1 | Login com magic link recebido por email | Funciona, expira após uso. Magic link 1x | | |
| G.2 | Login com link de magic link **expirado** | "Link expirado. Solicite novo" | | |
| G.3 | Login com magic link de **outro cliente** (copiar URL) | Não funciona ou 403 | | |
| G.4 | Listar chamados | Status humano em todos ("Recebemos", "Aguardando você", "Em execução", "Concluído") | | |
| G.5 | Abrir chamado | Vê linha do tempo das ações: criação, atendimento, conclusão | | |
| G.6 | Abrir orçamento | Itens listados, total claro, botão "Aprovar" destacado | | |
| G.7 | Aprovar orçamento | Modal de confirmação. Após aprovar, status muda imediatamente | | |
| G.8 | Recusar orçamento | Pede motivo. Registra recusa | | |
| G.9 | Buscar chamado por número | Encontra (hoje pode falhar — sem busca) | | |
| G.10 | Tentar editar/cancelar chamado já aprovado | Bloqueio educativo: "Entre em contato com a SoluClean" | | |
| G.11 | URL `/portal/quote/{id-aleatório}` | 403, não vaza existência do quote | | |
| G.12 | Logout → tentar voltar → URL antiga | Redireciona para login, não mostra dados em cache | | |

---

## Resumo da execução

Após rodar tudo, sua equipe consolida assim:

| Bloco | Total testes | OK | Falha | N/A | % OK |
|---|---|---|---|---|---|
| A. Smoke | 6 | | | | |
| B. Fluxo feliz | 12 | | | | |
| C. Erros | 14 | | | | |
| D. Multi-tenant | 8 | | | | |
| E. Mobile | 10 | | | | |
| F. IA | 8 | | | | |
| G. Portal cliente | 12 | | | | |
| **Total** | **70** | | | | |

**Critério de release:**
- 0 FALHAS no Bloco A (smoke).
- 0 FALHAS em B.6, B.9, B.11 (fluxo crítico).
- 0 FALHAS em C.6, C.7, C.8 (que mapeiam os críticos C1, C2 do relatório).
- 0 FALHAS em E.4 (foto offline — campo).
- < 2 FALHAS no Bloco F (IA — pode aceitar custo se precisa entregar release).

**O que fazer com cada FALHA:**
1. Tirar print/vídeo.
2. Anotar passos exatos, hora, dispositivo, perfil.
3. Abrir issue no GitHub do `fms-site` ou `relatorio_tecnico` com label `qa-checklist-{ID}`.
4. Bloqueia release se for em teste crítico (lista acima).
