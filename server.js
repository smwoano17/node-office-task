import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

// Create HTTP server
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST']
    }
});

app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api', authRoutes);

// Socket connection
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.set('io', io);

// Test route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API is running'
    });
});


// Error handler
app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });

});

// IMPORTANT: use server.listen(), NOT app.listen()
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});