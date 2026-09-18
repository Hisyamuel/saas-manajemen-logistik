const supabase = require('../../../database/index');

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

module.exports = { getTugasAktif, selesaikanTugas };