# Laporan Pengujian — NPC System V1.4.0 (Tahap 2)

## Pengujian otomatis yang berhasil

- Pemeriksaan sintaks seluruh 29 file JavaScript: lulus.
- Simulasi jadwal Mira pada 06.00, 08.00, 12.00, 14.00, 18.00, dan 21.00: mencapai titik aktivitas yang ditetapkan.
- Simulasi jadwal Bima pada 06.00, 09.00, 12.00, 16.00, 19.00, dan 22.00: mencapai titik aktivitas yang ditetapkan.
- Pemeriksaan collision setiap langkah simulasi: NPC tidak masuk ke tile air atau collider objek.
- Pemeriksaan tile interaksi dinamis: `World.kindAt()` dan `World.villagerAt()` mengenali lokasi NPC terbaru.
- Pemeriksaan `World.reset()` pada instance World yang sama: NPCSystem mengambil ulang referensi objek yang baru.
- Pemeriksaan penghalang pemain: NPC menunggu ketika pemain menghalangi jalur dan melanjutkan perjalanan setelah jalur kosong.
- Pemeriksaan pemuatan ulang struktur dan hubungan modul: import NPCSystem terpasang di `main.js`; seluruh file JavaScript lolos parser.

## Pengujian yang belum dapat diklaim lulus

- Chromium headless tidak menyelesaikan proses pengujian halaman dalam batas waktu lingkungan. Karena itu, tidak ada klaim uji visual browser penuh.
- Belum dilakukan pengujian manual di HP, tablet, laptop, kontrol sentuh, dan keyboard.
- Belum dilakukan sesi gameplay manual panjang untuk memeriksa perilaku NPC selama beberapa hari permainan.

## Catatan

Tahap 2 berfokus pada rutinitas, pergerakan, dan aktivitas NPC. Dialog berbasis waktu, respons interaksi lanjutan, quest, pesanan, dan ekonomi tetap berada pada tahap berikutnya sesuai roadmap.


## HOTFIX — ReferenceError npcSystem
- Penyebab: modul `NPCSystem` sudah di-import, tetapi instance `npcSystem` belum dibuat di `js/main.js`.
- Perbaikan: membuat `const npcSystem = new NPCSystem();` setelah inisialisasi `World`.
- Verifikasi: `node --check` seluruh file JavaScript lulus; simulasi `NPCSystem` dengan Mira dan Bima berhasil mengikat dua villager dan memproses jadwal 08.00.
- Batasan: pengujian browser, console browser, dan perangkat fisik belum dilakukan.
