// backend/server.js
const path = require('path');
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 5000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('Public'));

// ================= MONGODB CONNECTION (SIMPLIFIED) =================
const MONGODB_URI = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'kibu_evote';

let db = null;

async function connectDB() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        
        // SIMPLE connection - no extra options
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        
        db = client.db(DB_NAME);
        console.log('✅ MongoDB Connected Successfully!');
        console.log(`📊 Database: ${DB_NAME}`);
        
        // Test connection
        await db.command({ ping: 1 });
        console.log('✅ MongoDB Ping Successful');
        
        // Create collections if they don't exist
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        
        const requiredCollections = ['positions', 'candidates', 'elections'];
        
        for (const collName of requiredCollections) {
            if (!collectionNames.includes(collName)) {
                await db.createCollection(collName);
                console.log(`📁 Created ${collName} collection`);
            }
        }
        
        console.log('✅ Database setup complete');
        return true;
        
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error.message);
        console.log('\n💡 TROUBLESHOOTING:');
        console.log('1. Open a NEW terminal window');
        console.log('2. Run: mongod');
        console.log('3. Wait for "Waiting for connections" message');
        console.log('4. Then restart this server');
        return false;
    }
}

// Initialize DB
connectDB();

// Middleware to check DB connection
const checkDB = (req, res, next) => {
    if (!db) {
        return res.status(503).json({
            success: false,
            error: 'Database not connected. Please wait...'
        });
    }
    next();
};

// ================= ADMIN ROUTES =================

// Admin Login
app.post('/api/admin/login', (req, res) => {
    console.log('🔐 Admin login attempt');
    
    const { email, password } = req.body || {};
    
    // Simple hardcoded admin
    if (email === 'admin@kibu.edu' && password === 'admin123') {
        return res.json({
            success: true,
            token: 'admin-token-' + Date.now(),
            user: { email: email, role: 'admin' }
        });
    }
    
    res.status(401).json({
        success: false,
        error: 'Invalid credentials'
    });
});

// ================= POSITIONS ROUTES =================

// Get positions for election
app.get('/api/positions/election/:electionId', checkDB, async (req, res) => {
    try {
        const positions = await db.collection('positions')
            .find({ electionId: req.params.electionId })
            .sort({ order: 1 })
            .toArray();
        
        res.json(positions || []);
    } catch (error) {
        console.error('Error getting positions:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Add new position
app.post('/api/positions', checkDB, async (req, res) => {
    try {
        const { electionId, title, description, order } = req.body;
        
        if (!title || !electionId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Title and electionId are required' 
            });
        }
        
        const positionData = {
            _id: new ObjectId(),
            electionId: electionId,
            title: title,
            description: description || '',
            order: order || 1,
            maxVotes: 1,
            createdAt: new Date()
        };
        
        await db.collection('positions').insertOne(positionData);
        
        res.json({
            success: true,
            position: positionData,
            message: 'Position added successfully'
        });
    } catch (error) {
        console.error('Error adding position:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ================= CANDIDATES ROUTES =================

// Get candidates for election
app.get('/api/candidates/election/:electionId', checkDB, async (req, res) => {
    try {
        const candidates = await db.collection('candidates')
            .find({ electionId: req.params.electionId })
            .toArray();
        
        res.json(candidates || []);
    } catch (error) {
        console.error('Error getting candidates:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Add new candidate
app.post('/api/candidates', checkDB, async (req, res) => {
    try {
        const { electionId, positionId, name, regNo, department, manifesto } = req.body;
        
        if (!name || !positionId || !electionId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Name, positionId, and electionId are required' 
            });
        }
        
        const candidateData = {
            _id: new ObjectId(),
            electionId: electionId,
            positionId: positionId,
            name: name,
            regNo: regNo || 'STU000',
            department: department || '',
            photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
            manifesto: manifesto || '',
            votes: 0,
            createdAt: new Date()
        };
        
        await db.collection('candidates').insertOne(candidateData);
        
        res.json({
            success: true,
            candidate: candidateData,
            message: 'Candidate added successfully'
        });
    } catch (error) {
        console.error('Error adding candidate:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ================= UTILITY ROUTES =================

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working!',
        database: db ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'OK',
        database: db ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Get all positions
app.get('/api/positions', checkDB, async (req, res) => {
    try {
        const positions = await db.collection('positions').find().toArray();
        res.json(positions || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Database status
app.get('/api/db-status', async (req, res) => {
    try {
        if (!db) {
            return res.json({ 
                connected: false,
                message: 'MongoDB not connected'
            });
        }
        
        // List collections
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        
        // Get document counts
        const counts = {};
        for (const collName of collectionNames) {
            counts[collName] = await db.collection(collName).countDocuments();
        }
        
        res.json({
            connected: true,
            database: DB_NAME,
            collections: collectionNames,
            counts: counts
        });
        
    } catch (error) {
        res.json({
            connected: false,
            error: error.message
        });
    }
});

// ================= ADMIN PAGES =================

// Admin dashboard
app.get('/admin/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'admin-dashboard.html'));
});

// Admin login page
app.get('/admin-login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'admin-login.html'));
});

// Redirect
app.get('/admin', (req, res) => {
    res.redirect('/admin-login.html');
});

// Root
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'KIBU eVote API',
        version: '1.0.0',
        endpoints: {
            admin: '/admin-login.html',
            test: '/api/test',
            health: '/health',
            dbStatus: '/api/db-status'
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.path
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err.message);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// ================= START SERVER =================

app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════╗
    ║      KIBU eVote Server Started       ║
    ╚══════════════════════════════════════╝
    
    🌐 Server URL:  http://localhost:${PORT}
    
    📋 Quick Links:
    --------------------------------------
    🔐 Admin Login:    http://localhost:${PORT}/admin-login.html
    ✅ API Test:       http://localhost:${PORT}/api/test
    💚 Health Check:   http://localhost:${PORT}/health
    🗄️  DB Status:     http://localhost:${PORT}/api/db-status
    
    👤 Admin Credentials:
    --------------------------------------
    📧 Email:    admin@kibu.edu
    🔑 Password: admin123
    
    ⚠️  IMPORTANT - MongoDB Setup:
    1. Open a NEW terminal window
    2. Run this command: mongod
    3. Wait for "Waiting for connections" message
    4. If already running, you'll see "Address already in use"
    
    📊 Server will automatically create the database
    `);
});