# Tahap 2 — Farm Development

## Tujuan
Membuat perkembangan kebun dan rumah memberi manfaat gameplay yang nyata, dengan memanfaatkan sistem toko, upgrade rumah, lahan, dan dekorasi yang sudah ada. Tidak membuat ulang sistem farming.

## Fitur yang dikerjakan

### 1. Cangkul Baja
- Pembelian satu kali melalui tab Pengembangan rumah & kebun.
- Harga: 180 koin.
- Biaya energi mencangkul turun dari 2 menjadi 1.
- Biaya aksi lain tidak berubah.

### 2. Penyiram Lebar
- Pembelian satu kali dengan harga 220 koin.
- Saat digunakan pada tanaman yang belum disiram, menyiram tanaman belum tersiram dalam area 3 × 3 dengan tile target sebagai pusat.
- Satu aksi tetap menggunakan 1 energi.
- Tanaman yang sudah disiram tidak dihitung ulang. Statistik harian mencatat jumlah tanaman yang benar-benar disiram.

### 3. Upgrade rumah memberi manfaat
- Level 1: maksimum 100 energi.
- Level 2: maksimum 110 energi (biaya upgrade lama tetap 500 koin).
- Level 3: maksimum 120 energi (biaya upgrade lama tetap 1.200 koin).
- Energi dipulihkan sampai kapasitas rumah saat pemain tidur.

### 4. Fitur lama dipertahankan
- Perluasan lahan 60 petak tetap 300 koin.
- Dekorasi kebun dan batas slot tidak diubah.
- Sprite rumah level 1–3 tetap digunakan.
- Tidak ada perubahan durasi pertumbuhan, harga tanaman, Harmony Garden, atau siklus cuaca.

## Save compatibility
- Save tetap menggunakan `Save.VERSION = 1`.
- Save lama tanpa data `toolUpgrades` dimuat dengan Cangkul dan Penyiram level 1.
- Level upgrade alat dan rumah disimpan dan dipulihkan.
- Energi maksimum ditentukan oleh level rumah; nilai energi yang terlalu tinggi dibatasi saat validasi.

## Pengujian otomatis
- Pemeriksaan sintaks semua modul JavaScript.
- Cangkul dasar dan Cangkul Baja menghasilkan biaya energi yang sesuai.
- Penyiram dasar hanya menyiram tile target.
- Penyiram Lebar menyiram tanaman belum tersiram dalam radius 1 tile (area 3 × 3).
- Tanaman yang sudah disiram tidak dihitung ulang.
- Save lama mendapat default upgrade level 1.
- Save dengan upgrade level 2 memulihkan level alat dan kapasitas energi rumah.
- Nilai energi pada save dibatasi sesuai level rumah.

## Checklist manual
- [ ] Buka toko dan pastikan dua upgrade alat muncul.
- [ ] Beli Cangkul Baja; cangkul beberapa petak dan bandingkan pengurangan energi.
- [ ] Beli Penyiram Lebar; tanam beberapa tanaman berdekatan, lalu siram dari tengah dan periksa area 3 × 3.
- [ ] Pastikan tanaman di luar area tidak ikut tersiram.
- [ ] Upgrade rumah ke level 2 dan 3; periksa kapasitas energi di HUD.
- [ ] Tidur dan pastikan energi pulih sesuai kapasitas rumah.
- [ ] Simpan/muat permainan; pastikan upgrade alat dan rumah tetap ada.
- [ ] Muat save V1.4.0 lama; pastikan upgrade alat dimulai pada level dasar.
- [ ] Mulai game baru; pastikan rumah dan alat kembali ke level awal.
- [ ] Periksa desktop dan mobile melalui browser.

## Batas verifikasi
Pemeriksaan sintaks dan simulasi modul dilakukan dengan Node.js. Belum dilakukan pengujian browser interaktif, localStorage browser nyata, performa perangkat, atau kontrol sentuh fisik.
