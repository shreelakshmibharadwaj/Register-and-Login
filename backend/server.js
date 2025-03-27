import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS

// Routes
app.use('/api', authRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Server error:", err);
    res.status(500).json({ message: 'Internal Server Error' });
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
