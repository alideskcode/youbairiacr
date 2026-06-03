import mysql from 'mysql2/promise';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  });

  const [rows] = await connection.execute('SELECT * FROM User');
  await connection.end();

  return Response.json(rows);
}