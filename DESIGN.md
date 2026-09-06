# UI/UX Design Specification (DESIGN.md)
**Proyek:** B2B SaaS Manajemen Logistik (Portofolio)
**Filosofi Desain:** Bersih (Clean), Minimalis, *Role-Centric*, dan *Mobile-First* untuk modul operasional lapangan.

---

## 1. Panduan Visual (Visual Guidelines)
Untuk menjaga konsistensi UI, kita menggunakan sistem desain yang sederhana:
*   **Warna Primer:** Putih gelap Profesional untuk tombol aksi utama.
*   **Warna Latar (Background):** Abu-abu gelap (`#22252a`) agar tidak membuat mata lelah, dan membuat area kartu (`#2c3036`) menonjol.
*   **Warna Status Pengiriman:** 
    *   `Pending` / `Mencari Vendor`: Kuning (`yellow-500`)
    *   `Diproses` / `Menunggu Supir`: Oranye (`orange-500`)
    *   `Dalam Perjalanan`: Biru Muda (`blue-400`)
    *   `Selesai`: Hijau (`green-500`)

---

## 2. Struktur Layout per Modul

### A. Landing Page & Modul Autentikasi (Halaman Publik)
*   **Layout Landing Page:** 
    *   *Desktop:* Tata letak horizontal (kiri-kanan) memanfaatkan `flex-direction: row`. Teks utama (Headline & Subtitle) di sisi kiri (`flex: 1`), dan tombol "Mulai Sekarang" di sisi kanan (`flex-shrink: 0`) untuk menciptakan ruang visual yang seimbang.
    *   *Mobile:* Layout responsif bertumpuk vertikal dengan pemerataan rata kiri. Navigasi menggunakan Hamburger Menu presisi di sudut kanan atas.
*   **Layout Login:** *Single Column*, posisi form di tengah layar (Center Modal). 
*   **Komponen Login:** 
    *   Logo/Header aplikasi di atas form.
    *   Form input (Email, Password).
    *   Tombol *Dropdown* "Masuk Sebagai" (Toko atau Vendor).
    *   Tombol Login tebal (Full-width).

### B. Modul Toko (Shipper) - Tampilan Desktop
*   **Layout Utama:** Sidebar di kiri (Navigasi), Header di atas (Profil), Konten Utama di kanan.
*   **Halaman Dashboard:**
    *   **Metrik Section:** 3 Kartu (Cards) berjajar di atas menampilkan angka "Pending", "Jalan", "Selesai".
    *   **Tabel Riwayat:** Berada di bawah metrik. Desain tabel *borderless* dengan *padding* yang lega.
    *   **Call-to-Action (CTA):** Tombol "Buat Permintaan" diletakkan di sudut kanan atas area tabel.

### C. Modul Vendor (Transporter) - Tampilan Desktop
*   **Layout Utama:** Sama dengan Toko (Sidebar kiri, Konten kanan) agar konsisten.
*   **Halaman Bursa Pengiriman (Job Board):**
    *   Tampilan daftar pekerjaan dalam bentuk baris tebal atau kartu (Grid Layout).
    *   Setiap kartu menampilkan rute (Toko A -> Tujuan B) dan berat barang.
    *   Tombol aksi utama: "Ambil Order".

### D. Modul Supir (Driver) - Tampilan Mobile
*   **Layout Utama:** *Mobile-First*. Tidak ada sidebar. Header sederhana di bagian atas dengan menu hamburger di sudut kanan atas.
*   **Halaman Daftar Tugas:**
    *   **Card Layout:** Informasi tidak disajikan dalam tabel, melainkan dalam bentuk Kartu (Cards) yang memanjang ke bawah.
    *   Setiap kartu menampilkan urutan: Nama Barang, Alamat Jemput (Toko), dan Alamat Antar.
*   **Interaksi Status (Action Buttons):**
    *   Tombol harus besar agar mudah ditekan oleh jempol (Touch-target minimal 48px).
    *   **UX Flow:** Tombol bersifat dinamis. Awalnya bertuliskan "Barang Diambil". Setelah ditekan, tombol tersebut berubah warna dan teksnya menjadi "Barang Sampai".

---

## 3. Komponen UI Inti (Reusability)
1.  **`<StatusBadge />`**: Komponen pil kecil untuk menampilkan status (warna teks dan latar menyesuaikan prop status).
2.  **`<Layout />`**: Pembungkus halaman yang otomatis mengatur posisi Sidebar dan Header.
3.  **`<TaskCard />`**: Khusus untuk mobile supir, menampilkan ringkasan rute dan tombol aksi statis.
4.  **`<AppTable />`**: Komponen tabel universal dengan dukungan *pagination* sederhana.