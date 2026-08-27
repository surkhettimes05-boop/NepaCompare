import { Client } from "pg";
import bcrypt from "bcryptjs";
import { createHmac } from "node:crypto";

interface Env {
  HYPERDRIVE: {
    connectionString: string;
  };
  JWT_SECRET: string;
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
      "GET, POST, OPTIONS",
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

    return json(
      request,
      {
        message: "Route not found",
      },
      404,
    );
  },
};
