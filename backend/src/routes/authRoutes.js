const authController = require('../controllers/authController');

const authRoutes = [
    {
        method: 'POST',
        path: '/api/auth/register',
        handler: authController.register
    },
    {
        method: 'POST',
        path: '/api/auth/login',
        handler: authController.login
    }
];

module.exports = authRoutes;