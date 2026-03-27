/**
 * WorkDesk — /api/sa-config-check
 * Cloudflare Pages Function (main app project)
 *
 * GET /api/sa-config-check — Verify that environment variables are present
 * and non-empty for super admin, demo, and admin roles.
 *
 * Checked environment variables (presence only — values are never revealed):
 *   SA_USERNAME       — Super admin username
 *   SA_SECURITY_KEY   — Super admin security key (second factor)
 *   SA_PASSWORD       — Super admin password
 *   DEMO_ORG_ID       — Demo / employee login org ID (default: DEMO)
 *   DEMO_EMPLOYEE_ID  — Demo employee ID (default: EMP001)
 *   DEMO_PASSWORD     — Demo / employee login password
 *   ADMIN_ORG_ID      — Admin login org ID override (defaults to DEMO_ORG_ID)
 *   ADMIN_EMPLOYEE_ID — Admin employee ID strict match (optional)
 *   ADMIN_PASSWORD    — Admin login password override (defaults to DEMO_PASSWORD)
 *
 * All requests require a valid SA Bearer token so that the presence/absence
 * of each variable is never exposed to unauthenticated callers.
 */

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method.toUpperCase();

  const corsHeaders = {
    'Access-Control-Allow-Origin':  'same-origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type':                 'application/json',
    'X-Robots-Tag':                 'noindex, nofollow',
    'Cache-Control':                'no-store, no-cache, must-revalidate',
  };

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (method !== 'GET') {
    return new Response(JSON.stringify({ ok: false, message: 'Method not allowed.' }), {
      status: 405, headers: corsHeaders,
    });
  }

  // ── Constant-time string comparison (timing-attack safe) ─────────────────
  async function safeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const enc = new TextEncoder();
    const ka  = await crypto.subtle.importKey('raw', enc.encode(a), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const kb  = await crypto.subtle.importKey('raw', enc.encode(b), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig  = enc.encode('workdesk-sa-check');
    const sigA = await crypto.subtle.sign('HMAC', ka, sig);
    const sigB = await crypto.subtle.sign('HMAC', kb, sig);
    const arrA = new Uint8Array(sigA);
    const arrB = new Uint8Array(sigB);
    if (arrA.length !== arrB.length) return false;
    let diff = 0;
    for (let i = 0; i < arrA.length; i++) diff |= arrA[i] ^ arrB[i];
    return diff === 0;
  }

  // ── SA token guard ───────────────────────────────────────────────────────
  const authHeader = request.headers.get('Authorization') || '';
  const saToken    = authHeader.replace('Bearer ', '').trim();

  if (!saToken) {
    return new Response(JSON.stringify({ ok: false, message: 'Authentication required.' }), {
      status: 401, headers: corsHeaders,
    });
  }

  // Validate token structure: must decode to "<username>:sa:<timestamp>:<uuid>"
  // Also cross-check the username and verify the token has not expired (8 h).
  let tokenUsername = '';
  let tokenIssuedAt = 0;
  try {
    const decoded = atob(saToken);
    const parts   = decoded.split(':sa:');
    if (parts.length < 2 || !parts[0]) throw new Error('bad format');
    tokenUsername = parts[0];
    tokenIssuedAt = parseInt(parts[1], 10) || 0;
  } catch {
    return new Response(JSON.stringify({ ok: false, message: 'Invalid or expired session token.' }), {
      status: 401, headers: corsHeaders,
    });
  }

  // Reject tokens older than 8 hours
  if (!tokenIssuedAt || Date.now() - tokenIssuedAt > 8 * 60 * 60 * 1000) {
    return new Response(JSON.stringify({ ok: false, message: 'Invalid or expired session token.' }), {
      status: 401, headers: corsHeaders,
    });
  }

  // Cross-check the username embedded in the token against the configured SA_USERNAME
  const saConfiguredUsername = (env.SA_USERNAME || '').trim();
  if (saConfiguredUsername && !(await safeEqual(tokenUsername, saConfiguredUsername))) {
    return new Response(JSON.stringify({ ok: false, message: 'Invalid or expired session token.' }), {
      status: 401, headers: corsHeaders,
    });
  }

  // ── Check which variables are configured ────────────────────────────────
  const secrets = {
    SA_USERNAME:       !!(env.SA_USERNAME      && env.SA_USERNAME.trim()),
    SA_SECURITY_KEY:   !!(env.SA_SECURITY_KEY  && env.SA_SECURITY_KEY.trim()),
    SA_PASSWORD:       !!(env.SA_PASSWORD      && env.SA_PASSWORD.trim()),
    DEMO_ORG_ID:       !!(env.DEMO_ORG_ID      && env.DEMO_ORG_ID.trim()),
    DEMO_EMPLOYEE_ID:  !!(env.DEMO_EMPLOYEE_ID && env.DEMO_EMPLOYEE_ID.trim()),
    DEMO_PASSWORD:     !!(env.DEMO_PASSWORD    && env.DEMO_PASSWORD.trim()),
    ADMIN_ORG_ID:      !!(env.ADMIN_ORG_ID     && env.ADMIN_ORG_ID.trim()),
    ADMIN_EMPLOYEE_ID: !!(env.ADMIN_EMPLOYEE_ID && env.ADMIN_EMPLOYEE_ID.trim()),
    ADMIN_PASSWORD:    !!(env.ADMIN_PASSWORD   && env.ADMIN_PASSWORD.trim()),
  };

  const saConfigured   = secrets.SA_USERNAME && secrets.SA_SECURITY_KEY && secrets.SA_PASSWORD;
  const demoConfigured = secrets.DEMO_ORG_ID && secrets.DEMO_EMPLOYEE_ID && secrets.DEMO_PASSWORD;
  const adminConfigured = secrets.ADMIN_ORG_ID && secrets.ADMIN_PASSWORD;
  const allConfigured  = saConfigured && demoConfigured && adminConfigured;

  return new Response(JSON.stringify({
    ok: true,
    allConfigured,
    saConfigured,
    demoConfigured,
    adminConfigured,
    secrets,
  }), { status: 200, headers: corsHeaders });
}
