/**
 * POST /api/contact
 *
 * Captura lead do form "Falar com vendas". Enfileira email pra
 * `SALES_LEAD_EMAIL` reutilizando a extensão `firestore-send-email`
 * já instalada no projeto (collection `mail/`).
 *
 * Sem auth: é form público anti-spam. Em escala, considerar:
 *   - reCAPTCHA v3 client-side
 *   - Rate-limit por IP via middleware
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const Body = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  phone: z.string().min(8).max(30).optional(),
  company: z.string().max(120).optional(),
  teamSize: z.string().max(40).optional(), // ex: "1-10", "10-50"
  message: z.string().max(2000).optional(),
});

const SALES_EMAIL = process.env.SALES_LEAD_EMAIL ?? '';

export async function POST(req: NextRequest) {
  if (!SALES_EMAIL) {
    return NextResponse.json(
      { error: 'server_misconfigured' },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_body', details: parsed.error.errors },
      { status: 400 }
    );
  }
  const lead = parsed.data;

  const html = `
    <h2>Novo lead pelo site</h2>
    <p><strong>Nome:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
    ${lead.phone ? `<p><strong>Telefone:</strong> ${escapeHtml(lead.phone)}</p>` : ''}
    ${lead.company ? `<p><strong>Empresa:</strong> ${escapeHtml(lead.company)}</p>` : ''}
    ${lead.teamSize ? `<p><strong>Tamanho da equipe:</strong> ${escapeHtml(lead.teamSize)}</p>` : ''}
    ${lead.message ? `<p><strong>Mensagem:</strong><br>${escapeHtml(lead.message)}</p>` : ''}
    <hr>
    <p style="color:#888;font-size:12px">Enviado pelo formulário "Falar com vendas" do site FMS</p>
  `;

  // Enfileira via mesma collection que o app usa pra emails transacionais
  // (chamado aberto, orçamento aprovado, etc). A extensão
  // firestore-send-email faz o envio SMTP.
  await adminDb().collection('mail').add({
    to: SALES_EMAIL,
    replyTo: lead.email,
    message: {
      subject: `[Lead] ${lead.name}${lead.company ? ` · ${lead.company}` : ''}`,
      html,
    },
    kind: 'salesLead',
    leadData: lead,
    createdAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
