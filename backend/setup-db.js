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
  
  // Criar banco de dados se não existir
  await client.query('CREATE DATABASE flow');
  console.log('Banco de dados flow criado');
  
  // Dar todas as permissões necessárias ao titogo_admin
  await client.query('ALTER USER titogo_admin WITH SUPERUSER');
  await client.query('GRANT ALL PRIVILEGES ON DATABASE flow TO titogo_admin');
  console.log('Permissões concedidas');
  
  await client.end();
} catch (err) {
  if (err.code === '42P04') {
    console.log('Banco de dados flow já existe');
    // Continuar com as permissões
    try {
      await client.query('ALTER USER titogo_admin WITH SUPERUSER');
      await client.query('GRANT ALL PRIVILEGES ON DATABASE flow TO titogo_admin');
      console.log('Permissões concedidas');
    } catch (permErr) {
      console.error('Erro ao conceder permissões:', permErr);
    }
  } else {
    console.error('Erro:', err);
  }
  await client.end();
}