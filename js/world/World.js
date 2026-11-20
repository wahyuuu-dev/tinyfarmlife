import { CFG, PAL } from '../data/config.js';
import { SPR, drawVillager } from './Sprites.js';

const T = CFG.TILE;
const GRASS = 0, DIRT = 3, PATH = 4, WATER = 5;
const HOUSE = { x: 18, y: 8, w: 3, h: 3 };
const PLOT = { x1: 14, y1: 17, x2: 25, y2: 22 };
// Empat slot ekspansi berada di taman dekorasi terpisah di sisi timur kebun, bukan di petak tanam.
const DECORATION_SLOTS = [[15, 13], [25, 13], [15, 15], [25, 15], [28, 25], [31, 25], [28, 28], [31, 28]];

function rng(seed) { return () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296; }
// Variasi tile deterministik berbasis koordinat; tidak membentuk garis diagonal berulang.
function hash2(x, y, seed = 0) {
  let n = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed + 1, 1442695041)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

export class World {
  constructor() {
    this.w = CFG.MAP_W; this.h = CFG.MAP_H;
    this.tiles = new Uint8Array(this.w * this.h);
    this.objects = [];
    this.lush = false;
    this.houseLevel = 1;
    this.expanded = false;
    this.regionStates = { forest: false, lake: false, cave: false };
    this.decorations = [];
    this.cache = [null, null];
    this.generate();
    this.buildCollision();
  }
  reset() { this.tiles.fill(0); this.objects = []; this.houseLevel = 1; this.expanded = false; this.regionStates = { forest: false, lake: false, cave: false }; this.decorations = []; this.cache = [null, null]; this.generate(); this.buildCollision(); }
  at(x, y) { return this.tiles[y * this.w + x]; }
  setHouseLevel(level) {
    this.houseLevel = Math.max(1, Math.min(3, Number.isInteger(level) ? level : 1));
    this.buildCollision();
  }
  houseSize() { return this.houseLevel === 1 ? { w: 48, h: 48 } : this.houseLevel === 2 ? { w: 64, h: 56 } : { w: 80, h: 64 }; }

