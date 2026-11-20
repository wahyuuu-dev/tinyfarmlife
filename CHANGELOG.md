# Changelog — Tiny Farm Life

## Finalisasi 5.5 — Toko Kebun, Pasar Desa, dan konsolidasi rilis

### Diubah
- Memisahkan fungsi Toko Kebun dan Pasar Desa pada antarmuka.
- Toko Kebun hanya menampilkan pembelian benih serta pengembangan rumah/kebun.
- Pasar Desa hanya menampilkan penjualan hasil panen.
- Mempertahankan satu objek Economy, satu saldo koin, dan satu inventaris untuk kedua lokasi.
- Memperbarui petunjuk interaksi, dialog Mira, README, GDD, serta dokumentasi Pasar Desa agar sesuai dengan fungsi terbaru.

### Kompatibilitas
- Tidak mengubah struktur save, kunci penyimpanan, ID item/tanaman/NPC, harga tanaman, atau rumus Harmony.
- Transaksi penjualan tetap melewati callback statistik harian dan pencatatan progres quest yang sudah ada.

### Catatan pengujian
- Pemeriksaan sintaks modul JavaScript, struktur HTML, referensi modul/aset, integritas ZIP, dan uji logika transaksi toko/pasar dijalankan.
- Pengujian browser interaktif penuh dan perangkat fisik belum dapat dilakukan di lingkungan pemeriksaan; checklist manual tersedia pada `docs/TAHAP5_5_FINALIZATION_RELEASE.md`.

---

## [V1.4.0 — Tahap 5.3 Player Restoration, Crop & Environment Improvement]

- Memulihkan desain Player ke referensi 5.2A tanpa mengembalikan seluruh `Sprites.js`; empat frame idle identik per piksel, dengan clamp highlight topi satu piksel saat berjalan agar tetap di dalam 16×16. Mira dan Bima tetap memakai desain 5.2B.
- Menyempurnakan siluet Carrot, Wheat, Tomato, dan Daisy pada empat state pertumbuhan; ukuran sprite tetap 16×16.
- Menata ulang variasi rumput, tanah, jalur dan transisi tepi rumput, air/tepian kolam, batu, tajuk pohon, serta dekorasi alam.
- Menambahkan sprite batu 16×16 dan overlay transisi jalan berbasis tile tetangga; tile ID, collision, posisi objek, dan struktur peta tetap.
- Tidak mengubah `config.js`, `crops.js`, `Farming.js`, sistem ekonomi/inventaris, NPC, quest, save/load, renderer, atau CSS.
- Sintaks, pemeriksaan PAL, smoke test World/Farming, dan integritas ZIP lulus. Uji browser langsung dan perangkat nyata masih perlu dilakukan.

## [V1.4.0 — Tahap 5.2B Character Visual Improvement]

- Menyempurnakan sprite Player 16×16 dengan empat arah, detail topi/rambut/wajah/overall, dan animasi langkah kaki tanpa bob vertikal.
- Menambahkan fungsi gambar Canvas 16×16 untuk Mira dan Bima dengan empat arah; identitas warna rambut dan pakaian tetap dipertahankan.
- Mira mendapat detail apron krem; Bima mendapat detail kerah/rompi krem agar siluet keduanya lebih mudah dibedakan.
- Animasi NPC memakai dua frame kaki bergantian; bayangan dan baseline kaki tetap konsisten.
- Posisi render NPC dibulatkan ke piksel terdekat tanpa mengubah koordinat logika, collision, atau pathfinding.
- Menggunakan token PAL yang sudah ada; tidak menambahkan token warna baru.
- Tidak mengubah resolusi, grid, kecepatan, jadwal NPC, dialog, quest, interaksi, ID, atau save/load.
- Pengujian otomatis fungsi gambar, batas sprite, empat arah, titik pijak, sintaks, dan integritas ZIP lulus. Uji browser/perangkat masih diperlukan.


## [V1.4.0 — Tahap 5.2A Palette Standardization]

- Memusatkan seluruh warna langsung pada aset dunia `Sprites.js` dan `World.js` ke token `PAL` di `js/data/config.js`.
- Menambahkan token bernama untuk vegetasi lush, tajuk pohon, air, tanah, batu, bangunan, hasil panen, karakter, bayangan, dan label.
- Mempertahankan nilai warna lama; perubahan ini menata referensi warna tanpa mendesain ulang aset.
- Memperbarui tabel palet pendukung di `docs/VISUAL_ASSET_STYLE_GUIDE.md`.
- Tidak mengubah ukuran canvas/tile/sprite, geometri gambar, collision, interaksi, gameplay, atau save/load.

