import { PAL } from '../data/config.js';

function rng(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function mk(w, h, fn) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  fn(c.getContext('2d')); return c;
}
const R = (g, col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x, y, w, h); };

function grass(v, lush = false) {
  const base = lush ? PAL.greenLush : PAL.green;
  const dark = lush ? PAL.greenLushDark : PAL.greenDark;
  const light = lush ? PAL.greenLushLight : PAL.greenLight;
  return mk(16, 16, (g) => {
    R(g, base, 0, 0, 16, 16);
    const r = rng(v + (lush ? 101 : 11));
    // Tekstur rumput berupa kelompok pendek, menyisakan bidang datar agar tile tenang.
    for (let i = 0; i < 7; i++) {
      const x = 1 + Math.floor(r() * 14), y = 2 + Math.floor(r() * 12);
      R(g, dark, x, y, 1, 1 + (i % 3 === 0 ? 1 : 0));
    }
    for (let i = 0; i < 6; i++) {
      const x = 1 + Math.floor(r() * 14), y = 1 + Math.floor(r() * 14);
      R(g, light, x, y, 1 + (i % 3 === 0 ? 1 : 0), 1);
    }
    // Varian ketiga memiliki satu aksen semanggi kecil, bukan bunga yang bersaing dengan tanaman.
    if (v === 2) {
      R(g, PAL.greenDark, 4, 5, 1, 3); R(g, PAL.greenLight, 3, 4, 2, 1);
      R(g, PAL.greenLight, 5, 5, 2, 1); R(g, PAL.green, 4, 6, 2, 1);
    }
  });
}
function speckled(base, dark, light, seed) {
  return mk(16, 16, (g) => {
    R(g, base, 0, 0, 16, 16);
    const r = rng(seed);
    for (let i = 0; i < 8; i++) {
      const x = 1 + Math.floor(r() * 13), y = 1 + Math.floor(r() * 14);
      R(g, dark, x, y, 1 + (i % 3 === 0 ? 1 : 0), 1);
    }
    for (let i = 0; i < 7; i++) {
      const x = 1 + Math.floor(r() * 14), y = 1 + Math.floor(r() * 14);
      R(g, light, x, y, 1, 1);
    }
  });
}
function pathTile(seed) {
  return mk(16, 16, (g) => {
    R(g, PAL.pathBase, 0, 0, 16, 16);
    const r = rng(seed);
    // Butiran kecil dan tidak berulang; jalur tetap memiliki bidang warna terbuka.
    for (let i = 0; i < 7; i++) {
      const x = 1 + Math.floor(r() * 14), y = 1 + Math.floor(r() * 14);
      R(g, PAL.earthMid, x, y, 1 + (i % 3 === 0 ? 1 : 0), 1);
    }
    for (let i = 0; i < 5; i++) {
      const x = 1 + Math.floor(r() * 14), y = 1 + Math.floor(r() * 14);
      R(g, PAL.pathLight, x, y, 1, 1);
    }
    R(g, PAL.earthMid, 2, 3, 2, 1); R(g, PAL.pathLight, 11, 11, 2, 1);
  });
}
function pathEdge(mask, seed) {
  return mk(16, 16, (g) => {
    const r = rng(seed + mask * 19);
    // Sedikit rumput yang menyentuh tepi jalur menciptakan transisi tanpa mengubah tile ID.
    for (let side = 0; side < 4; side++) {
      if (!(mask & (1 << side))) continue;
      for (let i = 0; i < 3; i++) {
        const p = 2 + Math.floor(r() * 12);
        if (side === 0) R(g, i === 0 ? PAL.greenDark : PAL.green, p, Math.floor(r() * 2), 1, 1);
        if (side === 1) R(g, i === 0 ? PAL.greenDark : PAL.green, 14 + Math.floor(r() * 2), p, 1, 1);
        if (side === 2) R(g, i === 0 ? PAL.greenDark : PAL.green, p, 14 + Math.floor(r() * 2), 1, 1);
        if (side === 3) R(g, i === 0 ? PAL.greenDark : PAL.green, Math.floor(r() * 2), p, 1, 1);
      }
    }
  });
}
function water(f) {
  return mk(16, 16, (g) => {
    R(g, PAL.water, 0, 0, 16, 16);
    // Lapisan air gelap di sisi bawah memberi kedalaman; riak terang bergerak perlahan.
    R(g, PAL.wetSoilWater, 0, 13, 16, 3);
    R(g, PAL.water, 0, 12, 16, 1);
    for (let k = 0; k < 3; k++) {
      const x = (k * 6 + f * 3 + 2) % 13;
      const y = (k * 5 + 3) % 12;
      R(g, PAL.waterHighlight, x, y, 2 + (k === 1 ? 1 : 0), 1);
      if (k === 0) R(g, PAL.sky, x + 1, y + 1, 2, 1);
    }
    R(g, PAL.wetSoilWater, 2, 5, 1, 1); R(g, PAL.wetSoilWater, 12, 9, 1, 1);
  });
}
function tree() {
  return mk(32, 40, (g) => {
    R(g, PAL.shadowSoft, 6, 36, 20, 3);
    // Batang terlihat di bawah tajuk, dengan sisi kanan lebih gelap.
    R(g, PAL.brownDark, 13, 24, 7, 14); R(g, PAL.brown, 13, 24, 4, 13);
    R(g, PAL.brownLight, 14, 26, 1, 8);
    // Tajuk bertingkat: outline gelap, massa tengah, lalu sorotan kiri-atas.
    const clusters = [
      [3, 9, 26, 18], [6, 4, 20, 17], [1, 14, 13, 13], [17, 13, 14, 13], [9, 1, 15, 14]
    ];
    for (const [x, y, w, h] of clusters) R(g, PAL.canopyEdge, x, y, w, h);
    R(g, PAL.canopyMid, 4, 8, 23, 18); R(g, PAL.canopyBase, 6, 5, 20, 18);
    R(g, PAL.canopyBase, 2, 14, 14, 12); R(g, PAL.canopyMid, 18, 14, 12, 11);
    R(g, PAL.canopyHighlight, 7, 5, 12, 7); R(g, PAL.canopyHighlight, 4, 10, 6, 5);
    R(g, PAL.canopyAccent, 12, 3, 6, 3); R(g, PAL.canopyAccent, 20, 9, 4, 3);
    R(g, PAL.canopyEdge, 4, 23, 5, 3); R(g, PAL.canopyEdge, 24, 22, 4, 3);
    R(g, PAL.canopyMid, 10, 17, 5, 3); R(g, PAL.canopyHighlight, 8, 15, 3, 2);
  });
}
function rockSprite() {
  return mk(16, 16, (g) => {
    R(g, PAL.shadowGround, 2, 13, 12, 2);
    R(g, PAL.stoneTileDark, 3, 8, 10, 6);
    R(g, PAL.stoneTile, 4, 6, 9, 7);
    R(g, PAL.stoneTileLight, 6, 4, 6, 5);
    R(g, PAL.stoneObjectHighlight, 7, 4, 3, 2);
    R(g, PAL.stoneTileDark, 3, 10, 2, 3); R(g, PAL.stoneTileDark, 11, 9, 2, 4);
    R(g, PAL.mossAccent, 4, 7, 2, 1);
  });
}
function shop() {
  return mk(32, 32, (g) => {
    R(g, PAL.shadowSoft, 1, 29, 30, 3);
    // Tiang dan rangka kios.
    R(g, PAL.brownDark, 2, 9, 3, 21); R(g, PAL.brownLight, 3, 10, 1, 18);
    R(g, PAL.brownDark, 27, 9, 3, 21); R(g, PAL.brownLight, 28, 10, 1, 18);
    // Kanopi bergaris dengan lis bawah yang tegas.
    R(g, PAL.brownDark, 0, 2, 32, 2);
    for (let x = 1; x < 31; x += 4) {
      R(g, (x / 4 | 0) % 2 ? PAL.cream : PAL.orange, x, 4, 3, 7);
      R(g, PAL.brownDark, x + 2, 4, 1, 7);
    }
    R(g, PAL.brown, 1, 11, 30, 2); R(g, PAL.creamDark, 2, 13, 28, 2);
    // Meja dagang dan barang dagangan yang tetap dekoratif.
    R(g, PAL.brownDark, 1, 21, 30, 2); R(g, PAL.brownLight, 2, 23, 28, 2);
    R(g, PAL.brown, 2, 25, 28, 4); R(g, PAL.brownDark, 2, 25, 28, 1);
    R(g, PAL.orange, 5, 17, 4, 4); R(g, PAL.greenDark, 6, 16, 3, 2);
    R(g, PAL.tomato, 13, 17, 5, 4); R(g, PAL.tomato, 17, 18, 3, 3);
    R(g, PAL.harvestGold, 23, 16, 2, 5); R(g, PAL.harvestGoldLight, 22, 15, 5, 2);
    R(g, PAL.cream, 4, 27, 5, 1); R(g, PAL.cream, 22, 27, 6, 1);
  });
}
function house(level = 1) {
  const sizes = { 1: [48, 48], 2: [64, 56], 3: [80, 64] };
  const [w, h] = sizes[level] || sizes[1];
  return mk(w, h, (g) => {
    const cx = Math.floor(w / 2), roofBase = Math.floor(h * .48);
    const bodyW = Math.floor(w * .78), bodyX = cx - Math.floor(bodyW / 2);
    const bodyY = roofBase - 1, bodyH = h - bodyY - 4;
    // Bayangan pijak dan dinding berlapis.
    R(g, PAL.shadowSoft, cx - Math.floor(w * .40), h - 4, Math.floor(w * .80), 3);
    R(g, PAL.brownDark, bodyX - 2, bodyY - 1, bodyW + 4, bodyH + 2);
    R(g, PAL.creamDark, bodyX, bodyY, bodyW, bodyH);
    R(g, PAL.cream, bodyX + 2, bodyY + 2, bodyW - 4, bodyH - 7);
    R(g, PAL.wallShadow, bodyX + 1, h - 12, bodyW - 2, 7);
    R(g, PAL.creamDark, bodyX + 2, bodyY + 5, 2, bodyH - 13);
    // Atap pelana bertingkat dengan tepi dan sorotan kiri-atas.
    const roofH = Math.floor(h * .43);
    for (let row = 0; row < roofH; row++) {
      const half = Math.min(Math.floor(w * .48), Math.floor(w * .18 + row * (w * .32 / roofH)));
      const y = 2 + row;
      R(g, PAL.brownDark, cx - half - 1, y, half * 2 + 2, 1);
      R(g, row < 3 || row % 5 === 0 ? PAL.roofHighlight : PAL.roofShadow, cx - half, y, half * 2, 1);
      if (row > 4 && row % 4 === 0) R(g, PAL.terracotta, cx - half + 3, y, Math.max(2, half - 5), 1);
    }
    R(g, PAL.brownDark, cx - Math.floor(w * .49), roofH + 1, Math.floor(w * .98), 3);
    R(g, PAL.roofHighlight, cx - Math.floor(w * .43), roofH + 1, Math.floor(w * .86), 1);
    // Pintu dan ambang.
    const doorW = level === 1 ? 8 : level === 2 ? 10 : 12;
    const doorX = cx - Math.floor(doorW / 2), doorY = bodyY + 10;
    R(g, PAL.brownDark, doorX - 1, doorY - 1, doorW + 2, h - doorY - 3);
    R(g, PAL.brown, doorX, doorY, doorW, h - doorY - 4);
    R(g, PAL.brownLight, doorX + 1, doorY + 1, 2, h - doorY - 7);
    R(g, PAL.harvestGold, doorX + doorW - 2, h - 12, 1, 2);
    R(g, PAL.brownDark, doorX - 2, h - 7, doorW + 4, 2);
    // Jendela simetris dengan kusen tebal.
    const win = level === 1 ? 7 : 9, wy = bodyY + 5;
    for (const wx of [bodyX + 5, bodyX + bodyW - win - 5]) {
      R(g, PAL.brownDark, wx - 1, wy - 1, win + 2, win + 2);
      R(g, PAL.sky, wx, wy, win, win);
      R(g, PAL.cream, wx + Math.floor(win / 2), wy, 1, win);
      R(g, PAL.cream, wx, wy + Math.floor(win / 2), win, 1);
      R(g, PAL.creamDark, wx + 1, wy + 1, 2, 1);
    }
    // Perkembangan level bersifat visual: ventilasi/cerobong, lis dan serambi.
    if (level >= 2) {
      R(g, PAL.brownDark, cx + Math.floor(w * .22), 1, 7, 12);
      R(g, PAL.roofStone, cx + Math.floor(w * .22) + 1, 2, 5, 9);
      R(g, PAL.cream, cx + Math.floor(w * .22) + 2, 3, 3, 2);
      R(g, PAL.brownDark, bodyX - 3, h - 7, bodyW + 6, 3);
      R(g, PAL.brownLight, bodyX - 2, h - 6, bodyW + 4, 1);
      R(g, PAL.houseDetail, cx - 2, 1, 4, 2);
    }
    if (level >= 3) {
      // Sayap atap dan lis hijau menandai rumah yang telah dikembangkan penuh.
      R(g, PAL.brownDark, bodyX - 5, bodyY - 5, bodyW + 10, 3);
      R(g, PAL.houseGreenTrim, bodyX - 3, bodyY - 7, bodyW + 6, 2);
      R(g, PAL.roofHighlight, bodyX - 4, bodyY - 8, bodyW + 8, 1);
      R(g, PAL.brownDark, bodyX + 3, h - 11, bodyW - 6, 2);
      R(g, PAL.brownLight, bodyX + 4, h - 10, bodyW - 8, 1);
      // Dua pot kecil di beranda, tetap berada dalam footprint sprite.
      R(g, PAL.terracotta, bodyX + 2, h - 10, 4, 3); R(g, PAL.greenDark, bodyX + 3, h - 12, 2, 3);
      R(g, PAL.terracotta, bodyX + bodyW - 6, h - 10, 4, 3); R(g, PAL.greenDark, bodyX + bodyW - 5, h - 12, 2, 3);
    }
  });
}
function villageHouse() {
  return mk(48, 36, (g) => {
    R(g, PAL.shadowSoft, 4, 32, 40, 3);
    R(g, PAL.brownDark, 5, 15, 38, 19); R(g, PAL.terracotta, 7, 17, 34, 15);
    R(g, PAL.creamDark, 8, 18, 32, 13); R(g, PAL.cream, 9, 19, 30, 9);
    // Atap rumah warga dibuat lebih rendah dan berwarna terakota agar berbeda dari rumah pemain.
    R(g, PAL.brownDark, 2, 13, 44, 4); R(g, PAL.terracotta, 4, 8, 40, 8);
    R(g, PAL.roofShadow, 7, 5, 34, 4); R(g, PAL.roofHighlight, 9, 6, 27, 2);
    R(g, PAL.brownDark, 5, 15, 38, 2);
    R(g, PAL.sky, 10, 21, 7, 6); R(g, PAL.brownDark, 9, 20, 9, 8);
    R(g, PAL.sky, 31, 21, 7, 6); R(g, PAL.brownDark, 30, 20, 9, 8);
    R(g, PAL.cream, 13, 21, 1, 6); R(g, PAL.cream, 10, 23, 7, 1);
    R(g, PAL.cream, 34, 21, 1, 6); R(g, PAL.cream, 31, 23, 7, 1);
    R(g, PAL.brownDark, 21, 23, 8, 11); R(g, PAL.brown, 22, 24, 6, 10);
    R(g, PAL.harvestGold, 26, 28, 1, 2);
    R(g, PAL.brownLight, 19, 33, 12, 2);
    R(g, PAL.houseGreenTrim, 7, 16, 34, 2);
  });
}
function market() {
  return mk(48, 32, (g) => {
    R(g, PAL.shadowSoft, 2, 28, 44, 3);
    // Kanopi pasar dengan garis kain, papan nama, dan meja terbuka.
    R(g, PAL.brownDark, 2, 7, 44, 4);
    R(g, PAL.brownDark, 4, 10, 3, 18); R(g, PAL.brownDark, 41, 10, 3, 18);
    for (let x = 4; x < 44; x += 8) {
      R(g, x % 16 === 4 ? PAL.orange : PAL.cream, x, 4, 8, 7);
      R(g, PAL.brownDark, x, 10, 8, 1);
    }
    R(g, PAL.brown, 5, 12, 38, 2); R(g, PAL.creamDark, 7, 14, 34, 2);
    R(g, PAL.brownDark, 7, 18, 34, 3); R(g, PAL.brownLight, 8, 21, 32, 5);
    R(g, PAL.brown, 8, 26, 32, 2);
    // Keranjang dan hasil dagang menjadi penanda fungsi pasar.
    R(g, PAL.orange, 11, 17, 6, 4); R(g, PAL.greenDark, 12, 16, 4, 2);
    R(g, PAL.tomato, 21, 17, 5, 4); R(g, PAL.greenDark, 22, 16, 3, 2);
    R(g, PAL.harvestGold, 31, 17, 6, 4); R(g, PAL.cream, 32, 16, 4, 1);
    R(g, PAL.brownDark, 19, 2, 10, 3); R(g, PAL.cream, 21, 2, 6, 1);
  });
}
function well() {
  return mk(16, 16, (g) => {
    R(g, PAL.shadowGround, 1, 13, 14, 2);
    R(g, PAL.brownDark, 2, 7, 12, 7); R(g, PAL.stoneTileDark, 3, 8, 10, 5);
    R(g, PAL.stoneTile, 4, 8, 8, 4); R(g, PAL.stoneTileLight, 4, 8, 3, 1);
    R(g, PAL.sky, 5, 9, 6, 3); R(g, PAL.water, 6, 9, 4, 1);
    R(g, PAL.brownDark, 3, 4, 2, 7); R(g, PAL.brownDark, 11, 4, 2, 7);
    R(g, PAL.brown, 4, 4, 1, 6); R(g, PAL.brownLight, 11, 4, 1, 6);
    R(g, PAL.brownDark, 2, 3, 12, 2); R(g, PAL.brownLight, 3, 3, 10, 1);
    R(g, PAL.brownDark, 7, 1, 2, 4); R(g, PAL.brownLight, 7, 1, 1, 3);
    R(g, PAL.brownDark, 5, 1, 6, 1);
  });
}
function signboard(region = false) {
  return mk(16, 16, (g) => {
    R(g, PAL.shadowGround, 4, 14, 8, 1);
    R(g, PAL.brownDark, 7, 7, 3, 8); R(g, PAL.brownLight, 8, 8, 1, 6);
    R(g, PAL.brownDark, 1, 2, 14, 7); R(g, region ? PAL.terracotta : PAL.brownLight, 2, 3, 12, 5);
    R(g, PAL.cream, 3, 4, 10, 1); R(g, PAL.creamDark, 4, 6, 8, 1);
    R(g, PAL.brown, 2, 9, 2, 1); R(g, PAL.brown, 12, 9, 2, 1);
  });
}
function flowerPot() {
  return mk(16, 16, (g) => {
    R(g, PAL.shadowGround, 3, 14, 10, 1);
    R(g, PAL.greenDark, 7, 6, 2, 6); R(g, PAL.greenLight, 5, 8, 3, 1); R(g, PAL.green, 9, 9, 3, 1);
    R(g, PAL.flowerAccent, 5, 3, 3, 3); R(g, PAL.flowerPink, 9, 4, 3, 3);
    R(g, PAL.flowerWhite, 6, 4, 1, 1); R(g, PAL.flowerYellow, 7, 4, 2, 2);
    R(g, PAL.terracotta, 4, 10, 8, 4); R(g, PAL.brownDark, 4, 10, 8, 1);
    R(g, PAL.brownLight, 5, 11, 2, 2); R(g, PAL.brownDark, 11, 11, 1, 3);
  });
}
function lampPost() {
  return mk(16, 16, (g) => {
    R(g, PAL.shadowGround, 3, 14, 10, 1);
    R(g, PAL.brownDark, 7, 5, 2, 10); R(g, PAL.brownLight, 7, 6, 1, 8);
    R(g, PAL.brownDark, 4, 13, 8, 2); R(g, PAL.brown, 5, 13, 6, 1);
    R(g, PAL.brownDark, 5, 2, 6, 5); R(g, PAL.harvestGold, 6, 3, 4, 3);
    R(g, PAL.lampGlow, 7, 3, 2, 2); R(g, PAL.cream, 7, 2, 2, 1);
    R(g, PAL.brownLight, 4, 1, 8, 1); R(g, PAL.brownDark, 6, 1, 4, 1);
  });
}
function scarecrow() {
  return mk(16, 16, (g) => {
    R(g, PAL.shadowGround, 3, 14, 10, 1);
    R(g, PAL.brownDark, 7, 5, 2, 10); R(g, PAL.brownLight, 7, 6, 1, 8);
    R(g, PAL.brownDark, 2, 7, 12, 2); R(g, PAL.brownLight, 3, 7, 10, 1);
    R(g, PAL.creamDark, 5, 3, 6, 5); R(g, PAL.harvestGold, 6, 2, 4, 3);
    R(g, PAL.brownDark, 5, 3, 6, 1); R(g, PAL.brown, 4, 5, 2, 2);
    R(g, PAL.greenDark, 4, 9, 8, 4); R(g, PAL.green, 5, 9, 6, 2);
    R(g, PAL.cream, 6, 4, 1, 1); R(g, PAL.cream, 9, 4, 1, 1);
  });
}
function fence(vertical) {
  return mk(16, 16, (g) => {
    if (vertical) { R(g, PAL.brownLight, 6, 0, 4, 16); R(g, PAL.brown, 6, 0, 1, 16); R(g, PAL.brownDark, 5, 6, 6, 3); return; }
    R(g, PAL.brownLight, 0, 8, 16, 2); R(g, PAL.brownLight, 0, 12, 16, 2);
    R(g, PAL.brown, 1, 6, 3, 10); R(g, PAL.brown, 12, 6, 3, 10);
  });
}

