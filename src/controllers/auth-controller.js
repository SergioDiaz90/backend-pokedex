const jwt = require('jsonwebtoken');

const secretKey = 'yourSecretKey';

const users = [
    {
        id: 1,
        username: 'demoUser',
        password: 'demoPassword',
    },
];

const login = (req, res) => {
  // Lógica de inicio de sesión y generación de token JWT
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const accessToken = jwt.sign({ username: user.username, id: user.id }, secretKey);
    res.json({ accessToken });
};

const logout = (req, res) => {
  // Lógica de cierre de sesión
    res.json({ message: 'Logout successful' });
};

module.exports = { login, logout };