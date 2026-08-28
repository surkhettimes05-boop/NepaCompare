import { Client } from "pg";
import bcrypt from "bcryptjs";
import { createHmac } from "node:crypto";

interface Env {
  HYPERDRIVE: {
    connectionString: string;
  };
  JWT_SECRET: string;
}

interface StaffClaims {
  sub: string;
  phone: string;
  role: string;
  exp?: number;
}

const encoder = new TextEncoder();

function corsHeaders(request: Request) {
  const origin = request.headers.get("Origin") || "";

  const allowedOrigins = [
    "https://khaacho.com",
    "https://www.khaacho.com",
    "https://nepa-compare.vercel.app",
  ];

  const allowed =
    allowedOrigins.includes(origin) ||
    origin.endsWith(".vercel.app");

  return {
    "Access-Control-Allow-Origin": allowed
      ? origin
      : "https://khaacho.com",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization",
    "Access-Control-Allow-Methods":
      "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

function json(
  request: Request,
  data: unknown,
  status = 200,
) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(request),
    },
  });
}

async function withDb<T>(
  env: Env,
  callback: (db: Client) => Promise<T>,
): Promise<T> {
  const db = new Client({
    connectionString: env.HYPERDRIVE.connectionString,
  });

  await db.connect();

  try {
    return await callback(db);
  } finally {
    await db.end();
  }
}

