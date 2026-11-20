// Hubungan sosial sederhana dengan warga. Interaksi dibatasi sekali per hari permainan.
const DEFINITIONS = {
  Mira: { likes: ['crop_carrot', 'crop_tomato'], giftNames: { crop_carrot: 'Carrot', crop_tomato: 'Tomato', crop_wheat: 'Wheat', crop_daisy: 'Daisy' } },
  Bima: { likes: ['crop_wheat', 'crop_daisy'], giftNames: { crop_carrot: 'Carrot', crop_tomato: 'Tomato', crop_wheat: 'Wheat', crop_daisy: 'Daisy' } }
};
const fresh = () => Object.fromEntries(Object.keys(DEFINITIONS).map(name => [name, { points: 0, lastTalkDay: 0, lastGiftDay: 0 }]));

export class NPCRelationship {
  constructor() { this.data = fresh(); }
  load(raw) {
    const clean = fresh();
    if (raw && typeof raw === 'object') for (const name of Object.keys(clean)) {
      const r = raw[name]; if (!r || typeof r !== 'object') continue;
      clean[name] = {
        points: Number.isInteger(r.points) ? Math.max(0, Math.min(20, r.points)) : 0,
        lastTalkDay: Number.isInteger(r.lastTalkDay) && r.lastTalkDay >= 0 ? r.lastTalkDay : 0,
        lastGiftDay: Number.isInteger(r.lastGiftDay) && r.lastGiftDay >= 0 ? r.lastGiftDay : 0
      };
    }
    this.data = clean;
  }
  snapshot() { return Object.fromEntries(Object.entries(this.data).map(([k, v]) => [k, { ...v }])); }
  level(name) {
    const p = this.data[name]?.points || 0;
    return p >= 10 ? 'Sahabat dekat' : p >= 5 ? 'Teman' : 'Kenalan';
  }
  status(name) {
    const p = this.data[name]?.points || 0;
    return `${this.level(name)} · ${p}/20 kedekatan`;
  }
  actions(name, day, inventory) {
    const r = this.data[name], def = DEFINITIONS[name];
    if (!r || !def) return [];
    const actions = [];
    if (r.lastTalkDay !== day) actions.push({ label: 'Sapa warga (+1 kedekatan)', run: () => this.talk(name, day) });
    else actions.push({ label: 'Sudah menyapa hari ini', disabled: true });
    if (r.lastGiftDay !== day) {
      const candidates = [...def.likes, ...Object.keys(def.giftNames).filter(id => !def.likes.includes(id))];
      const item = candidates.find(id => inventory.count(id) > 0);
      if (item) actions.push({ label: `Berikan ${def.giftNames[item]}${def.likes.includes(item) ? ' (disukai)' : ''}`, run: () => this.gift(name, day, item, inventory) });
      else actions.push({ label: 'Belum punya hasil panen untuk hadiah', disabled: true });
    } else actions.push({ label: 'Sudah memberi hadiah hari ini', disabled: true });
    return actions;
  }
  talk(name, day) {
    const r = this.data[name];
    if (!r || r.lastTalkDay === day) return 'Kamu sudah menyapa hari ini. Sampai jumpa besok!';
    r.lastTalkDay = day; r.points = Math.min(20, r.points + 1);
    return `Terima kasih sudah menyempatkan waktu untuk menyapa. ${name} merasa senang! (${r.points}/20 kedekatan)`;
  }
  gift(name, day, item, inventory) {
    const r = this.data[name], def = DEFINITIONS[name];
    if (!r || !def || r.lastGiftDay === day) return 'Kamu sudah memberi hadiah hari ini.';
    if (!def.giftNames[item] || !inventory.remove(item, 1)) return 'Hadiah tidak tersedia di tas.';
    r.lastGiftDay = day;
    const liked = def.likes.includes(item), gain = liked ? 2 : 1;
    r.points = Math.min(20, r.points + gain);
    return liked
      ? `${name} menyukai ${def.giftNames[item]}! Kedekatan +${gain}. (${r.points}/20)`
      : `${name} berterima kasih atas ${def.giftNames[item]}. Kedekatan +${gain}. (${r.points}/20)`;
  }
}
