document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // --- FUNGSI KEAMANAN & VALIDASI ---

    const sanitizeInput = (str) => {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag])
        );
    };

    // Perbaikan RegEx: Menggunakan literal form agar simbol terbaca ketat
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
                
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay

                // Simulasi Database: Cek apakah email sudah ada
                let users = JSON.parse(localStorage.getItem('krl_users')) || [];
                if (users.find(u => u.email === email)) {
                    showError(emailInput, "Email ini sudah terdaftar.");
                    return;
                }

                // Simpan ke "Database"
                users.push({ name, email, password, role });
                localStorage.setItem('krl_users', JSON.stringify(users));

                alert("Registrasi berhasil! Silakan masuk menggunakan akun baru Anda.");
                window.location.href = "login.html";

            } catch (error) {
                alert("Terjadi kesalahan sistem.");
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

                await new Promise(resolve => setTimeout(resolve, 1000));

                // Simulasi Database: Cari kecocokan kredensial
                let users = JSON.parse(localStorage.getItem('krl_users')) || [];
                const validUser = users.find(u => u.email === email && u.password === password && u.role === role);

                if (!validUser) {
                    showError(emailInput, "Kredensial salah atau peran (role) tidak sesuai.");
                    return; // Hentikan proses jika gagal
                }

                // Jika sukses, simpan sesi aktif
                localStorage.setItem('krl_active_user', JSON.stringify({ name: validUser.name, email: validUser.email, role: validUser.role }));

                // Routing Dinamis
                if (role === 'toko') window.location.href = "toko.html";
                else if (role === 'vendor') window.location.href = "vendor.html";
                else if (role === 'supir') window.location.href = "driver.html";

            } catch (error) {
                alert("Terjadi kesalahan koneksi.");
            } finally {
                const btn = loginForm.querySelector('button');
                btn.innerText = "Masuk";
                btn.disabled = false;
            }
        });
    }
});