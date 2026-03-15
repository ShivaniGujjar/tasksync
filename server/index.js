// server/index.js

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middlewares
app.use(cors({ origin: '*' })); 
app.use(express.json()); 

// test route to check if the API is running
app.get('/', (req, res) => {
  res.send('API chal raha hai...');
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/boards', require('./routes/boards'));
app.use('/api/lists', require('./routes/lists'));
app.use('/api/cards', require('./routes/cards'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/users', require('./routes/users'));


const startServer = async () => {
  try {
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB se connect ho gaya!');
    
    
    const PORT = process.env.PORT || 5001;
    
    
    app.listen(PORT, () => {
      console.log(`Server port ${PORT} par chal raha hai`);
    });

  } catch (error) {
    console.error('MongoDB se connect nahi ho paya', error);
    process.exit(1); 
  }
};

// Call the function to start the server
startServer();