const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://efedhaphlevian_db_user:0dOaLv5p2rnsX5nR@cluster0.2nkucab.mongodb.net/kibu-evote?retryWrites=true&w=majority')
.then(() => {
    console.log('✅ Connected to MongoDB successfully');
})
.catch((err) => {
    console.error('❌ Error connecting to MongoDB:', err.message);
});

// Sample route
app.get('/', (req, res) => {
    res.send('KIBU eVote Backend is running');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Create - Post
// Read - Get
// Update - Put/Patch
// Delete - Delete