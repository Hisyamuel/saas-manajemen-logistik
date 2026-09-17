document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector('.data-table tbody');
    const searchInput = document.querySelector('.search-bar input');
    const filterSelect = document.querySelector('.filter-select select');
    const filterBtn = document.querySelector('.filter-btn');
    const paginationContainer = document.querySelector('.pagination');

    let allData = []; // Menyimpan semua data dari database
    let filteredData = []; // Menyimpan data setelah di-filter
    let currentPage = 1;
    const itemsPerPage = 5; // Tampilkan 5 baris per halaman

    // 1. FUNGSI MENGAMBIL DATA DARI BACKEND
    const fetchRiwayat = async () => {
        const token = localStorage.getItem('krl_token');
        if (!token) return;

        try {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Memuat data...</td></tr>';
            
            const response = await fetch('http://localhost:5000/api/pengiriman', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await response.json();
            if (result.status === 'success') {
                allData = result.data;
                filteredData = [...allData]; // Salin data ke array filter
                renderTable();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Gagal memuat: ${error.message}</td></tr>`;
        }
    };

    // 2. FUNGSI RENDER TABEL & PAGINASI
    const renderTable = () => {
        tableBody.innerHTML = '';
        
        // Hitung total halaman
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        
        // Koreksi halaman jika di luar batas
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages;

        // Potong array data berdasarkan halaman aktif
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);

        if (pageData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Tidak ada data ditemukan.</td></tr>';
            renderPagination(0);
            return;
        }

        pageData.forEach(item => {
            // Format Tanggal
            const dateObj = new Date(item.created_at);
            const dateStr = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
            
            // Format ID (Potong sebagian UUID agar tidak terlalu panjang)
            const idResi = `#KRL-${item.id.substring(0, 4).toUpperCase()}`;
            
            // Atur Badge Status
            let badgeClass = 'pending';
            let statusText = item.status_kirim;
            let statusStyle = '';

            if (statusText === 'Dalam Perjalanan') badgeClass = 'jalan';
            if (statusText === 'Selesai') {
                badgeClass = 'selesai';
                statusStyle = 'background: rgba(34, 197, 94, 0.15); color: var(--status-selesai);';
            }

            // Atur Nama Vendor (Jika belum ada, tampilkan strip "-")
            const namaVendor = item.vendor ? item.vendor.nama_perusahaan : '-';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${dateStr}</td>
                <td>${idResi}</td>
                <td>${item.nama_barang}</td>
                <td>${item.alamat_tujuan}</td>
                <td><span class="badge ${badgeClass}" style="${statusStyle}">${statusText}</span></td>
                <td>${namaVendor}</td>
            `;
            tableBody.appendChild(tr);
        });

        renderPagination(totalPages);
    };

    const renderPagination = (totalPages) => {
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return; // Sembunyikan paginasi jika hanya 1 halaman

        // Tombol Prev
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.innerHTML = '&laquo;';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => { currentPage--; renderTable(); });
        paginationContainer.appendChild(prevBtn);

        // Angka Halaman
        for (let i = 1; i <= totalPages; i++) {
            const numBtn = document.createElement('button');
            numBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            numBtn.innerText = i;
            numBtn.addEventListener('click', () => { currentPage = i; renderTable(); });
            paginationContainer.appendChild(numBtn);
        }

        // Tombol Next
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn';
        nextBtn.innerHTML = '&raquo;';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => { currentPage++; renderTable(); });
        paginationContainer.appendChild(nextBtn);
    };

    // 3. LOGIKA PENCARIAN & FILTER
    const applyFilter = () => {
        const keyword = searchInput.value.toLowerCase();
        const statusValue = filterSelect.value;

        filteredData = allData.filter(item => {
            const idResi = item.id.toLowerCase();
            const namaBarang = item.nama_barang.toLowerCase();
            const tujuan = item.alamat_tujuan.toLowerCase();
            
            // Pencocokan keyword (cari di id, nama, atau tujuan)
            const matchKeyword = idResi.includes(keyword) || namaBarang.includes(keyword) || tujuan.includes(keyword);
            
            // Pencocokan status
            let matchStatus = true;
            if (statusValue === 'pending') matchStatus = item.status_kirim === 'Mencari Vendor';
            if (statusValue === 'jalan') matchStatus = item.status_kirim === 'Dalam Perjalanan';
            if (statusValue === 'selesai') matchStatus = item.status_kirim === 'Selesai';

            return matchKeyword && matchStatus;
        });

        currentPage = 1; // Reset ke halaman 1 setiap kali filter berubah
        renderTable();
    };

    filterBtn.addEventListener('click', applyFilter);
    searchInput.addEventListener('keyup', (e) => { if(e.key === 'Enter') applyFilter(); });

    // Mulai eksekusi
    fetchRiwayat();
});