// Tekstur tambahan untuk area gua: batu abu-abu dan batu berlumut.
function rockyGround(seed, moss = false) {
  const base = moss ? PAL.mossGround : PAL.stoneTile;
  const dark = moss ? PAL.mossGroundDark : PAL.stoneTileDark;
  const light = moss ? PAL.mossGroundLight : PAL.stoneTileLight;
  return mk(16, 16, (g) => {
    R(g, base, 0, 0, 16, 16);
    const r = rng(seed);
    // Pecahan batu berukuran kecil dengan garis sambungan yang renggang.
    for (const [x, y, w, h] of [[1, 2, 5, 3], [8, 1, 6, 4], [3, 8, 6, 4], [10, 9, 5, 5]]) {
      R(g, dark, x, y + h - 1, w, 1);
      R(g, light, x + 1, y, Math.max(1, w - 2), 1);
      if (r() > 0.45) R(g, dark, x + w - 1, y + 1, 1, h - 1);
    }
    for (let i = 0; i < 4; i++) R(g, light, 1 + Math.floor(r() * 14), 1 + Math.floor(r() * 14), 1, 1);
    if (moss) {
      R(g, PAL.mossAccent, 2, 4, 3, 1); R(g, PAL.mossAccent, 11, 12, 3, 1);
      R(g, PAL.greenDark, 4, 5, 1, 1); R(g, PAL.greenDark, 12, 11, 1, 1);
    }
  });
}

