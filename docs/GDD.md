# Tiny Farm Life — GDD ringkas
Tidak ada kondisi menang/kalah dan tidak ada target koin atau batas hari. Permainan berfokus pada perkembangan bebas dan aktivitas santai.
Resolusi internal 480x270, tile 16x16. 1 hari = 4 menit nyata (06:00-24:00). Modal awal 100 koin.
Tanaman: Carrot (10/25, 2 hari), Wheat (15/40, 3 hari), Tomato (25/70, 4 hari), Daisy (5, dekoratif, 2 hari).
Harmony Garden: tetangga baik tumbuh +25%; Daisy di sebelah tanaman: +15% harga jual dan kupu-kupu; level Harmoni 1-3.
Energi maks 100: cangkul 2, tanam 1, siram 1, panen 1.

## Pembaruan Tahap 4
- Lahan hanya bisa dicangkul pada tanah cokelat. Rumput tidak bisa diolah.
- Tanaman tumbuh 1 hari hanya jika disiram. Tahap: benih, tunas, muda, siap panen.
- Aksi pada rumah = tidur: hari berganti, tanaman yang disiram tumbuh, energi pulih penuh.
- (Diganti di Tahap 6) Energi habis sekarang membuat karakter pingsan, lihat bagian Tahap 6.

## Pembaruan Tahap 5
- Toko Kebun berupa kios di dekat rumah dan digunakan untuk membeli benih serta mengakses pengembangan rumah/kebun. Pasar Desa digunakan untuk menjual hasil panen. Keduanya memakai saldo koin dan inventaris yang sama.
- Harga mengikuti tabel tanaman. Daisy bisa dibeli tetapi hasil panennya tidak dijual.
- Tas (tombol E atau TAS di HP) menampilkan benih, hasil panen, dan koin.

## Pembaruan Tahap 6
- Waktu: 1 hari = 240 detik nyata (06:00-24:00). Jam berhenti saat jeda, toko, atau tas terbuka.
- Suasana: pagi hangat, siang normal, senja jingga, malam biru gelap.
- Tengah malam atau energi 0: karakter pingsan, hari berganti, energi 60%, tanaman yang belum disiram tidak tumbuh. Tidur di rumah: energi 100%.
- Harmony Garden:
  1. Tetangga baik (Carrot-Tomato, Tomato-Wheat): tumbuh 1,5x per hari penyiraman (usulan awal 25% tidak terasa karena waktu tumbuh bulat).
  2. Daisy bersebelahan dengan tanaman lain: hasil panen menjadi "Harmoni" dan harganya +15%. Kupu-kupu muncul.
  3. Level dari jumlah pasangan yang sedang terbentuk: 3 pasangan = Mekar, 6 pasangan = Harmonis. Level 3: rumput lebih hijau, kunang-kunang saat senja, harga jual semua tanaman +5%.
- Tidak ada kondisi menang/kalah, target koin, batas hari, atau kondisi buntu.

## Pembaruan Tahap 7
- Simpan otomatis ke localStorage: koin, hari, jam, energi, posisi, inventory, kondisi tanaman. Level Harmoni dihitung ulang dari tanaman.
- Progres disimpan otomatis; mode bermain bebas tidak memiliki layar akhir menang/kalah.
- Audio sepenuhnya sintetis; efek visual: debu, percikan air, kilau panen dan pertumbuhan, daun jatuh.

## Versi 1.0.0 (Tahap 8)
- Gerbang pagar 2 tile + koreksi sudut gerak. Optimasi gambar dan penghematan baterai saat jeda. Paket itch.io tersedia.


## Versi 1.1.0 — Gameplay Improvement & Quality Update
- Tidak ada panel atau alur tutorial pada versi hotfix; kontrol keyboard dan sentuh tersedia langsung selama permainan.
- Ringkasan aktivitas ditampilkan setelah pergantian hari normal. Statistik mencakup aktivitas lahan, panen, pembelian/penjualan, serta koin masuk/keluar.
- Informasi waktu tumbuh dan harga jual tanaman ditampilkan pada daftar benih di toko. Daisy ditandai sebagai tanaman dekoratif.
- Save tetap menggunakan skema `1` dan key lama agar progres V1.0.0 tetap dapat dibaca.
- Catatan historis V1.1.0: pada versi saat itu, target 1.500 koin dan batas 20 hari masih berlaku. Keduanya dihapus pada V1.2.0-dev.4.


## Versi 1.2.0-dev — Sistem Cuaca
- Cuaca harian: cerah, mendung, dan hujan.
- Hujan menyiram otomatis tanaman yang sudah ditanam untuk hari tersebut.
- Cuaca ditampilkan pada HUD dan memiliki efek visual ringan.
- Cuaca disimpan agar memuat ulang permainan tidak mengundi cuaca baru.
- Perluasan lahan dan dekorasi belum menjadi bagian prototipe ini.


## Versi 1.2.0-dev.4 — Free Play Foundation
- Menghapus kondisi menang/kalah, target 1.500 koin, batas 20 hari, dan kondisi buntu.
- Hari dan ekonomi berjalan sebagai progres bebas; pemain dapat terus bermain tanpa akhir permainan.
- HUD menampilkan jumlah koin dan hari tanpa indikator target.
- Simpanan V1.0–V1.2 tetap menggunakan skema lama dan dapat dibaca; validasi hari diperluas untuk progres tanpa batas praktis.


## Pembaruan finalisasi 5.5 — Toko dan Pasar
- Toko Kebun: pembelian benih, upgrade alat, upgrade rumah, perluasan lahan, dan dekorasi yang telah tersedia.
- Pasar Desa: penjualan hasil panen, termasuk hasil panen biasa dan hasil panen Harmoni.
- Keduanya menggunakan satu saldo koin, satu inventaris, dan satu sistem Economy.
- Katalog barang dagangan warga dan sistem pesanan belum menjadi bagian versi ini.
