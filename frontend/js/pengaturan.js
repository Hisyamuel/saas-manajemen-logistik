document.addEventListener('DOMContentLoaded', () => {
    const btnSimpan = document.querySelector('.settings-form .btn-primary');
    
    if (btnSimpan) {
        btnSimpan.addEventListener('click', async () => {
            const nama = document.getElementById('settingPerusahaan').value.trim();
            const email = document.getElementById('settingEmail').value.trim();
            const password = document.getElementById('newPassword').value;
            const token = localStorage.getItem('krl_token');

            btnSimpan.innerText = "Menyimpan...";

            try {
                const response = await fetch('http://localhost:5000/api/auth/profil', {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ nama, email, password })
                });

                const result = await response.json();

                if (result.status === 'success') {
                    // Timpa sesi lama dengan data baru agar UI seketika berubah!
                    localStorage.setItem('krl_active_user', JSON.stringify(result.user));
                    
                    window.showToast("Profil berhasil diperbarui!");
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                window.showToast(error.message);
                btnSimpan.innerText = "Simpan Pengaturan";
            }
        });
    }
});