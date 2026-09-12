document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const driverNav = document.getElementById('driverNav');

    if (menuBtn && driverNav) {
        menuBtn.addEventListener('click', () => {
            // Toggle kelas 'active' pada tombol (untuk animasi X)
            menuBtn.classList.toggle('active');
            
            // Toggle kelas 'active' pada menu (untuk memunculkan kotak dropdown)
            driverNav.classList.toggle('active');
        });
    }
});

// Simulasi flow: Tombol ditekan berubah warna dan teks
function updateStatus(button) {
    button.className = "action-btn btn-sampai";
    button.innerText = "Barang Sampai";

    // Ubah badge status di atas kartu
    const badge = button.parentElement.querySelector('.badge');
    badge.className = "badge jalan";
    badge.innerText = "Dalam Perjalanan";

    // Ubah aksi onclick ke fungsi selesai
    button.onclick = function () { finishTask(this); };
}

function finishTask(button) {
    button.className = "action-btn btn-selesai";
    button.innerText = "Selesai";
    button.disabled = true; // Matikan tombol setelah selesai

    const badge = button.parentElement.querySelector('.badge');
    badge.className = "badge selesai";
    badge.innerText = "Pengiriman Selesai";
}