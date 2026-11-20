# TINY FARM LIFE
## Visual Asset Style Guide — Panduan Resmi Aset Visual

**Dokumen:** TFL-VASG-001  
**Versi panduan:** 1.0  
**Berlaku mulai:** V1.4.0  
**Status:** Standar visual proyek  
**Cakupan:** World art, karakter, tanaman, objek, efek, ikon, dan antarmuka

---

## 1. Tujuan dan identitas visual

Tiny Farm Life adalah game **Cozy Farming & Life Simulation** dengan sudut pandang top-down 2D. Identitas visualnya adalah **Cozy Pixel Art**: hangat, sederhana, ramah, mudah dibaca, dan terasa hidup tanpa dipenuhi detail yang mengganggu.

Visual harus mendukung pengalaman bermain yang santai. Pemain perlu dapat mengenali tanah yang bisa dicangkul, tanaman yang siap dipanen, bangunan yang bisa dimasuki atau digunakan, serta NPC yang bisa diajak bicara hanya dengan melihat bentuk dan warnanya.

**Kata kunci:** cozy, hangat, alami, cerah-terkendali, pixelated, sederhana, terbaca, konsisten.

### Prinsip utama
1. **Pixel first** — bentuk dibangun dari piksel yang disengaja, bukan ilustrasi halus yang diperkecil.
2. **Readable first** — siluet dan fungsi objek harus terbaca pada ukuran permainan.
3. **Warm and calm** — warna tanah, kayu, krem, dan hijau menjadi dasar suasana.
4. **Consistent scale** — aset mengikuti grid dan proporsi dunia yang sudah ada.
5. **Gameplay clarity** — dekorasi tidak boleh menyamarkan objek interaktif atau petak pertanian.
6. **Small details, not noise** — detail kecil hanya ditambahkan jika membantu identitas atau suasana.

## 2. Kanvas, grid, dan skala

| Elemen | Standar proyek saat ini |
|---|---:|
| Resolusi logis canvas | 480 × 270 px |
| Ukuran tile dasar | 16 × 16 px |
| Ukuran peta | 96 × 64 tile |
| Karakter pemain | 16 × 16 px |
| Pohon | 32 × 40 px |
| Rumah pemain | 48 × 48 px (level 1), 64 × 56 px (level 2), 80 × 64 px (level 3) |
| Bangunan kios | 32 × 32 px |

### Aturan grid
- Tile tanah, rumput, air, pagar, dan petak olahan menggunakan kanvas dasar **16 × 16 px**.
- Objek yang lebih besar boleh memakai kelipatan atau ukuran khusus, tetapi titik pijak/collision harus tetap sejajar dengan grid dunia.
- Karakter dan NPC harus memiliki titik pijak yang konsisten agar tidak tampak melayang atau tenggelam.
- Ukuran kanvas logis tidak diubah hanya untuk memperbesar detail aset. Jika aset perlu lebih detail, detail ditambahkan di dalam kanvas yang sesuai.
- Perbesar tampilan dengan nearest-neighbor/pixelated scaling. Jangan mengaktifkan image smoothing untuk sprite pixel art.

## 3. Palet warna resmi

### 3.1 Palet inti aset dunia
Palet berikut berasal dari `js/data/config.js` (`PAL`) dan menjadi sumber acuan utama untuk **aset dunia baru**.

| Nama token | HEX | Penggunaan |
|---|---|---|
| `green` | `#5AA84A` | Rumput dan vegetasi utama |
| `greenDark` | `#3D7A38` | Bayangan daun, batang hijau, aksen gelap vegetasi |
| `greenLight` | `#7CC45C` | Sorotan daun dan rumput |
| `brown` | `#7A4E2D` | Kayu, tanah, furnitur, detail bangunan |
| `brownDark` | `#5A3820` | Outline dan bayangan kayu |
| `brownLight` | `#A06C40` | Sorotan kayu dan permukaan hangat |
| `cream` | `#F6ECD0` | Kain, dinding terang, highlight, elemen lembut |
| `creamDark` | `#E3D3A8` | Bayangan krem, tanah kering terang |
| `orange` | `#E8873A` | Aksen hangat, atap, tombol/penanda penting |
| `sky` | `#6CB8E6` | Jendela, langit, aksen air/biru |
| `ink` | `#2B2118` | Outline dan detail paling gelap |

