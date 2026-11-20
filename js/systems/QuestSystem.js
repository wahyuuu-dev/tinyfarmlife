// Quest desa V1.4.0. Progres dicatat dari aksi panen dan transaksi toko.
export const VILLAGE_QUESTS = {
  Mira: { id: 'mira_market', title: 'Pasokan untuk Pasar', description: 'Jual 3 Carrot kepada pasar.', type: 'sell', crop: 'carrot', goal: 3, reward: 60 },
  Bima: { id: 'bima_wheat', title: 'Persediaan Gandum', description: 'Panen 4 Wheat untuk persediaan desa.', type: 'harvest', crop: 'wheat', goal: 4, reward: 75 },
};

const fresh = () => Object.fromEntries(Object.entries(VILLAGE_QUESTS).map(([name, q]) => [name, { status: 'available', progress: 0 }]));

export class QuestSystem {
  constructor(state, onChange = () => {}) {
    this.state = state;
    this.onChange = onChange;
    this.data = fresh();
  }
  load(raw) {
    const clean = fresh();
    if (raw && typeof raw === 'object') for (const name of Object.keys(clean)) {
      const q = raw[name]; if (!q || typeof q !== 'object') continue;
      const def = VILLAGE_QUESTS[name];
      const status = ['available', 'active', 'complete', 'claimed'].includes(q.status) ? q.status : 'available';
      const progress = Number.isInteger(q.progress) ? Math.max(0, Math.min(def.goal, q.progress)) : 0;
      clean[name] = { status, progress };
      if (clean[name].progress >= def.goal && status === 'active') clean[name].status = 'complete';
    }
    this.data = clean; this.onChange();
  }
  snapshot() { return Object.fromEntries(Object.entries(this.data).map(([k, v]) => [k, { ...v }])); }
  actionFor(name) {
    const def = VILLAGE_QUESTS[name], q = this.data[name];
    if (!def || !q) return null;
    if (q.status === 'available') return { label: 'Ambil quest: ' + def.title, detail: def.description };
    if (q.status === 'active') return { label: 'Lihat quest: ' + def.title, detail: def.description + ' (' + q.progress + '/' + def.goal + ')' };
    if (q.status === 'complete') return { label: 'Ambil hadiah: ' + def.reward + ' koin', detail: 'Tugas selesai! Kembali untuk mengambil hadiah.' };
    return { label: 'Quest selesai: ' + def.title, detail: 'Terima kasih sudah membantu desa!' };
  }
  interact(name) {
    const def = VILLAGE_QUESTS[name], q = this.data[name];
    if (!def || !q) return 'Belum ada tugas untukmu.';
    if (q.status === 'available') { q.status = 'active'; this.onChange(); return 'Quest diterima: ' + def.description; }
    if (q.status === 'active') return def.description + ' Progres: ' + q.progress + '/' + def.goal + '.';
    if (q.status === 'complete') {
      q.status = 'claimed'; this.state.coins += def.reward; this.onChange();
      return 'Hadiah diterima! +' + def.reward + ' koin.';
    }
    return 'Quest ini sudah selesai. Terima kasih!';
  }
  record(type, crop, qty = 1) {
    let changed = false;
    for (const [name, def] of Object.entries(VILLAGE_QUESTS)) {
      const q = this.data[name];
      if (q.status !== 'active' || def.type !== type || def.crop !== crop) continue;
      q.progress = Math.min(def.goal, q.progress + Math.max(0, qty));
      if (q.progress >= def.goal) q.status = 'complete';
      changed = true;
    }
    if (changed) this.onChange();
    return changed;
  }
  activeSummary() {
    for (const [name, def] of Object.entries(VILLAGE_QUESTS)) {
      const q = this.data[name];
      if (q.status === 'active' || q.status === 'complete') return { title: def.title, progress: q.progress, goal: def.goal, complete: q.status === 'complete' };
    }
    return null;
  }
}
