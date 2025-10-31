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
  console.log('Conectado como postgres');
  
  // Alterar a senha do titogo_admin
  await client.query("ALTER USER titogo_admin WITH PASSWORD 'Protonsysdba1986'");
  console.log('Senha alterada com sucesso');
  
  await client.end();
} catch (err) {
  console.error('Erro:', err);
  await client.end();
}