const Hapi = require('@hapi/hapi');
require('dotenv').config();

// Panggil file route dari folder routes/
const authRoutes = require('./routes/authRoutes');
const pengirimanRoutes = require('./routes/pengirimanRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const driverRoutes = require('./routes/driverRoutes');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 5000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'], // Mengizinkan frontend (live server) mengakses API ini
            },
        },
    });

    // Rute Uji Coba Dasar
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return { status: 'success', message: 'API Kirlogist Berjalan dengan Baik!' };
        }
    });

    // Daftarkan rute-rute dari folder routes/ di sini nanti
    server.route(authRoutes);
    server.route(pengirimanRoutes);
    server.route(vendorRoutes);
    server.route(driverRoutes);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();