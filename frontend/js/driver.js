document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const driverNav = document.getElementById('driverNav');
    const taskContainer = document.querySelector('main.task-container');
    const token = localStorage.getItem('krl_token');

    // Toggle Menu Mobile
    if (menuBtn && driverNav) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            driverNav.classList.toggle('active');
        });
    }

    // Fungsi Mengambil Tugas
    const loadTasks = async () => {
        // Hanya eksekusi jika berada di halaman Tugas Hari Ini (driver.html)
        if (!document.querySelector('.section-title h2') || document.querySelector('.section-title h2').innerText !== 'Tugas Hari Ini') return;

        try {
            // 1. Update teks jumlah tugas secara langsung tanpa merusak HTML
            const taskCountEl = document.querySelector('.section-title p');
            if (taskCountEl) taskCountEl.innerText = "Memuat tugas...";

            // 2. Bersihkan HANYA kartu-kartu tugas yang lama (bukan section title-nya)
            document.querySelectorAll('.task-card').forEach(card => card.remove());
            
            // Hapus juga pesan kosong jika sebelumnya ada
            const emptyMsg = document.querySelector('.empty-task-msg');
            if (emptyMsg) emptyMsg.remove();

            const response = await fetch('http://localhost:5000/api/driver/tugas', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();

            if (result.status === 'success') {
                const tasks = result.data;
                if (taskCountEl) taskCountEl.innerText = `${tasks.length} Pengiriman tertunda`;

                if (tasks.length === 0) {
                    // Buat elemen baru dengan class khusus agar mudah dihapus nanti
                    const emptyP = document.createElement('p');
                    emptyP.className = 'empty-task-msg';
                    emptyP.style.cssText = 'text-align:center; color:var(--text-secondary); margin-top:2rem; padding: 0 1.5rem;';
                    emptyP.innerText = 'Hore! Anda tidak memiliki tugas aktif saat ini.';
                    taskContainer.appendChild(emptyP);
                    return;
                }

                tasks.forEach(task => {
                    const idResi = `#KRL-${task.id.substring(0, 4).toUpperCase()}`;
                    const tokoName = task.toko ? task.toko.nama_perusahaan : 'Toko';

                    const card = document.createElement('div');
                    card.className = 'task-card';
                    card.innerHTML = `
                        <div class="task-header">
                            <span class="badge jalan">Dalam Perjalanan</span>
                            <span class="resi">${idResi}</span>
                        </div>
                        <h3 class="item-name">${task.nama_barang} (${task.berat_kg} Kg)</h3>
                        <div class="route-info">
                            <div class="route-point">
                                <span class="dot origin"></span>
                                <p><strong>JEMPUT DI:</strong><br>${tokoName}</p>
                            </div>
                            <div class="route-line"></div>
                            <div class="route-point">
                                <span class="dot dest"></span>
                                <p><strong>ANTAR KE:</strong><br>${task.alamat_tujuan}</p>
                            </div>
                        </div>
                        <button class="action-btn btn-sampai" data-id="${task.id}">
                            Barang Sampai
                        </button>
                    `;
                    taskContainer.appendChild(card);
                });
            }
        } catch (error) {
            console.error("Gagal memuat tugas:", error);
            window.showToast("Gagal terhubung ke server.");
        }
    };

    // Event Listener untuk Tombol Selesai
    if (taskContainer) {
        taskContainer.addEventListener('click', async (e) => {
            if (e.target.classList.contains('btn-sampai')) {
                const taskId = e.target.getAttribute('data-id');
                const btn = e.target;
                
                if (confirm("Konfirmasi bahwa barang telah sampai di tujuan?")) {
                    btn.innerText = "Memproses...";
                    btn.disabled = true;

                    try {
                        const response = await fetch('http://localhost:5000/api/driver/tugas', {
                            method: 'PUT',
                            headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}` 
                            },
                            body: JSON.stringify({ pengiriman_id: taskId })
                        });

                        const result = await response.json();
                        if (result.status === 'success') {
                            window.showToast(result.message);
                            btn.className = "action-btn btn-selesai";
                            btn.innerText = "Tugas Selesai";
                            
                            // Hapus kartu setelah 2 detik
                            setTimeout(() => loadTasks(), 2000);
                        } else {
                            throw new Error(result.message);
                        }
                    } catch (error) {
                        window.showToast(error.message);
                        btn.innerText = "Barang Sampai";
                        btn.disabled = false;
                    }
                }
            }
        });
    }

    loadTasks();
});