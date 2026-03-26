# STEP 4 — Environment Variables

Set these **before** clicking the first deploy. You can also add/edit them later from the project settings.

---

## How to Add Environment Variables (during initial setup)

On the **Build settings** page scroll down to the **Environment variables (advanced)** section:

1. Click **Add variable**
2. Fill in the **Variable name** and **Value**
3. Repeat for each variable below
4. Use **Encrypt** (the lock icon) for all secret/password values

---

## Required Variables

### Super-Admin Portal (`/admin/login.html`)

| Variable          | Value (your choice)          | Encrypt? |
|-------------------|------------------------------|----------|
| `SA_USERNAME`     | e.g. `superadmin`            | ✅ Yes   |
| `SA_SECURITY_KEY` | e.g. `sk_yourSecretKey123`   | ✅ Yes   |
| `SA_PASSWORD`     | e.g. `Admin@StrongPass1`     | ✅ Yes   |

### Admin Login (`/app/login.html` — Org ID + Employee ID + Password)

Set these to create a dedicated **Admin** account on the regular login page.  
The server always returns `role: admin` when these credentials match, regardless of the
Employee ID value.  Using a prefix of `ADMIN` or `ADM` (e.g. `ADMIN-01`, `ADM001`) is
**recommended** so the login form automatically shows the admin UI as you type.

| Variable            | Value (your choice)          | Encrypt? |
|---------------------|------------------------------|----------|
| `ADMIN_ORG_ID`      | e.g. `acme-corp`             | No       |
| `ADMIN_EMPLOYEE_ID` | e.g. `ADMIN-01`              | No       |
| `ADMIN_PASSWORD`    | your strong admin password   | ✅ Yes   |

> When all three `ADMIN_*` variables are set, the API always returns `role: admin` for
> those credentials — regardless of what the browser sends — preventing role escalation.

### Demo / Regular Employee Login (`/app/login.html`)

| Variable           | Value           | Encrypt? |
|--------------------|-----------------|----------|
| `DEMO_ORG_ID`      | `DEMO`          | No       |
| `DEMO_EMPLOYEE_ID` | `EMP001`        | No       |
| `DEMO_PASSWORD`    | your password   | ✅ Yes   |

> If you skip `DEMO_ORG_ID` / `DEMO_EMPLOYEE_ID`, they default to `DEMO` and `EMP001`.  
> If you skip `DEMO_PASSWORD`, the hardcoded default in `functions/api/auth.js` will be used — **not recommended for production**.

---

## How to Edit Variables After Deployment

1. Go to https://dash.cloudflare.com
2. **Workers & Pages** → **myworkdeskapp** → **Settings** → **Environment variables**
3. Click **Edit variables**, make your changes, then click **Save and deploy**

---

## Production vs Preview Environments

Cloudflare Pages has two environments:

| Environment  | When used                                  |
|--------------|--------------------------------------------|
| `Production` | Pushes to the `main` branch                |
| `Preview`    | Pushes to any other branch / pull requests |

Set your variables in **Production** (and optionally in **Preview** with test values).

---

➡️ Next: [STEP-5-deploy-and-verify.md](./STEP-5-deploy-and-verify.md)
