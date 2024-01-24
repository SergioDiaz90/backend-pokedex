const express = require('express');
const authRoutes = require('../routes/handler-auth-routes');
const pokemonRoutes = require('../routes/handler-pokemon-routes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', pokemonRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});