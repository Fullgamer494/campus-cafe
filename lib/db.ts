import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function query<T>(sql: string, params: (string | number)[] = []): Promise<T[]> {
    const result = await pool.query(sql, params);
    return result.rows;
}
