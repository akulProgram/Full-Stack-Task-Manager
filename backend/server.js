const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const https = require('https');
const authRoutes = require('./routes/authRoutes');
const authenticateToken = require('./middleware/authMiddleware');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);


app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: `Welcome, user ${req.user.id}!` });
});

app.get('/', (req, res) => {
  res.send('API Running...');
});

const sslOptions = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

const PORT = process.env.PORT || 443;

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`HTTPS server running on port ${PORT}`);
});
