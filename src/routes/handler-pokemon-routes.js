const express = require('express');
const router = express.Router();
const pokemonController = require('../controllers/pokemon-controller');
const authenticationMiddleware = require('../middleware/auth-middleware');

router.get('/pokemon/:id', authenticationMiddleware.authenticateToken, pokemonController.getPokemonDetails);

module.exports = router;