### 3.2 Palet pendukung bernama (`PAL`)
Warna pendukung berikut tetap mempertahankan nilai warna lama dari aset V1.4.0. Nilainya kini didefinisikan sebagai token bernama di `js/data/config.js`, sehingga fungsi warna dapat dikenali dan digunakan ulang tanpa mengubah tampilan aset.

| Kelompok | Token `PAL` | HEX / nilai | Fungsi |
|---|---|---|---|
| Rumput lush | `greenLush`, `greenLushDark`, `greenLushLight` | `#68BE50`, `#4A9A40`, `#8AD868` | Varian rumput Harmony |
| Tajuk pohon | `canopyEdge`, `canopyMid`, `canopyBase`, `canopyHighlight`, `canopyAccent` | `#173D2C`, `#235A3C`, `#2E7048`, `#3F8A58`, `#56A46C` | Lapisan tajuk dan sorotan daun |
| Air | `water`, `waterHighlight`, `wetSoilWater` | `#4F9FD6`, `#8FD0F2`, `#4F7FA6` | Dasar, riak, dan pantulan air pada tanah basah |
| Tanah/jalan | `soilWarmMid`, `pathBase`, `earthMid`, `pathLight` | `#8A5A34`, `#CFAE72`, `#B8955A`, `#E0C590` | Tanah jalur, dasar jalan, tepi bumi, dan highlight |
| Petak kering/basah | `soilDry`, `soilDryDark`, `soilWet`, `soilWetDark`, `soilWetLight` | `#6E4426`, `#4F2F18`, `#52331C`, `#3A2312`, `#6B4A30` | Dasar dan alur petak pertanian |
| Batu/lumut | `stoneTile`, `stoneTileDark`, `stoneTileLight`, `mossGround`, `mossGroundDark`, `mossGroundLight`, `mossAccent` | `#777D7B`, `#5D6463`, `#AEB5AD`, `#687B55`, `#4A6242`, `#91A66C`, `#78945B` | Tile batu dan variasi lumut |
| Batu objek/gua | `stoneObject`, `stoneObjectLight`, `stoneObjectHighlight`, `caveDark` | `#777B79`, `#AEB3A8`, `#D2D0BD`, `#292D30` | Batu kecil dan interior pintu gua |
| Bangunan | `roofShadow`, `roofHighlight`, `wallShadow`, `roofStone`, `houseDetail`, `houseGreenTrim`, `terracotta` | `#C25E2E`, `#D9783A`, `#A89C86`, `#8A8F98`, `#E7D8B5`, `#6B9D55`, `#A85C32` | Atap, dinding, lis, dan material bangunan |
| Hasil panen/bunga | `tomato`, `carrotShadow`, `harvestGold`, `harvestGoldLight`, `wheatYoung`, `flowerWhite`, `flowerYellow`, `flowerPink`, `flowerAccent`, `labelText`, `lampGlow` | `#D94A3A`, `#C96A24`, `#D9B84A`, `#F0D070`, `#9CCF5A`, `#FFFDF5`, `#F2C230`, `#F08AA8`, `#D94A8C`, `#FFFDF5`, `#FFF2B0` | Penanda hasil panen, bunga, dan cahaya lampu |
| Karakter | `skin`, `miraHair`, `bimaHair`, `miraClothes`, `bimaClothes`, `hatHighlight` | `#F1C9A0`, `#6A3D28`, `#3D2B20`, `#D94A8C`, `#3D7A9A`, `#F0A860` | Warna identitas karakter dan pakaian |
| Bayangan/label | `shadowSoft`, `shadowGround`, `shadowPlayer`, `labelBackground` | `rgba(0,0,0,.2)`, `rgba(0,0,0,.18)`, `rgba(0,0,0,.22)`, `rgba(43,33,24,.88)` | Bayangan objek dan latar label dunia |

Token yang memiliki nilai HEX sama digunakan bersama jika fungsinya sama (contohnya `soilWarmMid` untuk warna tanah tengah). Nilai yang mirip tetapi memiliki fungsi berbeda, seperti batu tile dan batu objek, tetap dipisahkan agar perubahan visual dapat dikendalikan secara eksplisit.