function base64UrlString(value: string): string {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlBytes(value: Uint8Array): string {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function createJwt(
  payload: Record<string, unknown>,
  secret: string,
): string {
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const header = base64UrlString(
    JSON.stringify({
      alg: "HS256",
      typ: "JWT",
    }),
  );

  const now = Math.floor(Date.now() / 1000);

  const body = base64UrlString(
    JSON.stringify({
      ...payload,
      iat: now,
      exp: now + 60 * 60 * 12,
    }),
  );

  const unsignedToken = `${header}.${body}`;

  const signature = createHmac(
    "sha256",
    secret,
  )
    .update(unsignedToken)
    .digest();

  return `${unsignedToken}.${base64UrlBytes(signature)}`;
}

function decodeBase64Url(value: string): string {
  return Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

async function verifyJwt(token: string, secret: string): Promise<StaffClaims | null> {
  const parts = token.split(".");
  if (parts.length !== 3 || !secret) return null;
  const expected = createHmac("sha256", secret).update(`${parts[0]}.${parts[1]}`).digest();
  const actual = Buffer.from(parts[2].replace(/-/g, "+").replace(/_/g, "/"), "base64");
  if (actual.length !== expected.length || !actual.every((byte, index) => byte === expected[index])) return null;
  const claims = JSON.parse(decodeBase64Url(parts[1])) as StaffClaims;
  if (!claims.sub || claims.role !== "ADMIN" || (claims.exp && claims.exp <= Math.floor(Date.now() / 1000))) return null;
  return claims;
}

function bearerToken(request: Request): string | null {
  const value = request.headers.get("Authorization") || "";
  return value.startsWith("Bearer ") ? value.slice(7).trim() : null;
}

async function requireAdmin(request: Request, env: Env): Promise<StaffClaims | Response> {
  const token = bearerToken(request);
  const claims = token ? await verifyJwt(token, env.JWT_SECRET) : null;
  if (!claims) return json(request, { message: "Unauthorized" }, 401);
  return claims;
}

async function staffLogin(request: Request, env: Env) {
  const body = (await request.json()) as { phone?: string; phoneNumber?: string; password?: string };
  const phone = String(body.phoneNumber || body.phone || "").trim().replace(/\s+/g, "");
  const password = String(body.password || "");
  console.log("Admin login request", { phone, hasPassword: Boolean(password), field: body.phoneNumber ? "phoneNumber" : "phone" });
  if (!phone || !password) {
    console.log("Admin login rejected", { phone, reason: "missing_credentials" });
    return json(request, { message: "Phone and password are required" }, 400);
  }

  try {
    const staff = await withDb(env, async (db) => {
      const result = await db.query(
        `SELECT id, name, phone, password, role, active FROM "Staff" WHERE phone = $1 LIMIT 1`,
        [phone],
      );
      return result.rows[0];
    });

    console.log("Admin staff lookup", { phone, userFound: Boolean(staff), active: Boolean(staff?.active), role: staff?.role || null, hasPasswordHash: Boolean(staff?.password) });
    if (!staff || !staff.active || staff.role !== "ADMIN" || !staff.password) {
      console.log("Admin login rejected", { phone, reason: !staff ? "user_not_found" : !staff.active ? "inactive_user" : staff.role !== "ADMIN" ? "non_admin_role" : "missing_password_hash" });
      return json(request, { message: "Invalid credentials" }, 401);
    }

    const passwordMatch = await bcrypt.compare(password, staff.password);
    console.log("Admin password check", { phone, passwordMatch });
    if (!passwordMatch) {
      console.log("Admin login rejected", { phone, reason: "invalid_password" });
      return json(request, { message: "Invalid credentials" }, 401);
    }

    const accessToken = createJwt({ sub: staff.id, phone: staff.phone, role: staff.role }, env.JWT_SECRET);
    console.log("Admin JWT created", { phone, jwtCreated: Boolean(accessToken), responseStatus: 200 });
    return json(request, { access_token: accessToken, user: { id: staff.id, name: staff.name, phone: staff.phone, role: staff.role } });
  } catch (error) {
    console.error("Staff login failed:", error);
    return json(request, { message: "Login unavailable" }, 503);
  }
}

async function staffMe(request: Request, env: Env) {
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  try {
    const staff = await withDb(env, async (db) => {
      const result = await db.query(`SELECT id, name, phone, role, active FROM "Staff" WHERE id = $1 LIMIT 1`, [auth.sub]);
      return result.rows[0];
    });
    if (!staff || !staff.active || staff.role !== "ADMIN") return json(request, { message: "Unauthorized" }, 401);
    return json(request, { user: staff });
  } catch (error) {
    console.error("Staff session check failed:", error);
    return json(request, { message: "Session unavailable" }, 503);
  }
}

async function getLeads(request: Request, env: Env) {
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  try {
    const leads = await withDb(env, async (db) => {
      const result = await db.query(
        `SELECT id, vertical, source, "formData", status, "createdAt", "updatedAt"
         FROM "Lead" ORDER BY "createdAt" DESC LIMIT 500`,
      );
      return result.rows;
    });
    return json(request, leads);
  } catch (error) {
    console.error("Lead lookup failed:", error);
    return json(request, { message: "Unable to load leads" }, 503);
  }
}

async function getLead(request: Request, env: Env, id: string) {
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  try {
    const lead = await withDb(env, async (db) => {
      const result = await db.query(`SELECT l.id, l.vertical, l.source, l."formData", l.status, l."createdAt", l."updatedAt", l."partnerId", l."assignedStaffId", u.name AS "userName", u.phone AS "userPhone", p.name AS "partnerName", s.name AS "staffName" FROM "Lead" l LEFT JOIN "User" u ON u.id = l."userId" LEFT JOIN "Partner" p ON p.id = l."partnerId" LEFT JOIN "Staff" s ON s.id = l."assignedStaffId" WHERE l.id = $1 LIMIT 1`, [id]);
      return result.rows[0];
    });
    if (!lead) return json(request, { message: "Lead not found" }, 404);
    return json(request, { ...lead, user: lead.userName ? { name: lead.userName, phone: lead.userPhone } : undefined, partner: lead.partnerName ? { name: lead.partnerName } : undefined, assignedStaff: lead.staffName ? { name: lead.staffName } : undefined });
  } catch (error) {
    console.error("Lead detail lookup failed:", error);
    return json(request, { message: "Unable to load lead" }, 503);
  }
}

async function updateLead(request: Request, env: Env, id: string) {
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  const body = (await request.json()) as { status?: string };
  const statuses = ["NEW", "QUALIFIED", "DISQUALIFIED", "SENT_TO_PARTNER", "CONVERTED", "LOST", "NO_RESPONSE", "INVOICED", "PAID"];
  if (!body.status || !statuses.includes(body.status)) return json(request, { message: "Invalid status" }, 400);
  try {
    const lead = await withDb(env, async (db) => {
      const result = await db.query(`UPDATE "Lead" SET status = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING id, status, "updatedAt"`, [body.status, id]);
      return result.rows[0];
    });
    return lead ? json(request, lead) : json(request, { message: "Lead not found" }, 404);
  } catch (error) {
    console.error("Lead update failed:", error);
    return json(request, { message: "Unable to update lead" }, 503);
  }
}

async function routeLead(request: Request, env: Env, id: string) {
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  const body = (await request.json()) as { partnerId?: string };
  if (!body.partnerId) return json(request, { message: "Partner is required" }, 400);
  try {
    const lead = await withDb(env, async (db) => {
      const result = await db.query(`UPDATE "Lead" SET "partnerId" = $1, status = 'SENT_TO_PARTNER', "updatedAt" = NOW() WHERE id = $2 RETURNING id, status, "partnerId"`, [body.partnerId, id]);
      return result.rows[0];
    });
    return lead ? json(request, lead) : json(request, { message: "Lead not found" }, 404);
  } catch (error) {
    console.error("Lead routing failed:", error);
    return json(request, { message: "Unable to route lead" }, 503);
  }
}

async function getPartners(request: Request, env: Env) {
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  try { return json(request, await withDb(env, async (db) => (await db.query(`SELECT id, name, type, "integrationType", "agreedCpl", active, verticals, regions FROM "Partner" WHERE active = TRUE ORDER BY name`)).rows)); }
  catch (error) { console.error("Partner lookup failed:", error); return json(request, { message: "Unable to load partners" }, 503); }
}

async function savePartner(request: Request, env: Env, id?: string) {
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  const body = (await request.json()) as { name?: string; type?: string; agreedCpl?: number; active?: boolean; integrationType?: string; verticals?: unknown[]; regions?: unknown[] };
  const name = String(body.name || "").trim();
  if (!name || !["INSURER", "AGENT", "BROKER"].includes(String(body.type))) return json(request, { message: "Name and valid type are required" }, 400);
  try {
    const partner = await withDb(env, async (db) => {
      if (id) return (await db.query(`UPDATE "Partner" SET name = $1, type = $2, "agreedCpl" = $3, active = COALESCE($4, active), "integrationType" = COALESCE($5, "integrationType"), verticals = COALESCE($6, verticals), regions = COALESCE($7, regions) WHERE id = $8 RETURNING id, name, type, "integrationType", "agreedCpl", active`, [name, body.type, body.agreedCpl ?? null, body.active ?? null, body.integrationType ?? null, body.verticals ? JSON.stringify(body.verticals) : null, body.regions ? JSON.stringify(body.regions) : null, id])).rows[0];
      return (await db.query(`INSERT INTO "Partner" (id, name, type, "integrationType", "agreedCpl", active, verticals, regions) VALUES ($1, $2, $3, COALESCE($4, 'MOCK_STANDARD'), $5, COALESCE($6, TRUE), $7, $8) RETURNING id, name, type, "integrationType", "agreedCpl", active`, [crypto.randomUUID(), name, body.type, body.integrationType ?? null, body.agreedCpl ?? null, body.active ?? true, body.verticals ? JSON.stringify(body.verticals) : null, body.regions ? JSON.stringify(body.regions) : null])).rows[0];
    });
    return partner ? json(request, partner, id ? 200 : 201) : json(request, { message: "Partner not found" }, 404);
  } catch (error) { console.error("Partner save failed:", error); return json(request, { message: "Unable to save partner" }, 503); }
}

async function getRateTables(request: Request, env: Env) {
  const auth = await requireAdmin(request, env); if (auth instanceof Response) return auth;
  try { return json(request, await withDb(env, async (db) => (await db.query(`SELECT r.id, r.vertical, r."partnerId", r."planName", r.criteria, r."premiumMin", r."premiumMax", p.name AS "partnerName" FROM "RateTable" r JOIN "Partner" p ON p.id = r."partnerId" ORDER BY r.vertical, r."planName"`)).rows)); }
  catch (error) { console.error("Rate table lookup failed:", error); return json(request, { message: "Unable to load rate tables" }, 503); }
}

async function saveRateTable(request: Request, env: Env, id?: string) {
  const auth = await requireAdmin(request, env); if (auth instanceof Response) return auth;
  const body = await request.json() as { vertical?: string; partnerId?: string; planName?: string; criteria?: unknown; premiumMin?: number; premiumMax?: number };
  if (!body.vertical || !body.partnerId || !body.planName || typeof body.criteria !== "object" || typeof body.premiumMin !== "number" || typeof body.premiumMax !== "number") return json(request, { message: "Invalid rate table" }, 400);
  try { const row = await withDb(env, async (db) => id ? (await db.query(`UPDATE "RateTable" SET vertical=$1, "partnerId"=$2, "planName"=$3, criteria=$4, "premiumMin"=$5, "premiumMax"=$6 WHERE id=$7 RETURNING *`, [body.vertical, body.partnerId, body.planName, JSON.stringify(body.criteria), body.premiumMin, body.premiumMax, id])).rows[0] : (await db.query(`INSERT INTO "RateTable" (id, vertical, "partnerId", "planName", criteria, "premiumMin", "premiumMax", "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,NOW()) RETURNING *`, [crypto.randomUUID(), body.vertical, body.partnerId, body.planName, JSON.stringify(body.criteria), body.premiumMin, body.premiumMax])).rows[0]); return row ? json(request, row, id ? 200 : 201) : json(request, { message: "Rate table not found" }, 404); }
  catch (error) { console.error("Rate table save failed:", error); return json(request, { message: "Unable to save rate table" }, 503); }
}

async function getRenewals(request: Request, env: Env) {
  const auth = await requireAdmin(request, env); if (auth instanceof Response) return auth;
  try { const rows = await withDb(env, async (db) => (await db.query(`SELECT p.id, p.insurer, p."planName", p.vertical, p.premium, p."startDate", p."endDate", u.name AS "userName", u.phone AS "userPhone" FROM "Policy" p LEFT JOIN "User" u ON u.id=p."userId" WHERE p.status='EXPIRING_SOON' OR p."endDate" <= NOW() + INTERVAL '30 days' ORDER BY p."endDate"`)).rows); return json(request, rows.map(row => ({ ...row, user: { name: row.userName, phone: row.userPhone } }))); }
  catch (error) { console.error("Renewal lookup failed:", error); return json(request, { message: "Unable to load renewals" }, 503); }
}

async function customerRegister(
  request: Request,
  env: Env,
) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  };

  const name = String(body.name || "").trim();

  const email = String(body.email || "")
    .trim()
    .toLowerCase();

  const phone = String(body.phone || "")
    .trim()
    .replace(/\s+/g, "");

  const password = String(body.password || "");

  if (!name) {
    return json(
      request,
      { message: "Name is required" },
      400,
    );
  }

  if (!email || !email.includes("@")) {
    return json(
      request,
      { message: "Valid email is required" },
      400,
    );
  }

  if (!phone) {
    return json(
      request,
      { message: "Phone is required" },
      400,
    );
  }

  if (password.length < 8) {
    return json(
      request,
      {
        message:
          "Password must be at least 8 characters",
      },
      400,
    );
  }

  try {
    const existing = await withDb(
      env,
      async (db) => {
        const result = await db.query(
          `SELECT id
           FROM "User"
           WHERE email = $1 OR phone = $2
           LIMIT 1`,
          [email, phone],
        );

        return result.rows[0];
      },
    );

    if (existing) {
      return json(
        request,
        {
          message:
            "Email or phone already registered",
        },
        409,
      );
    }

    const id = crypto.randomUUID();

    const hashedPassword = await bcrypt.hash(
      password,
      10,
    );

    const user = await withDb(
      env,
      async (db) => {
        const result = await db.query(
          `INSERT INTO "User"
            (
              id,
              phone,
              name,
              email,
              password,
              "createdAt"
            )
           VALUES ($1, $2, $3, $4, $5, NOW())
           RETURNING id, name, email`,
          [
            id,
            phone,
            name,
            email,
            hashedPassword,
          ],
        );

        return result.rows[0];
      },
    );

    const accessToken = createJwt(
      {
        sub: user.id,
        email: user.email,
        role: "CUSTOMER",
      },
      env.JWT_SECRET,
    );

    return json(
      request,
      {
        access_token: accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: "CUSTOMER",
        },
      },
      201,
    );
  } catch (error) {
    console.error(
      "Registration failed:",
      error,
    );

    return json(
      request,
      { message: "Registration failed" },
      500,
    );
  }
}

