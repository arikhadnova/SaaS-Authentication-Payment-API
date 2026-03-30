const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('./src/config/passport');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
const authRoutes = require('./src/routes/auth.routes');
const oauthRoutes = require('./src/routes/oauth.routes');

app.use('/auth', authRoutes);
app.use('/auth', oauthRoutes);

// Healt check routes
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});