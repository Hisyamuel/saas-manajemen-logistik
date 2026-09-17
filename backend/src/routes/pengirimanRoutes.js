const { buatPermintaan, getRiwayatPengiriman } = require('../controllers/pengirimanController');
const { verifyToken } = require('../middlewares/authMiddleware');

const pengirimanRoutes = [
    {
        method: 'POST',
        path: '/api/pengiriman',
        options: {
            // Di sinilah fungsi middleware (Satpam) kita pasang
            pre: [
                { method: verifyToken, assign: 'user' }
            ]
        },
        handler: buatPermintaan
    },
    {
        method: 'GET',
        path: '/api/pengiriman',
        options: {
            // Di sinilah fungsi middleware (Satpam) kita pasang
            pre: [
                { method: verifyToken, assign: 'user' }
            ]
        },
        handler: getRiwayatPengiriman
    }
];

module.exports = pengirimanRoutes;