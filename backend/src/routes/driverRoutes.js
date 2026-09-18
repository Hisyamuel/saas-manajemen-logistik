const { getTugasAktif, selesaikanTugas, getRiwayatTugas, getProfilSupir, updateProfilSupir } = require('../controllers/driverController');
const { verifyToken } = require('../middlewares/authMiddleware');

const driverRoutes = [
    { method: 'GET', path: '/api/driver/tugas', options: { pre: [{ method: verifyToken, assign: 'user' }] }, handler: getTugasAktif },
    { method: 'PUT', path: '/api/driver/tugas', options: { pre: [{ method: verifyToken, assign: 'user' }] }, handler: selesaikanTugas },
    { method: 'GET', path: '/api/driver/riwayat', options: { pre: [{ method: verifyToken, assign: 'user' }] }, handler: getRiwayatTugas },
    { method: 'GET', path: '/api/driver/profil', options: { pre: [{ method: verifyToken, assign: 'user' }] }, handler: getProfilSupir },
    { method: 'PUT', path: '/api/driver/profil', options: { pre: [{ method: verifyToken, assign: 'user' }] }, handler: updateProfilSupir }
];

module.exports = driverRoutes;