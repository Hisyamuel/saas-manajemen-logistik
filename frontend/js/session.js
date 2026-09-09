document.addEventListener('DOMContentLoaded', () => {
    // Ambil data user yang sedang login dari memori
    const activeUserJSON = localStorage.getItem('krl_active_user');
    
    if (activeUserJSON) {
        const activeUser = JSON.parse(activeUserJSON);
        
        // Cari elemen HTML yang menyimpan nama & email
        const roleSpans = document.querySelectorAll('.user-role, .driver-name');
        const headerStrong = document.querySelector('.dropdown-header strong');
        const headerSpan = document.querySelector('.dropdown-header span');
        const profileNameInput = document.getElementById('namaUser');
        const profileInitial = document.querySelector('.avatar, .avatar-large');

        // Timpa teks template HTML dengan data asli
        if (roleSpans.length > 0) roleSpans.forEach(span => span.innerText = activeUser.name);
        if (headerStrong) headerStrong.innerText = activeUser.name;
        if (headerSpan) headerSpan.innerText = activeUser.email;
        if (profileNameInput) profileNameInput.value = activeUser.name;
        
        // Buat inisial untuk Avatar (Misal: "Toko Makmur" -> "T")
        if (profileInitial && activeUser.name) {
            const initial = activeUser.name.charAt(0).toUpperCase();
            document.querySelectorAll('.avatar, .avatar-large').forEach(av => av.innerText = initial);
        }
    }
});