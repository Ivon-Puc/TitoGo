import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client'; //prisma/client
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const app = express();
const prisma = new PrismaClient();

const JWT_SECRET = "my_jwt_secret"; 

app.use(cors());  
app.use(express.json());  

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
        req.user = user;
        next();
    });
};

// Register Route
app.post('/register', async (req, res) => {
    // 1. ADICIONE 'senacId' AQUI
    const { firstName, lastName, email, password, driverLicenseId, gender, senacId } = req.body; // <-- MUDANÇA AQUI

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { 
                firstName, 
                lastName, 
                email, 
                password: hashedPassword, 
                driverLicense: driverLicenseId, 
                gender,
                senacId: senacId // <-- 2. ADICIONE ESTA LINHA
            },
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Protected Routes
app.get('/protected/share', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'You can access this route!' });
});

//store trips data
app.post('/create-trip', authenticateToken, async (req, res) => {
    const { from, to, departureDate, departureTime, spots, message } = req.body;

    try {
        const trip = await prisma.share.create({
            data: {
                driverId: req.user.id, 
                origin: from,
                destination: to,
                departureTime: new Date(`${departureDate}T${departureTime}`),
                spots: parseInt(spots),
                message: message || null,
            },
        });

        res.status(201).json({ message: 'Trip created successfully', trip });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Search Rides Route
app.get('/search-rides', authenticateToken, async (req, res) => {
    const { from, to, date } = req.query;

    try {
        const rides = await prisma.share.findMany({
            where: {
                origin: { contains: from, mode: 'insensitive' },
                destination: { contains: to, mode: 'insensitive' },
                departureTime: {
                    gte: new Date(date), // Match rides on or after the given date
                    lte: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000), // Match rides on the same day
                },
                spots: { gt: 0 }, // Ensure there are available spots
            },
            include: {
                driver: {
                    select: { firstName: true, lastName: true }, // Include driver's name
                },
            },
        });

        res.status(200).json(rides);
    } catch (error) {
        console.error('Error fetching rides:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Request Ride Route
app.post('/request-ride', authenticateToken, async (req, res) => {
    const { shareId, message } = req.body;

    try {
        // Check if spots are available
        const ride = await prisma.share.findUnique({ where: { id: shareId } });
        if (!ride || ride.spots <= 0) {
            return res.status(400).json({ message: 'No spots available for this ride' });
        }

        // Create a new request
        const newRequest = await prisma.request.create({
            data: {
                shareId,
                userId: req.user.id, // User ID from the JWT
                message: message || null,
            },
        });

        res.status(201).json({ message: 'Request raised successfully', request: newRequest });
    } catch (error) {
        console.error('Error raising ride request:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//for trips 
app.get('/trips/driving', authenticateToken, async (req, res) => {
    try {
      const trips = await prisma.share.findMany({
        where: { driverId: req.user.id },
        include: {
          requests: {
            include: {
              user: {
                select: { firstName: true, lastName: true }, // Fetch only necessary fields
              },
            },
          },
        },
      });
  
      if (!trips.length) {
        return res.status(200).json([]); // Return an empty array if no trips found
      }
  
      res.status(200).json(trips);
    } catch (error) {
      console.error('Error fetching driving trips:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  

  app.get('/trips/ride-requests', authenticateToken, async (req, res) => {
    try {
      const requests = await prisma.request.findMany({
        where: {
          share: { driverId: req.user.id },
        },
        include: {
          share: true, // Include trip details
          user: {
            select: { firstName: true, lastName: true }, // Include rider details
          },
        },
      });
  
      if (!requests.length) {
        return res.status(200).json([]); // Return empty array if no requests
      }
  
      res.status(200).json(requests);
    } catch (error) {
      console.error('Error fetching ride requests:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

  app.get('/trips/riding', authenticateToken, async (req, res) => {
    try {
      const ridingRequests = await prisma.request.findMany({
        where: { userId: req.user.id },
        include: {
          share: {
            select: { origin: true, destination: true, departureTime: true },
          },
        },
      });
  
      if (!ridingRequests.length) {
        return res.status(200).json([]); // Return empty array if no riding requests
      }
  
      res.status(200).json(ridingRequests);
    } catch (error) {
      console.error('Error fetching riding requests:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  

  app.patch('/requests/:id/status', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    // Validar o status de entrada
    if (!['PENDING', 'APPROVED', 'DECLINED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
  
    try {
      // Usamos uma transação para garantir a consistência dos dados
      const updatedRequest = await prisma.$transaction(async (tx) => {
  
        // 1. Encontrar o pedido original para saber o seu estado atual e o ID da viagem
        const request = await tx.request.findUnique({
          where: { id: parseInt(id) },
          select: { status: true, shareId: true }
        });
  
        if (!request) {
          throw new Error('Request not found'); // Lança um erro para cancelar a transação
        }

        const currentStatus = request.status; // Ex: "PENDING"
        const shareId = request.shareId;     // Ex: 1

        // ---- LÓGICA DE APROVAÇÃO ----
        if (status === 'APPROVED') {
            
            // Só diminuímos lugares se o pedido estava PENDENTE
            if (currentStatus !== 'PENDING') {
                return tx.request.findUnique({ where: { id: parseInt(id) }}); // Já foi tratado, não faz nada
            }

            // 2. Encontrar a viagem (Share) para verificar se há lugares
            const share = await tx.share.findUnique({
                where: { id: shareId },
                select: { spots: true }
            });

            // 3. Verificar se há lugares disponíveis
            if (!share || share.spots <= 0) {
                throw new Error('No spots available for this ride'); // Cancela a transação
            }

            // 4. Se há lugares, ATUALIZAR AMBOS:
            
            // 4a. Diminuir 1 lugar na viagem (Share)
            await tx.share.update({
                where: { id: shareId },
                data: {
                    spots: {
                        decrement: 1 // Operação atómica de decremento
                    }
                }
            });

            // 4b. Atualizar o status do pedido (Request)
            return tx.request.update({
                where: { id: parseInt(id) },
                data: { status: 'APPROVED' },
            });

        // ---- LÓGICA DE RECUSA (BÓNUS) ----
        } else if (status === 'DECLINED' || status === 'PENDING') {
            
            // Bónus: Se o pedido estava "APPROVED" e agora foi recusado (ou revertido),
            // devolvemos o lugar à viagem.
            if (currentStatus === 'APPROVED') {
                await tx.share.update({
                    where: { id: shareId },
                    data: {
                        spots: {
                            increment: 1 // Operação atómica de incremento
                        }
                    }
                });
            }

            // Apenas atualiza o status do pedido
            return tx.request.update({
                where: { id: parseInt(id) },
                data: { status: status },
            });
        }
        
        // Se o status não for nenhum dos acima (não deve acontecer)
        return tx.request.findUnique({ where: { id: parseInt(id) }}); 
      });
  
      // Se a transação foi bem-sucedida
      res.status(200).json({ message: 'Request status updated successfully', request: updatedRequest });
  
    } catch (error) {
      console.error('Error updating request status:', error.message);

      // Enviar mensagens de erro específicas que definimos na transação
      if (error.message === 'Request not found') {
        return res.status(404).json({ message: 'Request not found' });
      }
      if (error.message === 'No spots available for this ride') {
        return res.status(400).json({ message: 'No spots available for this ride' });
      }

      // Erro genérico
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));