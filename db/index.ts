import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const poolConnection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'be-labuai',
    port: 3306,
});

export const db = drizzle(poolConnection, { schema, mode: "default" });
