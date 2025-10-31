import pg from 'pg';
const { Client } = pg;

const client = new Client({
  user: 'titogo_admin',
  host: 'localhost',
  database: 'flow',
  password: 'admin123',
  port: 5432,
});

try {
  await client.connect();
  console.log('Connected successfully');
  await client.end();
} catch (err) {
  console.error('Connection error:', err);
  await client.end();
}