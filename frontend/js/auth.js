document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // --- FUNGSI KEAMANAN & VALIDASI ---

    // 1. Sanitasi Input (Mencegah serangan XSS dasar)
    const sanitizeInput = (str) => {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag])
        );
    };

    // 2. Validasi Kekuatan Password (Minimal 8 karakter, 1 huruf besar, 1 angka, 1 simbol)
    const isPasswordStrong = (password) => {
        const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        return strongRegex.test(password);
    };

    // 3. Menampilkan Error UI
    const showError = (inputElement, message) => {
        // Hapus error lama jika ada
        const oldError = inputElement.parentElement.querySelector('.error-text');
        if (oldError) oldError.remove();

        inputElement.style.borderColor = '#ef4444'; // Warna merah
        const errorText = document.createElement('span');
        errorText.className = 'error-text';
        errorText.style.color = '#ef4444';
        errorText.style.fontSize = '0.75rem';
        errorText.style.marginTop = '0.4rem';
        errorText.style.display = 'block';
        errorText.innerText = message;
        
        inputElement.parentElement.appendChild(errorText);
    };

    const clearErrors = (form) => {
        const errors = form.querySelectorAll('.error-text');
        errors.forEach(err => err.remove());
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => input.style.borderColor = 'rgba(255,255,255,0.1)');
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
            const password = passwordInput.value; // Password tidak disanitasi agar simbol tetap utuh, backend yang akan hash
            const role = roleInput.value;

            // Validasi Frontend
            if (!isPasswordStrong(password)) {
                showError(passwordInput, "Sandi minimal 8 karakter, wajib ada huruf besar, angka, dan simbol.");
                return;
            }

            // TODO: Integrasi Fetch API ke Node.js Backend
            try {
                // Simulasi loading
                const btn = registerForm.querySelector('button');
                const originalText = btn.innerText;
                btn.innerText = "Memproses...";
                btn.disabled = true;

                console.log("Mengirim data registrasi aman:", { name, email, role });
                
                // Simulasi network delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                alert("Registrasi berhasil! Silakan periksa email Anda untuk verifikasi.");
                window.location.href = "login.html";

            } catch (error) {
                alert("Terjadi kesalahan sistem. Silakan coba lagi nanti.");
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

                // TODO: Fetch API ke endpoint Login Backend
                // await fetch('/api/auth/login', { ... })
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Simulasi respon sukses dan penyimpanan sesi lokal
                localStorage.setItem('krl_session_token', 'simulated_jwt_token_123abc');
                localStorage.setItem('krl_user_role', role);

                // Routing Dinamis Berdasarkan Role
                if (role === 'toko') {
                    window.location.href = "toko.html";
                } else if (role === 'vendor') {
                    window.location.href = "vendor.html";
                } else if (role === 'supir') {
                    window.location.href = "supir.html";
                }

            } catch (error) {
                showError(emailInput, "Kredensial tidak valid atau akun tidak ditemukan.");
            } finally {
                const btn = loginForm.querySelector('button');
                btn.innerText = "Masuk";
                btn.disabled = false;
            }
        });
    }
});