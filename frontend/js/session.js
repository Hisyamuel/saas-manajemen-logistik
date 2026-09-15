document.addEventListener('DOMContentLoaded', () => {
    // 1. SESSION GUARD (Keamanan Lapis Kedua)
    const token = localStorage.getItem('krl_token');
    const activeUserJSON = localStorage.getItem('krl_active_user');
    const isProtectedPage = document.querySelector('.dashboard-body') || document.querySelector('.driver-body');

    // Jika ini halaman dashboard/driver TAPI tidak ada token atau data user aktif, redirect ke index.html
    if (isProtectedPage && (!token || !activeUserJSON)) {
        window.location.replace('index.html');
        return; // Hentikan eksekusi script di bawahnya
    }

    // 2. LOGIKA LOGOUT AMAN
    document.querySelectorAll('a').forEach(link => {
        if (link.innerText.trim().toLowerCase() === 'keluar' || link.classList.contains('text-danger')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('krl_token');
                localStorage.removeItem('krl_active_user');
                // Replace mencegah halaman masuk ke history browser
                window.location.replace('index.html'); 
            });
        }
    });

    // 3. LOGIKA RENDER PROFIL (Hanya dieksekusi jika user valid)
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