  set(x, y, id) { this.tiles[y * this.w + x] = id; }
  generate() {
    const r = rng(7);
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      const h = (x * 7 + y * 13) % 11;
      this.set(x, y, h === 0 ? 2 : (x * 3 + y * 5) % 4 === 0 ? 1 : GRASS);
    }
    for (let y = PLOT.y1; y <= PLOT.y2; y++) for (let x = PLOT.x1; x <= PLOT.x2; x++) this.set(x, y, DIRT);
    for (let y = HOUSE.y + HOUSE.h; y < PLOT.y1; y++) this.set(19, y, PATH);
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++)
      if (((x - 31) / 4.5) ** 2 + ((y - 20) / 3.2) ** 2 < 1) this.set(x, y, WATER);

    for (let x = PLOT.x1 - 1; x <= PLOT.x2 + 1; x++) for (const y of [PLOT.y1 - 1, PLOT.y2 + 1])
      if (!(y === PLOT.y1 - 1 && (x === 19 || x === 20))) this.objects.push({ k: 'fenceH', x, y });
    for (let y = PLOT.y1; y <= PLOT.y2; y++) for (const x of [PLOT.x1 - 1, PLOT.x2 + 1]) this.objects.push({ k: 'fenceV', x, y });
    this.objects.push({ k: 'house', x: HOUSE.x, y: HOUSE.y });
    this.objects.push({ k: 'shop', x: 22, y: 12 });

    // Jalur utama mengitari sisi utara kolam agar jalan tidak memotong badan air.
    // Jalur tersambung dari koridor Home Farm menuju pintu masuk Greenfield Village.
    for (let x = 20; x <= 45; x++) this.set(x, 14, PATH);
    for (let y = 14; y <= 19; y++) this.set(44, y, PATH);
    for (let x = 44; x <= 46; x++) this.set(x, 19, PATH);
    // Greenfield Village berada di sisi timur Home Farm dalam satu peta yang sama.
    for (let y = 8; y <= 27; y++) for (let x = 46; x <= 63; x++) {
      const edge = x === 46 || x === 63 || y === 8 || y === 27;
      if (!edge) this.set(x, y, (x + y) % 9 === 0 ? 1 : GRASS);
    }
    // Jalan desa dibuat satu jalur lurus, tanpa memotong area kolam atau bangunan.
    for (let x = 46; x <= 63; x++) this.set(x, 19, PATH);
    for (let y = 17; y <= 19; y++) this.set(46, y, PATH);
    this.objects.push(
      { k: 'villageHouse', x: 49, y: 11 },
      { k: 'villageHouse', x: 57, y: 11 },
      { k: 'market', x: 49, y: 22 },
      { k: 'well', x: 59, y: 22 },
      { k: 'villageSign', x: 45, y: 17 },
      { k: 'villager', x: 52, y: 17, name: 'Mira', role: 'Penjaga pasar' },
      { k: 'villager', x: 60, y: 17, name: 'Bima', role: 'Warga desa' }
    );

    // Tiga wilayah baru berada dalam satu peta yang sama dan terhubung dengan jalan desa.
    // Hutan di timur, gua di selatan desa, dan danau di selatan hutan.
    for (let y = 8; y <= 30; y++) for (let x = 68; x <= 92; x++) { const n = hash2(x, y, 11); this.set(x, y, n < 0.13 ? 2 : n < 0.38 ? 1 : GRASS); }
    for (let x = 63; x <= 67; x++) this.set(x, 19, PATH);
    this.objects.push({ k: 'regionGate', x: 66, y: 19, region: 'forest', cost: 150, title: 'Hutan Teduh' });
    // Jalur hutan ke danau.
    for (let x = 78; x <= 82; x++) this.set(x, 29, PATH);
    for (let y = 29; y <= 35; y++) this.set(80, y, PATH);
    for (let y = 36; y <= 59; y++) for (let x = 68; x <= 92; x++) { const n = hash2(x, y, 19); this.set(x, y, n < 0.08 ? 2 : n < 0.28 ? 1 : GRASS); }
    // Kolam danau dengan tepian alami.
    for (let y = 43; y <= 52; y++) for (let x = 76; x <= 85; x++)
      if (((x - 80.5) / 5) ** 2 + ((y - 47.5) / 5) ** 2 < 1) this.set(x, y, WATER);
    this.objects.push({ k: 'regionGate', x: 80, y: 33, region: 'lake', cost: 250, title: 'Tepi Danau' });
    // Area gua: dasar batu dengan lumut dan tanah tersebar alami, bukan pola diagonal.
    for (let y = 39; y <= 60; y++) for (let x = 35; x <= 64; x++) {
      const n = hash2(x, y, 31);
      this.set(x, y, n < 0.17 ? 7 : n < 0.29 ? 3 : 6);
    }
    // Jalan masuk dari gerbang menuju mulut gua dibuat terbaca dan bebas rintangan.
    for (let y = 27; y <= 39; y++) this.set(55, y, PATH);
    for (let x = 48; x <= 55; x++) this.set(x, 39, PATH);
    for (let y = 39; y <= 43; y++) this.set(48, y, PATH);
    this.objects.push({ k: 'regionGate', x: 55, y: 36, region: 'cave', cost: 350, title: 'Gua Batu' });
    // Vegetasi hutan dan batu gua; disebar deterministik agar peta konsisten setiap permainan.
    for (let y = 10; y <= 28; y++) for (let x = 69; x <= 91; x++) {
      if (((x * 17 + y * 11) % 13 === 0) && !(x >= 77 && x <= 83 && y >= 17 && y <= 22)) this.objects.push({ k: 'tree', x, y });
    }
    for (let y = 41; y <= 58; y++) for (let x = 37; x <= 62; x++) {
      const nearPath = (x >= 47 && x <= 56 && y >= 38 && y <= 44);
      const nearEntrance = x >= 46 && x <= 51 && y >= 42 && y <= 47;
      if (!nearPath && !nearEntrance && hash2(x, y, 47) > 0.94) this.objects.push({ k: 'rock', x, y });
    }
    this.objects.push(
      { k: 'regionSign', x: 69, y: 17, title: 'HUTAN TEDUH' },
      { k: 'regionSign', x: 82, y: 39, title: 'TEPI DANAU' },
      { k: 'caveEntrance', x: 48, y: 44 }
    );

    const free = (x, y) => {
      if (x >= 43 || (x >= 28 && x <= 46 && y >= 17 && y <= 23)) return false;
      if (DECORATION_SLOTS.some(([sx, sy]) => Math.abs(sx - x) <= 1 && Math.abs(sy - y) <= 1)) return false;
      if (x >= HOUSE.x - 2 && x <= HOUSE.x + HOUSE.w + 1 && y >= HOUSE.y - 2 && y <= HOUSE.y + HOUSE.h + 5) return false;
      if (x >= 21 && x <= 26 && y >= 10 && y <= 15) return false;
      if (x >= PLOT.x1 - 3 && x <= PLOT.x2 + 3 && y >= PLOT.y1 - 3 && y <= PLOT.y2 + 3) return false;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < this.w && ny < this.h &&
          (this.at(nx, ny) === WATER || this.at(nx, ny) === PATH)) return false;
      }
      return true;
    };
    const trees = [];
    const tryTree = (x, y) => {
      if (!free(x, y) || trees.some((t) => Math.abs(t.x - x) < 2 && Math.abs(t.y - y) < 2)) return;
      const t = { k: 'tree', x, y }; trees.push(t); this.objects.push(t);
    };
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++)
      if ((x < 2 || x >= this.w - 2 || y < 2 || y >= this.h - 2) && r() < 0.6) tryTree(x, y);
    for (let i = 0; i < 40; i++) tryTree(Math.floor(r() * this.w), Math.floor(r() * this.h));
  }
  // Lapisan tanah/rumput digambar sekali ke satu kanvas, lalu disalin per frame (jauh lebih sedikit panggilan gambar).
  groundCache(lush) {
    const i = lush ? 1 : 0;
    if (!this.cache[i]) {
      const c = document.createElement('canvas'); c.width = this.w * T; c.height = this.h * T;
      const g = c.getContext('2d');
      for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
        const id = this.at(x, y);
        if (id === WATER) continue;
        const px = x * T, py = y * T;
        g.drawImage(lush && id < 3 ? SPR.lush[id] : SPR.tiles[id], px, py);
        if (id === PATH) {
          // Mask empat sisi untuk menyatukan jalan dengan rumput tanpa mengganti ID tile.
          let mask = 0;
          const around = [[0,-1],[1,0],[0,1],[-1,0]];
          for (let side = 0; side < 4; side++) {
            const [dx, dy] = around[side], nx = x + dx, ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= this.w || ny >= this.h || this.at(nx, ny) < 3 && this.at(nx, ny) !== WATER) mask |= 1 << side;
          }
          if (mask) g.drawImage(SPR.pathEdges[mask], px, py);
        }
      }
      this.cache[i] = c;
    }
    return this.cache[i];
  }
  // Hanya petak kebun utama dan lahan ekspansi yang boleh dicangkul.
  // Tile tanah dekoratif di Gua Batu memakai ID DIRT yang sama, tetapi bukan lahan pertanian.
  isFarmableSoil(tx, ty, expanded = this.expanded) {
    const inHomePlot = tx >= PLOT.x1 && tx <= PLOT.x2 && ty >= PLOT.y1 && ty <= PLOT.y2;
    return inHomePlot || (expanded && this.isExpansionTile(tx, ty));
  }
  isExpansionTile(tx, ty) { return tx >= 14 && tx <= 25 && ty >= 24 && ty <= 28; }
  isDecorationSlot(tx, ty) {
    return DECORATION_SLOTS.some(([x, y]) => x === tx && y === ty);
  }
  setExpanded(value) {
    const next = value === true;
    if (next === this.expanded) return;
    this.expanded = next;
    if (next) {
      // Bersihkan pohon tepi yang mungkin menempati area ekspansi.
      this.objects = this.objects.filter(o => {
        if (o.k === 'fenceH' && o.y === 23 && o.x >= 13 && o.x <= 26) return false;
        if (o.k === 'tree' && o.x >= 13 && o.x <= 26 && o.y >= 23 && o.y <= 29) return false;
        return true;
      });
      for (let y = 24; y <= 28; y++) for (let x = 14; x <= 25; x++) this.set(x, y, DIRT);
      for (let x = 13; x <= 26; x++) this.objects.push({ k: 'fenceH', x, y: 29 });
      for (let y = 23; y <= 28; y++) {
        this.objects.push({ k: 'fenceV', x: 13, y });
        // Bukaan satu tile di sisi timur menjadi akses ke taman dekorasi ekspansi.
        if (y !== 26) this.objects.push({ k: 'fenceV', x: 26, y });
      }
    } else {
      this.objects = this.objects.filter(o => !((o.k === 'fenceH' && o.y === 29 && o.x >= 13 && o.x <= 26) ||
        (o.k === 'fenceV' && (o.x === 13 || o.x === 26) && o.y >= 23 && o.y <= 28)));
      for (let y = 24; y <= 28; y++) for (let x = 14; x <= 25; x++) this.set(x, y, GRASS);
      for (let x = 13; x <= 26; x++) this.objects.push({ k: 'fenceH', x, y: 23 });
    }
    this.cache = [null, null];
    this.buildCollision();
  }
  setRegions(regions) {
    const next = regions && typeof regions === 'object' ? regions : {};
    this.regionStates = {
      forest: next.forest === true,
      lake: next.lake === true,
      cave: next.cave === true
    };
    this.objects = this.objects.filter(o => o.k !== 'regionGate');
    const gates = [
      ['forest', 66, 19, 150, 'Hutan Teduh'],
      ['lake', 80, 33, 250, 'Tepi Danau'],
      ['cave', 55, 36, 350, 'Gua Batu']
    ];
    for (const [id, x, y, cost, title] of gates) {
      if (!this.regionStates[id]) this.objects.push({ k: 'regionGate', x, y, region: id, cost, title });
    }
    this.buildCollision();
  }
  unlockRegion(id) {
    if (!Object.prototype.hasOwnProperty.call(this.regionStates, id) || this.regionStates[id]) return false;
    this.regionStates[id] = true;
    this.objects = this.objects.filter(o => !(o.k === 'regionGate' && o.region === id));
    this.buildCollision();
    return true;
  }
  regionInfo(id) {
    const info = {
      forest: { title: 'Hutan Teduh', cost: 150, description: 'Jalur hutan terbuka. Jelajahi pepohonan dan jalan setapak.' },
      lake: { title: 'Tepi Danau', cost: 250, description: 'Jalur menuju danau terbuka. Area air tetap tidak bisa dilewati.' },
      cave: { title: 'Gua Batu', cost: 350, description: 'Jalan menuju gua terbuka. Batu-batu menjadi bagian dari rintangan.' }
    };
    return info[id] || null;
  }
  setDecorations(list) {
    // Migrasi posisi slot ekspansi dari save lama ke area taman dekorasi V1.4.0.
    const moved = new Map([
      // Koordinat slot ekspansi dari versi sebelum HOTFIX dan HOTFIX dev.3.1.
      ['16,24', [28, 25]], ['23,24', [31, 25]],
      ['16,28', [28, 28]], ['23,28', [31, 28]],
      ['15,24', [28, 25]], ['24,24', [31, 25]],
      ['15,27', [28, 28]], ['24,27', [31, 28]]
    ]);
    const used = new Set();
    this.decorations = Array.isArray(list) ? list.map(d => {
      if (!d) return null;
      const next = moved.get(d.tx + ',' + d.ty);
      return next ? { ...d, tx: next[0], ty: next[1] } : d;
    }).filter(d => {
      if (!d || !this.isDecorationSlot(d.tx, d.ty) || (d.ty >= 24 && !this.expanded) || !['flower', 'lamp', 'scarecrow'].includes(d.type)) return false;
      const key = d.tx + ',' + d.ty;
      if (used.has(key)) return false;
      used.add(key); return true;
    }).slice(0, 8) : [];
    this.objects = this.objects.filter(o => !String(o.k).startsWith('deco_'));
    for (const d of this.decorations) this.objects.push({ k: 'deco_' + d.type, x: d.tx, y: d.ty });
    this.buildCollision();
  }
  addDecoration(type) {
    if (!['flower', 'lamp', 'scarecrow'].includes(type)) return false;
    const used = new Set(this.decorations.map(d => d.tx + ',' + d.ty));
    const slots = DECORATION_SLOTS;
    const slot = slots.find(([x, y]) => !used.has(x + ',' + y) && (y < 24 || this.expanded));
    if (!slot) return false;
    this.decorations.push({ tx: slot[0], ty: slot[1], type });
    this.setDecorations(this.decorations);
    return true;
  }
  buildCollision() {
    this.solids = []; this.objAt = new Map();
    const mark = (tx, ty, k) => this.objAt.set(ty * this.w + tx, k);
    for (const o of this.objects) {
      const px = o.x * T, py = o.y * T;
      if (o.k === 'tree') { this.solids.push({ x: px + 5, y: py + 6, w: 6, h: 9 }); mark(o.x, o.y, 'tree'); }
      else if (o.k === 'house') {
        const size = this.houseSize(), left = px - Math.floor((size.w - 48) / 2), top = py - (size.h - 48);
        this.solids.push({ x: left + 4, y: top + size.h - 26, w: size.w - 8, h: 26 });
        const cols = Math.ceil(size.w / T), rows = Math.ceil(size.h / T);
        for (let dy = 0; dy < rows; dy++) for (let dx = 0; dx < cols; dx++) mark(o.x + dx - Math.floor((cols - 3) / 2), o.y + dy - Math.ceil((rows - 3)), 'house');
      } else if (o.k === 'villageHouse') {
        this.solids.push({ x: px + 2, y: py + 10, w: 42, h: 22 });
        for (let dy = 0; dy < 3; dy++) for (let dx = 0; dx < 3; dx++) mark(o.x + dx, o.y + dy, 'villageHouse');
      } else if (o.k === 'market') {
        this.solids.push({ x: px + 2, y: py + 10, w: 42, h: 18 });
        for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 3; dx++) mark(o.x + dx, o.y + dy, 'market');
      } else if (o.k === 'well') {
        this.solids.push({ x: px + 3, y: py + 5, w: 10, h: 10 }); mark(o.x, o.y, 'well');
      } else if (o.k === 'villageSign') {
        this.solids.push({ x: px + 6, y: py + 5, w: 5, h: 10 }); mark(o.x, o.y, 'villageSign');
      } else if (o.k === 'regionGate') {
        this.solids.push({ x: px + 2, y: py + 2, w: 12, h: 14 }); mark(o.x, o.y, 'regionGate');
      } else if (o.k === 'rock') {
        this.solids.push({ x: px + 3, y: py + 7, w: 10, h: 8 }); mark(o.x, o.y, 'rock');
      } else if (o.k === 'caveEntrance') {
        this.solids.push({ x: px + 1, y: py + 5, w: 30, h: 18 });
        for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) mark(o.x + dx, o.y + dy, 'caveEntrance');
      } else if (o.k === 'regionSign') {
        this.solids.push({ x: px + 5, y: py + 7, w: 6, h: 8 }); mark(o.x, o.y, 'regionSign');
      } else if (o.k === 'villager') {
        // NPC bergerak dinamis; tile interaksinya dihitung dari posisi aktual di kindAt().
      } else if (o.k === 'shop') {
        this.solids.push({ x: px + 2, y: py + 12, w: 28, h: 20 });
        for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) mark(o.x + dx, o.y + dy, 'shop');
      } else if (o.k === 'fenceH') { this.solids.push({ x: px, y: py + 8, w: 16, h: 8 }); mark(o.x, o.y, 'fence'); }
      else if (o.k === 'fenceV') { this.solids.push({ x: px + 5, y: py, w: 6, h: 16 }); mark(o.x, o.y, 'fence'); }
    }
  }
  // Apakah kotak (x,y,w,h) dalam piksel menabrak air, objek, atau batas peta?
  isBlocked(x, y, w, h) {
    if (x < 0 || y < 0 || x + w > this.w * T || y + h > this.h * T) return true;
    for (let ty = Math.floor(y / T); ty <= Math.floor((y + h - 1) / T); ty++)
      for (let tx = Math.floor(x / T); tx <= Math.floor((x + w - 1) / T); tx++)
        if (this.at(tx, ty) === WATER) return true;
    for (const s of this.solids) if (x < s.x + s.w && x + w > s.x && y < s.y + s.h && y + h > s.y) return true;
    return false;
  }
  villagerAt(tx, ty) {
    return this.objects.find(o => o.k === 'villager' && Math.floor(o.x) === tx && Math.floor(o.y) === ty) || null;
  }
  kindAt(tx, ty) {
    if (tx < 0 || ty < 0 || tx >= this.w || ty >= this.h) return null;
    const villager = this.villagerAt(tx, ty);
    if (villager) return 'villager';
    const o = this.objAt.get(ty * this.w + tx);
    if (o) return o;
    const id = this.at(tx, ty);
    if (id === WATER) return 'water';
    if (id === PATH) return 'path';
    if (id === DIRT && this.isFarmableSoil(tx, ty)) return 'soil';
    // Area gua memiliki variasi tanah berbatu dengan ID tile yang sebagian sama
    // dengan tanah kebun. Pisahkan jenisnya agar tidak bisa ditanami.
    if (tx >= 35 && tx <= 64 && ty >= 39 && ty <= 60) return 'rockyGround';
    return 'grass';
  }
  sortY(o) { return o.k === 'house' ? (o.y + HOUSE.h) * T : ['shop','market','villageHouse'].includes(o.k) ? (o.y + 2) * T : o.y * T + T; }

  // extras: [{y, draw(ctx)}] digambar bersama objek dunia agar urutan depan-belakang benar.
  draw(ctx, cam, clock, extras, ground) {
    const cx = Math.round(cam.x), cy = Math.round(cam.y);
    ctx.save(); ctx.translate(-cx, -cy);
    const x0 = Math.max(0, Math.floor(cx / T)), x1 = Math.min(this.w - 1, Math.ceil((cx + CFG.W) / T));
    const y0 = Math.max(0, Math.floor(cy / T)), y1 = Math.min(this.h - 1, Math.ceil((cy + CFG.H) / T));
    const wf = Math.floor(clock * 2) % 2;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      if (this.at(x, y) !== WATER) continue;
      const wx = x * T, wy = y * T;
      ctx.drawImage(SPR.water[wf], wx, wy);
      // Bibir kolam tipis hanya pada sisi yang berbatasan dengan daratan.
      ctx.fillStyle = PAL.earthMid;
      if (y === 0 || this.at(x, y - 1) !== WATER) { ctx.fillRect(wx, wy, T, 1); ctx.fillStyle = PAL.pathBase; ctx.fillRect(wx, wy + 1, T, 1); ctx.fillStyle = PAL.earthMid; }
      if (y === this.h - 1 || this.at(x, y + 1) !== WATER) { ctx.fillRect(wx, wy + T - 1, T, 1); ctx.fillStyle = PAL.pathBase; ctx.fillRect(wx, wy + T - 2, T, 1); ctx.fillStyle = PAL.earthMid; }
      if (x === 0 || this.at(x - 1, y) !== WATER) { ctx.fillRect(wx, wy, 1, T); ctx.fillStyle = PAL.pathBase; ctx.fillRect(wx + 1, wy, 1, T); ctx.fillStyle = PAL.earthMid; }
      if (x === this.w - 1 || this.at(x + 1, y) !== WATER) { ctx.fillRect(wx + T - 1, wy, 1, T); ctx.fillStyle = PAL.pathBase; ctx.fillRect(wx + T - 2, wy, 1, T); ctx.fillStyle = PAL.earthMid; }
    }
    ctx.drawImage(this.groundCache(this.lush), cx, cy, CFG.W, CFG.H, cx, cy, CFG.W, CFG.H);
    if (ground) ground(ctx, x0, y0, x1, y1);
    const list = [];
    for (const o of this.objects) {
      const px = o.x * T, py = o.y * T;
      if (px < cx - 56 || px > cx + CFG.W + 56 || py < cy - 56 || py > cy + CFG.H + 56) continue;
      list.push({ y: this.sortY(o), draw: (c) => this.drawObject(c, o) });
    }
    for (const e of extras) list.push(e);
    list.sort((a, b) => a.y - b.y);
    for (const d of list) d.draw(ctx);
    ctx.restore();
  }
  drawObject(c, o) {
    const px = o.x * T, py = o.y * T;
    if (o.k === 'tree') c.drawImage(SPR.tree, px - 8, py - 24);
    else if (o.k === 'house') { const size = this.houseSize(); c.drawImage(SPR.houses[this.houseLevel], px - Math.floor((size.w - 48) / 2), py - (size.h - 48)); }
    else if (o.k === 'shop') c.drawImage(SPR.shop, px, py);
    else if (o.k === 'villageHouse') c.drawImage(SPR.villageHouse, px - 1, py + 5);
    else if (o.k === 'market') c.drawImage(SPR.market, px - 1, py + 2);
    else if (o.k === 'well') c.drawImage(SPR.well, px, py);
    else if (o.k === 'villageSign') c.drawImage(SPR.villageSign, px, py);
    else if (o.k === 'villager') {
      c.save();
      const mira = o.name === 'Mira';
      const sx = Math.round(px), sy = Math.round(py);
      drawVillager(c, sx, sy, o.dir || 0, o.moving ? (o.walkFrame ? 2 : 1) : 0, mira);
      // Label tetap di posisi dan ukuran lama; koordinat gambar dibulatkan agar piksel tetap tajam.
      c.fillStyle = PAL.labelBackground; c.fillRect(sx - 7, sy - 10, 30, 8);
      c.fillStyle = PAL.labelText; c.font = 'bold 7px monospace'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(o.name, sx + 8, sy - 6);
      c.restore();
    }
    else if (o.k === 'regionGate') {
      c.fillStyle = PAL.brownDark; c.fillRect(px + 2, py + 2, 12, 14);
      c.fillStyle = PAL.brownLight; c.fillRect(px + 4, py + 3, 8, 12);
      c.fillStyle = PAL.creamDark; c.fillRect(px + 10, py + 8, 1, 2);
      c.fillStyle = PAL.labelBackground; c.fillRect(px - 15, py - 9, 46, 7);
      c.fillStyle = PAL.labelText; c.font = 'bold 6px monospace'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(o.title, px + 8, py - 5);
    } else if (o.k === 'rock') {
      c.drawImage(SPR.rock, px, py);
    } else if (o.k === 'caveEntrance') {
      c.fillStyle = PAL.brownDark; c.fillRect(px, py + 5, 32, 18);
      c.fillStyle = PAL.stoneObject; c.fillRect(px + 2, py + 2, 28, 9);
      c.fillStyle = PAL.caveDark; c.fillRect(px + 7, py + 9, 18, 14);
      c.fillStyle = PAL.stoneObjectLight; c.fillRect(px + 4, py + 5, 5, 4); c.fillRect(px + 23, py + 4, 5, 5);
    } else if (o.k === 'regionSign') {
      c.drawImage(SPR.regionSign, px, py);
      c.fillStyle = PAL.cream; c.font = 'bold 5px monospace'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(o.title, px + 8, py + 5);
    }
    else if (o.k === 'fenceH' || o.k === 'fenceV') c.drawImage(o.k === 'fenceH' ? SPR.fenceH : SPR.fenceV, px, py);
    else if (o.k === 'deco_flower') c.drawImage(SPR.decoFlower, px, py);
    else if (o.k === 'deco_lamp') c.drawImage(SPR.decoLamp, px, py);
    else if (o.k === 'deco_scarecrow') c.drawImage(SPR.decoScarecrow, px, py);
  }
}
