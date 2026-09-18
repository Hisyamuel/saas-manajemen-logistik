const supabase = require('../../../database/index');
const bcrypt = require('bcrypt');

// 1. Mengambil tugas hari ini (status: Dalam Perjalanan)
const getTugasAktif = async (request, h) => {
    const supir_id = request.user.id;

    try {
        const { data, error } = await supabase
            .from('pengiriman')
            .select(`*, toko:toko_id (nama_perusahaan, alamat_lengkap)`)
            .eq('supir_id', supir_id)
            .eq('status_kirim', 'Dalam Perjalanan')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return h.response({ status: 'success', data }).code(200);
    } catch (error) {
        return h.response({ status: 'error', message: 'Gagal mengambil tugas.' }).code(500);
    }
};

// 2. Mengubah status barang menjadi 'Selesai'
const selesaikanTugas = async (request, h) => {
    const supir_id = request.user.id;
    const { pengiriman_id } = request.payload;

    try {
        const { error } = await supabase
            .from('pengiriman')
            .update({ status_kirim: 'Selesai' })
            .eq('id', pengiriman_id)
            .eq('supir_id', supir_id); // Keamanan: Pastikan ini benar tugasnya dia

        if (error) throw error;
        return h.response({ status: 'success', message: 'Pengiriman diselesaikan!' }).code(200);
    } catch (error) {
        return h.response({ status: 'error', message: 'Gagal menyelesaikan tugas.' }).code(500);
    }
};

// 3. Mengambil riwayat pengiriman yang sudah selesai
const getRiwayatTugas = async (request, h) => {
    const supir_id = request.user.id;
    try {
        const { data, error } = await supabase
            .from('pengiriman')
            .select(`*, toko:toko_id (nama_perusahaan)`)
            .eq('supir_id', supir_id)
            .eq('status_kirim', 'Selesai')
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return h.response({ status: 'success', data }).code(200);
    } catch (error) {
        return h.response({ status: 'error', message: 'Gagal mengambil riwayat.' }).code(500);
    }
};

// 4. Mengambil data profil supir saat ini
const getProfilSupir = async (request, h) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('nama_lengkap, no_hp, kendaraan, plat_nomor')
            .eq('id', request.user.id)
            .single();

        if (error) throw error;
        return h.response({ status: 'success', data }).code(200);
    } catch (error) {
        return h.response({ status: 'error', message: 'Gagal memuat profil.' }).code(500);
    }
};

// 5. Menyimpan perubahan profil supir
const updateProfilSupir = async (request, h) => {
    const { nama, no_hp, kendaraan, plat_nomor, password } = request.payload;
    try {
        let updateData = { nama_lengkap: nama, no_hp, kendaraan, plat_nomor };
        if (password) updateData.password = await bcrypt.hash(password, 10);

        const { error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', request.user.id);

        if (error) throw error;
        return h.response({ status: 'success', message: 'Profil armada berhasil diperbarui!' }).code(200);
    } catch (error) {
        return h.response({ status: 'error', message: 'Gagal memperbarui profil.' }).code(500);
    }
};

module.exports = { getTugasAktif, selesaikanTugas, getRiwayatTugas, getProfilSupir, updateProfilSupir };