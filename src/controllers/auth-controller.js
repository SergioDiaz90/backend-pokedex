const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const secretKey = 'yourSecretKey';
const users = [
    {
        id: 1,
        username: 'demoUser',
        password: 'demoPassword',
    },
];

const loadTokens = async () => {
    try {
        const content = await fs.readFile('src/data-session/tokens.json', 'utf-8');
        return JSON.parse(content) || {};
    } catch (error) {
        console.error('loadSessions', error);
        return {};
    }
};

// Guardar sesiones en el archivo JSON
const saveTokens = async (token) => {
    try {
        await fs.writeFile('./src/data-session/tokens.json', JSON.stringify(token));
    } catch (error) {
        console.error('saveSessions', error);
    }
};

const loadSessions = async () => {
    try {
        const content = await fs.readFile('./src/data-session/sessions.json', 'utf-8');
        return JSON.parse(content) || {};
    } catch (error) {
        console.error('loadSessions', error);
        return {};
    }
};

// Guardar sesiones en el archivo JSON
const saveSessions = async (sessions) => {
    try {
        await fs.writeFile('src/data-session/sessions.json', JSON.stringify(sessions));
    } catch (error) {
        console.error('saveSessions', error);
    }
};

const login = async (req, res) => {
  // Lógica de inicio de sesión y generación de token JWT
    try {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username && u.password === password);
        const tokenSave = await loadTokens();
        let sessions = await loadSessions();
        let accessToken = undefined;

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // console.log('login', {tokensInit}, tokensInit.hasOwnProperty(user.username));
        if (!tokenSave.hasOwnProperty(user.username)) {
            accessToken = jwt.sign({ username: user.username, id: user.id }, secretKey);
            tokenSave[user.username] = accessToken;
            await saveTokens(tokenSave);
            console.log('tokensInit', tokenSave );
        } else {
            return res.status(200).json({ message: 'Sesión ya existente', accessToken: sessions[tokenSave[user.username]].token });
        }
        
        const userData = {
            name: user.username,
            password: user.password,
            nickname: 'userNickname',
            last_connection: new Date().toISOString(),
        };
        
        req.session['token'] = accessToken;
        req.session['user'] = userData;
        sessions[req.session.token] = req.session;
        await saveSessions(sessions);
    
        res.json({ accessToken });

    } catch (error) {
        console.error('login', error );
    }
};

const logout = async (req, res) => {
  // Lógica de cierre de sesión
    try {
        console.log('logout', req)
        const token = req.header('Authorization');
        const sessions = await loadSessions();
        console.log('token', { token, session: sessions[token], sessions });
        delete sessions[token];
        await saveSessions(sessions);
    
        const tokenSave = await loadTokens();
        const searchToken = Object.keys(tokenSave).find( item => tokenSave[item] === token);
        console.log('searchtoken', tokenSave[searchToken], tokenSave);
        delete tokenSave[searchToken];
        await saveTokens(tokenSave);

        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('logout', error);
    }
};

module.exports = { login, logout , loadSessions };