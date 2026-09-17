const jwt = require('jsonwebtoken');

const verifyToken = (request, h) => {
    // 1. Ambil token dari header Authorization (Format: Bearer <token>)
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Jika tidak ada token, langsung tolak (takeover menghentikan proses)
        return h.response({ 
            status: 'fail', 
            message: 'Akses ditolak. Token otentikasi tidak ditemukan.' 
        }).code(401).takeover(); 
    }

    // 2. Pisahkan kata "Bearer" dan ambil token intinya saja
    const token = authHeader.split(' ')[1];

    try {
        // 3. Verifikasi token menggunakan kunci rahasia di .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Jika asli, titipkan data user (ID, nama, email, role) ke dalam object request
        // agar bisa digunakan oleh Controller nantinya
        request.user = decoded;
        
        // 5. Loloskan kurir ke tujuan utama (Controller)
        return h.continue; 

    } catch (error) {
        return h.response({ 
            status: 'fail', 
            message: 'Sesi tidak valid atau telah kadaluarsa. Silakan masuk kembali.' 
        }).code(401).takeover();
    }
};

module.exports = { verifyToken };