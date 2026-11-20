# Tahap 4 — NPC & Village Life

## Tujuan
Membuat Mira dan Bima terasa lebih hidup melalui rutinitas yang mudah dipahami, percakapan kontekstual, dan hubungan sosial sederhana. Pertanian tetap menjadi aktivitas utama.

## Fitur
1. **Rutinitas terlihat oleh pemain** — NPCSystem yang telah memiliki jadwal dan navigasi tetap dipakai. Panel dialog kini menampilkan aktivitas NPC yang sedang berlangsung, misalnya menjaga pasar, beristirahat di sumur, atau membantu warga.
2. **Menyapa warga** — pemain dapat menyapa setiap NPC satu kali per hari permainan. Sapaan memberi +1 kedekatan.
3. **Memberi hadiah** — pemain dapat memberikan satu hasil panen kepada setiap NPC per hari. Hadiah dikonsumsi dari inventaris.
4. **Preferensi hadiah** — Mira menyukai Carrot dan Tomato; Bima menyukai Wheat dan Daisy. Hadiah favorit memberi +2 kedekatan, hadiah lain memberi +1.
5. **Tingkat hubungan** — status ditampilkan sebagai Kenalan (0–4), Teman (5–9), dan Sahabat dekat (10–20). Nilai maksimum 20.
6. **Penyimpanan kompatibel** — kedekatan dan hari terakhir menyapa/memberi hadiah ikut disimpan. Save sebelum Tahap 4 otomatis memperoleh nilai hubungan 0.
7. **Quest lama dipertahankan** — quest Mira dan Bima, pasar, sumur, sistem kebun, serta jadwal NPC tetap menggunakan sistem yang sama.

## Batasan
- Hanya Mira dan Bima yang memiliki sistem hubungan pada tahap ini.
- Tidak ada hadiah uang atau item balik agar ekonomi dan keseimbangan pertanian tidak berubah.
- Sapaan dan hadiah dibatasi sekali per NPC per hari permainan.
- NPC tetap mengikuti jalur/jadwal yang telah ada; tahap ini menampilkan aktivitas tersebut pada dialog, bukan mengganti sistem navigasinya.

## Checklist uji manual
- [ ] Temui Mira pada waktu berbeda dan pastikan aktivitas pada dialog berubah sesuai jadwal.
- [ ] Temui Bima pada waktu berbeda dan pastikan aktivitas pada dialog berubah sesuai jadwal.
- [ ] Sapa Mira dua kali pada hari yang sama; kedekatan hanya bertambah sekali.
- [ ] Sapa Bima dua kali pada hari yang sama; kedekatan hanya bertambah sekali.
- [ ] Berikan Carrot/Tomato ke Mira; kedekatan bertambah 2 dan item berkurang 1.
- [ ] Berikan Wheat/Daisy ke Bima; kedekatan bertambah 2 dan item berkurang 1.
- [ ] Pastikan hadiah kedua pada NPC yang sama di hari itu tidak dapat diberikan.
- [ ] Lewati hari dan pastikan batas sapaan/hadiah tersedia kembali.
- [ ] Simpan, muat ulang, dan pastikan nilai kedekatan serta batas harian tetap benar.
- [ ] Muat save dari Tahap 3 dan pastikan progres kebun, quest, rumah, alat, pasar, dan sumur tetap ada.
