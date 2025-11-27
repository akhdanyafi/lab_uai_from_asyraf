import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
    conn: mysql.Pool | undefined;
};

const poolConnection = globalForDb.conn ?? mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'be-labuai',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

if (process.env.NODE_ENV !== 'production') globalForDb.conn = poolConnection;

export const db = drizzle(poolConnection, { schema, mode: "default" });
