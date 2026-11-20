# TINY FARM LIFE V1.4.0 — Tahap 5.2A Palette Standardization

**Baseline:** V1.4.0 Tahap 4 + Visual Asset Style Guide v1.0  
**Status:** Implementasi palet selesai; belum melanjutkan desain karakter.

## Tujuan dan ruang lingkup
Menyeragamkan referensi warna pada `js/data/config.js`, `js/world/Sprites.js`, dan `js/world/World.js` tanpa mengubah bentuk aset, ukuran, koordinat, atau mekanisme permainan.

## Ringkasan perubahan
- `PAL` inti tetap menggunakan 11 warna resmi yang sama.
- Menambahkan token bernama untuk warna pendukung yang memang dipakai aset V1.4.0: rumput lush, tajuk pohon, air, tanah/jalan, petak kering/basah, batu/lumut, material bangunan, hasil panen/bunga, karakter, serta bayangan dan latar label.
- Semua literal warna HEX/RGBA di `Sprites.js` dan `World.js` dipindahkan ke referensi `PAL.*`. Tidak ada literal HEX/RGBA tersisa pada kedua file tersebut.
- Warna dengan nilai sama dan fungsi sama memakai token bersama, misalnya `soilWarmMid` dan `earthMid`. Warna yang berdekatan tetapi punya fungsi berbeda tetap dipisah, misalnya `stoneTile` dan `stoneObject`, untuk menjaga nilai visual lama.
- Tabel palet pendukung pada `docs/VISUAL_ASSET_STYLE_GUIDE.md` diperbarui agar nama token dan nilai warnanya terdokumentasi.

## File yang diubah
1. `js/data/config.js` — menambahkan token pendukung ke `PAL`; `CFG`, biaya, item awal, aturan, Harmony, dan versi tidak diubah.
2. `js/world/Sprites.js` — mengganti literal warna dengan token `PAL`; ukuran kanvas, koordinat `fillRect`, jumlah frame, algoritme bentuk, dan daftar sprite tidak diubah.
3. `js/world/World.js` — mengimpor `PAL` dan mengganti literal warna objek dunia dengan token; koordinat, urutan gambar, ukuran, dan jenis objek tidak diubah.
4. `docs/VISUAL_ASSET_STYLE_GUIDE.md` — memperbarui daftar palet pendukung.
5. `CHANGELOG.md` — mencatat pekerjaan Tahap 5.2A.
6. `docs/TAHAP5_2A_PALETTE_STANDARDIZATION.md` — laporan implementasi dan pengujian ini.

## Token yang ditambahkan

| Kelompok | Token |
|---|---|
| Vegetasi | `greenLush`, `greenLushDark`, `greenLushLight`, `canopyEdge`, `canopyMid`, `canopyBase`, `canopyHighlight`, `canopyAccent` |
| Air | `water`, `waterHighlight`, `wetSoilWater` |
| Tanah/jalan | `soilWarmMid`, `earthMid`, `pathBase`, `pathLight`, `soilDry`, `soilDryDark`, `soilWet`, `soilWetDark`, `soilWetLight` |
| Batu/gua | `stoneTile`, `stoneTileDark`, `stoneTileLight`, `mossGround`, `mossGroundDark`, `mossGroundLight`, `mossAccent`, `stoneObject`, `stoneObjectLight`, `stoneObjectHighlight`, `caveDark` |
| Bangunan | `roofShadow`, `roofHighlight`, `wallShadow`, `roofStone`, `houseDetail`, `houseGreenTrim`, `terracotta` |
| Panen/bunga | `tomato`, `carrotShadow`, `harvestGold`, `harvestGoldLight`, `wheatYoung`, `flowerWhite`, `flowerYellow`, `flowerPink`, `flowerAccent`, `labelText`, `lampGlow` |
| Karakter | `skin`, `miraHair`, `bimaHair`, `miraClothes`, `bimaClothes`, `hatHighlight` |
| Efek/label | `shadowSoft`, `shadowGround`, `shadowPlayer`, `labelBackground` |

Total token PAL: 70 (11 inti dan 59 token pendukung).

## HEX/RGBA yang masih dipertahankan
Nilai warna lama dipertahankan persis di token, bukan dihapus atau diganti secara visual. Contohnya: `#4F9FD6` untuk air, `#173D2C` untuk tepi tajuk pohon, `#52331C` untuk tanah basah, `#C25E2E` untuk bayangan atap, `#D94A3A` untuk tomat, serta warna kulit, rambut, pakaian NPC, batu, dan efek. Nilai `rgba(...)` untuk bayangan dan label juga dipertahankan sebagai token bernama karena transparansi tersebut memiliki fungsi visual tersendiri.

## Batas perubahan yang dijaga
- Resolusi logis tetap 480 × 270; tile tetap 16 × 16.
- Ukuran sprite, bentuk dan koordinat gambar tidak diubah.
- Tidak ada perubahan pada collision, titik interaksi, ID item/NPC, pertanian, NPC, ekonomi, atau save/load.
- `Renderer.js` tidak diubah; `imageSmoothingEnabled = false` tetap aktif.
- Tidak ada migrasi spritesheet eksternal dan tidak ada aset yang dihapus.

## Hasil pengujian
- Pemeriksaan sintaks JavaScript seluruh modul: lulus.
- Pemeriksaan referensi `PAL`: 70 token direferensikan dan seluruhnya terdefinisi.
- Literal warna langsung pada `Sprites.js` dan `World.js`: 0 HEX/RGBA tersisa.
- Smoke test pembuatan seluruh sprite Canvas dan pemanggilan fungsi gambar: lulus menggunakan Canvas stub untuk memverifikasi jalur gambar dan dimensi; bukan pengganti pengujian browser.
- Konfigurasi 480 × 270, tile 16, ukuran pohon, ukuran rumah, dan ukuran sprite dicek tidak berubah.
- File `Renderer.js` identik dengan baseline dan aturan pixelated scaling tetap ada.
- ZIP diperiksa integritasnya.

## Screenshot dan batas verifikasi
Screenshot sebelum/sesudah dari browser tidak tersedia pada sesi ini. Karena seluruh nilai warna lama dipertahankan persis dan hanya literal diganti dengan token yang bernilai sama, tidak ada perubahan warna yang dimaksudkan. Pengujian visual akhir tetap perlu dilakukan di browser/perangkat untuk memastikan hasil render nyata.

## Status
**Tahap 5.2A — Palette Standardization: selesai secara source dan pemeriksaan otomatis.**  
Tahap desain/perbaikan karakter belum dimulai.
