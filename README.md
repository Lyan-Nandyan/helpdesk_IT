# Helpdesk IT System

Sistem Helpdesk IT merupakan aplikasi berbasis web yang dirancang untuk mengelola dan memantau tiket permasalahan teknologi informasi dalam sebuah organisasi. Sistem ini dibangun menggunakan arsitektur client–server dengan pemisahan frontend dan backend yang jelas.

## Teknologi Utama

- **Frontend:** React + Vite  
- **Backend:** Node.js + Express  
- **Autentikasi & Otorisasi:** Keycloak (Identity Provider)  
- **Database:** MySQL  
- **UI Framework:** Tailwind CSS  

---

## Deskripsi Sistem

Sistem Helpdesk IT menyediakan manajemen tiket secara terpadu untuk berbagai role dalam organisasi. Mulai dari pengguna umum yang membuat tiket, admin yang mengelola penyelesaian tiket, hingga manajer yang memantau performa dan statistik layanan.

---

## Fitur Berdasarkan Role Pengguna

### 1. Role: User (Pengguna Umum)

Pengguna dengan role user hanya dapat mengelola tiket yang mereka buat sendiri.

- **Membuat Tiket Baru**  
  Mengisi judul masalah dan memilih tingkat prioritas (Low, Medium, High).

- **Melihat Daftar Tiket Pribadi**  
  Melihat seluruh tiket mereka sendiri beserta status, prioritas, dan tanggal pembuatan.

- **Memantau Status Tiket**  
  Status tiket yang tersedia: `Open`, `In Progress`, `Closed`.

- **Melihat Statistik Tiket Pribadi**  
  Tampilan ringkas distribusi tiket berdasarkan status dan prioritas.

---

### 2. Role: Admin (Administrator)

Administrator memiliki akses penuh terhadap seluruh tiket.

- **Melihat Semua Tiket**  
  Dapat melihat seluruh tiket dalam sistem.

- **Mengubah Status Tiket**  
  Mengatur status dari `Open` → `In Progress` → `Closed`.

- **Mengubah Prioritas Tiket**  
  Menyesuaikan prioritas untuk memastikan penanganan sesuai urgensi.

- **Menghapus Tiket**  
  Menghapus tiket duplikat atau tidak relevan secara permanen.

- **Pencarian & Filter Tiket**  
  Berdasarkan ID, judul, atau pembuat tiket.

- **Akses Lengkap Menu Admin**  
  Termasuk halaman administrasi tiket dan halaman pengguna.

---

### 3. Role: Manager (Manajer)

Manager berfokus pada monitoring, analitik, dan audit sistem.

- **Dashboard Statistik Lengkap**  
  Menampilkan total tiket, statistik per status (Open, In Progress, Closed), dan distribusi prioritas (High, Medium, Low).

- **Monitoring Log Aktivitas**  
  Melihat seluruh aktivitas penting seperti pembuatan tiket, perubahan status/prioritas, serta penghapusan tiket.

- **Analisis Kinerja Tim**  
  Evaluasi performa penyelesaian tiket dan identifikasi area peningkatan.

- **Monitoring Real-Time**  
  Menampilkan 50 aktivitas terbaru melalui aplikasi log.

---

## Fitur Keamanan

Sistem menerapkan keamanan berlapis untuk memastikan integritas data dan akses yang tepat.

- **Single Sign-On (SSO)** via Keycloak  
  Autentikasi terpusat dan aman.

- **Role-Based Access Control (RBAC)**  
  Setiap endpoint dan halaman dilindungi sesuai role.

- **Token-Based Authentication (JWT)**  
  Mendukung refresh token otomatis untuk menjaga sesi tetap aktif.

- **Protected Routes**  
  Akses halaman dibatasi sesuai role pengguna.

---

## Fitur Pendukung Lainnya

- **Logging Komprehensif**  
  Semua aktivitas sistem dicatat dalam file log untuk audit dan troubleshooting.

- **Responsive Design**  
  Tampilan modern dan adaptif menggunakan Tailwind CSS.

- **Health Check Endpoint**  
  Endpoint untuk memeriksa status backend dan layanan inti.

- **Database Synchronization**  
  Model secara otomatis sinkron dengan struktur database saat backend dijalankan.

---

## Ringkasan

Sistem Helpdesk IT ini dirancang sebagai solusi lengkap untuk pengelolaan tiket permasalahan IT dengan pemisahan tugas jelas antar role, dukungan keamanan modern, serta monitoring dan analitik yang memadai. Sistem ini berfokus pada efisiensi operasional, keamanan data, dan pengalaman pengguna yang optimal.

---

