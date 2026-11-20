# Tiny Farm Life — V1.4.0

**Tiny Farm Life** adalah game simulasi Cozy Farming & Village Development 2D top-down berbasis HTML, CSS, dan JavaScript. Game memakai gaya Cozy Pixel Art, dunia desa yang saling terhubung, serta progres yang berpusat pada pertanian dan pengembangan kebun.

## Fitur utama

- **Pertanian:** olah tanah, tanam, siram, panen, dan jual Carrot, Wheat, serta Tomato. Daisy berfungsi sebagai tanaman dekoratif untuk Harmony Garden.
- **Harmony Garden:** penempatan tanaman tertentu memberi bonus pertumbuhan dan nilai jual.
- **Pengembangan kebun:** perluas lahan, tingkatkan rumah dan alat, serta tempatkan dekorasi yang tersedia.
- **Desa terhubung:** Home Farm, Greenfield Village, Hutan Teduh, Tepi Danau, dan Gua Batu berada dalam satu dunia.
- **Kehidupan desa:** Mira dan Bima memiliki rutinitas, dialog, quest, dan interaksi sosial sederhana.
- **Satu sistem ekonomi:** koin dan inventaris dipakai bersama oleh seluruh lokasi.

## Toko Kebun dan Pasar Desa

Keduanya memiliki fungsi yang berbeda:

- **Toko Kebun** di dekat rumah digunakan untuk membeli benih, upgrade alat, upgrade rumah, perluasan lahan, dan dekorasi yang tersedia.
- **Pasar Desa** digunakan untuk menjual hasil panen. Transaksi tetap memakai koin dan inventaris yang sama dengan Toko Kebun.

Katalog barang dagangan warga dan sistem pesanan belum tersedia pada versi ini; fitur tersebut tidak ditambahkan pada finalisasi 5.5 agar ruang lingkup dan keseimbangan game tetap terjaga.

## Menjalankan game

Game menggunakan JavaScript ES Modules. Jalankan melalui server lokal, bukan dengan membuka `index.html` langsung.

Contoh menggunakan VS Code:

1. Buka folder proyek di VS Code.
2. Jalankan ekstensi Live Server.
3. Buka alamat lokal yang diberikan Live Server.

Alternatifnya, jalankan server sederhana dari folder proyek:

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000` di browser.

## Kontrol

| Aksi | Kontrol |
|---|---|
| Bergerak | WASD / tombol panah |
| Aksi / interaksi | Space / Enter / F |
| Buka tas | E |
| Ganti alat | Q |
| Pilih slot hotbar | Tombol angka |
| Jeda | P / Escape |
| HP | Joystick dan tombol sentuh saat landscape |

## Struktur proyek

- `index.html` — halaman game dan antarmuka.
- `css/style.css` — tampilan, panel, dan responsivitas.
- `js/main.js` — integrasi sistem dan game loop.
- `js/data/` — konfigurasi, item, dan data tanaman.
- `js/engine/` — renderer, input, dan game loop.
- `js/entities/` — karakter pemain.
- `js/systems/` — pertanian, ekonomi, inventaris, NPC, quest, Harmony, waktu, cuaca, dan save.
- `js/ui/` — HUD, toko, tas, dialog, efek, dan kontrol sentuh.
- `js/world/` — peta, kamera, sprite, collision, dan rendering objek.
- `docs/` — GDD, roadmap, panduan visual, dan catatan pengujian.

## Simpanan

Progres disimpan secara lokal melalui `localStorage` browser. Gunakan browser dan perangkat yang sama untuk melanjutkan simpanan. Sebelum menghapus data situs atau browser, buat cadangan bila ingin mempertahankan progres.

## Visual Asset Style Guide

`docs/VISUAL_ASSET_STYLE_GUIDE.md` adalah standar visual resmi proyek: Cozy Pixel Art, tile 16×16 px, palet warna terpusat, rendering nearest-neighbor, dan prinsip keterbacaan pada ukuran permainan.

## Status finalisasi V1.4.0

Paket ini meneruskan baseline Tahap 5.4, bukan proyek baru. Finalisasi 5.5 memisahkan fungsi Toko Kebun dan Pasar Desa, menyelaraskan informasi dalam game dan dokumentasi, serta menjalankan pemeriksaan sintaks, struktur, dan logika transaksi. Pengujian browser interaktif penuh dan pemeriksaan perangkat fisik masih harus diselesaikan sebelum rilis dinyatakan tervalidasi.

Lihat `docs/TAHAP5_5_FINALIZATION_RELEASE.md` untuk rincian perubahan, hasil pemeriksaan, dan checklist penerimaan manual.
