# Product Requirements Document (PRD)
**Proyek:** B2B SaaS Manajemen Logistik (Portofolio)
**Tujuan:** Menyediakan platform penghubung antara Toko (Shipper), Vendor Logistik (Transporter), dan Supir (Driver) dalam satu alur pengiriman yang mulus.

---

## 1. Peta Alur (Flowchart) Proses Pengiriman
Alur sistem dibagi menjadi 3 *swimlanes* utama: User, Web App (Sistem), dan PostgreSQL (Database).

**Skenario Utama:**
1. **[User - Admin Toko]:** Mengisi form "Buat Permintaan Kirim Barang" di dashboard.
2. **[Sistem]:** Menerima data form dan memvalidasi input (memastikan tidak ada *field* kosong).
3. **[Database]:** Menyimpan data ke tabel `pengiriman` dengan status awal `Mencari Vendor`.
4. **[User - Admin Vendor]:** Membuka menu "Bursa Pengiriman", melihat daftar barang baru, lalu menekan tombol "Ambil Order & Tugaskan Supir Budi".
5. **[Sistem]:** Mengirim perintah *Update* data.
6. **[Database]:** Mengubah status di tabel `pengiriman` menjadi `Menunggu Supir`, serta menyimpan `vendor_id` dan `supir_id`.
7. **[User - Supir Budi]:** Membuka aplikasi berbasis *mobile*, menekan tombol "Barang Diambil", dan memperbarui lagi saat "Barang Sampai".
8. **[Sistem]:** Mengirim perintah *Update* status terakhir dari aplikasi HP.
9. **[Database]:** Status pengiriman berubah menjadi `Selesai`.

---

## 2. Desain Relasi Database (ERD) & Struktur PostgreSQL
Sistem ini menggunakan 3 tabel utama yang saling terhubung menggunakan *Foreign Key* (Kunci Tamu) untuk menjaga integritas data.

### Skema SQL (Kompatibel dengan Supabase / PgAdmin)

```sql
-- 1. Buat Tabel Perusahaan (Bisa Toko atau Vendor Logistik)
CREATE TABLE perusahaan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_perusahaan VARCHAR(255) NOT NULL,
    tipe_perusahaan VARCHAR(50) NOT NULL, -- 'Toko' atau 'Vendor'
    alamat_lengkap TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Buat Tabel Users (Orang yang login)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perusahaan_id UUID REFERENCES perusahaan(id) ON DELETE CASCADE,
    nama_lengkap VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'Admin_Toko', 'Admin_Vendor', atau 'Supir'
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Buat Tabel Pengiriman (Pusat aktivitas)
CREATE TABLE pengiriman (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    toko_id UUID REFERENCES perusahaan(id), 
    vendor_id UUID REFERENCES perusahaan(id), -- Bisa NULL di awal
    supir_id UUID REFERENCES users(id),       -- Bisa NULL di awal
    
    nama_barang VARCHAR(255) NOT NULL,
    berat_kg DECIMAL,
    alamat_tujuan TEXT NOT NULL,
    status_kirim VARCHAR(50) DEFAULT 'Pending', -- Pending, Diproses, Jalan, Selesai
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);