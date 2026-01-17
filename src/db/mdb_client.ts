import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// pool always better dont know why I did single-conn
let pool: mysql.Pool;

// let mdbConnection: mysql.Connection;

export function getMDBClient() {
  if (!pool) {
    try {
      pool = mysql.createPool({
        host: process.env.MDB_HOST,
        user: process.env.MDB_USER,
        password: process.env.MDB_PASSWORD,
        database: process.env.MDB_DBNAME,
        port: Number(process.env.MDB_PORT) || 3306,
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0,
        enableKeepAlive: true, 
        keepAliveInitialDelay: 10000,
      });

      console.log('Successfully pool MariaDB');
    } catch (error) {
      console.error('Error creating to MariaDB pool:', error);
      throw error;
    }
  }
  return pool;
}

// graceful shutdown for MariaDB
process.on('SIGTERM', async () => {
  if (pool) {
    await pool.end();
    console.log('MariaDB connection closed.');
  }
});
