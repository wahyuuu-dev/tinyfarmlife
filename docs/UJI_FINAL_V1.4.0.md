# Final Testing — Tiny Farm Life V1.4.0

## Perbaikan Tahap 6

- Quest Mira kini menerima catatan progres dari transaksi jual yang berhasil di toko. Tombol **Jual** dan **Semua** sama-sama dihitung berdasarkan jumlah Carrot yang benar-benar terjual; transaksi gagal tidak menambah progres.
- Hadiah quest tetap diklaim melalui dialog Mira dan status `claimed` mencegah hadiah diberikan dua kali.
- Area Gua Batu menggunakan variasi tile batu, lumut, dan tanah yang ditentukan dari hash koordinat, bukan pola diagonal berulang.
- Jalur dari gerbang Gua Batu menuju mulut gua diperjelas; sebaran batu menghindari jalur dan area masuk.
- Area Hutan Teduh dan Tepi Danau menggunakan variasi vegetasi deterministik agar pola tanah tidak membentuk garis diagonal.
- Antarmuka diperhalus melalui CSS: kontras, panel, tombol, dialog, tab toko, penunjuk quest, fokus keyboard, dan tampilan layar kecil. Tata letak gameplay dan kontrol inti dipertahankan.

## Pemeriksaan otomatis

- Jalankan pemeriksaan sintaks seluruh modul JavaScript.
- Uji transaksi penjualan Carrot dan progres quest Mira: 0/3 → 1/3 → 3/3.
- Uji transaksi gagal dan penjualan tanaman selain Carrot agar tidak mengubah quest Mira.
- Uji hadiah hanya sekali dan pemuatan snapshot quest.
- Uji pembentukan tile gua, jalur masuk, gerbang, dan status wilayah.
- Uji integritas arsip ZIP.

## Checklist manual sebelum rilis

- [ ] Jalankan melalui Live Server, bukan `file://`.
- [ ] Terima quest Mira, jual Carrot satu per satu hingga 3/3.
- [ ] Ulangi dengan tombol **Jual Semua**.
- [ ] Pastikan menjual Wheat/Tomato tidak menambah progres Mira.
- [ ] Klaim hadiah 60 koin, simpan, muat ulang, dan pastikan hadiah tidak berulang.
- [ ] Terima dan selesaikan quest Bima.
- [ ] Uji pertanian, inventaris, toko, NPC, waktu, cuaca, dan pergantian hari.
- [ ] Buka ketiga wilayah dan uji simpan/muat statusnya.
- [ ] Jelajahi jalan Gua Batu dan periksa collision batu serta pintu gua.
- [ ] Periksa desktop dan HP landscape, termasuk tombol sentuh.
- [ ] Mainkan satu sesi panjang dan periksa Console browser.

## Batas verifikasi

Pemeriksaan sintaks dan simulasi logika dapat dilakukan secara otomatis. Pengujian visual interaktif, performa nyata, dan kontrol pada perangkat fisik harus dilakukan melalui browser/perangkat pengguna sebelum menyatakan rilis final tervalidasi sepenuhnya.


## Finalisasi 5.5 — Candidate build

### Perubahan yang diperiksa
- Toko Kebun dan Pasar Desa kini memakai panel dengan fungsi terpisah.
- Toko Kebun menampilkan pembelian benih dan tab pengembangan rumah/kebun.
- Pasar Desa menampilkan penjualan hasil panen saja.
- Satu saldo koin dan satu inventaris tetap dipakai bersama; pencatatan transaksi yang sudah ada tetap terhubung ke statistik dan quest.
- Label interaksi, penjelasan Mira, README, GDD, dan changelog telah diselaraskan.

### Hasil pemeriksaan source dan logika
- Sintaks seluruh modul JavaScript: lulus.
- Referensi import lokal dan elemen HTML yang dipakai `main.js`: lulus.
- ID HTML duplikat: tidak ditemukan.
- Parsing stylesheet: tidak ditemukan kesalahan sintaks.
- Delapan gambar preview: dapat dibuka dan diverifikasi.
- Uji logika Toko Kebun/Pasar Desa: lulus, termasuk pembatasan jenis transaksi, saldo/inventaris bersama, penjualan semua Carrot, dan progres quest Mira.
- Uji pertanian: lulus untuk siklus tanam-siram-tumbuh-panen, bonus hasil panen Daisy, bonus pertumbuhan tetangga baik, dan Penyiram Lebar.
- Uji NPC: lulus untuk jadwal, pathfinding yang menghindari tile penghalang, serta batas sapaan/hadiah harian.
- Uji save/load: lulus untuk data terkini, kompatibilitas save lama, validasi petak, dan pemulihan dari backup.

### Batas verifikasi
Chromium headless tidak dapat dijalankan pada lingkungan pemeriksaan karena akses browser diblokir (`ERR_BLOCKED_BY_ADMINISTRATOR`). Oleh karena itu, uji browser gameplay penuh, pemeriksaan visual, kontrol sentuh, dan perangkat nyata tetap berstatus **belum diuji**. Jangan menganggap checklist manual di bawah sudah selesai hanya berdasarkan pemeriksaan source.

Untuk checklist penerimaan lengkap dan kriteria sebelum membuat ZIP rilis final, lihat `TAHAP5_5_FINALIZATION_RELEASE.md`.