async function customerLogin(
  request: Request,
  env: Env,
) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  const email = String(body.email || "")
    .trim()
    .toLowerCase();

  const password = String(body.password || "");

  if (!email || !password) {
    return json(
      request,
      {
        message:
          "Email and password are required",
      },
      400,
    );
  }

  try {
    const user = await withDb(
      env,
      async (db) => {
        const result = await db.query(
          `SELECT id, name, email, password
           FROM "User"
           WHERE email = $1
           LIMIT 1`,
          [email],
        );

        return result.rows[0];
      },
    );

    if (!user || !user.password) {
      return json(
        request,
        { message: "Invalid credentials" },
        401,
      );
    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.password,
      );

    if (!validPassword) {
      return json(
        request,
        { message: "Invalid credentials" },
        401,
      );
    }

    const accessToken = createJwt(
      {
        sub: user.id,
        email: user.email,
        role: "CUSTOMER",
      },
      env.JWT_SECRET,
    );

    return json(request, {
      access_token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: "CUSTOMER",
      },
    });
  } catch (error) {
    console.error("Login failed:", error);

    return json(
      request,
      { message: "Login failed" },
      500,
    );
  }
}

async function createLead(
  request: Request,
  env: Env,
) {
  try {
    const body = (await request.json()) as {
      vertical?: string;
      source?: string;
      formData?: {
        name?: string;
        phone?: string;
        age?: string | number;
        [key: string]: unknown;
      };
      userId?: string;
    };

    const vertical = String(
      body.vertical || "",
    )
      .trim()
      .toLowerCase();

    const source = String(
      body.source || "web",
    ).trim();

    const formData = body.formData || {};

    const userId =
      body.userId &&
      String(body.userId).trim()
        ? String(body.userId).trim()
        : null;

    if (
      !vertical ||
      vertical === "unknown"
    ) {
      return json(
        request,
        {
          message:
            "Insurance vertical is required",
        },
        400,
      );
    }

    if (!formData.name) {
      return json(
        request,
        { message: "Name is required" },
        400,
      );
    }

    if (!formData.phone) {
      return json(
        request,
        { message: "Phone is required" },
        400,
      );
    }

    const leadId = crypto.randomUUID();

    const lead = await withDb(
      env,
      async (db) => {
        const result = await db.query(
          `INSERT INTO "Lead"
            (
              id,
              "userId",
              vertical,
              source,
              "formData",
              "consentTs",
              status,
              "createdAt",
              "updatedAt"
            )
           VALUES (
              $1,
              $2,
              $3,
              $4,
              $5::jsonb,
              NOW(),
              'NEW',
              NOW(),
              NOW()
           )
           RETURNING
             id,
             "userId",
             vertical,
             source,
             "formData",
             status,
             "consentTs",
             "createdAt"`,
          [
            leadId,
            userId,
            vertical,
            source,
            JSON.stringify(formData),
          ],
        );

        return result.rows[0];
      },
    );

    return json(
      request,
      {
        success: true,
        message:
          "Quote request submitted successfully",
        lead,
      },
      201,
    );
  } catch (error) {
    console.error(
      "Lead creation failed:",
      error,
    );

    return json(
      request,
      {
        message:
          "Failed to submit quote request",
      },
      500,
    );
  }
}

