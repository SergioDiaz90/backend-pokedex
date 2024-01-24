const jwt = require('jsonwebtoken');
const authController = require('../controllers/auth-controller');
const secretKey = 'yourSecretKey';

const authenticateToken = async (req, res, next) => {
    const token = req.header('Authorization');
    const sessions = await authController.loadSessions();

    console.log('authenticateToken', { session: sessions[token] });
    if (!token || !sessions[token]) {
        return res.sendStatus(401);
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            req.session.token = null;
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };