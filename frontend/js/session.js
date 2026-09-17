document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // FUNGSI GLOBAL: TOAST NOTIFICATION
    // ==========================================
    window.showToast = (message) => {
        // Hapus toast lama jika masih ada yang tampil (mencegah penumpukan)
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerText = message;
        document.body.appendChild(toast);

        // Animasi masuk
        setTimeout(() => toast.classList.add('show'), 10); 
    
        // Animasi keluar
        setTimeout(() => {
            toast.classList.remove('show'); 
            setTimeout(() => toast.remove(), 400); 
        }, 3000);
    };
    
    // 1. SESSION GUARD (Keamanan Lapis Kedua)
    const token = localStorage.getItem('krl_token');
    const activeUserJSON = localStorage.getItem('krl_active_user');
    const isProtectedPage = document.querySelector('.dashboard-body') || document.querySelector('.driver-body');

    // Jika ini halaman dashboard/driver TAPI tidak ada token atau data user aktif, redirect ke index.html
    if (isProtectedPage && (!token || !activeUserJSON)) {
        window.location.replace('index.html');
        return; // Hentikan eksekusi script di bawahnya
    }

    // 2. LOGIKA INTERCEPT: KELUAR & GANTI AKUN
    const logoutModal = document.getElementById('logoutModal');
    const switchAccountModal = document.getElementById('switchAccountModal');

    // Fungsi tutup modal
    const closeModals = () => {
        if (logoutModal) logoutModal.classList.remove('active');
        if (switchAccountModal) switchAccountModal.classList.remove('active');
    };

    document.querySelectorAll('.close-logout-btn, .close-switch-btn').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    // Mencegat semua klik pada elemen tautan <a>
    document.querySelectorAll('a').forEach(link => {
        const linkText = link.textContent.trim().toLowerCase();
        
        // Mencegat "Keluar" (Baik di Sidebar maupun Dropdown)
        if (linkText === 'keluar' || link.classList.contains('text-danger')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (logoutModal) logoutModal.classList.add('active');
            });
        }
        
        // Mencegat "Ganti Akun"
        if (linkText === 'ganti akun') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (switchAccountModal) switchAccountModal.classList.add('active');
            });
        }
    });

    // 3. LOGIKA EKSEKUSI PEMUTUSAN SESI
    const executeEndSession = (targetUrl) => { 
        window.showToast("Anda telah logout");
        localStorage.removeItem('krl_token');
        localStorage.removeItem('krl_active_user');
        
        // Berikan jeda 0.8 detik agar animasi toast sempat selesai sebelum pindah
        setTimeout(() => {
            window.location.replace(targetUrl); 
        }, 800);
    };

    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
    const confirmSwitchBtn = document.getElementById('confirmSwitchBtn');

    // Tombol "Ya, Keluar" melempar ke Landing Page
    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', () => executeEndSession('index.html'));
    }
    
    // Tombol "Ya, Ganti" melempar ke Halaman Login
    if (confirmSwitchBtn) {
        confirmSwitchBtn.addEventListener('click', () => executeEndSession('login.html'));
    }

    // 4. LOGIKA RENDER PROFIL (Hanya dieksekusi jika user valid)
    if (activeUserJSON && isProtectedPage) {
        const activeUser = JSON.parse(activeUserJSON);
        
        const roleSpans = document.querySelectorAll('.user-role, .driver-name');
        const headerStrong = document.querySelector('.dropdown-header strong');
        const headerSpan = document.querySelector('.dropdown-header span');
        const profileNameInput = document.getElementById('namaUser');
        const settingPerusahaan = document.getElementById('settingPerusahaan');
        const settingEmail = document.getElementById('settingEmail');
        const settingNamaSupir = document.getElementById('settingNamaSupir');

        if (roleSpans.length > 0) {
            roleSpans.forEach(span => {
                if (span.classList.contains('driver-name')) {
                    span.innerText = `Halo, ${activeUser.name}`;
                } else {
                    span.innerText = activeUser.name;
                }
            });
        }
        
        if (headerStrong) headerStrong.innerText = activeUser.name;
        if (headerSpan) headerSpan.innerText = activeUser.email;
        if (profileNameInput) profileNameInput.value = activeUser.name;
        if (settingPerusahaan) settingPerusahaan.value = activeUser.name;
        if (settingEmail) settingEmail.value = activeUser.email;
        if (settingNamaSupir) settingNamaSupir.value = activeUser.name;
        
        if (activeUser.name) {
            const initial = activeUser.name.charAt(0).toUpperCase();
            document.querySelectorAll('.avatar, .avatar-large').forEach(av => av.innerText = initial);
        }
    }
});

// Mengatasi masalah "Back" button dari cache browser (bfcache)
window.addEventListener('pageshow', (event) => {
    // event.persisted akan bernilai true jika halaman dimuat dari history/cache browser
    if (event.persisted) {
        const token = localStorage.getItem('krl_token');
        const isProtectedPage = document.querySelector('.dashboard-body') || document.querySelector('.driver-body');
        
        // Tendang langsung ke index.html (Sesuai dengan perubahanmu)
        if (isProtectedPage && !token) {
            window.location.replace('index.html');
        }
    }
});