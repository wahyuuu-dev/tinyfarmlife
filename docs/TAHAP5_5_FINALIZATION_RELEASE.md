# Tiny Farm Life V1.4.0 — Tahap 5.5 Finalization & Release

**Status paket:** Candidate build. Pemeriksaan source dan paket selesai; penerimaan gameplay manual serta pengujian perangkat masih menunggu.

## 1. Baseline dan keputusan yang dipertahankan

- Baseline: `Tiny-Farm-Life-V1.4.0-stage5.4-BUILDING-DECORATION-IMPROVEMENT.zip`.
- Standar visual: `docs/VISUAL_ASSET_STYLE_GUIDE.md` v1.0.
- Tahap 5.3 original menjadi baseline Player, tanaman, dan lingkungan. Revisi tambahan 5.3A tidak digunakan.
- Player memakai desain lama; Mira dan Bima memakai desain 5.2B.
- Sprite Carrot, Wheat, Tomato, Daisy, bangunan, dan dekorasi dipertahankan dari baseline yang telah disetujui.
- Tidak ada fitur besar baru atau perubahan struktur dunia.

## 2. Integrasi Toko Kebun dan Pasar Desa

Fungsi antarmuka kini dipisahkan:

| Lokasi | Fungsi |
|---|---|
| Toko Kebun | Membeli benih, upgrade alat, upgrade rumah, perluasan lahan, dan dekorasi yang sudah tersedia. |
| Pasar Desa | Menjual hasil panen biasa dan hasil panen Harmoni. |

Keduanya tetap memakai satu objek `Economy`, satu saldo koin, satu `Inventory`, harga tanaman yang sama, serta penyimpanan yang sama. Penjualan dari Pasar Desa tetap melewati callback transaksi pada `main.js`, sehingga statistik penjualan dan progres quest Mira yang sudah ada tetap menerima jumlah hasil panen yang berhasil dijual.

Katalog barang dagangan warga dan sistem pesanan tidak ditambahkan karena data barang dan sistem pesanannya belum tersedia dalam proyek. Menambahkannya pada tahap ini akan memperluas ruang lingkup dan memerlukan penyeimbangan ekonomi baru.

## 3. Perubahan berkas

- `index.html` — memisahkan kontainer antarmuka Toko Kebun dan Pasar Desa.
- `js/ui/Shop.js` — mendukung mode `home` dan `market`; membatasi pembelian pada Toko Kebun dan penjualan pada Pasar Desa.
- `js/main.js` — mengirim mode lokasi yang benar saat pemain berinteraksi dengan kios Home Farm atau Pasar Desa.
- `js/systems/Interaction.js` — memperbarui label dan penjelasan interaksi.
- `js/ui/Dialogue.js` — memperbarui penjelasan Mira sesuai fungsi pasar baru.
- `css/style.css` — menambahkan gaya teks keterangan Pasar Desa.
- `README.md`, `docs/GDD.md`, `docs/TAHAP3_VILLAGE_DEVELOPMENT.md`, `CHANGELOG.md` — menyelaraskan dokumentasi.

Tidak ada perubahan pada data tanaman, harga, formula Harmony, sistem save, kunci `localStorage`, ID item/tanaman/NPC, koordinat peta, collision, ukuran sprite, atau jadwal NPC.

## 4. Pemeriksaan yang dijalankan

- [x] Integritas ZIP baseline Tahap 5.4.
- [x] Pemeriksaan sintaks seluruh modul JavaScript menggunakan Node.js.
- [x] Pemeriksaan struktur HTML dan keberadaan elemen UI yang dibutuhkan oleh modul toko.
- [x] Pemeriksaan jalur import modul dan referensi berkas lokal.
- [x] Uji logika mode Toko Kebun: tampilan benih, tab pengembangan kebun, dan transaksi pembelian.
- [x] Uji logika pertanian: penanaman, penyiraman, pertumbuhan 1,5× tetangga baik, bonus hasil panen Harmoni dari Daisy, serta Penyiram Lebar.
- [x] Uji logika NPC: jadwal Mira/Bima, pathfinding menghindari tile terhalang, dan batas sapaan/hadiah harian.
- [x] Uji save/load: data terkini, default untuk save lama, validasi petak non-pertanian, dan pemulihan dari backup ketika save utama rusak.
- [x] Uji logika mode Pasar Desa: tab pembelian disembunyikan, daftar penjualan ditampilkan, pembelian ditolak pada konteks pasar, dan penjualan hasil panen memperbarui saldo/inventaris.
- [x] Uji perpindahan kembali dari Pasar Desa ke Toko Kebun agar tampilan tidak tertinggal dalam mode pasar.
- [x] Uji penjualan hasil panen Harmoni menggunakan bonus harga tanpa menggandakan progres quest yang sudah selesai.
- [x] Pemeriksaan integritas ZIP hasil candidate.

