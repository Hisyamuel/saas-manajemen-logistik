const { register, login, updateProfil } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

const authRoutes = [
    {
        method: 'POST',
        path: '/api/auth/register',
        handler: register
    },
    {
        method: 'POST',
        path: '/api/auth/login',
        handler: login
    },
    {
        method: 'PUT',
        path: '/api/auth/profil',
        options: { pre: [{ method: verifyToken, assign: 'user' }] },
        handler: updateProfil
    }
];

module.exports = authRoutes;