### 3.3 Aturan penggunaan warna
- Utamakan 3–5 warna utama per aset kecil: dasar, bayangan, sorotan, aksen, dan outline bila diperlukan.
- Warna paling gelap digunakan untuk outline, celah, atau bayangan yang benar-benar penting; hindari outline hitam pekat di semua sisi jika membuat aset terasa terlalu keras.
- Sorotan harus berasal dari arah cahaya yang konsisten. Untuk aset dunia saat ini, gunakan pencahayaan atas-kiri sebagai default visual.
- Warna aksen seperti oranye, merah tomat, kuning gandum, dan biru air digunakan secukupnya agar objek penting mudah dikenali.
- Hindari gradasi halus, transparansi berlebihan, neon, dan warna sangat jenuh yang tidak sesuai dengan suasana cozy.
- Jangan memperkenalkan warna baru untuk satu aset tanpa alasan fungsi atau lingkungan. Jika warna baru diperlukan, dokumentasikan di bagian palet pendukung.

### 3.4 Palet antarmuka
UI HTML/CSS menggunakan token CSS dan telah memiliki lapisan penyegaran visual tersendiri. Warna CSS boleh sedikit berbeda dari warna sprite, tetapi harus tetap berada dalam keluarga hijau–cokelat–krem–oranye.

**Aturan:** `PAL` adalah acuan warna sprite/world art. Token CSS adalah acuan tampilan panel dan kontrol. Jangan menyalin warna CSS UI ke sprite secara otomatis; cocokkan dengan palet inti aset dunia.

## 4. Bentuk, outline, dan tekstur

- Gunakan siluet sederhana dan mudah dikenali pada ukuran asli.
- Outline boleh berupa warna gelap dari keluarga warna objek, bukan selalu hitam.
- Hindari garis diagonal antialias yang tampak blur. Bentuk diagonal dibuat dengan tangga piksel yang disengaja.
- Tekstur tanah, rumput, batu, dan daun harus bervariasi secara terkontrol. Hindari pola berulang yang terlalu jelas atau noise acak berlebihan.
- Sisakan area warna datar agar objek tetap terbaca saat dilihat dari jarak permainan.
- Bayangan objek di tanah dibuat sederhana, pendek, dan konsisten; bayangan tidak boleh menyerupai objek interaktif lain.

## 5. Standar aset per kategori

### 5.1 Tile dan lingkungan
- Tile dasar mengikuti ukuran 16 × 16 px.
- Rumput memakai dasar hijau dengan variasi bintik/serat yang ringan.
- Tanah, pasir, dan batu memiliki tekstur berbeda yang langsung terbaca tanpa perlu zoom.
- Air memakai warna dasar biru dengan riak terang pendek. Animasi air harus halus dan tidak terlalu ramai.
- Transisi antarjenis tanah harus terasa alami. Jangan membuat batas keras yang tidak punya alasan lingkungan.
- Area pertanian harus tetap memiliki kontras cukup antara rumput, tanah yang dicangkul, tanah basah, dan tanaman.

### 5.2 Tanaman
Tanaman utama saat ini: **Carrot, Wheat, Tomato, dan Daisy**.

- Semua tanaman mengikuti tile 16 × 16 px.
- Tahap visual wajib konsisten: benih → tunas → tanaman muda → siap panen.
- Setiap tahap harus berbeda jelas dalam siluet atau volume, bukan hanya beda warna tipis.
- Tanaman siap panen perlu memiliki aksen hasil yang mudah dikenali.
- Daisy adalah tanaman dekoratif dan dapat menjadi elemen visual pendukung Harmony Garden.
- Daun tidak boleh menutupi seluruh petak hingga batas lahan sulit dikenali.

### 5.3 Pohon, bunga, dan dekorasi alam
- Pohon standar saat ini memakai kanvas 32 × 40 px dengan batang dan tajuk yang terpisah secara visual.
- Tajuk pohon menggunakan beberapa tingkat hijau gelap–sedang–terang; tepi boleh lebih gelap untuk memberi volume.
- Bunga liar menggunakan aksen warna terbatas dan ukuran kecil agar tidak bersaing dengan tanaman yang dapat dipanen.
- Dekorasi tidak boleh menghalangi jalur, NPC, penanda interaksi, atau petak pertanian.

