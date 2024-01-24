const express = require('express');
const router = express.Router();
const pokemonController = require('../controllers/pokemon-controller');
const authenticationMiddleware = require('../middleware/auth-middleware');

router.get('/pokemon-list', authenticationMiddleware.authenticateToken, pokemonController.getFirstInfoPokemon);
router.post('/pokemon-list/more', authenticationMiddleware.authenticateToken, pokemonController.changePagInfoPokemon);

module.exports = router;
