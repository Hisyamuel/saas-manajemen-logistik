const supabase = require('../../../database/index');

const buatPermintaan = async (request, h) => {
    // 1. Tangkap data dari frontend (Pastikan namanya sesuai dengan yang dikirim dari toko.js)
    const { nama_barang, berat, alamat_tujuan } = request.payload;
    
    // 2. Ini adalah ID User, BUKAN ID Perusahaan
    const user_id = request.user.id; 

    try {
        // 3. Cari tahu ID Perusahaan milik user ini dari tabel users
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('perusahaan_id')
            .eq('id', user_id)
            .single();

        if (userError || !userData) {
            throw new Error('Data perusahaan pengguna tidak ditemukan.');
        }

        const toko_id = userData.perusahaan_id;

        // 4. Masukkan ke tabel pengiriman menggunakan toko_id yang benar
        const { data, error } = await supabase
            .from('pengiriman')
            .insert([
                {
                    toko_id: toko_id, 
                    nama_barang: nama_barang,
                    berat_kg: berat, // Petakan 'berat' dari frontend ke 'berat_kg' di database
                    alamat_tujuan: alamat_tujuan,
                    status_kirim: 'Mencari Vendor'
                }
            ])
            .select();

        if (error) throw error;

        return h.response({
            status: 'success',
            message: 'Permintaan pengiriman berhasil dibuat dan disebarkan ke bursa!',
            data: data[0]
        }).code(201);

    } catch (error) {
        console.error('Error buat permintaan:', error);
        return h.response({
            status: 'error',
            message: error.message || 'Gagal membuat permintaan pengiriman.'
        }).code(500);
    }
};

const getRiwayatPengiriman = async (request, h) => {
    const user_id = request.user.id;

    try {
        // 1. Cari tahu ID Perusahaan (Toko) milik user ini
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('perusahaan_id')
            .eq('id', user_id)
            .single();

        if (userError || !userData) throw new Error('Data pengguna tidak ditemukan.');

        const toko_id = userData.perusahaan_id;

        // 2. Ambil data pengiriman khusus milik toko ini, urutkan dari yang terbaru
        // Kita juga menggunakan 'join' untuk mengambil nama vendor jika sudah ada
        const { data, error } = await supabase
            .from('pengiriman')
            .select(`
                *,
                vendor:vendor_id (nama_perusahaan)
            `)
            .eq('toko_id', toko_id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return h.response({
            status: 'success',
            data: data
        }).code(200);

    } catch (error) {
        console.error('Error ambil riwayat:', error);
        return h.response({
            status: 'error',
            message: error.message || 'Gagal mengambil data riwayat pengiriman.'
        }).code(500);
    }
};


module.exports = { buatPermintaan, getRiwayatPengiriman };