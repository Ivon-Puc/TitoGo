// ULTIMA TENTATIVA
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
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

// [ADICIONADO] Middleware para verificar o cargo de Admin
const isAdmin = (req, res, next) => {
    // A propriedade 'role' vem do token, que é adicionado ao req.user pelo authenticateToken
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        return res.status(403).json({ message: 'Acesso Negado: Admin é necessário' });
    }
};

// ==========================================================
// ROTA DE REGISTO CORRIGIDA (DOMÍNIO + GÊNERO)
// ==========================================================
app.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, driverLicenseId, gender, senacId } = req.body;

    const dominiosPermitidos = ['@sp.senac.br', '@senacsp.edu.br'];
    const dominioValido = dominiosPermitidos.some(dominio => senacId.endsWith(dominio));

    if (!dominioValido) {
      return res.status(400).json({ 
        message: 'ID Senac inválido. O e-mail institucional deve terminar com @sp.senac.br ou @senacsp.edu.br' 
      });
    }

    let genderEnum;
    if (gender === 'masculino' || gender === 'MALE') {
      genderEnum = 'MALE';
    } else if (gender === 'feminino' || gender === 'FEMALE') {
      genderEnum = 'FEMALE';
    } else {
      genderEnum = 'OTHER';
    }

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
                driverLicense: driverLicenseId || null, 
                gender: genderEnum, 
                senacId 
            },
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
// ==========================================================
// FIM DA ROTA DE REGISTO CORRIGIDA
// ==========================================================


// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password' });

        // [CORREÇÃO 1] Verificar o statusVerificacao (o campo correto no Schema)
        if (user.statusVerificacao !== 'APROVADO') {
            return res.status(403).json({ message: 'Usuário não aprovado. Contacte o Admin.' });
        }
        
        // [CORREÇÃO 2] Incluir o role (cargo) no Token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );
        
        // Devolver o role no response (resposta) para o frontend (opcional, mas útil)
        res.status(200).json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ==========================================================
// ROTA ADMIN: APROVAR/REPROVAR UTILIZADOR
// ==========================================================
// Protegida por authenticateToken E isAdmin
app.patch('/admin/users/:userId/status', authenticateToken, isAdmin, async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;

    // Validação de segurança: o status tem de ser um dos nossos ENUMs
    if (!['PENDENTE', 'APROVADO', 'REPROVADO'].includes(status)) {
        return res.status(400).json({ message: 'Status de verificação inválido' });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { statusVerificacao: status },
            // Devolvemos apenas os campos essenciais
            select: { id: true, email: true, statusVerificacao: true, role: true } 
        });

        res.status(200).json({ 
            message: `Status do usuário ${userId} atualizado para ${status}`, 
            user: updatedUser 
        });

    } catch (error) {
        console.error('Error updating user status:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
// ==========================================================
// FIM DA ROTA ADMIN
// ==========================================================


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
                    gte: new Date(date), 
                    lte: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
                },
                spots: { gt: 0 },
            },
            include: {
                driver: {
                    select: { firstName: true, lastName: true },
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
        const ride = await prisma.share.findUnique({ where: { id: shareId } });
        if (!ride || ride.spots <= 0) {
            return res.status(400).json({ message: 'No spots available for this ride' });
        }

        const newRequest = await prisma.request.create({
            data: {
                shareId,
                userId: req.user.id, 
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
                select: { firstName: true, lastName: true },
              },
            },
          },
        },
      });
  
      if (!trips.length) {
        return res.status(200).json([]);
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
          share: true, 
          user: {
            select: { firstName: true, lastName: true },
          },
        },
      });
  
      if (!requests.length) {
        return res.status(200).json([]);
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
        return res.status(200).json([]);
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
  
    if (!['PENDING', 'APPROVED', 'DECLINED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
  
    try {
      const updatedRequest = await prisma.$transaction(async (tx) => {
  
        const request = await tx.request.findUnique({
          where: { id: parseInt(id) },
          select: { status: true, shareId: true }
        });
  
        if (!request) {
          throw new Error('Request not found');
        }

        const currentStatus = request.status;
        const shareId = request.shareId;

        if (status === 'APPROVED') {
            
            if (currentStatus !== 'PENDING') {
                return tx.request.findUnique({ where: { id: parseInt(id) }});
            }

            const share = await tx.share.findUnique({
                where: { id: shareId },
                select: { spots: true }
            });

            if (!share || share.spots <= 0) {
                throw new Error('No spots available for this ride');
            }

            await tx.share.update({
                where: { id: shareId },
                data: {
                    spots: {
                        decrement: 1 
                    }
                }
            });

            return tx.request.update({
                where: { id: parseInt(id) },
                data: { status: 'APPROVED' },
            });

        } else if (status === 'DECLINED' || status === 'PENDING') {
            
            if (currentStatus === 'APPROVED') {
                await tx.share.update({
                    where: { id: shareId },
                    data: {
                        spots: {
                            increment: 1
                        }
                    }
                });
            }

            return tx.request.update({
                where: { id: parseInt(id) },
                data: { status: status },
            });
        }
        
        return tx.request.findUnique({ where: { id: parseInt(id) }}); 
      });
  
      res.status(200).json({ message: 'Request status updated successfully', request: updatedRequest });
  
    } catch (error) {
      console.error('Error updating request status:', error.message);

      if (error.message === 'Request not found') {
        return res.status(404).json({ message: 'Request not found' });
      }
      if (error.message === 'No spots available for this ride') {
        return res.status(400).json({ message: 'No spots available for this ride' });
      }

      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));