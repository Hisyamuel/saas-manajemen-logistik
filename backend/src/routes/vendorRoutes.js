const { getAvailableJobs, getMyDrivers, assignDriver, getSupir, tambahSupir } = require('../controllers/vendorController');
const { verifyToken } = require('../middlewares/authMiddleware');

const vendorRoutes = [
    {
        method: 'GET',
        path: '/api/vendor/jobs',
        options: { pre: [{ method: verifyToken, assign: 'user' }] },
        handler: getAvailableJobs
    },
    {
        method: 'GET',
        path: '/api/vendor/drivers',
        options: { pre: [{ method: verifyToken, assign: 'user' }] },
        handler: getMyDrivers
    },
    {
        method: 'PUT',
        path: '/api/vendor/assign',
        options: { pre: [{ method: verifyToken, assign: 'user' }] },
        handler: assignDriver
    },
    {
        method: 'GET',
        path: '/api/vendor/supir',
        options: { pre: [{ method: verifyToken, assign: 'user' }] },
        handler: getSupir
    },
    {
        method: 'POST',
        path: '/api/vendor/supir',
        options: { pre: [{ method: verifyToken, assign: 'user' }] },
        handler: tambahSupir
    }
];

module.exports = vendorRoutes;