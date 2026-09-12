document.addEventListener('DOMContentLoaded', () => {
    const activeUserJSON = localStorage.getItem('krl_active_user');
    
    if (activeUserJSON) {
        const activeUser = JSON.parse(activeUserJSON);
        
        // Cari elemen Text biasa
        const roleSpans = document.querySelectorAll('.user-role, .driver-name');
        const headerStrong = document.querySelector('.dropdown-header strong');
        const headerSpan = document.querySelector('.dropdown-header span');
        
        // Cari elemen Form Modal (Shipper & Vendor)
        const profileNameInput = document.getElementById('namaUser');
        
        // Cari elemen Form Pengaturan
        const settingPerusahaan = document.getElementById('settingPerusahaan');
        const settingEmail = document.getElementById('settingEmail');
        const settingNamaSupir = document.getElementById('settingNamaSupir'); 

        // Timpa teks template HTML dengan data asli
        if (roleSpans.length > 0) {
            roleSpans.forEach(span => {
                // Khusus driver, kita beri format "Halo, [Nama]"
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
        
        // Update Form Pengaturan 
        if (settingPerusahaan) settingPerusahaan.value = activeUser.name;
        if (settingEmail) settingEmail.value = activeUser.email;
        if (settingNamaSupir) settingNamaSupir.value = activeUser.name; 
        
        // Buat inisial untuk Avatar
        if (activeUser.name) {
            const initial = activeUser.name.charAt(0).toUpperCase();
            document.querySelectorAll('.avatar, .avatar-large').forEach(av => av.innerText = initial);
        }
    }
});