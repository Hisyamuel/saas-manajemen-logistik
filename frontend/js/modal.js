document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Modal Buat Permintaan (Halaman Toko) ---
    const reqModal = document.getElementById('createRequestModal');
    const btnOpenReq = document.getElementById('btnBuatPermintaan');
    const btnsCloseReq = document.querySelectorAll('.close-modal-btn');

    if (btnOpenReq && reqModal) {
        btnOpenReq.addEventListener('click', () => reqModal.classList.add('active'));
    }
    if (btnsCloseReq.length > 0 && reqModal) {
        btnsCloseReq.forEach(btn => btn.addEventListener('click', () => reqModal.classList.remove('active')));
    }
    if (reqModal) {
        reqModal.addEventListener('click', (e) => {
            if (e.target === reqModal) reqModal.classList.remove('active');
        });
    }

    // --- 2. Modal Profil Saya (Semua Halaman Dashboard) ---
    const profModal = document.getElementById('profileModal');
    // Mencari tombol "Profil Saya" dari dalam dropdown dengan lebih aman berdasarkan teksnya
    const btnsOpenProf = Array.from(document.querySelectorAll('.dropdown-item'))
                              .filter(el => el.textContent.trim() === 'Profil Saya');
    const btnsCloseProf = document.querySelectorAll('.close-profile-btn');

    if (btnsOpenProf.length > 0 && profModal) {
        btnsOpenProf.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Mencegah reload halaman
                profModal.classList.add('active');
            });
        });
    }
    if (btnsCloseProf.length > 0 && profModal) {
        btnsCloseProf.forEach(btn => btn.addEventListener('click', () => profModal.classList.remove('active')));
    }
    if (profModal) {
        profModal.addEventListener('click', (e) => {
            if (e.target === profModal) profModal.classList.remove('active');
        });
    }

    // --- 3. Modal Ambil Order / Tugaskan Supir (Halaman Vendor) ---
    const assignModal = document.getElementById('assignJobModal');
    const btnOpenAssign = document.querySelectorAll('.job-footer .btn-primary'); 
    const btnsCloseAssign = document.querySelectorAll('.close-assign-btn');

    if (btnOpenAssign.length > 0 && assignModal) {
        btnOpenAssign.forEach(btn => {
            btn.addEventListener('click', () => {
                assignModal.classList.add('active');
            });
        });
    }
    if (btnsCloseAssign.length > 0 && assignModal) {
        btnsCloseAssign.forEach(btn => btn.addEventListener('click', () => assignModal.classList.remove('active')));
    }
    if (assignModal) {
        assignModal.addEventListener('click', (e) => {
            if (e.target === assignModal) assignModal.classList.remove('active');
        });
    }

    // --- 4. Modal Tambah Supir (Halaman Manajemen Supir) ---
    const driverModal = document.getElementById('addDriverModal');
    const btnOpenDriver = document.getElementById('btnTambahSupir');
    const btnsCloseDriver = document.querySelectorAll('.close-driver-btn');

    if (btnOpenDriver && driverModal) {
        btnOpenDriver.addEventListener('click', () => {
            driverModal.classList.add('active');
        });
    }
    if (btnsCloseDriver.length > 0 && driverModal) {
        btnsCloseDriver.forEach(btn => btn.addEventListener('click', () => driverModal.classList.remove('active')));
    }
    if (driverModal) {
        driverModal.addEventListener('click', (e) => {
            if (e.target === driverModal) driverModal.classList.remove('active');
        });
    }

});