# Checklist Pengujian Tiny Farm Life V1.2.0-dev

## Cuaca
- [ ] Cuaca hari pertama dimulai cerah.
- [ ] Pergantian hari dapat menghasilkan cerah, mendung, atau hujan.
- [ ] Indikator cuaca sesuai kondisi yang aktif.
- [ ] Efek hujan terlihat tanpa menutupi HUD atau kontrol.
- [ ] Efek mendung tidak membuat layar terlalu gelap.

## Dampak hujan
- [ ] Hujan menyiram tanaman yang sudah ditanam.
- [ ] Petak kosong tidak dihitung sebagai tanaman tersiram hujan.
- [ ] Tanaman yang ditanam pada hari hujan langsung mendapat air.
- [ ] Tanaman tersiram hujan tumbuh saat pergantian hari berikutnya.
- [ ] Hari cerah dan mendung tidak menyiram otomatis.
- [ ] Statistik hujan muncul pada ringkasan hari yang tepat.

## Kompatibilitas
- [ ] Save V1.0.0 dapat dimuat dan cuaca default menjadi cerah.
- [ ] Save V1.1.0 dapat dimuat dan statistik hujan default menjadi nol.
- [ ] Cuaca tidak berubah hanya karena halaman dimuat ulang.
- [ ] Sistem Harmony Garden tidak berubah.
- [ ] Mode bermain bebas: tidak ada target koin, batas Hari 20, atau layar menang/kalah.

## PC
- [ ] Chrome dan Edge: indikator serta efek cuaca tampil.
- [ ] Keyboard, mouse, toko, tas, dan pause tetap berfungsi.

## Mobile
- [ ] HP landscape: indikator cuaca terbaca.
- [ ] Efek hujan tidak mengganggu joystick dan tombol aksi.
- [ ] Rotasi layar tidak merusak tampilan.


## Uji responsif V1.2.0-dev.2
- [ ] Laptop 1366×768 dan 1920×1080: canvas proporsional dan tidak terpotong.
- [ ] HP landscape: canvas memenuhi area secara proporsional tanpa terlalu kecil.
- [ ] HP portrait: menu dapat diakses; saat mulai bermain, game dijeda dengan arahan rotasi.
- [ ] Joystick hanya mengambil area kiri-bawah; sentuhan di area lain tetap dapat memilih petak.
- [ ] Tombol TAS, ALAT, AKSI, dan JEDA mudah disentuh dan tidak saling menutupi.
- [ ] Panel toko/tas dapat discroll dan tombolnya tetap dapat disentuh.
- [ ] Rotasi landscape ↔ portrait tidak merusak ukuran canvas atau kontrol.
- [ ] Berpindah tab/aplikasi menyimpan progres dan menjeda permainan.
- [ ] Safe area perangkat dengan notch/home indicator tidak menutupi kontrol.


## Pengujian tambahan dev.3 — ekspansi dan dekorasi
- Buka toko dan pastikan bagian Pengembangan Kebun terlihat serta dapat discroll.
- Pastikan ekspansi hanya dapat dibeli sekali, harganya 300 koin, dan menambah 60 petak tanah.
- Coba mencangkul, menanam, menyiram, dan memanen di lahan tambahan.
- Beli pot bunga, lampu taman, dan orang-orangan sawah; pastikan dekorasi terlihat dan tidak menghalangi gerakan.
- Simpan, muat ulang, lalu lanjutkan; status ekspansi, dekorasi, dan petak tanaman harus tetap ada.
- Mulai Game Baru; lahan tambahan dan dekorasi harus kembali ke kondisi awal.
- Pastikan toko tetap nyaman digunakan pada layar laptop dan HP landscape.
