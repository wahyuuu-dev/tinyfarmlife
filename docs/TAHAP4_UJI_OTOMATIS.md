# Tahap 4 — Hasil Uji Otomatis

Pemeriksaan otomatis dilakukan pada modul hubungan dan sanitasi data save:

- Sapaan pertama pada hari yang sama menambah 1 poin; sapaan kedua tidak menambah poin.
- Hadiah favorit mengonsumsi 1 hasil panen dan menambah 2 poin.
- Hadiah nonfavorit mengonsumsi 1 hasil panen dan menambah 1 poin.
- Hadiah kedua pada NPC yang sama di hari yang sama ditolak.
- Poin hubungan dibatasi pada rentang 0–20.
- Data hubungan disimpan dan dipulihkan oleh sistem save.
- Save lama tanpa field `relationships` mendapat nilai awal 0.
- Pemeriksaan sintaks semua modul JavaScript dan integritas arsip ZIP.

Pengujian browser interaktif, localStorage nyata, serta perangkat desktop/ponsel belum dilakukan otomatis dan perlu diuji manual.
