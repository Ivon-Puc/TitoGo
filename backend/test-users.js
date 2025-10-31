import pg from 'pg';
const { Client } = pg;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Protonsysdba1986',
  port: 5433,
});

try {
  await client.connect();
  console.log('Conexão bem sucedida como postgres!');
  const result = await client.query('SELECT usename, usesuper FROM pg_user');
  console.log('Usuários:', result.rows);
  await client.end();
} catch (err) {
  console.error('Erro de conexão:', err);
  await client.end();
}