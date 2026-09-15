/*
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 }); // Muncul saat 10% elemen terlihat

    // Terapkan ke semua elemen yang ingin dianimasikan
    document.querySelectorAll('.hero-title, .hero-subtitle, .btn-primary, .image-placeholder, .feature-card, .image-placeholder, .section-title, .section-subtitle, .cta-content').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
});
*/

document.addEventListener('DOMContentLoaded', () => {
    // Pengaturan Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Elemen harus masuk 50px ke dalam layar baru terpicu
    };

    const observer = new IntersectionObserver((entries, observer) => {
        let delay = 0; // Inisialisasi waktu jeda
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Berikan jeda berurutan untuk elemen yang terdeteksi bersamaan
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
                
                delay += 400; // Elemen berikutnya akan delay +400ms
                observer.unobserve(entry.target); // Hentikan pantauan agar animasi hanya 1x jalan
            }
        });
    }, observerOptions);

    // Membidik elemen-elemen spesifik dari index.html untuk dianimasikan
    const elementsToReveal = document.querySelectorAll(`
        .hero-title,
        .hero-subtitle,
        .btn-primary,
        .image-placeholder,
        .section-title,
        .section-subtitle,
        .feature-card,
        .cap-header,
        .cta-content
    `);
    
    elementsToReveal.forEach(el => {
        el.classList.add('reveal'); // Tambahkan class dasar
        observer.observe(el);       // Mulai pantau
    });
});