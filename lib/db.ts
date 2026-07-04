import { Pool } from "pg";

type SqlValue = string | number | boolean | Date | null;
type SqlClient = <T extends Record<string, unknown> = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: SqlValue[]
) => Promise<T[]>;

let pool: Pool | null = null;
let client: SqlClient | null = null;

export function getDatabaseUrl(): string | null {
  return process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? null;
}

export function hasDatabaseUrl(): boolean {
  return Boolean(getDatabaseUrl());
}

export function getSql(): SqlClient {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    throw new Error("Database URL is not configured.");
  }

  if (!client) {
    pool = new Pool({
      connectionString: databaseUrl,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
      ssl: databaseUrl.includes("sslmode=disable")
        ? false
        : {
            rejectUnauthorized: false
          }
    });

    client = async (strings, ...values) => {
      const text = strings.reduce((query, part, index) => {
        if (index === 0) {
          return part;
        }

        return `${query}$${index}${part}`;
      }, "");
      const result = await pool!.query(text, values);

      return result.rows;
    };
  }

  return client;
}
