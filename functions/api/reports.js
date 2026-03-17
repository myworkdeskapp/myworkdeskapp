/**
 * WorkDesk — /api/reports
 * Cloudflare Pages Function
 *
 * Generates and exports HR reports across all modules.
 * Requires a valid org Bearer token (or SA token for cross-org reports).
 *
 * POST /api/reports         — generate a report (returns JSON data or download URL)
 * GET  /api/reports         — list recently generated reports for the org
 *
 * Body for POST:
 *   {
 *     type:      string   — "hr_summary" | "attendance" | "payroll" | "leave" | "performance" | "recruitment" | "platform_usage"
 *     format:    string   — "json" | "csv" | "xlsx"
 *     dateFrom:  string   — ISO date string (e.g. "2026-01-01")
 *     dateTo:    string   — ISO date string (e.g. "2026-03-15")
 *     orgId:     string?  — required for org-scoped reports; SA token may omit for platform-wide
 *     filters:   object?  — optional additional filters (e.g. { department: "Engineering" })
 *   }
 *
 * In production wire to D1 aggregation queries and R2 for file storage.
 */
import { CORS, getToken } from './_shared.js';

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method.toUpperCase();

  const corsHeaders = { ...CORS, 'Cache-Control': 'no-store, no-cache, must-revalidate' };

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // ── Token guard ──────────────────────────────────────────────────────────
  const token = getToken(request);

  if (!token) {
    return new Response(JSON.stringify({ ok: false, message: 'Authentication required.' }), {
      status: 401, headers: corsHeaders,
    });
  }

  // Detect SA vs org token (SA tokens contain ":sa:")
  let isSaToken = false;
  try { isSaToken = atob(token).includes(':sa:'); } catch { /* ignore */ }

  // ── GET — list recent reports ────────────────────────────────────────────
  if (method === 'GET') {
    // TODO (production): query D1 reports log for org or platform-wide (SA)
    const reports = [
      { id: 'rpt-001', name: 'HR Summary — Feb 2026',           type: 'hr_summary',     format: 'csv',  generatedAt: '2026-03-01T10:00:00Z', rows: 248,   size: '42 KB',  status: 'ready' },
      { id: 'rpt-002', name: 'Payroll Run — Feb 2026',          type: 'payroll',        format: 'xlsx', generatedAt: '2026-03-05T14:22:00Z', rows: 248,   size: '128 KB', status: 'ready' },
      { id: 'rpt-003', name: 'Attendance Report — Q1 2026',     type: 'attendance',     format: 'csv',  generatedAt: '2026-03-10T09:15:00Z', rows: 1840,  size: '310 KB', status: 'ready' },
      { id: 'rpt-004', name: 'Leave Balance — Mar 2026',        type: 'leave',          format: 'csv',  generatedAt: '2026-03-12T16:40:00Z', rows: 248,   size: '38 KB',  status: 'ready' },
      { id: 'rpt-005', name: 'Performance Reviews — H2 2025',   type: 'performance',    format: 'xlsx', generatedAt: '2026-01-15T11:00:00Z', rows: 186,   size: '94 KB',  status: 'ready' },
      { id: 'rpt-006', name: 'Platform Usage — Mar 2026',       type: 'platform_usage', format: 'csv',  generatedAt: '2026-03-15T08:00:00Z', rows: 5032,  size: '520 KB', status: 'ready' },
      { id: 'rpt-007', name: 'Recruitment Pipeline — Q1 2026',  type: 'recruitment',    format: 'csv',  generatedAt: '2026-03-14T17:30:00Z', rows: 74,    size: '22 KB',  status: 'ready' },
    ];
    return new Response(JSON.stringify({ ok: true, reports }), { status: 200, headers: corsHeaders });
  }

  // ── POST — generate report ───────────────────────────────────────────────
  if (method === 'POST') {
    let body;
    try { body = await request.json(); } catch {
      return new Response(JSON.stringify({ ok: false, message: 'Invalid request body.' }), { status: 400, headers: corsHeaders });
    }

    const { type, format, dateFrom, dateTo, orgId, filters } = body || {};

    const VALID_TYPES = ['hr_summary', 'attendance', 'payroll', 'leave', 'performance', 'recruitment', 'platform_usage', 'engagement', 'tickets'];
    const VALID_FORMATS = ['json', 'csv', 'xlsx'];

    if (!type || !VALID_TYPES.includes(type)) {
      return new Response(JSON.stringify({
        ok: false,
        message: 'type is required and must be one of: ' + VALID_TYPES.join(', '),
      }), { status: 400, headers: corsHeaders });
    }

    if (format && !VALID_FORMATS.includes(format)) {
      return new Response(JSON.stringify({
        ok: false,
        message: 'format must be one of: ' + VALID_FORMATS.join(', '),
      }), { status: 400, headers: corsHeaders });
    }

    // Org-scoped report: non-SA tokens must have an orgId
    if (!isSaToken && !orgId) {
      return new Response(JSON.stringify({ ok: false, message: 'orgId is required for org-scoped reports.' }), {
        status: 400, headers: corsHeaders,
      });
    }

    const reportId  = 'rpt-' + Date.now();
    const resolvedFormat = format || 'csv';
    const now = new Date().toISOString();

    // TODO (production): run D1 aggregation query based on `type` and date range,
    //   serialize to the requested format, upload to R2, return a signed download URL.
    //
    // const data = await generateReportData(env, type, orgId, dateFrom, dateTo, filters);
    // if (resolvedFormat === 'csv') {
    //   const csv = toCsv(data);
    //   const key = `reports/${orgId || 'platform'}/${reportId}.csv`;
    //   await env.UPLOADS.put(key, csv, { httpMetadata: { contentType: 'text/csv' } });
    //   const url = await env.UPLOADS.createSignedUrl(key, { expiresIn: 3600 });
    //   return new Response(JSON.stringify({ ok: true, reportId, downloadUrl: url }), { status: 200, headers: corsHeaders });
    // }

    // Queue the report generation for background processing (if queue binding is configured)
    if (env.WORKDESK_QUEUE) {
      await env.WORKDESK_QUEUE.send({
        event:     'report.generate',
        reportId,
        type,
        format:    resolvedFormat,
        orgId:     orgId || null,
        dateFrom:  dateFrom || null,
        dateTo:    dateTo || null,
        filters:   filters || null,
        queued_at: new Date().toISOString(),
      });
    }

    // Demo: return a stub response with simulated row counts
    const ROW_COUNTS = {
      hr_summary: 248, attendance: 1840, payroll: 248, leave: 248,
      performance: 186, recruitment: 74, platform_usage: 5032,
      engagement: 320, tickets: 142,
    };

    const REPORT_NAMES = {
      hr_summary:     'HR Summary Report',
      attendance:     'Attendance Report',
      payroll:        'Payroll Report',
      leave:          'Leave Balance Report',
      performance:    'Performance Reviews',
      recruitment:    'Recruitment Pipeline',
      platform_usage: 'Platform Usage Report',
      engagement:     'Engagement Survey Report',
      tickets:        'Support Ticket Report',
    };

    return new Response(JSON.stringify({
      ok:          true,
      reportId,
      name:        REPORT_NAMES[type] + (dateFrom ? ' (' + dateFrom + ' – ' + (dateTo || now.slice(0,10)) + ')' : ''),
      type,
      format:      resolvedFormat,
      rows:        ROW_COUNTS[type] || 0,
      generatedAt: now,
      // In production this would be a signed R2 URL:
      downloadUrl: null,
      message:     'Report generated successfully. Connect R2 storage to enable file downloads.',
    }), { status: 200, headers: corsHeaders });
  }

  return new Response(JSON.stringify({ ok: false, message: 'Method not allowed.' }), {
    status: 405, headers: corsHeaders,
  });
}
