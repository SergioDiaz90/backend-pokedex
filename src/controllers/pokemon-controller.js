const axios = require('axios');
const env = require('../environment/environment.json');
let limit = '20';
let offset = '20';

const getInfoPokemon = async () => {
    try {
        const response = await axios.get(`${env.URL}/ability/?limit=${limit}&offset=${offset}`);
        console.log('getInfoPokemon', response);
    } catch (error) {
        console.error('Error en getInfoPokemon:', error.message);
    }
}

const getPokemonForPage = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

const getPokemonDetails = async (req, res) => {
  // Lógica para obtener detalles de Pokémon utilizando la PokeAPI
    try {
        console.log('url', `${env.URL}/pokemon${req.params.id}`);
        const response = await axios.get(`${env.URL}/pokemon/${req.params.id}`);
        await getInfoPokemon();
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Pokémon details' });
    }
};

module.exports = { getPokemonDetails };