async function getQuotes(
  request: Request,
  env: Env,
) {
  const url = new URL(request.url);

  const vertical = String(
    url.searchParams.get("vertical") || "",
  ).toLowerCase();

  if (!vertical) {
    return json(request, []);
  }

  try {
    const rows = await withDb(
      env,
      async (db) => {
        const result = await db.query(
          `SELECT
             r.id,
             r."planName",
             r.criteria,
             r."premiumMin",
             r."premiumMax",
             p.id AS "partnerId",
             p.name AS insurer,
             p."claimRatio"
           FROM "RateTable" r
           INNER JOIN "Partner" p
             ON p.id = r."partnerId"
           WHERE r.vertical = $1
             AND p.active = TRUE
             AND p.type::text = 'INSURER'`,
          [vertical],
        );

        return result.rows;
      },
    );

    const cc = Number(
      url.searchParams.get("cc") || 0,
    );

    const age = Number(
      url.searchParams.get("age") || 0,
    );

    const applicable = rows.filter(
      (row) => {
        const criteria =
          row.criteria || {};

        if (
          criteria.type === "cc" &&
          cc &&
          (cc < Number(criteria.min) ||
            cc > Number(criteria.max))
        ) {
          return false;
        }

        if (
          criteria.type === "age" &&
          age &&
          (age < Number(criteria.min) ||
            age > Number(criteria.max))
        ) {
          return false;
        }

        return true;
      },
    );

    const quotes = applicable.map(
      (row) => {
        const min = Number(
          row.premiumMin,
        );

        const max = Number(
          row.premiumMax,
        );

        const premiumValue =
          Math.round(
            min === max
              ? min
              : (min + max) / 2,
          );

        return {
          id: base64UrlString(
            `${row.insurer}-${row.planName}`,
          ),
          insurer: row.insurer,
          plan: row.planName,
          premium: `NPR ${premiumValue.toLocaleString(
            "en-US",
          )}/yr`,
          premiumValue,
          coverage:
            vertical === "motor"
              ? "Motor insurance coverage"
              : vertical === "health"
                ? "Health insurance coverage"
                : vertical === "life"
                  ? "Life insurance coverage"
                  : "Insurance coverage",
          csr: row.claimRatio
            ? `${Number(
                row.claimRatio,
              ).toFixed(1)}%`
            : "N/A",
          exclusions: [],
          isBestMatch: false,
        };
      },
    );

    quotes.sort(
      (a, b) =>
        a.premiumValue -
        b.premiumValue,
    );

    if (quotes.length > 0) {
      quotes[0].isBestMatch = true;
    }

    return json(request, quotes);
  } catch (error) {
    console.error("Quotes failed:", error);

    return json(
      request,
      {
        message:
          "Unable to load quotes",
      },
      500,
    );
  }
}

