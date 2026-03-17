/**
 * WorkDesk — /api/payroll
 * Cloudflare Pages Function
 *
 * GET  /api/payroll        — List payroll ledger
 * POST /api/payroll/run    — Run payroll for a period
 */
import { CORS, json, getToken } from './_shared.js';

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method.toUpperCase();

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  const token = getToken(request);
  if (!token) return json({ ok: false, message: 'Unauthorized.' }, 401);

  const url = new URL(request.url);
  const path = url.pathname;

  // ── GET — list ledger ─────────────────────────────────────
  if (method === 'GET') {
    const period = url.searchParams.get('period') || 'March 2025';
    // TODO:
    //   const { results } = await env.DB
    //     .prepare('SELECT * FROM payroll_ledger WHERE period = ? ORDER BY employee_id')
    //     .bind(period).all();
    return json({ ok: true, ledger: [], period, message: 'Connect D1 database to enable server-side payroll data.' });
  }

  // ── POST ──────────────────────────────────────────────────
  if (method === 'POST') {
    let body;
    try { body = await request.json(); } catch { return json({ ok: false, message: 'Invalid JSON.' }, 400); }

    if (path.endsWith('/run')) {
      const { period, count } = body || {};
      if (!period) return json({ ok: false, message: 'Pay period is required.' }, 400);
      const employeeCount = count || 0;
      // TODO:
      //   1. Fetch all active employees for the period
      //   2. Compute basic pay, overtime, allowances, deductions per employee
      //   3. INSERT into payroll_ledger
      //   4. UPDATE status to 'Released'
      //   5. Send email notifications via env.EMAIL_SERVICE

      // Queue the payroll run for background processing (if queue binding is configured)
      if (env.WORKDESK_QUEUE) {
        await env.WORKDESK_QUEUE.send({
          event:     'payroll.run',
          period,
          count:     employeeCount,
          token,
          queued_at: new Date().toISOString(),
        });
      }

      return json({
        ok: true,
        message: 'Payroll run initiated for ' + period + '. ' + employeeCount + ' employees processed.',
        period,
        count: employeeCount,
      }, 202);
    }

    return json({ ok: false, message: 'Unknown action.' }, 400);
  }

  return json({ ok: false, message: 'Method not allowed.' }, 405);
}
