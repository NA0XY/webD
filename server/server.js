const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));
const USERS_FILE = path.join(__dirname, 'users.json');
let users = [];
function loadUsers() {
    try {
        if (fs.existsSync(USERS_FILE)) {
            const data = fs.readFileSync(USERS_FILE, 'utf8');
            users = JSON.parse(data);
            console.log(`Loaded ${users.length} users from storage`);
        } else {
            users = [];
            console.log('No existing user data found, starting fresh');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        users = [];
    }
}
function saveUsers() {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
        console.log('User data saved successfully');
    } catch (error) {
        console.error('Error saving users:', error);
    }
}
loadUsers();
app.post('/api/signup', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters'
        });
    }
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User already exists'
        });
    }
    const newUser = {
        id: Date.now().toString(),
        email,
        password,
        createdAt: new Date()
    };
    users.push(newUser);
    saveUsers();
    console.log(`New user signed up: ${email}`);
    res.json({
        success: true,
        user: {
            id: newUser.id,
            email: newUser.email
        }
    });
});
app.post('/api/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
    console.log(`User signed in: ${email}`);
    res.json({
        success: true,
        user: {
            id: user.id,
            email: user.email
        }
    });
});
app.get('/api/users', (req, res) => {
    res.json({
        count: users.length,
        users: users.map(u => ({ id: u.id, email: u.email }))
    });
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'signup.html'));
});
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'signin.html'));
});
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'dashboard.html'));
});
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'about.html'));
});
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'contact.html'));
});
app.get('/features', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'features.html'));
});
app.get('/calculators', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'calculators.html'));
});
app.get('/budget', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'budget.html'));
});
app.get('/news', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'news.html'));
});
app.get('/help', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'help.html'));
});
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '..', 'index.html'));
});
app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════╗
    ║   FinanceIQ Server Running Successfully    ║
    ╠═══════════════════════════════════════════╣
    ║   Server: http://localhost:${PORT}           ║
    ║   API: http://localhost:${PORT}/api          ║
    ╚═══════════════════════════════════════════╝
    `);
    console.log('Press Ctrl+C to stop the server\n');
});
process.on('SIGTERM', () => {
    console.log('\nShutting down server...');
    saveUsers();
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    saveUsers();
    process.exit(0);
});
