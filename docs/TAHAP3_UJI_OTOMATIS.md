# Catatan Uji Otomatis — Tahap 3

Checklist pengujian yang dapat diulang:

- [x] Semua modul JavaScript lolos `node --check`.
- [x] Simulasi pembelian benih dan penjualan panen melalui modul Economy/Inventory bersama.
- [x] Data save lama tanpa `wellUsedDay` dinormalisasi menjadi `0`.
- [x] `wellUsedDay` hanya menerima bilangan bulat dari `0` sampai hari saat ini.
- [x] Panel transaksi memiliki judul dinamis untuk Toko Kebun dan Pasar Desa.
- [x] Pasar menggunakan instance Economy/Inventory yang sama; tidak ada duplikasi stok atau saldo.
- [ ] Uji langsung mendekati kios pasar, buka transaksi, beli benih, jual panen.
- [ ] Uji sumur memulihkan maksimal 15 energi, tidak melewati maxEnergy, dan menolak penggunaan kedua pada hari yang sama.
- [ ] Uji penggunaan sumur tetap tercatat setelah save/load dan tersedia kembali pada hari berikutnya.
- [ ] Uji desktop dan layar sentuh.

Catatan: checklist browser dan perangkat belum dinyatakan lulus karena belum dijalankan pada browser pengguna.
