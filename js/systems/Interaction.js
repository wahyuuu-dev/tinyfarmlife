import { CROPS } from '../data/crops.js';

// Menentukan objek di depan karakter. Tanah pertanian menampilkan status petaknya.
const LABEL = { grass: 'Rumput', soil: 'Tanah pertanian', path: 'Jalan setapak', water: 'Kolam',
  tree: 'Pohon', rockyGround: 'Tanah berbatu', house: 'Rumah: tidur', shop: 'Toko', fence: 'Pagar kebun', villageHouse: 'Rumah warga', market: 'Pasar Desa: jual hasil panen', well: 'Sumur desa: pulihkan energi', villageSign: 'Papan nama desa', villager: 'Warga desa', regionGate: 'Gerbang wilayah', rock: 'Batu', caveEntrance: 'Pintu masuk gua', regionSign: 'Papan petunjuk' };
const INFO = { grass: 'Rumput liar.', path: 'Jalan setapak menuju rumah.',
  water: 'Air kolam. Tidak bisa dilewati.', rockyGround: 'Permukaan berbatu. Tidak cocok untuk pertanian.', tree: 'Pohon yang rindang.', fence: 'Pagar kebun.', villageHouse: 'Rumah warga Greenfield Village.', market: 'Pasar Greenfield Village. Jual hasil panen di sini; benih dan upgrade tersedia di Toko Kebun dekat rumah.', well: 'Sumur desa dapat memulihkan 15 energi sekali setiap hari.', villageSign: 'Selamat datang di Greenfield Village.', rock: 'Bongkahan batu. Belum bisa ditambang.', caveEntrance: 'Mulut gua yang gelap. Eksplorasi gua lebih lanjut direncanakan untuk tahap berikutnya.', regionSign: 'Petunjuk menuju wilayah baru.' };

export class Interaction {
  constructor() { this.target = null; }
  update(player, world, farming) {
    const f = player.front(), kind = world.kindAt(f.tx, f.ty);
    if (!kind) { this.target = null; return; }
    let label = LABEL[kind];
    if (kind === 'soil') {
      const p = farming.get(f.tx, f.ty), st = farming.stageOf(p);
      if (p) {
        if (!p.crop) label = 'Tanah dicangkul';
        else if (st === 3) label = CROPS[p.crop].name + ' siap panen';
        else label = CROPS[p.crop].name + (p.watered ? ' (disiram)' : ' (kering)');
      }
    }
    const villager = kind === 'villager' ? world.villagerAt(f.tx, f.ty) : null;
    if (villager) label = villager.name + ' — ' + villager.role;
    const obj = kind === 'regionGate' ? world.objects.find(o => o.k === 'regionGate' && o.x === f.tx && o.y === f.ty) : null;
    if (obj) label = 'Gerbang: ' + obj.title;
    this.target = { tx: f.tx, ty: f.ty, kind, label, villager, region: obj ? obj.region : null };
  }
  act() {
    if (this.target.kind === 'villager') {
      const v = this.target.villager;
      if (!v) return 'Warga desa sedang tidak tersedia.';
      return v.name === 'Mira'
        ? 'Mira: Selamat datang di Greenfield Village! Kamu bisa menjual hasil panen di pasar. Untuk benih dan perlengkapan, kunjungi Toko Kebun dekat rumahmu.'
        : 'Bima: Jalan ke arah barat akan membawamu kembali ke Home Farm. Senang melihat desa mulai ramai.';
    }
    return INFO[this.target.kind] || 'Tidak ada yang bisa dilakukan di sini.';
  }
}
