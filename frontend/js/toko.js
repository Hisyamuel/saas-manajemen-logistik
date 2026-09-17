document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. FUNGSI LOAD DATA DASHBOARD DINAMIS
    // ==========================================
    const loadDashboardData = async () => {
        const token = localStorage.getItem('krl_token');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:5000/api/pengiriman', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            
            if (result.status === 'success') {
                const allData = result.data;
                
                // A. Hitung Metrik
                const countPending = allData.filter(d => d.status_kirim === 'Mencari Vendor').length;
                const countProses = allData.filter(d => d.status_kirim === 'Dalam Perjalanan').length;
                
                // Hitung "Selesai Bulan Ini"
                const currentMonth = new Date().getMonth();
                const countSelesai = allData.filter(d => {
                    if (d.status_kirim !== 'Selesai') return false;
                    const dateObj = new Date(d.created_at);
                    return dateObj.getMonth() === currentMonth;
                }).length;

                // Suntikkan angka ke Kartu Metrik HTML
                document.querySelector('.metric-value.pending').innerText = countPending;
                document.querySelector('.metric-value.proses').innerText = countProses;
                document.querySelector('.metric-value.selesai').innerText = countSelesai;

                // B. Render Tabel "Pengiriman Aktif" (Maksimal 5 data terbaru yang BUKAN 'Selesai')
                const activeData = allData.filter(d => d.status_kirim !== 'Selesai').slice(0, 5);
                const tbody = document.querySelector('.data-table tbody');
                tbody.innerHTML = ''; // Kosongkan tabel bawaan HTML

                if (activeData.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Tidak ada pengiriman aktif saat ini.</td></tr>';
                } else {
                    activeData.forEach(item => {
                        const idResi = `#KRL-${item.id.substring(0, 4).toUpperCase()}`;
                        let badgeClass = item.status_kirim === 'Dalam Perjalanan' ? 'jalan' : 'pending';
                        const namaVendor = item.vendor ? item.vendor.nama_perusahaan : '-';
                        
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${idResi}</td>
                            <td>${item.nama_barang}</td>
                            <td>${item.alamat_tujuan}</td>
                            <td><span class="badge ${badgeClass}">${item.status_kirim}</span></td>
                            <td>${namaVendor}</td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            }
        } catch (error) {
            console.error("Gagal memuat data dashboard:", error);
        }
    };

    // Jalankan fungsi saat halaman dimuat
    loadDashboardData();

    // ==========================================
    // 2. FUNGSI BUAT PERMINTAAN 
    // ==========================================
    const createRequestForm = document.getElementById('createRequestForm');

    if (createRequestForm) {
        createRequestForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Mencegah halaman me-refresh secara default
            
            // 1. Ambil nilai dari input form
            const namaBarang = document.getElementById('namaBarang').value.trim();
            const beratBarang = document.getElementById('beratBarang').value;
            const alamatTujuan = document.getElementById('alamatTujuan').value.trim();
            const submitBtn = document.querySelector('button[form="createRequestForm"]');
            
            // 2. Ambil token dari localStorage
            const token = localStorage.getItem('krl_token');
            if (!token) {
                window.showToast('Sesi Anda tidak valid. Silakan masuk kembali.');
                window.location.replace('index.html');
                return;
            }

            try {
                // Ubah status tombol agar user tahu sistem sedang bekerja
                submitBtn.innerText = "Memproses...";
                submitBtn.disabled = true;

                // 3. Tembakkan request POST ke API Pengiriman
                const response = await fetch('http://localhost:5000/api/pengiriman', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Menyelipkan token untuk satpam backend
                    },
                    body: JSON.stringify({
                        nama_barang: namaBarang,
                        berat: beratBarang,
                        alamat_tujuan: alamatTujuan
                    })
                });

                const result = await response.json();

                // Jika ditolak oleh backend (misal: token salah/kadaluarsa)
                if (!response.ok) {
                    throw new Error(result.message || 'Gagal membuat permintaan.');
                }

                // 4. Jika sukses, berikan feedback ke user
                window.showToast("Berhasil! Permintaan pengiriman Anda telah diteruskan ke bursa vendor.");
                
                // Tutup modal dan bersihkan form
                document.getElementById('createRequestModal').classList.remove('active');
                createRequestForm.reset();

                // Tunda refresh halaman selama 2 detik agar toast sempat terbaca
                setTimeout(() => {
                    window.location.reload();
                }, 3000);

            } catch (error) {
                console.error("Fetch error:", error);
                window.showToast(`Terjadi kesalahan: ${error.message}`);
            } finally {
                // Kembalikan status tombol
                submitBtn.innerText = "Simpan & Cari Vendor";
                submitBtn.disabled = false;
            }
        });
    }
});