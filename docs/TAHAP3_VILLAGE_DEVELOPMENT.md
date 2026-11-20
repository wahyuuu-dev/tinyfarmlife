# Tahap 3 — Village Development

## Tujuan
Membuat fasilitas Greenfield Village berguna dalam alur bermain, tanpa menggeser fokus utama dari berkebun atau membuat sistem ekonomi ganda.

## Fitur
1. **Pasar desa aktif** — kios pasar di Greenfield Village membuka sistem transaksi yang sama dengan Toko Kebun. Pemain dapat membeli benih dan menjual hasil panen; inventaris, koin, statistik harian, dan quest Mira tetap memakai sistem ekonomi yang sudah ada.
2. **Sumur desa aktif** — sumur memulihkan hingga 15 energi. Hanya dapat digunakan sekali per hari dan tidak mengisi energi melebihi batas rumah.
3. **Penyimpanan penggunaan sumur** — hari terakhir penggunaan sumur disimpan. Save lama yang belum memiliki data ini otomatis menganggap sumur belum digunakan.
4. **Dialog warga diperbarui** — Mira menjelaskan pasar yang telah beroperasi dan Bima memberi petunjuk fungsi sumur.
5. **Identitas panel** — panel transaksi menampilkan judul Toko Kebun atau Pasar Desa sesuai lokasi pemain.

## Batasan yang disengaja
- Pasar memakai sistem transaksi yang sama, bukan ekonomi atau inventaris terpisah.
- Harga benih dan harga jual hasil panen tidak diubah.
- Sumur tidak memberi energi jika energi pemain sudah penuh.
- Fitur rumah, alat, ekspansi kebun, dekorasi, NPC, quest, wilayah, dan tanaman dari tahap sebelumnya dipertahankan.

## Pengujian
- Pemeriksaan sintaks seluruh modul JavaScript.
- Pemeriksaan migrasi save lama tanpa `wellUsedDay`.
- Simulasi validasi batas `wellUsedDay` terhadap hari permainan.
- Pemeriksaan integritas ZIP.
- Pengujian interaktif browser, localStorage nyata, serta perangkat desktop/ponsel masih perlu dilakukan manual.


## Penyelarasan finalisasi Tahap 5.5
Pada implementasi awal Tahap 3, Pasar Desa membuka alur transaksi yang sama dengan Toko Kebun. Pada finalisasi 5.5, fungsi antarmuka dipisahkan sesuai kebutuhan desain terbaru: Toko Kebun melayani pembelian benih dan pengembangan kebun, sedangkan Pasar Desa melayani penjualan hasil panen. Keduanya tetap menggunakan `Economy`, saldo koin, inventaris, statistik harian, dan pencatatan quest yang sama.
