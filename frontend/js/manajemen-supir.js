document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('krl_token');
    const tbody = document.querySelector('.data-table tbody');
    const formTambah = document.getElementById('addDriverForm'); 
    const btnSubmit = document.querySelector('button[form="addDriverForm"]');
    const modalTambah = document.getElementById('addDriverModal');

    // 1. FUNGSI RENDER TABEL SUPIR
    const loadSupir = async () => {
        try {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Memuat data armada...</td></tr>';
            
            const response = await fetch('http://localhost:5000/api/vendor/supir', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            
            if (result.status === 'success') {
                tbody.innerHTML = '';
                
                if (result.data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: var(--text-secondary);">Belum ada supir yang didaftarkan.</td></tr>';
                    return;
                }
                
                result.data.forEach(supir => {
                    // Penyesuaian warna badge berdasarkan status
                    let statusStyle = '';
                    if (supir.status_supir === 'Siap Bertugas') {
                        statusStyle = 'background: rgba(34, 197, 94, 0.15); color: #22c55e;';
                    } else if (supir.status_supir === 'Sedang Mengirim') {
                        statusStyle = 'background: rgba(59, 130, 246, 0.15); color: #3b82f6;';
                    } else {
                        statusStyle = 'background: rgba(239, 68, 68, 0.15); color: #ef4444;'; // Nonaktif
                    }

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${supir.nama_lengkap}</td>
                        <td>${supir.no_hp || '-'}</td>
                        <td>${supir.kendaraan || '-'}</td>
                        <td>${supir.plat_nomor || '-'}</td>
                        <td><span class="badge" style="${statusStyle}">${supir.status_supir}</span></td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        } catch(error) {
            console.error(error);
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#ef4444;">Gagal memuat data.</td></tr>';
        }
    };

    // 2. FUNGSI TAMBAH SUPIR BARU
    if (formTambah) {
        formTambah.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Tangkap data dari input HTML Anda (sesuaikan ID-nya dengan form HTML Anda)
            const nama = document.getElementById('namaSupir').value.trim();
            const email = document.getElementById('emailSupir').value.trim();
            const password = document.getElementById('passSupir').value;
            const no_hp = document.getElementById('noHpSupir').value.trim();
            const kendaraan = document.getElementById('kendaraanSupir').value.trim();
            const plat_nomor = document.getElementById('platSupir').value.trim();

            btnSubmit.innerText = "Menyimpan...";
            btnSubmit.disabled = true;

            try {
                const response = await fetch('http://localhost:5000/api/vendor/supir', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({ nama, email, password, no_hp, kendaraan, plat_nomor })
                });

                const result = await response.json();

                if (result.status === 'success') {
                    window.showToast(result.message);
                    formTambah.reset();
                    modalTambah.classList.remove('active'); // Tutup Modal
                    loadSupir(); // Render ulang tabel
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                window.showToast(error.message);
            } finally {
                btnSubmit.innerText = "Simpan Data";
                btnSubmit.disabled = false;
            }
        });
    }

    // Panggil saat halaman pertama dibuka
    loadSupir();
});