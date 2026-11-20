# TINY FARM LIFE V1.4.0
## Tahap 5.4 — Building & Decoration Improvement

**Status:** Diterima sebagai baseline visual untuk finalisasi Tahap 5.5. Pemeriksaan gameplay/perangkat tetap mengikuti checklist finalisasi.

## 1. Baseline dan keputusan visual

- Baseline source: `Tiny-Farm-Life-V1.4.0-stage5.3-PLAYER-RESTORATION-CROP-ENVIRONMENT.zip` (versi original, bukan revisi 5.3A).
- Standar: `docs/VISUAL_ASSET_STYLE_GUIDE.md` v1.0.
- Palet `PAL`, Canvas procedural, nearest-neighbor, kanvas logis 480×270, dan tile 16×16 dipertahankan.
- Player lama, Mira/Bima dari 5.2B, tanaman dan lingkungan Tahap 5.3 tidak disentuh.

## 2. Player House

Tiga sprite rumah pemain diperbarui tanpa mengubah dimensi:

| Level | Ukuran |
|---|---:|
| 1 | 48×48 px |
| 2 | 64×56 px |
| 3 | 80×64 px |

Perbedaan level ditunjukkan melalui peningkatan bidang atap, lis, cerobong/ventilasi, serambi, dan detail pot. `World.houseSize()`, `setHouseLevel()`, harga, syarat, titik pijak, dan collider tidak diubah.

Preview: `preview/PLAYER_HOUSE_PREVIEW_5.4.png`.

## 3. Village Buildings

- **Rumah warga:** sprite 48×36 px dengan atap terakota, dinding krem, kusen jendela, pintu, dan lis hijau; identitasnya berbeda dari rumah pemain.
- **Pasar:** sprite 48×32 px dengan kanopi kain bergaris, papan nama, meja, keranjang, dan hasil dagang.
- **Sumur:** sprite 16×16 px dengan bibir batu, air, tiang, dan palang kayu.
- **Kios/toko:** sprite 32×32 px diperhalus dengan rangka, kanopi, meja dan hasil dagang.
- Papan desa dan papan wilayah kini memakai sprite 16×16 px yang konsisten.

Posisi render diselaraskan dengan posisi lama. Collision, penandaan tile, dan interaksi tidak diubah.

Preview: `preview/VILLAGE_BUILDINGS_PREVIEW_5.4.png`.

## 4. Decorations

Sprite 16×16 untuk pot bunga, lampu, dan orang-orangan sawah dirapikan. Pagar horizontal/vertikal tetap memakai tile 16×16. Papan petunjuk memakai sprite 16×16. Slot dekorasi, daftar jenis yang diizinkan, posisi, dan collider tidak berubah. Tidak ada fasilitas atau sistem baru.

Preview: `preview/DECORATIONS_PREVIEW_5.4.png`.

## 5. File yang diubah

- `js/world/Sprites.js` — sprite rumah pemain, rumah warga, pasar, sumur, kios, papan, dan dekorasi.
- `js/world/World.js` — mengganti gambar inline bangunan/dekorasi dengan pemanggilan sprite; struktur peta dan logika collision dipertahankan.
- `README.md` — catatan Tahap 5.4.
- `CHANGELOG.md` — ringkasan perubahan.
- `docs/TAHAP5_4_BUILDING_DECORATION_IMPROVEMENT.md` — dokumentasi tahap.
- `docs/preview/PLAYER_HOUSE_PREVIEW_5.4.png`.
- `docs/preview/VILLAGE_BUILDINGS_PREVIEW_5.4.png`.
- `docs/preview/DECORATIONS_PREVIEW_5.4.png`.

## 6. Hasil pemeriksaan

### Lulus pada pemeriksaan source / stub

- Sintaks seluruh modul JavaScript.
- Referensi `PAL` pada `Sprites.js` dan `World.js` semuanya tersedia.
- Ukuran rumah pemain tepat 48×48, 64×56, dan 80×64 px.
- Sprite bangunan/dekorasi baru dibuat melalui Canvas dengan batas koordinat di dalam ukuran sprite.
- Perbandingan baseline dan hasil: daftar objek peta, posisi, collision solids, slot dekorasi, dan hasil `houseSize()` sama pada level 1–3.
- Fungsi render objek menggunakan sprite baru dan dapat dipanggil melalui Canvas stub tanpa exception.
- Tidak ada perubahan pada sistem upgrade, ekonomi, pertanian, NPC, quest, atau save/load.
- ZIP final lulus pemeriksaan integritas.

### Belum diverifikasi

- Pengujian browser/gameplay langsung tidak berhasil diselesaikan pada lingkungan ini; preview dihasilkan dari operasi gambar Canvas yang diekspor dari source sprite dan disusun pada skala nearest-neighbor. Ini bukan screenshot gameplay.
- Belum dilakukan pemeriksaan manual di perangkat desktop/ponsel.
- Keterbacaan bangunan pada skala permainan normal serta jalur pendekatan NPC tetap perlu ditinjau oleh pemilik proyek.

## 7. Masalah tersisa / perhatian review

- Rumah pemain level 3 lebih lebar secara visual sesuai ukuran 80×64; periksa apakah siluetnya tetap nyaman pada tampilan kamera normal.
- Rumah warga dan pasar memiliki sprite lebih besar daripada tile dasar, tetapi footprint collision tetap mengikuti baseline. Pastikan secara visual tidak ada bagian gambar yang terasa mengganggu jalur di area desa.
- Lampu adalah dekorasi visual; tidak ada sistem pencahayaan atau radius cahaya baru yang ditambahkan.

## 8. Batas tahapan

Tahap 5.4 tidak mengubah desain Player, Mira, Bima, tanaman, atau lingkungan Tahap 5.3. Pemilik proyek menyetujui baseline Tahap 5.4 untuk diteruskan ke finalisasi Tahap 5.5. Catatan keterbatasan pengujian browser/perangkat tetap berlaku dan ditangani melalui checklist `TAHAP5_5_FINALIZATION_RELEASE.md`.