# Changelog — Tiny Farm Life

## Reorientasi Pengembangan — Tahap 1: Farming Foundation
- Memisahkan tile tanah dekoratif di Gua Batu dari lahan pertanian; hanya Home Farm dan lahan ekspansi yang dapat dicangkul.
- Menambahkan validasi lokasi petak pada proses pemuatan save, sehingga petak yang tersimpan di area non-pertanian tidak dipulihkan. Data petak Home Farm dan lahan ekspansi tetap kompatibel.
- Memperjelas label tanah berbatu di area gua agar pemain mengetahui area tersebut bukan lahan tanam.
- Memperkuat validasi jumlah item pada Inventory dan transaksi Economy agar jumlah negatif, nol untuk pembelian, atau jenis tanaman tidak dikenal tidak mengubah inventaris maupun koin.
- Menambahkan validasi alat/benih pada aksi Farming agar item yang tidak valid tidak dapat menjalankan aksi pertanian.
- Tidak mengubah harga tanaman, durasi pertumbuhan, biaya energi, Harmony Garden, kontrol, atau struktur save version.

### Catatan pengujian Tahap 1
- Pemeriksaan sintaks seluruh modul JavaScript: lulus.
- Simulasi klasifikasi tile: Home Farm dan lahan ekspansi tetap dapat ditanami; 80 tile tanah gua yang diperiksa diklasifikasikan sebagai non-pertanian.
- Simulasi validasi save: petak Home Farm dan ekspansi dipertahankan, petak gua ditolak.
- Simulasi siklus farming, durasi pertumbuhan empat tanaman, panen, bonus Daisy, hari kering, dan penyiraman hujan: lulus.
- Simulasi validasi inventaris dan transaksi ekonomi: lulus.
- Pengujian browser interaktif, localStorage browser, performa perangkat, dan kontrol sentuh belum dilakukan.

## V1.4.0 — Village & NPC Life (pengembangan bertahap)

## Tahap 4 — Village Life
- Menambahkan `QuestSystem` untuk mengelola quest desa, progres, status, dan hadiah.
- Mira memberikan quest pasar: jual 3 Carrot dan klaim hadiah 60 koin.
- Bima memberikan quest persediaan: panen 4 Wheat dan klaim hadiah 75 koin.
- Progres quest bertambah otomatis setelah transaksi jual berhasil atau hasil panen yang sesuai diperoleh.
- Dialog NPC kini menyediakan tombol untuk menerima, memeriksa, dan mengklaim quest.
- Menambahkan penunjuk quest ringkas di layar permainan dengan progres dan status selesai.
- Menyimpan progres quest di save game; save lama tanpa data quest tetap dimigrasikan ke status quest awal.
- Memakai saldo koin dan sistem toko yang sudah ada; tidak menambah mata uang baru.

### Catatan pengujian Tahap 4
- `node --check` untuk seluruh modul JavaScript: lulus.
- Simulasi QuestSystem: menerima quest Mira, progres penjualan, penyelesaian, klaim hadiah, menerima quest Bima, progres panen, dan pemuatan ulang data: lulus.
- Pengujian browser, UI, localStorage nyata, dan perangkat fisik belum dilakukan.

## Tahap 3 — NPC Interaction
- Menambahkan panel dialog khusus untuk Mira dan Bima dengan nama, peran, sapaan, dan beberapa pilihan topik.
- Menambahkan jawaban percakapan dan opsi "Tanya hal lain" agar pemain dapat melanjutkan obrolan.
- Interaksi NPC kini membuka panel percakapan, bukan hanya notifikasi singkat.
- Tombol "Akhiri percakapan", klik area luar panel, dan Escape dapat menutup dialog.
- Mode dialog menghentikan sementara gerakan pemain, rutinitas NPC, dan waktu permainan agar percakapan nyaman dibaca.
- Pada paket Tahap 3, quest dan hadiah belum tersedia; fitur tersebut ditambahkan pada Tahap 4.

### Catatan pengujian Tahap 3
- Pemeriksaan sintaks semua modul JavaScript dan validasi struktur HTML dilakukan.
- Pengujian browser interaktif dan perangkat fisik belum dilakukan.

