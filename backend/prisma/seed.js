import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const prisma = new PrismaClient();

async function main() {
  console.log('Running seed...');

  // Create two users
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      firstName: 'Alice',
      lastName: 'Silva',
      email: 'alice@example.com',
      password: '$2a$10$abcdefghijklmnopqrstuv', // dummy bcrypt hash
      driverLicense: 'ABC1234',
      gender: 'F',
      senacId: 'SENAC_ALICE_001',
      statusVerificacao: 'PENDENTE'
    }
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      firstName: 'Bob',
      lastName: 'Souza',
      email: 'bob@example.com',
      password: '$2a$10$abcdefghijklmnopqrstuv',
      driverLicense: 'XYZ5678',
      gender: 'M',
      senacId: 'SENAC_BOB_002',
      statusVerificacao: 'PENDENTE'
    }
  });

  // Create a share (trip) by Alice
  const trip = await prisma.share.create({
    data: {
      driverId: alice.id,
      origin: 'Centro',
      destination: 'Universidade',
      departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24),
      spots: 3,
      message: 'Saída às 08:00'
    }
  });

  // Create a request by Bob to join Alice's trip
  await prisma.request.upsert({
    where: { id: 1 },
    update: {},
    create: {
      shareId: trip.id,
      userId: bob.id,
      message: 'Posso ir com vocês?'
    }
  });

  console.log('Seed finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
