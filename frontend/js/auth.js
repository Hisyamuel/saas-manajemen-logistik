document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // URL API Backend (Sesuaikan dengan port server Hapi.js)
    const API_URL = 'http://localhost:5000/api/auth';

    // Fungsi Toast Global
    const showToast = (message) => {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerText = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10); // Animasi masuk
        setTimeout(() => {
            toast.classList.remove('show'); // Animasi keluar
            setTimeout(() => toast.remove(), 400); // Hapus dari DOM
        }, 3000);
    };

// PENGGUNAAN: Ganti semua alert("...") di auth.js dengan showToast("...")

    // --- FUNGSI KEAMANAN & VALIDASI ---
    const sanitizeInput = (str) => {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag])
        );
    };

    const isPasswordStrong = (password) => {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
        return strongRegex.test(password);
    };

    const showError = (inputElement, message) => {
        const oldError = inputElement.parentElement.querySelector('.error-text');
        if (oldError) oldError.remove();

        inputElement.style.borderColor = '#ff7b7b';
        const errorText = document.createElement('span');
        errorText.className = 'error-text';
        errorText.style.color = '#ff7b7b';
        errorText.style.fontSize = '0.75rem';
        errorText.style.marginTop = '0.4rem';
        errorText.style.display = 'block';
        errorText.innerText = message;
        
        inputElement.parentElement.appendChild(errorText);
    };

    const clearErrors = (form) => {
        form.querySelectorAll('.error-text').forEach(err => err.remove());
        form.querySelectorAll('input').forEach(input => input.style.borderColor = 'rgba(255,255,255,0.1)');
    };

    // --- HANDLER REGISTER ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors(registerForm);

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const roleInput = document.getElementById('role');

            const name = sanitizeInput(nameInput.value.trim());
            const email = sanitizeInput(emailInput.value.trim());
            const password = passwordInput.value; 
            const role = roleInput.value;

            if (!isPasswordStrong(password)) {
                showError(passwordInput, "Wajib minimal 8 karakter, 1 huruf besar, 1 angka, dan 1 simbol (!@#$).");
                return;
            }

            try {
                const btn = registerForm.querySelector('button');
                btn.innerText = "Memproses...";
                btn.disabled = true;

                // Mengirim Request POST ke API Register Backend
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, role })
                });

                const result = await response.json();

                if (!response.ok) {
                    showError(emailInput, result.message || "Gagal mendaftar, silakan periksa kembali data Anda.");
                    return;
                }

                showToast("Registrasi berhasil! Silakan masuk menggunakan akun baru Anda.");
                window.location.href = "login.html";

            } catch (error) {
                console.error("Fetch error:", error);
                showToast("Terjadi kesalahan koneksi ke server. Pastikan server backend menyala.");
            } finally {
                const btn = registerForm.querySelector('button');
                btn.innerText = "Daftar";
                btn.disabled = false;
            }
        });
    }

    // --- HANDLER LOGIN ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors(loginForm);

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const roleInput = document.getElementById('role');

            const email = sanitizeInput(emailInput.value.trim());
            const password = passwordInput.value;
            const role = roleInput.value;

            try {
                const btn = loginForm.querySelector('button');
                btn.innerText = "Memverifikasi...";
                btn.disabled = true;

                // Mengirim Request POST ke API Login Backend
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, role })
                });

                const result = await response.json();

                if (!response.ok) {
                    showError(emailInput, result.message || "Kredensial tidak valid.");
                    return;
                }

                // Jika sukses, simpan JWT Token dan data User ke localStorage
                localStorage.setItem('krl_token', result.token);
                localStorage.setItem('krl_active_user', JSON.stringify(result.user));

                // Routing Dinamis
                if (role === 'toko') window.location.href = "toko.html";
                else if (role === 'vendor') window.location.href = "vendor.html";
                else if (role === 'supir') window.location.href = "driver.html";

            } catch (error) {
                console.error("Fetch error:", error);
                showToast("Terjadi kesalahan koneksi ke server.");
            } finally {
                const btn = loginForm.querySelector('button');
                btn.innerText = "Masuk";
                btn.disabled = false;
            }
        });
    }
});