async function health(
  request: Request,
  env: Env,
) {
  try {
    await withDb(
      env,
      async (db) => {
        await db.query("SELECT 1");
      },
    );

    return json(request, {
      success: true,
      database: "connected",
      service:
        "NepaCompare Cloudflare API",
    });
  } catch (error) {
    console.error(
      "Health check failed:",
      error,
    );

    return json(
      request,
      {
        success: false,
        database:
          "connection_failed",
      },
      503,
    );
  }
}

export default {
  async fetch(
    request: Request,
    env: Env,
  ): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request),
      });
    }

    const url = new URL(request.url);

    const path =
      url.pathname.replace(/\/+$/, "") ||
      "/";

    // Temporary safe diagnostic.
    // Does NOT reveal the JWT secret.
    if (
      request.method === "GET" &&
      path === "/debug/env"
    ) {
      return json(request, {
        jwtSecretConfigured:
          Boolean(env.JWT_SECRET),

        jwtSecretLength:
          env.JWT_SECRET?.length || 0,

        hyperdriveConfigured:
          Boolean(env.HYPERDRIVE),

        hyperdriveConnectionConfigured:
          Boolean(
            env.HYPERDRIVE
              ?.connectionString,
          ),
      });
    }

    if (
      request.method === "GET" &&
      (path === "/" ||
        path === "/health" ||
        path === "/health/db")
    ) {
      return health(request, env);
    }

    if (
      request.method === "POST" &&
      path ===
        "/auth/customer-register"
    ) {
      return customerRegister(
        request,
        env,
      );
    }

    if (
      request.method === "POST" &&
      path ===
        "/auth/customer-login"
    ) {
      return customerLogin(
        request,
        env,
      );
    }

    if (request.method === "POST" && path === "/auth/login") {
      return staffLogin(request, env);
    }

    if (request.method === "GET" && path === "/auth/me") {
      return staffMe(request, env);
    }

    if (
      request.method === "GET" &&
      path === "/quotes"
    ) {
      return getQuotes(
        request,
        env,
      );
    }

    if (
      request.method === "POST" &&
      path === "/leads"
    ) {
      return createLead(
        request,
        env,
      );
    }

    if (request.method === "GET" && path === "/leads") {
      return getLeads(request, env);
    }

    if (path.startsWith("/leads/") && path.endsWith("/route") && request.method === "PATCH") return routeLead(request, env, path.split("/")[2]);
    if (path.startsWith("/leads/") && request.method === "PATCH") return updateLead(request, env, path.split("/")[2]);
    if (path.startsWith("/leads/") && request.method === "GET") return getLead(request, env, path.split("/")[2]);
    if (path === "/partners" && request.method === "GET") return getPartners(request, env);
    if (path === "/partners" && request.method === "POST") return savePartner(request, env);
    if (path.startsWith("/partners/") && request.method === "PATCH") return savePartner(request, env, path.split("/")[2]);
    if (path === "/rate-tables" && request.method === "GET") return getRateTables(request, env);
    if (path === "/rate-tables" && request.method === "POST") return saveRateTable(request, env);
    if (path.startsWith("/rate-tables/") && request.method === "PATCH") return saveRateTable(request, env, path.split("/")[2]);
    if (path === "/renewals/expiring-all" && request.method === "GET") return getRenewals(request, env);

    return json(
      request,
      {
        message: "Route not found",
      },
      404,
    );
  },
};
