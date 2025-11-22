import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
    schema: './db/schema.ts',
    out: './drizzle',
    dialect: 'mysql',
    dbCredentials: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'be-labuai',
        port: 3306,
    },
});
