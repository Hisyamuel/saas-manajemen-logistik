const supabase = require('..//../../database/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (request, h) => {
    const { name, email, password, role } = request.payload;

    try {
        // 1. Cek apakah email sudah terdaftar di database
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return h.response({ status: 'error', message: 'Email sudah terdaftar!' }).code(400);
        }

        // 2. Hash Password (Enkripsi)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let perusahaanId = null;

        // 3. Relasi Cerdas: Jika Toko/Vendor, buat data Perusahaan dulu
        if (role === 'toko' || role === 'vendor') {
            const tipe = role === 'toko' ? 'Toko' : 'Vendor';
            const { data: newPerusahaan, error: errPerusahaan } = await supabase
                .from('perusahaan')
                .insert([{ nama_perusahaan: name, tipe_perusahaan: tipe }])
                .select()
                .single();

            if (errPerusahaan) throw errPerusahaan;
            perusahaanId = newPerusahaan.id;
        }

        // 4. Masukkan data ke tabel users
        const { data: newUser, error: errUser } = await supabase
            .from('users')
            .insert([{
                nama_lengkap: name,
                email: email,
                password: hashedPassword,
                role: role,
                perusahaan_id: perusahaanId
            }])
            .select()
            .single();

        if (errUser) throw errUser;

        return h.response({ 
            status: 'success', 
            message: 'Registrasi berhasil!' 
        }).code(201);

    } catch (error) {
        console.error('Error Register:', error);
        return h.response({ status: 'error', message: 'Terjadi kesalahan pada server.' }).code(500);
    }
};

const login = async (request, h) => {
    const { email, password, role } = request.payload;

    try {
        // 1. Cari user berdasarkan email dan role
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .eq('role', role)
            .single();

        if (!user || error) {
            return h.response({ status: 'error', message: 'Kredensial tidak valid atau peran salah.' }).code(401);
        }

        // 2. Bandingkan password yang diketik dengan hash di database
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return h.response({ status: 'error', message: 'Kredensial tidak valid.' }).code(401);
        }

        // 3. Buat Token JWT (Tiket Sesi)
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, perusahaan_id: user.perusahaan_id },
            process.env.JWT_SECRET || 'secret_fallback',
            { expiresIn: '24h' }
        );

        return h.response({
            status: 'success',
            message: 'Login berhasil!',
            token: token,
            user: { name: user.nama_lengkap, email: user.email, role: user.role }
        }).code(200);

    } catch (error) {
        console.error('Error Login:', error);
        return h.response({ status: 'error', message: 'Terjadi kesalahan pada server.' }).code(500);
    }
};

module.exports = { register, login };