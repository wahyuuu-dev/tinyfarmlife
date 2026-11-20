# TINY FARM LIFE V1.4.0
## Tahap 5.3 — Player Restoration, Crop & Environment Improvement

**Status:** Implementasi selesai; menunggu pemeriksaan pengguna sebelum Tahap 5.4.

## 1. Basis dan batas pekerjaan

- Source utama: ZIP Tahap 5.2B `CHARACTER-VISUAL-IMPROVEMENT`.
- Referensi restorasi Player: ZIP Tahap 5.2A `PALETTE-STANDARDIZATION`.
- Standar visual: `docs/VISUAL_ASSET_STYLE_GUIDE.md` v1.0.
- Pipeline Canvas procedural dipertahankan. Tidak ada migrasi spritesheet eksternal.
- Ukuran kanvas logis 480×270, tile 16×16, Player/NPC 16×16, pohon 32×40, palet `PAL`, nearest-neighbor, dan `imageSmoothingEnabled = false` tetap berlaku.

## 2. Player visual restoration

- Siluet, warna, detail, dan posisi desain `drawPlayer()` dipulihkan dari implementasi Tahap 5.2A. Frame diam identik dengan referensi; satu piksel highlight topi saat bob berjalan dibatasi ke dalam frame agar tidak keluar dari kanvas 16×16.
- Ukuran 16×16, empat arah, serta variasi langkah tetap dipertahankan. Animasi bob lama tetap ada, sementara highlight topi tidak melampaui batas atas frame.
- Bayangan tetap berada pada baris y=14–15; animasi kaki dan gerak badan mengikuti frame diskrit versi referensi.
- Tidak mengubah `Player.js`, kecepatan, update posisi, collision, hitbox, arah hadap, atau titik interaksi.
- Fungsi `drawVillager()` dari 5.2B dipertahankan; Mira dan Bima tidak dikembalikan ke desain lama.

Preview: `preview/PLAYER_BEFORE_AFTER_5.3.png`.

## 3. Crop improvement

Keempat tanaman tetap memakai ID dan urutan state yang sama:

1. `0` — benih.
2. `1` — tunas.
3. `2` — tanaman muda.
4. `3` — siap panen.

Penyempurnaan siluet:

- **Carrot:** daun tegak dan akar oranye yang tampak di permukaan pada state siap panen.
- **Wheat:** batang ramping dan bulir keemasan yang mudah dibedakan dari daun tanaman lain.
- **Tomato:** tajuk daun lebih lebar dan buah merah pada state siap panen.
- **Daisy:** roset daun, kuncup, lalu bunga putih-kuning; tetap berperan sebagai tanaman dekoratif Harmony Garden.

Setiap frame tetap 16×16. `js/data/crops.js`, ID tanaman, harga benih/jual, durasi tumbuh, bonus Harmony, penyiraman, panen, dan data save tidak diubah.

Preview: `preview/CROP_PREVIEW_5.3.png`.

## 4. Environment improvement

- **Rumput:** tekstur lebih terkontrol, variasi rumput tetap deterministik, aksen clover kecil menggantikan aksen bunga yang terlalu mencolok.
- **Tanah:** butiran lebih renggang agar bidang tanah dan petak tetap mudah dibaca.
- **Jalan:** tekstur jalur dibuat lebih halus; overlay tepi rumput hanya muncul saat jalan berbatasan dengan tile rumput. ID PATH tidak berubah.
- **Air/kolam:** riak lebih renggang dengan lapisan warna kedalaman; tepian air memakai dua warna tanah hangat.
- **Batu/tanah berbatu:** pecahan batu dan aksen lumut dibuat lebih terstruktur.
- **Pohon:** tajuk berlapis dengan tepi gelap, massa hijau tengah, sorotan kiri-atas, batang dan bayangan lebih terbaca.
- **Dekorasi alam:** batu objek menggunakan sprite 16×16; pot bunga dekoratif dirapikan tanpa mengubah slot atau collision.

Tidak ada perubahan struktur peta, penempatan objek, tile ID, solid collider, atau hubungan antarkawasan. Preview: `preview/ENVIRONMENT_PREVIEW_5.3.png`.

## 5. File yang diubah

