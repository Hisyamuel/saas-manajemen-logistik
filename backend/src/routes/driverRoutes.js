const { getTugasAktif, selesaikanTugas } = require('../controllers/driverController');
const { verifyToken } = require('../middlewares/authMiddleware');

const driverRoutes = [
    {
        method: 'GET',
        path: '/api/driver/tugas',
        options: { pre: [{ method: verifyToken, assign: 'user' }] },
        handler: getTugasAktif
    },
    {
        method: 'PUT',
        path: '/api/driver/tugas',
        options: { pre: [{ method: verifyToken, assign: 'user' }] },
        handler: selesaikanTugas
    }
];
module.exports = driverRoutes;