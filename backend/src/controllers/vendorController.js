const supabase = require('../../../database/index');
const bcrypt = require('bcrypt');

// Mengambil semua pengiriman yang belum memiliki vendor
const getAvailableJobs = async (request, h) => {
    try {
        const { data, error } = await supabase
            .from('pengiriman')
            .select(`
                *,
                toko:toko_id (nama_perusahaan)
            `)
            .eq('status_kirim', 'Mencari Vendor')
            .is('vendor_id', null)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return h.response({ status: 'success', data }).code(200);
    } catch (error) {
        return h.response({ status: 'error', message: 'Gagal memuat bursa pengiriman.' }).code(500);
    }
};

// Mengambil daftar supir milik vendor yang sedang login
const getMyDrivers = async (request, h) => {
    const user_id = request.user.id; // Ini ID Admin Vendor

    try {
        // Cari tahu ID perusahaan vendor ini
        const { data: vendor, error: errVendor } = await supabase
            .from('users')
            .select('perusahaan_id')
            .eq('id', user_id)
            .single();

        if (errVendor || !vendor) throw new Error('Data vendor tidak valid.');

        // Ambil semua user dengan role 'supir' di perusahaan yang sama
        const { data: drivers, error: errDrivers } = await supabase
            .from('users')
            .select('id, nama_lengkap')
            .eq('role', 'supir')
            .eq('perusahaan_id', vendor.perusahaan_id);

        if (errDrivers) throw errDrivers;

        return h.response({ status: 'success', data: drivers }).code(200);
    } catch (error) {
        return h.response({ status: 'error', message: 'Gagal memuat daftar supir.' }).code(500);
    }
};

// Menugaskan supir dan mengambil alih pesanan
const assignDriver = async (request, h) => {
    const { pengiriman_id, supir_id } = request.payload;
    const user_id = request.user.id;

    try {
        const { data: vendor } = await supabase
            .from('users')
            .select('perusahaan_id')
            .eq('id', user_id)
            .single();

        // Update baris pengiriman: set vendor_id, supir_id, dan ubah status
        const { error } = await supabase
            .from('pengiriman')
            .update({
                vendor_id: vendor.perusahaan_id,
                supir_id: supir_id,
                status_kirim: 'Dalam Perjalanan'
            })
            .eq('id', pengiriman_id);

        if (error) throw error;

        return h.response({ status: 'success', message: 'Berhasil mengambil pesanan dan menugaskan supir!' }).code(200);
    } catch (error) {
        return h.response({ status: 'error', message: 'Gagal memproses pesanan.' }).code(500);
    }
};

// --- FUNGSI MENGAMBIL DAFTAR SUPIR ---
const getSupir = async (request, h) => {
    const user_id = request.user.id;
    try {
        const { data: vendor } = await supabase.from('users').select('perusahaan_id').eq('id', user_id).single();
        
        const { data, error } = await supabase
            .from('users')
            .select('id, nama_lengkap, no_hp, kendaraan, plat_nomor, status_supir')
            .eq('role', 'supir')
            .eq('perusahaan_id', vendor.perusahaan_id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return h.response({ status: 'success', data }).code(200);
    } catch (error) {
        return h.response({ status: 'error', message: 'Gagal mengambil data supir.' }).code(500);
    }
};

// --- FUNGSI MENAMBAH SUPIR BARU ---
const tambahSupir = async (request, h) => {
    const user_id = request.user.id;
    const { nama, email, password, no_hp, kendaraan, plat_nomor } = request.payload;

    try {
        const { data: vendor } = await supabase.from('users').select('perusahaan_id').eq('id', user_id).single();
        
        // 1. Cek apakah email sudah terdaftar
        const { data: existing } = await supabase.from('users').select('id').eq('email', email).single();
        if (existing) {
            return h.response({ status: 'fail', message: 'Email sudah terdaftar untuk pengguna lain!' }).code(400);
        }

        // 2. Hash Password untuk akses login si supir nantinya
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Masukkan data ke tabel users dengan role 'supir'
        const { error } = await supabase.from('users').insert([{
            nama_lengkap: nama,
            email: email,
            password: hashedPassword,
            role: 'supir',
            perusahaan_id: vendor.perusahaan_id,
            no_hp: no_hp,
            kendaraan: kendaraan,
            plat_nomor: plat_nomor,
            status_supir: 'Siap Bertugas'
        }]);

        if (error) throw error;
        return h.response({ status: 'success', message: 'Armada supir berhasil ditambahkan!' }).code(201);
    } catch (error) {
        console.error("Error tambah supir:", error);
        return h.response({ status: 'error', message: 'Gagal menambahkan supir.' }).code(500);
    }
};

// Update exports-nya:
module.exports = { getAvailableJobs, getMyDrivers, assignDriver, getSupir, tambahSupir };