## HOTFIX Tahap 2 — NPCSystem initialization
- Memperbaiki `Uncaught ReferenceError: npcSystem is not defined` dengan membuat satu instance `NPCSystem` di `js/main.js` setelah objek `World` dibuat.
- Mempertahankan modul rutinitas NPC dan pemanggilan update yang sudah ada; tidak mengubah jadwal atau fitur permainan lainnya.
- Verifikasi: pemeriksaan sintaks JavaScript dan simulasi modul NPCSystem dengan dua NPC berhasil. Pengujian browser nyata belum dilakukan.

### Tahap 2 — NPC System
- Menambahkan `NPCSystem` modular untuk jadwal harian Mira dan Bima berdasarkan menit permainan.
- Mira berpindah antara area pasar, sumur, dan titik istirahat di dekat rumah warga.
- Bima berpindah antara sumur, area desa, pasar, dan titik istirahat.
- NPC berjalan dengan kecepatan santai dan animasi langkah pixel-art sederhana.
- Rute dihitung pada grid menggunakan collision dunia; air dan bangunan tidak dapat ditembus.
- NPC berhenti sementara bila jalurnya terhalang pemain atau NPC lain.
- Posisi dan aktivitas NPC diperbarui secara dinamis; identitas, nama, dan peran Mira/Bima dipertahankan.
- Deteksi tile interaksi NPC kini mengikuti posisi aktual, bukan koordinat spawn awal.

### Catatan pengujian Tahap 2
- Pemeriksaan sintaks seluruh modul JavaScript.
- Simulasi jadwal harian dan perpindahan ke titik aktivitas.
- Pemeriksaan jalur terhadap tile air dan collision objek.
- Pemeriksaan reset dunia agar referensi NPC diperbarui.
- Pengujian visual lintas perangkat masih harus dilakukan.

## V1.4.0 — Foundation Refinement (Tahap 1)
- Dialog NPC membungkus teks panjang.
- Dekorasi slot 5–8 dipindahkan ke taman dekorasi di luar petak tanam.
- Save lama dimigrasikan ke koordinat dekorasi baru.
- Mempertahankan NPC, toko, waktu, dan kontrol dari HOTFIX.

## V1.3.0-dev.3.1 HOTFIX
- Perbaikan NPC, map, visual waktu, toko, dekorasi, dan penghapusan tutorial.


## [1.4.0] — Stage 5: World Expansion

### Added
- Memperluas peta menjadi 96 × 64 tile dalam satu dunia yang tersambung.
- Menambahkan wilayah Hutan Teduh, Tepi Danau, dan Gua Batu.
- Menambahkan gerbang wilayah yang dibuka dengan biaya 150, 250, dan 350 koin.
- Menambahkan jalur, vegetasi, danau, batu penghalang, papan petunjuk, dan pintu gua.
- Menyimpan status pembukaan wilayah dalam save game.

### Compatibility and notes
- Save lama tetap dapat dimuat; wilayah baru dimulai terkunci.
- Bug progres quest Mira belum diperbaiki dan tetap masuk daftar bug untuk tahap berikutnya/final testing.
- Menambang batu dan masuk ke interior gua belum diimplementasikan pada tahap ini.


## V1.4.0 — Tahap 6: Final Polish & Testing

### Perbaikan fungsi
- Memperbaiki bug progres quest Mira: transaksi jual Carrot yang berhasil kini dicatat sebagai progres quest, baik melalui tombol **Jual** maupun **Semua**.
- Progres hanya bertambah berdasarkan jumlah item Carrot yang benar-benar berhasil dijual; transaksi gagal atau penjualan tanaman lain tidak dihitung.
- Status quest dan klaim hadiah tetap dikelola oleh `QuestSystem`, sehingga hadiah tidak diberikan berulang setelah status tersimpan sebagai `claimed`.

### Penyempurnaan visual
- Mengganti pola diagonal di Gua Batu dengan campuran tile batu, lumut, dan tanah yang tersebar deterministik.
- Memperjelas jalur menuju mulut gua dan menjaga area jalur bebas dari sebaran batu.
- Mengurangi pola diagonal berulang pada variasi tanah Hutan Teduh dan Tepi Danau.
- Menambahkan tekstur tile batu dan batu berlumut.
- Memperhalus antarmuka menu, panel, toko, dialog, tombol, dan quest tracker dengan palet yang konsisten, fokus keyboard, serta penyesuaian layar kecil.
- Mempertahankan kontrol, tata letak HUD gameplay, sistem pertanian, NPC, ekonomi, dan world expansion.

