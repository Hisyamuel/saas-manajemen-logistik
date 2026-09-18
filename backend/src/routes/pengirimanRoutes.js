const { buatPermintaan, getRiwayatPengiriman, batalkanPengiriman } = require('../controllers/pengirimanController');
const { verifyToken } = require('../middlewares/authMiddleware');

const pengirimanRoutes = [
    {
        method: 'POST',
        path: '/api/pengiriman',
        options: { pre: [{ method: verifyToken, assign: 'user' }] },
        handler: buatPermintaan
    },
    {
        method: 'GET',
        path: '/api/pengiriman',
        options: { pre: [{ method: verifyToken, assign: 'user' }] },
        handler: getRiwayatPengiriman
    },
    // Rute baru untuk pembatalan menggunakan metode DELETE dan parameter dinamis {id}
    {
        method: 'DELETE',
        path: '/api/pengiriman/{id}',
        options: { pre: [{ method: verifyToken, assign: 'user' }] },
        handler: batalkanPengiriman
    }
];

module.exports = pengirimanRoutes;