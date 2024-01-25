const express = require('express');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('../routes/handler-auth-routes');
const pokemonRoutes = require('../routes/handler-pokemon-routes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


app.use(express.json());
app.use('/auth', authRoutes);
app.use('/api', pokemonRoutes);
app.options('/auth/login', cors());
app.options('/auth/logout', cors());

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});