# STEP 1 — Prerequisites

Before you deploy, make sure you have the following ready.

---

## 1. Cloudflare Account
- Go to https://dash.cloudflare.com/sign-up and create a **free** account (or log in if you already have one).
- No credit card needed for the free tier.

## 2. GitHub Account + Repository Access
- Your code must be in a GitHub repository.
- Repository: **myworkDESK/mwdapp**
- Make sure you are logged in to GitHub and have at least **read access** to the repo.

## 3. Your Credentials (keep these handy for Step 4)

You will need to set these as environment variables during setup:

| Variable             | What it is                                             | Example value  |
|----------------------|--------------------------------------------------------|----------------|
| `SA_USERNAME`        | Super-admin username                                   | `superadmin`   |
| `SA_SECURITY_KEY`    | Super-admin secret key                                 | `SA-key123`    |
| `SA_PASSWORD`        | Super-admin password                                   | `StrongPass!`  |
| `DEMO_ORG_ID`        | Demo / employee org ID (default: DEMO)                 | `DEMO`         |
| `DEMO_EMPLOYEE_ID`   | Demo employee ID (default: EMP001)                     | `EMP001`       |
| `DEMO_PASSWORD`      | Demo / employee login password                         | `demo1234`     |
| `ADMIN_ORG_ID`       | Admin login org ID (defaults to DEMO_ORG_ID)           | `DEMO`         |
| `ADMIN_EMPLOYEE_ID`  | Admin employee ID strict match (optional)              | `ADMIN-001`    |
| `ADMIN_PASSWORD`     | Admin login password (defaults to DEMO_PASSWORD)       | `Admin@Pass1`  |

> **Note:** If you skip the `DEMO_*` variables, the defaults (`DEMO` / `EMP001` / the default password) will be used automatically. The `SA_*` variables are required for the super-admin portal. The `ADMIN_*` variables are recommended so admins and employees use separate credentials.

---

➡️ Next: [STEP-2-connect-github.md](./STEP-2-connect-github.md)
