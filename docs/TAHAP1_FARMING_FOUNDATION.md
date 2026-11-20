# Tahap 1 — Farming Foundation

## Tujuan
Memperkuat siklus pertanian yang sudah ada tanpa mengganti sistem atau menambah fitur besar. Fokusnya adalah validitas petak, inventaris, transaksi, pertumbuhan, panen, dan penyimpanan.

## Pemeriksaan source

- `js/systems/Farming.js`: mencangkul, menanam, menyiram, pertumbuhan harian, panen, dan bonus Daisy.
- `js/data/crops.js`: Carrot (2 hari), Wheat (3 hari), Tomato (4 hari), Daisy (2 hari; dekoratif).
- `js/systems/Inventory.js`: jumlah benih dan hasil panen.
- `js/systems/Economy.js`: pembelian benih dan penjualan hasil panen.
- `js/systems/Save.js`: validasi serta pemulihan petak dan inventaris.
- `js/world/World.js`: batas lahan Home Farm, ekspansi, dan tile lingkungan.
- `js/main.js`: integrasi aksi, energi, cuaca, pergantian hari, statistik, dan penyimpanan.

## Perbaikan yang diterapkan

1. **Pembatasan lahan tanam**
   - `World.isFarmableSoil()` menentukan lahan yang boleh ditanami: petak Home Farm dan lahan ekspansi yang telah dibuka.
   - Tile tanah ID yang sama di Gua Batu tidak lagi dikenali sebagai lahan pertanian.
   - Area gua menampilkan target interaksi `Tanah berbatu` dengan keterangan bahwa area tersebut tidak cocok untuk pertanian.

2. **Validasi save**
   - `Save.sanitize()` hanya menerima petak pada lahan pertanian yang sah.
   - Status ekspansi dari data save ikut dipakai saat validasi, sehingga petak ekspansi tetap dipertahankan ketika save dimuat dari dunia yang awalnya belum diperluas.
   - Petak tidak sah di area gua tidak dipulihkan.

3. **Validasi inventaris dan ekonomi**
   - `Inventory.add()` dan `remove()` menolak ID kosong, jumlah bukan integer, nol, atau negatif.
   - `Economy.buy()` menolak jenis tanaman tidak dikenal dan jumlah pembelian tidak valid.
   - `Economy.sell()` menolak tanaman tidak dikenal dan jumlah penjualan negatif/tidak valid; transaksi tetap gagal tanpa mengubah koin atau item.

4. **Validasi alat dan benih**
   - `Farming.apply()` menolak item tidak dikenal dan benih yang ID-nya tidak sesuai dengan jenis tanaman.

## Yang sengaja tidak diubah

- Harga beli/jual tanaman dan durasi pertumbuhan.
- Biaya energi untuk mencangkul, menanam, menyiram, dan memanen.
- Mekanisme pertumbuhan berbasis penyiraman dan cuaca hujan.
- Harmony Garden dan bonus Daisy.
- Struktur data save serta `Save.VERSION` (tetap 1).
- Kontrol, HUD, aset, peta, NPC, dan sistem desa.

## Hasil pengujian otomatis

- [x] Pemeriksaan sintaks semua modul JavaScript.
- [x] Home Farm dikenali sebagai lahan pertanian.
- [x] Lahan ekspansi dikenali sebagai lahan pertanian setelah dibuka.
- [x] Tile tanah gua tidak dikenali sebagai lahan pertanian.
- [x] Save mempertahankan petak Home Farm dan ekspansi serta menolak petak gua.
- [x] Siklus mencangkul, menanam, menyiram, dan pertumbuhan berjalan.
- [x] Durasi pertumbuhan Carrot, Wheat, Tomato, dan Daisy sesuai data tanaman.
- [x] Tanaman tidak tumbuh pada hari tanpa penyiraman.
- [x] Penyiraman hujan memungkinkan tanaman tumbuh pada pergantian hari berikutnya.
- [x] Panen dan bonus kualitas Daisy bekerja dalam simulasi.
- [x] Transaksi dengan jumlah negatif atau tanaman tidak dikenal ditolak.

## Checklist manual yang masih diperlukan

- [ ] Jalankan melalui Live Server dan periksa Console browser.
- [ ] Cangkul, tanam, siram, dan panen setiap jenis tanaman.
- [ ] Pastikan tanaman tidak tumbuh saat tidak disiram dan tumbuh saat disiram/hujan.
- [ ] Periksa bonus pertumbuhan dan harga dari Harmony Garden.
- [ ] Jual hasil panen satuan dan melalui tombol Semua.
- [ ] Simpan/muat permainan dengan petak Home Farm dan petak ekspansi yang sudah ditanami.
- [ ] Pastikan tidak ada petak yang bisa dibuat di area gua.
- [ ] Periksa desktop dan perangkat mobile.

## Batas verifikasi

Pengujian di atas adalah simulasi logika dan pemeriksaan sintaks melalui Node.js. Belum dilakukan pengujian browser interaktif, localStorage browser nyata, performa perangkat, atau kontrol sentuh fisik.
