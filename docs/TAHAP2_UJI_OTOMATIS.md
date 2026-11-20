# Catatan Uji Otomatis Tahap 2

Pemeriksaan yang dijalankan:

- `node --check` pada seluruh modul JavaScript.
- Simulasi Penyiram Lebar: delapan tanaman belum tersiram dalam area 3 × 3 tersiram; tanaman yang sudah tersiram tidak dihitung ulang; tanaman di luar area tidak berubah.
- Simulasi Penyiram dasar: hanya tanaman target yang tersiram.
- Simulasi Cangkul Baja: biaya energi mencangkul menjadi 1.
- Simulasi Cangkul dasar: biaya energi tetap 2.
- Simulasi kompatibilitas save lama: nilai upgrade alat default ke level 1.
- Simulasi save upgrade: level alat 2 dan energi rumah level 3 (120) dapat dipulihkan.
- Simulasi batas energi: energi dibatasi menjadi 100 pada rumah level 1 dan 110 pada rumah level 2.

Semua pemeriksaan otomatis di atas lulus. Belum dilakukan uji browser interaktif atau perangkat fisik.
