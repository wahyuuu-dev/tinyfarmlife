# Checklist Uji — Village Life V1.4.0

## A. Dialog dan quest NPC
- [ ] Dekati Mira dan tekan tombol AKSI / Space / Enter / F.
- [ ] Pastikan tombol quest Mira muncul pada panel dialog.
- [ ] Pilih `Ambil quest: Pasokan untuk Pasar`.
- [ ] Pastikan penunjuk quest muncul dengan progres 0/3.
- [ ] Dekati Bima dan terima quest `Persediaan Gandum`.
- [ ] Pastikan dialog tetap dapat ditutup dengan tombol dan Escape.

## B. Quest Mira — Pasokan untuk Pasar
- [ ] Panen dan kumpulkan Carrot secukupnya.
- [ ] Buka toko dan jual 1 Carrot; progres harus bertambah 1.
- [ ] Jual hingga total 3 Carrot; quest harus berubah menjadi selesai.
- [ ] Kembali berbicara dengan Mira dan pilih klaim hadiah.
- [ ] Pastikan saldo koin bertambah 60 dan quest menjadi selesai/diklaim.

## C. Quest Bima — Persediaan Gandum
- [ ] Tanam dan rawat Wheat sampai siap panen.
- [ ] Panen 4 Wheat setelah quest diterima; progres harus bertambah menjadi 4/4.
- [ ] Kembali berbicara dengan Bima dan klaim hadiah.
- [ ] Pastikan saldo koin bertambah 75.

## D. Simpan dan muat
- [ ] Terima quest, tambah progres sebagian, lalu simpan game.
- [ ] Muat ulang game dan pastikan status/progres quest tetap sama.
- [ ] Selesaikan quest, simpan, muat ulang, dan pastikan status klaim tidak kembali ke awal.
- [ ] Muat save dari versi sebelumnya yang belum memiliki data quest; game harus tetap bisa melanjutkan.

## E. Regresi fitur lama
- [ ] NPC tetap bergerak sesuai jadwal harian dan tidak menembus bangunan/air.
- [ ] Dialog menghentikan sementara waktu dan gerakan NPC.
- [ ] Bertani, inventaris, toko, jual-beli, tidur, pergantian hari, dan ringkasan harian tetap berjalan.
- [ ] Uji kontrol keyboard dan kontrol sentuh dalam orientasi yang didukung.

Catatan: checklist ini perlu diuji melalui browser menggunakan Live Server. Pemeriksaan sintaks dan simulasi logika quest tidak menggantikan uji gameplay langsung.
