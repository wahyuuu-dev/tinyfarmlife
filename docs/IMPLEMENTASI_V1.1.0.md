# Tiny Farm Life V1.1.0 — Catatan Implementasi

## Fokus pembaruan
V1.1.0 berfokus pada onboarding, umpan balik aktivitas harian, informasi tanaman di toko, dan kompatibilitas save.

## Implementasi
1. `js/main.js`
   - Menambahkan enam tahap tutorial berbasis aksi: bergerak, mencangkul, menanam, menyiram, memanen, dan membuka kios.
   - Tutorial dapat dilewati dan progresnya disimpan.
   - Menghitung aktivitas harian serta menampilkan ringkasan setelah pergantian hari.
2. `js/systems/Save.js`
   - Menyimpan `dailyStats`, `tutorialStep`, dan `tutorialDone`.
   - Data lama yang belum memiliki properti tersebut diberi nilai bawaan.
   - Skema save tetap `1`; key penyimpanan V1.0.0 tidak diganti.
3. `js/systems/Economy.js`
   - Hasil transaksi menyertakan jumlah dan nominal untuk pencatatan statistik.
4. `js/ui/Shop.js`
   - Informasi daftar benih menampilkan waktu tumbuh dan harga jual; Daisy diberi label dekoratif.
5. `index.html` dan `css/style.css`
   - Menambahkan panel tutorial dan layar ringkasan harian yang responsif.
6. `js/data/config.js`
   - Versi aplikasi menjadi `1.1.0`.

## Batasan yang diketahui
- Statistik mencatat aksi/transaksi yang berhasil sejak awal hari; bukan riwayat seumur hidup.
- Ringkasan muncul setelah pergantian hari normal. Akhir Hari 20 tetap mengikuti layar game over yang sudah ada.
- Tutorial baru dimulai pada game baru. Save lama diberi progres tutorial awal agar pemain lama dapat memilih melewatinya.
- Belum ada klaim pengujian pada perangkat fisik. Checklist perangkat harus dijalankan setelah ZIP diekstrak.

## Cara menjalankan
Ekstrak ZIP, buka folder proyek di VS Code, jalankan Live Server pada `index.html`. Jangan membuka file dengan skema `file://`.

## Pemeriksaan yang sudah dilakukan
- Seluruh 27 file JavaScript lolos pemeriksaan sintaks Node.js.
- Tidak ditemukan impor relatif yang menunjuk ke file yang hilang.
- Uji modul otomatis lulus: transaksi beli/jual, aksi cangkul/tanam/siram, pertumbuhan tanaman, kompatibilitas save V1.0.0, dan pembacaan field V1.1.0.
- Pengguna melaporkan tidak menemukan bug saat mencoba paket V1.1.0.
- Pengujian browser otomatis di lingkungan kerja ini terhalang kebijakan akses ke localhost; pengujian perangkat fisik tetap mengikuti checklist dan laporan pengguna.
