import pg from 'pg';
const { Client } = pg;

const client = new Client({
  user: 'titogo_admin',
  host: 'localhost',
  database: 'flow',
  password: 'Protonsysdba1986',
  port: 5433,
});

try {
  await client.connect();
  console.log('Conexão bem sucedida!');
  const result = await client.query('SELECT current_database() as db_name');
  console.log('Database:', result.rows[0].db_name);
  await client.end();
} catch (err) {
  console.error('Erro de conexão:', err);
  await client.end();
}