export const SPR = {
  tiles: [grass(0), grass(1), grass(2), speckled(PAL.soilWarmMid, PAL.brownDark, PAL.brownLight, 21), pathTile(33), null, rockyGround(57), rockyGround(73, true)],
  pathEdges: Array.from({ length: 16 }, (_, mask) => pathEdge(mask, 33)),
  water: [water(0), water(1)],
  rock: rockSprite(),
  tree: tree(), house: house(1), houses: [null, house(1), house(2), house(3)], shop: shop(),
  villageHouse: villageHouse(), market: market(), well: well(), villageSign: signboard(false), regionSign: signboard(true),
  decoFlower: flowerPot(), decoLamp: lampPost(), decoScarecrow: scarecrow(), fenceH: fence(false), fenceV: fence(true),
};

function tilled(wet) {
  return mk(16, 16, (g) => {
    R(g, wet ? PAL.soilWet : PAL.soilDry, 0, 0, 16, 16);
    for (const y of [2, 7, 12]) { R(g, wet ? PAL.soilWetDark : PAL.soilDryDark, 0, y, 16, 2); R(g, wet ? PAL.soilWetLight : PAL.soilWarmMid, 0, y + 2, 16, 1); }
    if (wet) for (const [x, y] of [[3, 5], [10, 4], [6, 10], [13, 9], [2, 14]]) R(g, PAL.wetSoilWater, x, y, 2, 1);
  });
}
// Tahap tanaman: 0 benih, 1 tunas, 2 muda, 3 siap panen.
function cropSprite(id, st) {
  return mk(16, 16, (g) => {
    const G = PAL.green, GD = PAL.greenDark, GL = PAL.greenLight;
    // Benih: dua butir kecil yang konsisten untuk semua tanaman.
    if (st === 0) {
      R(g, PAL.creamDark, 5, 12, 2, 1); R(g, PAL.brownLight, 6, 11, 1, 1);
      R(g, PAL.creamDark, 9, 13, 2, 1); return;
    }
    if (id === 'carrot') {
      if (st === 1) {
        R(g, G, 7, 9, 2, 4); R(g, GL, 5, 8, 3, 2); R(g, G, 9, 7, 2, 3); R(g, GL, 8, 6, 2, 2);
      } else if (st === 2) {
        R(g, GD, 7, 5, 2, 8); R(g, G, 5, 4, 2, 8); R(g, GL, 8, 3, 2, 9); R(g, G, 10, 5, 2, 7);
        R(g, GD, 5, 10, 7, 1);
      } else {
        R(g, GD, 7, 8, 3, 7); R(g, PAL.orange, 7, 9, 3, 5); R(g, PAL.carrotShadow, 8, 13, 1, 2);
        R(g, G, 5, 3, 2, 6); R(g, GL, 7, 1, 2, 9); R(g, G, 9, 3, 2, 6); R(g, GL, 11, 4, 1, 5);
        R(g, PAL.greenDark, 6, 4, 1, 3);
      }
    } else if (id === 'wheat') {
      if (st === 1) {
        R(g, PAL.wheatYoung, 6, 7, 1, 6); R(g, PAL.wheatYoung, 9, 8, 1, 5);
        R(g, PAL.harvestGold, 5, 6, 2, 2); R(g, PAL.harvestGold, 9, 7, 2, 2);
      } else if (st === 2) {
        R(g, PAL.wheatYoung, 7, 5, 2, 9); R(g, G, 4, 7, 2, 7); R(g, G, 10, 6, 2, 8);
        R(g, PAL.harvestGold, 6, 4, 1, 3); R(g, PAL.harvestGold, 9, 3, 1, 3);
      } else {
        // Tiga bulir tegak dengan kepala gandum yang jelas pada ukuran 16 px.
        R(g, PAL.wheatYoung, 7, 5, 1, 9); R(g, PAL.wheatYoung, 4, 7, 1, 7); R(g, PAL.wheatYoung, 10, 6, 1, 8);
        R(g, PAL.harvestGold, 6, 2, 3, 4); R(g, PAL.harvestGoldLight, 6, 1, 2, 2);
        R(g, PAL.harvestGold, 3, 4, 3, 4); R(g, PAL.harvestGoldLight, 3, 4, 2, 2);
        R(g, PAL.harvestGold, 9, 3, 3, 4); R(g, PAL.harvestGoldLight, 10, 2, 2, 2);
        R(g, PAL.brownLight, 7, 5, 1, 2); R(g, PAL.brownLight, 4, 7, 1, 2); R(g, PAL.brownLight, 10, 6, 1, 2);
      }
    } else if (id === 'tomato') {
      if (st === 1) {
        R(g, GD, 7, 8, 2, 5); R(g, G, 4, 8, 4, 2); R(g, G, 8, 7, 4, 2);
        R(g, GL, 4, 7, 3, 2); R(g, GL, 9, 6, 3, 2);
      } else if (st === 2) {
        R(g, GD, 7, 5, 2, 9); R(g, G, 4, 6, 3, 5); R(g, G, 9, 5, 3, 6);
        R(g, GL, 4, 5, 3, 2); R(g, GL, 9, 4, 3, 2); R(g, G, 6, 3, 4, 3);
      } else {
        R(g, GD, 7, 5, 2, 10); R(g, G, 4, 6, 3, 5); R(g, G, 9, 5, 3, 6);
        R(g, GL, 4, 5, 3, 2); R(g, GL, 9, 4, 3, 2); R(g, G, 6, 3, 4, 3);
        R(g, PAL.tomato, 4, 8, 4, 4); R(g, PAL.tomato, 9, 7, 4, 4); R(g, PAL.tomato, 7, 11, 4, 4);
        R(g, PAL.carrotShadow, 5, 8, 1, 1); R(g, PAL.carrotShadow, 10, 7, 1, 1); R(g, PAL.carrotShadow, 8, 11, 1, 1);
        R(g, PAL.harvestGoldLight, 5, 9, 1, 1); R(g, PAL.harvestGoldLight, 10, 8, 1, 1);
      }
    } else { // Daisy dekoratif: roset daun lalu bunga putih-kuning.
      if (st === 1) {
        R(g, GD, 7, 9, 2, 4); R(g, G, 4, 10, 4, 2); R(g, G, 8, 10, 4, 2);
        R(g, GL, 5, 9, 2, 1); R(g, GL, 9, 9, 2, 1); R(g, PAL.cream, 7, 7, 2, 2);
      } else if (st === 2) {
        R(g, GD, 7, 6, 2, 8); R(g, G, 4, 9, 4, 2); R(g, G, 8, 8, 4, 2);
        R(g, GL, 4, 8, 3, 2); R(g, GL, 9, 7, 3, 2); R(g, PAL.cream, 7, 4, 2, 3);
      } else {
        R(g, GD, 7, 7, 2, 7); R(g, G, 4, 10, 4, 2); R(g, G, 8, 9, 4, 2);
        R(g, GL, 4, 9, 3, 2); R(g, GL, 9, 8, 3, 2);
        R(g, PAL.flowerWhite, 7, 2, 2, 7); R(g, PAL.flowerWhite, 4, 4, 8, 3);
        R(g, PAL.flowerWhite, 5, 2, 6, 6); R(g, PAL.flowerYellow, 7, 4, 2, 2);
        R(g, PAL.harvestGoldLight, 7, 3, 1, 1);
      }
    }
  });
}

