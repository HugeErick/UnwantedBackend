import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let mdbConnection: mysql.Connection;

export async function getMDBClient() {
  if (!mdbConnection) {
    try {
      mdbConnection = await mysql.createConnection({
        host: process.env.MDB_HOST,
        user: process.env.MDB_USER,
        password: process.env.MDB_PASSWORD,
        database: process.env.MDB_DBNAME,
        port: Number(process.env.MDB_PORT) || 3306,
      });

      console.log('Successfully connected to MariaDB');
    } catch (error) {
      console.error('Error connecting to MariaDB:', error);
      throw error;
    }
  }
  return mdbConnection;
}

// graceful shutdown for MariaDB
process.on('SIGTERM', async () => {
  if (mdbConnection) {
    await mdbConnection.end();
    console.log('MariaDB connection closed.');
  }
});