### 5.4 Karakter dan NPC
- Pemain saat ini memakai sprite 16 × 16 px dengan arah: bawah, atas, kiri, kanan.
- Animasi jalan menggunakan variasi langkah sederhana; gerak idle tetap tenang.
- Setiap karakter harus memiliki siluet, warna pakaian, dan/atau rambut yang cukup berbeda.
- Mira dan Bima harus tetap mudah dibedakan dalam tampilan normal maupun saat berdiri di antara dekorasi desa.
- Ekspresi dan detail wajah dibuat minimal tetapi terbaca pada resolusi kecil.
- Jangan mengubah titik pijak karakter ketika membuat variasi arah atau frame animasi.

### 5.5 Bangunan dan objek interaktif
- Rumah pemain memiliki tiga ukuran visual sesuai level upgrade yang sudah ada.
- Kios, pasar, sumur, papan petunjuk, pagar, dan objek interaktif perlu punya siluet unik.
- Objek interaktif harus kontras dengan latar dan memiliki ruang pendekatan yang cukup.
- Variasi bangunan boleh menambah detail level, tetapi bentuk dasar dan palet harus tetap satu keluarga.
- Hindari detail dekoratif kecil yang hilang pada resolusi 480 × 270.

### 5.6 Efek visual
- Efek panen, penyiraman, pertumbuhan, debu, kilau, dan kupu-kupu harus singkat dan lembut.
- Efek tidak boleh menutupi karakter, tanaman, atau indikator aksi.
- Partikel memakai warna dari palet aset atau aksen yang sudah terdokumentasi.
- Hindari flash putih penuh, shake berlebihan, atau partikel padat yang mengganggu suasana santai.

## 6. Animasi dan timing

- Animasi pixel art menggunakan frame diskrit, bukan interpolasi blur.
- Gerakan berjalan harus mempertahankan posisi kaki dan titik pijak yang konsisten.
- Animasi lingkungan (air, bunga, kupu-kupu, daun) dibuat lebih lambat dan tidak wajib terus bergerak jika tidak terlihat pemain.
- Animasi aksi harus memberi umpan balik yang jelas: mulai, kontak, lalu selesai.
- Hindari animasi loop yang terlalu cepat. Gerak kecil dan ritmis lebih sesuai daripada gerak yang agresif.
- Saat membuat sprite sheet, semua frame dalam satu animasi harus memiliki ukuran sel sama dan posisi karakter/objek konsisten.

## 7. UI, ikon, dan tipografi

- UI saat ini memakai keluarga monospace (`Courier New`) untuk mempertahankan karakter pixel/retro.
- Panel memakai warna krem, outline cokelat gelap, dan aksen hijau/oranye.
- Tombol aksi utama harus terlihat jelas; status disabled harus berbeda tanpa mengandalkan warna saja.
- Ikon kecil harus memakai siluet sederhana, idealnya terbaca dalam kotak 16 × 16 atau 24 × 24 px.
- Gunakan jarak, ukuran teks, dan kontras yang cukup untuk desktop serta layar sentuh.
- UI boleh memakai radius/bayangan ringan sesuai skin saat ini, tetapi hindari gaya glossy modern yang bertabrakan dengan dunia pixel art.
- Jangan gunakan lebih dari dua tingkat penekanan visual utama dalam satu panel.

## 8. Aksesibilitas dan keterbacaan

- Informasi penting tidak boleh disampaikan hanya dengan warna. Gunakan bentuk, ikon, teks, atau pola sebagai penanda tambahan.
- Pastikan teks panel memiliki kontras memadai terhadap latar.
- Jangan gunakan detail dekoratif yang membuat petak tanam atau status tanaman sulit dibaca.
- Tombol sentuh perlu memiliki area target yang nyaman dan tidak saling bertumpuk.
- Hormati `prefers-reduced-motion` untuk animasi UI dan hindari efek berkedip cepat.

## 9. Aturan teknis implementasi

- Sprite dunia saat ini dibuat melalui Canvas di `js/world/Sprites.js`; aset baru harus mengikuti pendekatan dan ukuran yang sudah dipakai, kecuali ada keputusan teknis terpisah.
- Palet inti dan token warna pendukung berada di `js/data/config.js` sebagai `PAL`; aset dunia harus merujuk token tersebut.
- Rendering menggunakan `imageSmoothingEnabled = false` di `js/engine/Renderer.js`.
- Logika peta dan gambar objek berada di `js/world/World.js`.
- Tampilan panel, menu, dan kontrol berada di `css/style.css` serta modul `js/ui/`.
- Jangan mengubah ukuran tile, resolusi logis, collision, atau titik interaksi hanya demi membuat aset terlihat lebih besar.
- Setiap aset baru perlu diuji pada skala permainan sebenarnya, bukan hanya saat diperbesar di editor.