SPR.tilled = tilled(false); SPR.tilledWet = tilled(true);
SPR.crops = {};
for (const id of ['carrot', 'wheat', 'tomato', 'daisy']) SPR.crops[id] = [0, 1, 2, 3].map((s) => cropSprite(id, s));

// Player dipulihkan ke desain visual versi 5.2A; ukuran, arah, animasi, dan pijakan tetap.
export function drawPlayer(g, x, y, dir, step) {
  const bob = step ? -1 : 0, up = dir === 1;
  R(g, PAL.shadowPlayer, x + 3, y + 14, 10, 2);
  const l = step === 1 ? 1 : 0, r = step === 2 ? 1 : 0;
  R(g, PAL.brownDark, x + 4, y + 12 - l, 3, 3); R(g, PAL.brownDark, x + 9, y + 12 - r, 3, 3);
  R(g, PAL.greenDark, x + 4, y + 8 + bob, 8, 5);
  R(g, PAL.cream, x + 4, y + 7 + bob, 8, 3);
  R(g, PAL.skin, x + 2, y + 8 + bob, 2, 3); R(g, PAL.skin, x + 12, y + 8 + bob, 2, 3);
  R(g, PAL.skin, x + 4, y + 2 + bob, 8, 6);
  if (up) R(g, PAL.brown, x + 4, y + 2 + bob, 8, 5);
  else {
    R(g, PAL.brown, x + 4, y + 2 + bob, 8, 2);
    const ex = dir === 0 ? [6, 9] : dir === 2 ? [5, 7] : [8, 10];
    for (const e of ex) R(g, PAL.ink, x + e, y + 5 + bob, 1, 2);
  }
  R(g, PAL.orange, x + 2, y + 2 + bob, 12, 2); R(g, PAL.hatHighlight, x + 4, y + Math.max(0, bob), 8, 3);
}

