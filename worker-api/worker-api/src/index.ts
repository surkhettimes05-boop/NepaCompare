import { Client } from "pg";

interface Env {
  HYPERDRIVE: {
    connectionString: string;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Simple test endpoint
    if (url.pathname === "/") {
      return Response.json({
        success: true,
        message: "NepaCompare API is running"
      });
    }

    // Test Cloudflare -> Hyperdrive -> Neon
    if (url.pathname === "/health/db") {
      const client = new Client({
        connectionString: env.HYPERDRIVE.connectionString
      });

      try {
        await client.connect();

        const result = await client.query(
          "SELECT NOW() AS database_time"
        );

        return Response.json({
          success: true,
          database: "connected",
          databaseTime: result.rows[0].database_time
        });
      } catch (error) {
        console.error("Database connection failed:", error);

        return Response.json(
          {
            success: false,
            database: "connection_failed",
            error:
              error instanceof Error
                ? error.message
                : "Unknown database error"
          },
          { status: 500 }
        );
      } finally {
        await client.end().catch(() => {});
      }
    }

    return Response.json(
      {
        success: false,
        message: "Route not found"
      },
      { status: 404 }
    );
  }
};


