const axios = require('axios');
const env = require('../environment/environment.json');
const URL_FIRST_POKEMONS =  `${env.URL}/pokemon/?limit=20&offset=0`;
let dataPagPokemons = undefined;

const _getApi = async (url, method) => {
    try {
        let res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.error(`Error en ${method}: `, error);
    }
}

const sortResults = (key, newPage) => {
    if (!newPage) {
        dataPagPokemons.results = {
            [key] : dataPagPokemons.results
        };
    }

    if (newPage) {
        dataPagPokemons.results[key] = newPage;
    }
}

const getItemsPokemon = async (objPokemon, type) => {
    let url = undefined;
    let response = undefined;

    if (type === 'data') {
        url = objPokemon.url;
        response = await _getApi(url, 'getItemsPokemon');
        objPokemon['data'] = response;

        // console.log('getItemsPokemon', objPokemon);
    }

    if (type === 'sprites') {
        url = objPokemon.data.sprites.front_default;
        response = await _getApi(url, 'getItemsPokemon');
        objPokemon.data['sprites'] = Buffer.from(response, 'binary').toString('base64');
    }
}

const getUrlInfoPokemon = async (objPokemon) => {
    for (let item in objPokemon) {
        await getItemsPokemon(objPokemon[item], 'data');
        await getItemsPokemon(objPokemon[item], 'sprites');
        await getItemsPokemon(objPokemon[item], 'abilities');
    }
}

const getInfoPokemon = async (req, res) => {
    let results = dataPagPokemons.results;

    for (let key in results) {
        let objPokemon = results[key];
        await getUrlInfoPokemon(objPokemon);
    }
    console.log('getInfoPokemon', results);
}

const getFirstInfoPokemon = async (req, res) => {
    dataPagPokemons = await _getApi(URL_FIRST_POKEMONS, 'getFirstInfoPokemon');
    // console.log('getFirstInfoPokemon', dataPagPokemons);
    dataPagPokemons['number_page'] = [ 'page-0' ];
    sortResults(dataPagPokemons['number_page'][0]);
    await getInfoPokemon();
    console.log('getFirstInfoPokemon - ok', req.session.user);
    res.json(dataPagPokemons);
}

const changePagInfoPokemon = async (req, res) => {
    let destiny = req.body.destiny;
    let numberPage = req.body.number_page;
    let results = dataPagPokemons.results;

    // console.log('changePagInfoPokemon', dataPagPokemons.hasOwnProperty(numberPage));
    if (!results.hasOwnProperty(numberPage)) {
        // console.log('changePagInfoPokemon', {body: req.body, url: dataPagPokemons[destiny]});
        const response = await _getApi(dataPagPokemons[destiny], 'changePagInfoPokemon');
        dataPagPokemons.count = response.count;
        dataPagPokemons.next = response.next;
        dataPagPokemons.previous = response.previous;
        dataPagPokemons['number_page'].push(numberPage);
        sortResults(numberPage, response.results);
        await getInfoPokemon();
        console.log('changePagInfoPokemon', dataPagPokemons);
    }

    res.json(dataPagPokemons.results[numberPage]);
}

module.exports = { getFirstInfoPokemon, changePagInfoPokemon };