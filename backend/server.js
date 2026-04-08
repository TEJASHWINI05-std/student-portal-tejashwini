const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
app.use((req, res, next) => {
    req.url = req.url.replace(/\/\/{2,}/g, '/');
    next();
});
app.use(express.static(FRONTEND_DIR));

// Fallback to index.html for SPA routing
app.get('/', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

const FILE = './data.json';

// GET API
app.get('/api/messages', (req, res) => {
    const data = JSON.parse(fs.readFileSync(FILE));
    res.json(data);
});

// POST API
app.post('/api/messages', (req, res) => {
    const newData = req.body;
    const data = JSON.parse(fs.readFileSync(FILE));

    data.push(newData);
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

    res.json({ message: "Data saved successfully" });
});

app.listen(5000, () => console.log("Server running on port 5000"));