### Catatan pengujian
- Pemeriksaan sintaks seluruh modul JavaScript dan simulasi transaksi/quest dilakukan untuk paket ini.
- Pengujian visual interaktif lintas browser, sesi gameplay penuh, dan perangkat fisik tetap perlu dilakukan secara manual.


## V1.4.0 — Tahap 2: Farm Development

### Added
- Cangkul Baja: upgrade satu kali yang mengurangi biaya energi aksi mencangkul dari 2 menjadi 1.
- Penyiram Lebar: upgrade satu kali yang menyiram tanaman yang belum disiram pada area 3 × 3 di sekitar tile target.
- Upgrade rumah level 2 meningkatkan energi maksimum dari 100 menjadi 110; level 3 meningkatkannya menjadi 120. Energi dipulihkan sesuai kapasitas baru ketika pemain tidur.

### Save compatibility
- Menambahkan `toolUpgrades` ke data save tanpa menaikkan `Save.VERSION`; save lama mendapat nilai default level 1.
- Validasi energi mengikuti kapasitas rumah. Data energi yang melebihi kapasitas akan dibatasi ke maksimum yang sesuai.

### Fixes and notes
- Memulai game baru mengatur ulang level rumah, kapasitas energi, dan upgrade alat ke kondisi awal.
- Tidak mengubah durasi tanaman, harga benih/panen, Harmony Garden, atau biaya energi aksi selain mencangkul dengan Cangkul Baja.
- Pengujian otomatis dilakukan melalui pemeriksaan sintaks dan simulasi modul. Browser interaktif/perangkat fisik belum diuji.

## V1.4.0 — Tahap 3: Village Development

### Added
- Mengaktifkan kios Pasar Desa sebagai titik transaksi benih dan hasil panen; menggunakan sistem Economy dan Inventory yang sama dengan Toko Kebun.
- Menambahkan fungsi Sumur Desa untuk memulihkan hingga 15 energi, maksimal sekali per hari permainan.
- Menampilkan judul panel sesuai lokasi transaksi: Toko Kebun atau Pasar Desa.
- Memperbarui dialog Mira dan Bima agar menjelaskan fasilitas desa yang kini aktif.

### Save compatibility
- Menyimpan `wellUsedDay` untuk mencegah sumur digunakan berulang pada hari yang sama.
- Save lama tanpa `wellUsedDay` otomatis diberi nilai default 0; `Save.VERSION` tidak berubah.

### Notes
- Harga jual/beli, quest, tanaman, dan sistem inventaris tidak diubah.
- Pemeriksaan sintaks dan simulasi validasi data save telah dilakukan. Uji browser dan perangkat masih perlu dilakukan manual.

## [Tahap 4] - NPC & Village Life
- Menampilkan aktivitas harian Mira dan Bima pada panel percakapan berdasarkan jadwal NPC yang sudah berjalan.
- Menambahkan kedekatan warga: sapaan harian (+1) dan hadiah harian (+1 atau +2 untuk hadiah favorit).
- Mira menyukai Carrot dan Tomato; Bima menyukai Wheat dan Daisy.
- Menyimpan progres hubungan dan batas interaksi harian; save lama dimigrasikan dengan kedekatan awal 0.
- Memperbarui tampilan tombol sosial dan status hubungan pada dialog.

## [1.4.0] - Tahap 5.4 — Building & Decoration Improvement

- Menyempurnakan sprite rumah pemain level 1–3 dengan ukuran resmi 48×48, 64×56, dan 80×64 px; level memiliki perkembangan visual yang lebih jelas.
- Mengganti gambar inline rumah warga, pasar, sumur, dan papan petunjuk menjadi fungsi sprite Canvas terstruktur.
- Merapikan kios/toko yang sudah ada tanpa mengubah fungsi interaksinya.
- Memperbarui sprite pot bunga, lampu, orang-orangan sawah, pagar, dan papan petunjuk menggunakan token `PAL`.
- Tidak mengubah ID objek, posisi bangunan, collision, mekanisme upgrade, ekonomi, pertanian, NPC, quest, atau save/load.
- Player, Mira, Bima, tanaman, dan lingkungan Tahap 5.3 dipertahankan.