- `js/world/Sprites.js`
- `js/world/World.js`
- `README.md`
- `CHANGELOG.md`
- `docs/TAHAP5_3_PLAYER_RESTORATION_CROP_ENVIRONMENT.md`
- `docs/preview/PLAYER_BEFORE_AFTER_5.3.png`
- `docs/preview/CROP_PREVIEW_5.3.png`
- `docs/preview/ENVIRONMENT_PREVIEW_5.3.png`

## 6. File/sistem yang dipastikan tidak berubah

Pemeriksaan byte-level terhadap source 5.2B menunjukkan file berikut tidak berubah:

- `js/data/config.js`, `js/data/crops.js`, `js/data/items.js`
- `js/entities/Player.js`
- `js/systems/Farming.js`, `Economy.js`, `Inventory.js`, `NPCSystem.js`, `NPCRelationship.js`, `QuestSystem.js`, `Save.js`, `Interaction.js`
- `js/engine/Renderer.js`, `js/engine/Game.js`, `js/main.js`
- `css/style.css`

Dengan demikian parameter tanaman, ekonomi, inventaris, NPC, quest, save/load, renderer, dan CSS tetap berasal dari 5.2B.

## 7. Hasil pengujian

### Lulus

- Pemeriksaan sintaks `node --check` untuk seluruh modul JavaScript.
- Keempat frame idle `drawPlayer()` identik secara piksel dengan referensi 5.2A; frame berjalan hanya mendapat clamp satu piksel untuk menjaga batas 16×16.
- Pemeriksaan batas seluruh gambar Player, Mira, dan Bima pada empat arah dan tiga variasi langkah tidak menemukan rectangle di luar kanvas 16×16.
- Fungsi gambar Mira/Bima tetap berasal dari 5.2B; empat arah dan dua identitas karakter tetap tersedia.
- Keempat tanaman memiliki empat sprite 16×16 dengan urutan state 0–3.
- Pemeriksaan sprite dilakukan melalui Canvas test stub: dimensi, batas gambar, transparansi, dan variasi visual state.
- Referensi warna yang dipakai `Sprites.js`/`World.js` mengarah ke token `PAL` yang tersedia.
- Smoke test modul World: pembuatan peta, ground cache, render objek dan overlay jalan tanpa exception pada Canvas stub.
- Smoke test Farming: cangkul, tanam, siram, pertumbuhan hingga siap panen, dan panen diuji untuk Carrot, Wheat, Tomato, serta Daisy.
- Pemeriksaan byte-level file sistem yang dibatasi: tidak berubah.
- Integritas ZIP diperiksa setelah paket dibuat.

### Belum dapat diverifikasi

- Browser Chromium headless dicoba untuk preview halaman, tetapi proses berakhir timeout di lingkungan pengujian ini. Karena itu tidak diklaim sebagai uji browser/gameplay langsung.
- Belum ada pemeriksaan manual pada perangkat desktop/ponsel.
- Preview PNG adalah render sprite langsung dari fungsi Canvas sumber, bukan screenshot gameplay berjalan.

## 8. Masalah tersisa / pemeriksaan manual yang disarankan

- Periksa tanaman pada skala permainan normal 480×270, terutama keterbacaan tunas dan bulir Wheat.
- **Catatan pertumbuhan dua hari:** logika `stageOf()` yang dipertahankan memetakan pertumbuhan harian Carrot dan Daisy dari state benih langsung ke tanaman muda, lalu siap panen. Akibatnya sprite tunas (state 1) tetap tersedia dan teruji, tetapi tidak muncul dalam siklus normal dua hari tanpa sub-tahap waktu. Mengubahnya memerlukan revisi mekanisme/progres pertumbuhan, sehingga tidak dilakukan pada tahap visual ini.
- Periksa transisi tepi jalan dan tepian kolam di beberapa area peta saat game dijalankan.
- Periksa urutan render pohon/batu terhadap Player serta akses jalur di sekitar objek.
- Uji penyimpanan dan pemuatan save lama di browser nyata sebagai regresi tambahan, walaupun file Save tidak diubah.

## 9. Status tahapan

Tahap 5.3 selesai pada sisi implementasi dan pengujian otomatis yang tersedia. Paket menunggu pemeriksaan pengguna. **Tahap 5.4 belum dimulai dan tidak termasuk dalam ZIP ini.**