### Pemeriksaan yang belum dapat diselesaikan

- [ ] Pengujian browser gameplay penuh. Upaya menjalankan Chromium headless pada lingkungan pemeriksaan terhalang kebijakan browser (`ERR_BLOCKED_BY_ADMINISTRATOR`), sehingga hasil interaksi browser tidak boleh dianggap lulus.
- [ ] Pemeriksaan fisik desktop/laptop dan HP landscape.
- [ ] Pengujian satu siklus penuh: mulai game, bertani, panen, jual di pasar, beli benih di Toko Kebun, upgrade, interaksi NPC/quest, simpan, dan muat ulang.
- [ ] Pemeriksaan visual skala permainan untuk rumah level 1–3, pasar, dekorasi, jalur NPC, serta keterbacaan UI.

## 5. Checklist penerimaan manual

### Toko Kebun
- [ ] Interaksi dengan kios dekat rumah membuka panel **Toko Kebun**.
- [ ] Tab **Benih & Perlengkapan** menampilkan pembelian benih.
- [ ] Tab **Dekorasi & Upgrade** menampilkan upgrade alat, rumah, perluasan lahan, dan dekorasi.
- [ ] Tidak ada daftar jual hasil panen di Toko Kebun.
- [ ] Pembelian mengurangi koin dan menambah item/upgrade yang tepat.

### Pasar Desa
- [ ] Interaksi dengan kios desa membuka panel **Pasar Desa**.
- [ ] Panel hanya menampilkan daftar hasil panen yang dapat dijual.
- [ ] Benih dan menu upgrade tidak tampil di Pasar Desa.
- [ ] Tombol **Jual** dan **Semua** berfungsi untuk hasil panen biasa maupun Harmoni.
- [ ] Hasil penjualan menambah koin dan mengurangi inventaris sesuai jumlah yang dijual.
- [ ] Quest Mira bertambah hanya dari Carrot yang berhasil dijual.

### Dunia dan gameplay
- [ ] Rumah level 1, 2, dan 3 tampil sesuai desain dan tidak mengganggu jalur.
- [ ] Bangunan pasar, rumah warga, sumur, kios, pagar, dan dekorasi tampil normal.
- [ ] Mira dan Bima bergerak pada rute yang wajar serta tidak menembus collision.
- [ ] Interaksi sumur, rumah, gerbang wilayah, dan NPC berfungsi.
- [ ] Hutan Teduh, Tepi Danau, dan Gua Batu dapat dicapai sesuai sistem pembukaan wilayah.
- [ ] Siklus pertanian, cuaca, pergantian hari, Harmony, quest, hubungan NPC, serta save/load tetap berjalan.

### Kompatibilitas
- [ ] Jalankan pada browser desktop melalui server lokal.
- [ ] Jalankan pada HP dalam mode landscape dengan kontrol sentuh.
- [ ] Muat save lama dan pastikan progres kebun, koin, rumah, alat, wilayah, quest, serta hubungan NPC tetap terbaca.

## 6. Batasan dan isu yang diketahui

- Tidak ada sistem membeli barang produksi warga atau sistem pesanan pasar pada build ini.
- Batu Gua masih menjadi objek/rintangan; sistem menambang dan interior gua belum termasuk ruang lingkup.
- Pengujian browser dan perangkat nyata belum dilakukan pada lingkungan ini.
- Build ini belum boleh disebut rilis tervalidasi sampai checklist penerimaan manual diselesaikan.

## 7. Kriteria penetapan rilis

Rilis `Tiny-Farm-Life-V1.4.0-FINAL.zip` dibuat setelah checklist penerimaan manual selesai dan tidak ada masalah kritis pada transaksi, jalur, interaksi, atau save/load. Candidate build disimpan terpisah agar baseline Tahap 5.4 dan ZIP lama tidak tertimpa.
