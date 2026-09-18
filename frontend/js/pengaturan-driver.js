document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('krl_token');
    const btnSimpan = document.querySelector('.action-btn.btn-ambil');
    
    // 1. Tarik Data Profil Saat Ini
    try {
        const response = await fetch('http://localhost:5000/api/driver/profil', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        
        if (result.status === 'success') {
            const data = result.data;
            document.getElementById('settingNamaSupir').value = data.nama_lengkap || '';
            document.getElementById('settingHpSupir').value = data.no_hp || '';
            document.getElementById('settingPlatSupir').value = data.plat_nomor || '';
            if (data.kendaraan) document.getElementById('settingKendaraanSupir').value = data.kendaraan;
        }
    } catch (error) {
        console.error("Gagal memuat profil awal.");
    }

    // 2. Simpan Perubahan Profil
    if (btnSimpan) {
        btnSimpan.addEventListener('click', async () => {
            const nama = document.getElementById('settingNamaSupir').value.trim();
            const no_hp = document.getElementById('settingHpSupir').value.trim();
            const kendaraan = document.getElementById('settingKendaraanSupir').value;
            const plat_nomor = document.getElementById('settingPlatSupir').value.trim();
            const password = document.getElementById('newPassword').value;

            btnSimpan.innerText = "Menyimpan...";
            try {
                const response = await fetch('http://localhost:5000/api/driver/profil', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ nama, no_hp, kendaraan, plat_nomor, password })
                });

                const result = await response.json();
                if (result.status === 'success') {
                    window.showToast("Profil berhasil diperbarui!");
                    
                    // Perbarui header nama secara real-time
                    document.querySelector('.driver-name').innerText = `Halo, ${nama}`;
                    
                    // Update cache user
                    let activeUser = JSON.parse(localStorage.getItem('krl_active_user'));
                    activeUser.name = nama;
                    localStorage.setItem('krl_active_user', JSON.stringify(activeUser));
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                window.showToast(error.message);
            } finally {
                btnSimpan.innerText = "Simpan Perubahan";
                document.getElementById('newPassword').value = '';
                document.getElementById('oldPassword').value = '';
            }
        });
    }
});