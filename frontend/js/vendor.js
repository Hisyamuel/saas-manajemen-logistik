document.addEventListener('DOMContentLoaded', async () => {
    const jobGrid = document.querySelector('.job-grid');
    const assignModal = document.getElementById('assignJobModal');
    const confirmBtn = assignModal.querySelector('button[type="submit"]');
    const supirSelect = document.getElementById('pilihSupir');
    
    let activeJobId = null;
    const token = localStorage.getItem('krl_token');

    // 1. FUNGSI RENDER BURSA PEKERJAAN
    const loadJobs = async () => {
        try {
            jobGrid.innerHTML = '<p style="color:var(--text-secondary); text-align:center; grid-column: 1/-1;">Memuat pesanan tersedia...</p>';
            
            const response = await fetch('http://localhost:5000/api/vendor/jobs', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();

            jobGrid.innerHTML = ''; // Kosongkan grid

            if (result.data.length === 0) {
                jobGrid.innerHTML = '<p style="color:var(--text-secondary); text-align:center; grid-column: 1/-1;">Belum ada pesanan baru saat ini.</p>';
                return;
            }

            result.data.forEach(job => {
                const tokoName = job.toko ? job.toko.nama_perusahaan : 'Toko Tidak Diketahui';
                
                // Kalkulasi waktu sederhana (Hari Ini/Kemarin/Tgl)
                const dateObj = new Date(job.created_at);
                const isToday = new Date().toDateString() === dateObj.toDateString();
                const dateText = isToday ? 'Hari Ini' : dateObj.toLocaleDateString('id-ID', {day: '2-digit', month: 'short'});

                // Asumsi kasar jarak untuk UI (dalam aplikasi nyata, gunakan Google Maps API)
                const mockDistance = Math.floor(Math.random() * 50) + 10; 

                const card = document.createElement('div');
                card.className = 'job-card';
                card.innerHTML = `
                    <div class="job-header">
                        <span class="shipper-name">${tokoName}</span>
                        <span class="job-date">${dateText}</span>
                    </div>
                    <div class="job-body">
                        <h3 class="item-name">${job.nama_barang}</h3>
                        <div class="route-info">
                            <div class="route-point">
                                <span class="dot origin"></span>
                                <p><strong>Tujuan:</strong> ${job.alamat_tujuan}</p>
                            </div>
                        </div>
                        <div class="job-meta">
                            <span class="weight-badge">Berat: ${job.berat_kg} Kg</span>
                            <span class="distance-badge">Est. Jarak: ~${mockDistance} Km</span>
                        </div>
                    </div>
                    <div class="job-footer">
                        <button class="btn-primary full-width btn-ambil" data-id="${job.id}">Ambil Order</button>
                    </div>
                `;
                jobGrid.appendChild(card);
            });
        } catch (error) {
            console.error("Gagal memuat job:", error);
            window.showToast("Gagal terhubung ke bursa pengiriman.");
        }
    };

    // 2. FUNGSI RENDER DROPDOWN SUPIR
    const loadDrivers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/vendor/drivers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();

            supirSelect.innerHTML = '<option value="" disabled selected>-- Pilih Supir --</option>';
            
            if(result.data.length === 0){
                supirSelect.innerHTML += '<option value="" disabled>Anda belum memiliki armada supir terdaftar.</option>';
            } else {
                result.data.forEach(driver => {
                    supirSelect.innerHTML += `<option value="${driver.id}">${driver.nama_lengkap}</option>`;
                });
            }
        } catch (error) {
            console.error("Gagal memuat supir:", error);
        }
    };

    // 3. EVENT LISTENER: BUKA MODAL SAAT KLIK "AMBIL ORDER"
    jobGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-ambil')) {
            activeJobId = e.target.getAttribute('data-id');
            assignModal.classList.add('active');
        }
    });

    // 4. PROSES PENUGASAN SUPIR
    document.getElementById('assignJobForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const supirId = supirSelect.value;
        if (!supirId || !activeJobId) {
            window.showToast("Pilih supir terlebih dahulu!");
            return;
        }

        confirmBtn.innerText = "Memproses...";
        confirmBtn.disabled = true;

        try {
            const response = await fetch('http://localhost:5000/api/vendor/assign', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    pengiriman_id: activeJobId,
                    supir_id: supirId
                })
            });

            const result = await response.json();
            
            if(result.status === 'success'){
                assignModal.classList.remove('active');
                window.showToast(result.message);
                
                // Hilangkan pesanan yang sudah diambil dari grid
                loadJobs(); 
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            window.showToast(error.message);
        } finally {
            confirmBtn.innerText = "Konfirmasi Tugas";
            confirmBtn.disabled = false;
        }
    });

    // Jalankan saat pertama kali halaman dibuka
    loadJobs();
    loadDrivers();
});