import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function resetDb() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('DATABASE_URL not found');

    // Parse the URL to get connection details but connect without specific logic to drop it
    // Actually mysql2 connection string can just connect. We can strip the db name to connect to root.
    const urlWithoutDb = dbUrl.substring(0, dbUrl.lastIndexOf('/'));
    const dbName = dbUrl.substring(dbUrl.lastIndexOf('/') + 1).split('?')[0];

    const connection = await mysql.createConnection(urlWithoutDb);

    console.log(`Dropping database ${dbName}...`);
    await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\``);

    console.log(`Creating database ${dbName}...`);
    await connection.query(`CREATE DATABASE \`${dbName}\``);

    console.log('Database reset successfully!');
    await connection.end();
}

resetDb().catch(console.error);