### Penamaan dan organisasi
- Gunakan nama file/fungsi yang deskriptif dan konsisten dengan kategori aset.
- Gunakan ID stabil untuk aset yang dirujuk oleh sistem game.
- Jangan mengganti ID tanaman, item, NPC, atau objek yang sudah dipakai save/gameplay tanpa migrasi yang disengaja.
- Jika aset memiliki beberapa state, gunakan urutan state yang eksplisit dan konsisten.

## 10. Do & Don't

| Do | Don't |
|---|---|
| Gunakan grid 16 px sebagai dasar | Menggambar aset dengan skala acak |
| Gunakan palet inti dan warna pendukung terdokumentasi | Menambahkan warna neon tanpa alasan |
| Buat siluet jelas pada ukuran asli | Mengandalkan detail mikro |
| Gunakan tekstur ringan dan terarah | Mengisi seluruh tile dengan noise |
| Pertahankan arah cahaya dan bayangan | Membuat sumber cahaya berbeda-beda tanpa alasan |
| Jaga tanaman dan petak tetap terbaca | Membuat dekorasi menutupi gameplay |
| Gunakan nearest-neighbor scaling | Menghaluskan pixel art dengan blur |
| Uji pada canvas 480 × 270 | Menilai aset hanya dari tampilan zoom besar |

## 11. Checklist penerimaan aset baru

Sebuah aset dinyatakan sesuai panduan jika:

- [ ] Ukuran dan titik pijaknya sesuai grid dunia.
- [ ] Siluet terbaca pada ukuran permainan sebenarnya.
- [ ] Warna mengikuti palet inti atau warna pendukung yang terdokumentasi.
- [ ] Outline, bayangan, dan arah cahaya konsisten.
- [ ] Tekstur tidak terlalu ramai dan tidak membentuk pola repetitif yang mengganggu.
- [ ] Aset tidak menutupi informasi atau objek gameplay penting.
- [ ] Animasi (jika ada) stabil, tidak blur, dan tidak terlalu cepat.
- [ ] Aset tampil baik pada resolusi logis 480 × 270.
- [ ] Collision, interaksi, dan ID gameplay tidak berubah tanpa alasan.
- [ ] Tampilan sudah diperiksa di dalam game, bukan hanya secara terpisah.

## 12. Pengelolaan panduan

Panduan ini menjadi acuan untuk seluruh aset visual baru Tiny Farm Life mulai V1.4.0. Perubahan palet inti, ukuran grid, resolusi logis, gaya outline, atau arah seni harus dicatat sebagai revisi dokumen.

**Revisi berikutnya** diperlukan jika proyek secara resmi mengubah arah seni, mengganti resolusi/grid, atau memindahkan pipeline aset dari Canvas-generated sprites ke spritesheet eksternal.

---

## Lampiran A — Sumber acuan proyek

Panduan ini disusun dengan memeriksa source V1.4.0 Tahap 4, khususnya:

- `js/data/config.js` — resolusi, ukuran tile, dan palet inti `PAL`.
- `js/world/Sprites.js` — tile, air, pohon, rumah, pagar, petak olahan, tanaman, pemain, dan bunga liar.
- `js/world/World.js` — rendering objek dunia, bangunan desa, NPC, dan dekorasi.
- `js/engine/Renderer.js` — scaling canvas dan `imageSmoothingEnabled = false`.
- `css/style.css` — tipografi, panel, tombol, warna UI, dan aturan responsif.
- `docs/GDD.md` — genre, gameplay santai, tanaman, waktu, dan suasana dunia.

**Catatan:** Dokumen ini menetapkan standar untuk pekerjaan visual berikutnya. Dokumen ini tidak mengklaim bahwa seluruh aset V1.4.0 saat ini sudah sepenuhnya seragam; aset lama dapat diselaraskan secara bertahap tanpa menghapus fitur atau mengubah gameplay.
