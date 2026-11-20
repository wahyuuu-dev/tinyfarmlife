# Tiny Farm Life V1.4.0 — Tahap 5.2B: Character Visual Improvement

**Baseline:** `Tiny-Farm-Life-V1.4.0-stage5.2A-PALETTE-STANDARDIZATION.zip`  
**Standar:** `docs/VISUAL_ASSET_STYLE_GUIDE.md` v1.0  
**Status:** Implementasi dan pengujian otomatis selesai; uji browser/perangkat masih diperlukan.

## 1. Tujuan dan ruang lingkup

Menyempurnakan gambar Player, Mira, dan Bima dalam pipeline Canvas yang sudah digunakan. Perubahan dibatasi pada fungsi gambar, warna karakter yang merujuk `PAL`, dan pembulatan posisi render NPC agar piksel tidak digambar pada koordinat pecahan.

Tidak ada perubahan pada resolusi 480 × 270, tile 16 × 16, ukuran sprite karakter 16 × 16, collision, kecepatan, jadwal NPC, dialog, quest, ID, interaksi, atau save/load.

## 2. Ringkasan visual

### Player
- Mempertahankan identitas petani bertopi oranye, rambut cokelat, pakaian krem/hijau, dan celana/sepatu cokelat.
- Memperjelas crown dan brim topi, rambut, profil wajah empat arah, lengan, overall, serta detail kaki.
- Ukuran gambar tetap 16 × 16 px.
- Animasi jalan hanya mengubah posisi kaki secara diskrit. Kepala dan badan tidak lagi melakukan bob vertikal; bayangan tetap pada baris y=14..15.

### Mira
- Mempertahankan rambut cokelat (`PAL.miraHair`) dan pakaian merah muda (`PAL.miraClothes`), sesuai identitas penjaga pasar.
- Menambahkan apron krem sebagai detail visual pembeda.
- Rambut samping dan aksen kecil membantu siluet khas Mira.
- Memiliki gambar menghadap bawah, atas, kiri, dan kanan.

### Bima
- Mempertahankan rambut gelap (`PAL.bimaHair`) dan pakaian biru (`PAL.bimaClothes`), sesuai identitas warga desa.
- Menambahkan detail kerah/rompi krem dan bentuk rambut yang lebih tegas.
- Siluet dan blok warna pakaian dibedakan dari Mira.
- Memiliki gambar menghadap bawah, atas, kiri, dan kanan.

## 3. Animasi dan titik pijak

- Player menerima state langkah 0/1/2 dari `Player.draw()` seperti sebelumnya. Hanya kaki yang bergantian naik satu piksel.
- NPCSystem tetap menghasilkan `walkFrame` 0/1. `World.js` memetakannya menjadi dua frame kaki bergantian untuk fungsi gambar baru.
- Tidak ada interpolasi, blur, atau gerakan badan vertikal.
- Bayangan tetap pada y=14 dengan tinggi 2 px.
- Baris dasar kaki tetap mencapai y=15 pada pose idle dan berjalan.
- Posisi dunia NPC tetap berasal dari `o.x`/`o.y`; posisi render dibulatkan ke piksel terdekat. Pembulatan ini hanya untuk tampilan, bukan untuk koordinat logika, pathfinding, atau collision.

## 4. File yang diubah

| File | Perubahan |
|---|---|
| `js/world/Sprites.js` | Menyempurnakan `drawPlayer()` dan menambahkan `drawVillager()` untuk Mira/Bima |
| `js/world/World.js` | Memanggil `drawVillager()`; mempertahankan label NPC dan membulatkan posisi render ke piksel terdekat |
| `js/entities/Player.js` | Menggunakan `PAL.roofStone` dan `PAL.brown` untuk warna gagang/ujung alat default yang sebelumnya literal |
| `CHANGELOG.md` | Mencatat perubahan Tahap 5.2B |
| `README.md` | Menambahkan ringkasan Tahap 5.2B |
| `docs/TAHAP5_2B_CHARACTER_VISUAL_IMPROVEMENT.md` | Dokumentasi implementasi dan pengujian |
| `docs/preview/*.png` | Preview sprite dan perbandingan sebelum/sesudah |

Tidak ada token `PAL` baru yang ditambahkan. Warna karakter menggunakan token yang sudah ada dari Tahap 5.2A.

## 5. Pengujian otomatis

Lulus:

1. `node --check` untuk seluruh modul JavaScript di folder `js/`.
2. Seluruh referensi `PAL.*` pada `Sprites.js`, `World.js`, dan `Player.js` ditemukan pada `config.js` (70 token tersedia; tidak ada referensi undefined).
3. 36 kombinasi render Player, Mira, dan Bima (empat arah × tiga state langkah) berhasil dijalankan dengan Canvas test stub.
4. Semua operasi gambar karakter berada dalam batas sprite 16 × 16.
5. Empat arah menghasilkan sprite yang berbeda untuk masing-masing karakter.
6. Bayangan dan baseline kaki tetap konsisten antar-frame.
7. `World.drawObject()` berhasil menggambar Mira dan Bima untuk empat arah serta state berjalan tanpa mengubah posisi, nama, atau peran NPC.
8. `NPCSystem.js`, `NPCRelationship.js`, `Interaction.js`, `Dialogue.js`, `QuestSystem.js`, `Save.js`, `Renderer.js`, dan `css/style.css` identik dengan baseline Tahap 5.2A.

## 6. Preview

- `preview/CHARACTER_SPRITE_PREVIEW_5.2B.png`: tampilan Player, Mira, dan Bima dari empat arah, diperbesar dengan nearest-neighbor.
- `preview/CHARACTER_BEFORE_AFTER_5.2B.png`: perbandingan fungsi gambar baseline 5.2A dengan fungsi gambar 5.2B.

Gambar preview dirender langsung dari fungsi Canvas karakter dengan context uji sederhana. Ini bukan screenshot gameplay dari browser.

## 7. Batas pengujian dan masalah tersisa

- Belum dilakukan uji gameplay interaktif pada browser, localStorage nyata, desktop, atau perangkat sentuh.
- Belum tersedia screenshot gameplay yang menunjukkan NPC bergerak dalam dunia penuh.
- Detail wajah dan aksesori tetap terbatas oleh ukuran 16 × 16 px; ini disengaja agar skala dan titik pijak tidak berubah.
- Perlu pemeriksaan visual manual untuk memastikan pembacaan karakter pada jarak kamera normal, termasuk saat label NPC tampil dan lingkungan ramai.

## 8. Batas perubahan

Tidak mengubah `CFG.W`, `CFG.H`, `CFG.TILE`, `CFG.PLAYER_SPEED`, collision box Player, NPC schedule/pathfinding, objek/interaksi, sistem dialog/quest, ekonomi, pertanian, ID NPC, maupun struktur save.

Tahap 5.3 belum dimulai.
