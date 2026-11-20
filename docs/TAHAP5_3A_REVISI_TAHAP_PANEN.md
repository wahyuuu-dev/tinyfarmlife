# Revisi Tahap 5.3A — Desain Lama pada Tahap Siap Panen

## Keputusan visual
Berdasarkan masukan pengguna, tampilan tanaman pada tahap siap panen dikembalikan ke desain lama agar tetap familiar dan sesuai selera pengguna.

- Carrot: stage 3 menggunakan kembali sprite lama.
- Wheat: stage 3 menggunakan kembali sprite lama.
- Tomato: stage 3 menggunakan kembali sprite lama.
- Daisy: tetap dekoratif; bukan tanaman panen dan tidak diubah.
- Stage 0–2 untuk tanaman panen tetap menggunakan desain Tahap 5.3.

## Batas perubahan
Perubahan hanya berada pada fungsi gambar tanaman di `js/world/Sprites.js`. Tidak diubah:
- ID tanaman dan data tanaman di `js/data/crops.js`;
- waktu pertumbuhan, harga, dan hasil panen;
- sistem menanam, menyiram, pertumbuhan, dan panen;
- Player, NPC, lingkungan, peta, penyimpanan, atau sistem permainan lainnya.

## Pemeriksaan
- Sintaks JavaScript diperiksa dengan Node.js.
- Perubahan dibatasi pada sprite stage 3 Carrot, Wheat, dan Tomato.
- File data tanaman dan sistem farming dibandingkan dengan versi Tahap 5.3 untuk memastikan tidak berubah.
- ZIP diuji integritasnya setelah dibuat.

Catatan: pemeriksaan ini bersifat statis/otomatis. Belum diklaim sebagai pengujian gameplay langsung di browser.
