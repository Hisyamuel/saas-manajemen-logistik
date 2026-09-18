document.addEventListener('DOMContentLoaded', async () => {
    const taskContainer = document.querySelector('main.task-container');
    const token = localStorage.getItem('krl_token');

    try {
        const response = await fetch('http://localhost:5000/api/driver/riwayat', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();

        if (result.status === 'success') {
            // Hapus kartu dummy HTML
            document.querySelectorAll('.task-card').forEach(card => card.remove());
            const tasks = result.data;

            if (tasks.length === 0) {
                taskContainer.innerHTML += `<p style="text-align:center; color:var(--text-secondary); margin-top:2rem;">Belum ada riwayat pengiriman yang diselesaikan.</p>`;
                return;
            }

            tasks.forEach(task => {
                const idResi = `#KRL-${task.id.substring(0, 4).toUpperCase()}`;
                const tokoName = task.toko ? task.toko.nama_perusahaan : 'Toko';
                const dateStr = new Date(task.updated_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

                const card = document.createElement('div');
                card.className = 'task-card';
                card.style.opacity = '0.8';
                card.innerHTML = `
                    <div class="task-header">
                        <span class="badge selesai">Selesai</span>
                        <span class="resi">${idResi}</span>
                    </div>
                    <h3 class="item-name" style="margin-bottom: 0.5rem;">${task.nama_barang}</h3>
                    <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0; margin-bottom: 1.5rem;">Diantar: ${dateStr}</p>
                    <div class="route-info" style="margin-bottom: 0;">
                        <div class="route-point">
                            <span class="dot origin" style="background-color: var(--status-selesai); box-shadow: none;"></span>
                            <p><strong>DARI:</strong><br>${tokoName}</p>
                        </div>
                        <div class="route-line" style="bottom: 20px;"></div>
                        <div class="route-point">
                            <span class="dot dest"></span>
                            <p><strong>KE:</strong><br>${task.alamat_tujuan}</p>
                        </div>
                    </div>
                `;
                taskContainer.appendChild(card);
            });
        }
    } catch (error) {
        window.showToast("Gagal memuat riwayat.");
    }
});