// Mira dan Bima memakai area gambar 16x16 yang sama dengan NPC sebelumnya.
// Label nama tetap digambar oleh World.js di luar sprite agar tidak memengaruhi pijakan.
export function drawVillager(g, x, y, dir, step, isMira) {
  const d = ((dir % 4) + 4) % 4;
  const a = step === 1 ? 1 : 0;
  const b = step === 2 ? 1 : 0;
  const hair = isMira ? PAL.miraHair : PAL.bimaHair;
  const clothes = isMira ? PAL.miraClothes : PAL.bimaClothes;

  R(g, PAL.shadowSoft, x + 3, y + 14, 10, 2);
  R(g, PAL.brownDark, x + 4, y + 12 - a, 3, 3);
  R(g, PAL.brownDark, x + 9, y + 12 - b, 3, 3);
  R(g, PAL.brownLight, x + 5, y + 13 - a, 1, 1);
  R(g, PAL.brownLight, x + 10, y + 13 - b, 1, 1);

  // Badan dan lengan: apron membedakan Mira, kerah/rompi membedakan Bima.
  R(g, PAL.brownDark, x + 3, y + 8, 10, 4);
  R(g, clothes, x + 3, y + 8, 10, 4);
  R(g, PAL.cream, x + 6, y + 9, 4, 3);
  if (isMira) {
    R(g, PAL.creamDark, x + 6, y + 9, 4, 1);
    R(g, PAL.cream, x + 7, y + 10, 2, 2);
    R(g, PAL.orange, x + 8, y + 8, 1, 1);
  } else {
    R(g, PAL.cream, x + 6, y + 8, 4, 1);
    R(g, PAL.brownDark, x + 7, y + 9, 2, 2);
    R(g, PAL.creamDark, x + 8, y + 9, 1, 1);
  }
  R(g, PAL.skin, x + 2, y + 8, 2, 3);
  R(g, PAL.skin, x + 12, y + 8, 2, 3);

  // Bentuk kepala dan arah pandang.
  if (d === 0) {
    R(g, PAL.skin, x + 4, y + 3, 8, 5);
    R(g, hair, x + 4, y + 1, 8, 3);
    R(g, PAL.ink, x + 6, y + 5, 1, 1); R(g, PAL.ink, x + 10, y + 5, 1, 1);
    if (isMira) {
      R(g, hair, x + 3, y + 3, 2, 5); R(g, hair, x + 11, y + 3, 2, 4);
      R(g, PAL.hatHighlight, x + 11, y, 2, 2);
    } else {
      R(g, hair, x + 3, y + 2, 2, 4); R(g, hair, x + 11, y + 2, 2, 4);
      R(g, PAL.brownDark, x + 6, y + 2, 4, 1);
    }
  } else if (d === 1) {
    R(g, hair, x + 4, y + 2, 8, 6);
    R(g, PAL.brownDark, x + 5, y + 6, 6, 2);
    if (isMira) { R(g, hair, x + 3, y + 3, 2, 5); R(g, hair, x + 11, y + 3, 2, 5); R(g, PAL.hatHighlight, x + 11, y, 2, 2); }
    else { R(g, hair, x + 3, y + 2, 2, 5); R(g, hair, x + 11, y + 2, 2, 5); }
  } else if (d === 2) {
    R(g, PAL.skin, x + 3, y + 3, 8, 5);
    R(g, hair, x + 3, y + 1, 8, 3);
    R(g, hair, x + 3, y + 3, 2, 5);
    R(g, PAL.ink, x + 5, y + 5, 1, 1);
    if (isMira) { R(g, hair, x + 9, y + 2, 3, 5); R(g, PAL.hatHighlight, x + 10, y, 2, 2); }
    else R(g, hair, x + 9, y + 2, 3, 4);
  } else {
    R(g, PAL.skin, x + 5, y + 3, 8, 5);
    R(g, hair, x + 5, y + 1, 8, 3);
    R(g, hair, x + 11, y + 3, 2, 5);
    R(g, PAL.ink, x + 10, y + 5, 1, 1);
    if (isMira) { R(g, hair, x + 3, y + 2, 3, 5); R(g, PAL.hatHighlight, x + 4, y, 2, 2); }
    else R(g, hair, x + 4, y + 2, 3, 4);
  }

  // Kontur bahu dan warna sorotan kecil memberi kedalaman tanpa mengubah skala.
  R(g, PAL.brownDark, x + 3, y + 11, 1, 1);
  R(g, PAL.brownDark, x + 12, y + 11, 1, 1);
}

// Rumput lebih hijau (Harmoni level 3) dan bunga liar (level 2 ke atas).
SPR.lush = [0, 1, 2].map((v) => grass(v, true));
function wildFlower(v) {
  const [c0, c1] = [[PAL.flowerPink, PAL.flowerWhite], [PAL.flowerWhite, PAL.flowerYellow], [PAL.flowerYellow, PAL.orange]][v];
  return mk(16, 16, (g) => {
    for (const [x, y] of [[3, 4], [10, 9], [6, 12]]) { R(g, c0, x, y - 1, 1, 3); R(g, c0, x - 1, y, 3, 1); R(g, c1, x, y, 1, 1); }
  });
}
SPR.wild = [0, 1, 2].map(wildFlower);
