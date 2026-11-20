import { CROPS } from '../data/crops.js';
import { CFG, RULES } from '../data/config.js';
import { HOTBAR } from '../data/items.js';

// Penyimpanan progres dan pengaturan di localStorage.
// Penulisan dua langkah + cadangan: data lama tidak ditimpa sebelum data baru terbukti valid.
const KEY = 'tfl_save_v1', BAK = 'tfl_save_v1_bak', TMP = 'tfl_save_v1_tmp', SET = 'tfl_settings_v1';
export const VERSION = 1;
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const store = () => { try { return globalThis.localStorage || null; } catch (e) { return null; } };
const num = (v, min, max) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : null);
const int = (v, min, max) => (Number.isInteger(v) && v >= min && v <= max ? v : null);

// Membersihkan dan memeriksa data simpanan. Mengembalikan data aman, atau null bila tidak valid.
export function sanitize(raw, world) {
  if (!raw || typeof raw !== 'object' || raw.v !== VERSION) return null;
  const coins = int(raw.coins, 0, 1e7), day = int(raw.day, 1, 1000000);
  const minutes = num(raw.minutes, CFG.START_MINUTES, RULES.END_MINUTES - 1);
  if (coins === null || day === null || minutes === null) return null;
  const pr = raw.player || {};
  let x = num(pr.x, 0, CFG.MAP_W * 16 - 16), y = num(pr.y, 0, CFG.MAP_H * 16 - 16);
  if (x === null || y === null || world.isBlocked(x + 4, y + 10, 8, 5)) { x = 19 * 16; y = 12 * 16; }
  const items = {};
  if (raw.items && typeof raw.items === 'object')
    for (const [k, v] of Object.entries(raw.items)) {
      const m = /^(seed|crop|fine)_(\w+)$/.exec(k);
      if (m && has(CROPS, m[2]) && Number.isInteger(v) && v >= 0 && v <= 9999) items[k] = v;
    }
  const expanded = raw.expanded === true;
  const regionRaw = raw.regions && typeof raw.regions === 'object' ? raw.regions : {};
  const regions = { forest: regionRaw.forest === true, lake: regionRaw.lake === true, cave: regionRaw.cave === true };
  const houseLevel = int(raw.houseLevel, 1, 3) ?? 1;
  const maxEnergy = CFG.MAX_ENERGY + (houseLevel - 1) * 10;
  const energy = num(raw.energy, 1, maxEnergy);
  if (energy === null) return null;
  const rawTools = raw.toolUpgrades && typeof raw.toolUpgrades === 'object' ? raw.toolUpgrades : {};
  const toolUpgrades = { hoe: int(rawTools.hoe, 1, 2) ?? 1, can: int(rawTools.can, 1, 2) ?? 1 };
  const plots = [], seen = new Set();
  if (Array.isArray(raw.plots))
    for (const e of raw.plots) {
      if (!Array.isArray(e) || e.length !== 5) continue;
      const [tx, ty, crop, growth, watered] = e;
      if (!Number.isInteger(tx) || !Number.isInteger(ty) || !world.isFarmableSoil(tx, ty, expanded) || seen.has(tx + ',' + ty)) continue;
      if (crop !== null && !(typeof crop === 'string' && has(CROPS, crop))) continue;
      const g = crop ? num(growth, 0, CROPS[crop].days + 3) : 0;
      if (g === null || typeof watered !== 'boolean') continue;
      seen.add(tx + ',' + ty); plots.push([tx, ty, crop, g, watered]);
    }
  const ds = raw.dailyStats && typeof raw.dailyStats === 'object' ? raw.dailyStats : {};
  const statKeys = ['tilled', 'planted', 'watered', 'rainWatered', 'harvested', 'sold', 'bought', 'earned', 'spent'];
  const dailyStats = {};
  for (const k of statKeys) dailyStats[k] = Number.isInteger(ds[k]) && ds[k] >= 0 && ds[k] <= 1000000 ? ds[k] : 0;
  const weather = ['sunny', 'cloudy', 'rainy'].includes(raw.weather) ? raw.weather : 'sunny';
  const decorations = []; const decoSeen = new Set();
  const movedSlots = new Map([
    // Migrasi slot lama dan slot ekspansi HOTFIX dev.3.1 ke area dekorasi terpisah.
    ['16,24', [28, 25]], ['23,24', [31, 25]],
    ['16,28', [28, 28]], ['23,28', [31, 28]],
    ['15,24', [28, 25]], ['24,24', [31, 25]],
    ['15,27', [28, 28]], ['24,27', [31, 28]]
  ]);
  if (Array.isArray(raw.decorations)) for (const d of raw.decorations) {
    if (!d || !Number.isInteger(d.tx) || !Number.isInteger(d.ty) ||
      !['flower', 'lamp', 'scarecrow'].includes(d.type)) continue;
    const moved = movedSlots.get(d.tx + ',' + d.ty);
    const tx = moved ? moved[0] : d.tx, ty = moved ? moved[1] : d.ty;
    if (!world.isDecorationSlot(tx, ty) || (ty >= 24 && !expanded)) continue;
    const k = tx + ',' + ty; if (decoSeen.has(k)) continue; decoSeen.add(k); decorations.push({ tx, ty, type: d.type });
  }
  const wellUsedDay = int(raw.wellUsedDay, 0, day) ?? 0;
  const relationships = {};
  for (const name of ['Mira', 'Bima']) {
    const r = raw.relationships && raw.relationships[name] || {};
    relationships[name] = {
      points: int(r.points, 0, 20) ?? 0,
      lastTalkDay: int(r.lastTalkDay, 0, day) ?? 0,
      lastGiftDay: int(r.lastGiftDay, 0, day) ?? 0
    };
  }
  const quests = {};
  for (const name of ['Mira', 'Bima']) {
    const q = raw.quests && raw.quests[name] || {};
    const status = ['available', 'active', 'complete', 'claimed'].includes(q.status) ? q.status : 'available';
    const goal = name === 'Mira' ? 3 : 4;
    const progress = Number.isInteger(q.progress) ? Math.max(0, Math.min(goal, q.progress)) : 0;
    quests[name] = { status: progress >= goal && status === 'active' ? 'complete' : status, progress };
  }
  return { coins, day, minutes, energy, weather, expanded, regions, houseLevel, toolUpgrades, decorations, quests, wellUsedDay, relationships, selected: int(raw.selected, 0, HOTBAR.length - 1) ?? 0,
    player: { x, y, dir: int(pr.dir, 0, 3) ?? 0 }, items, plots, dailyStats };
}

const parses = (s) => { try { return JSON.parse(s).v === VERSION; } catch (e) { return false; } };

export function write(data) {
  const s = store(); if (!s) return false;
  try {
    const json = JSON.stringify({ ...data, v: VERSION, saved: Date.now() });
    JSON.parse(json);
    const prev = s.getItem(KEY);
    if (prev && parses(prev)) s.setItem(BAK, prev);
    s.setItem(TMP, json);
    if (s.getItem(TMP) !== json) return false;
    s.setItem(KEY, json); s.removeItem(TMP);
    return true;
  } catch (e) { return false; }
}
export function read(world) {
  const s = store(); if (!s) return null;
  for (const k of [KEY, BAK]) {
    try { const raw = s.getItem(k); if (raw) { const d = sanitize(JSON.parse(raw), world); if (d) return d; } } catch (e) { /* coba cadangan */ }
  }
  return null;
}
// 'none' (tidak ada), 'ok', atau 'corrupt' (ada tetapi tidak bisa dibaca).
export function status(world) {
  const s = store(); if (!s) return 'none';
  let any = false; try { any = !!(s.getItem(KEY) || s.getItem(BAK)); } catch (e) { return 'none'; }
  return !any ? 'none' : read(world) ? 'ok' : 'corrupt';
}
export function clear() { const s = store(); if (s) try { s.removeItem(KEY); s.removeItem(BAK); s.removeItem(TMP); } catch (e) { /* abaikan */ } }

export function readSettings() {
  const d = { music: true, sfx: true, fps: false };
  try { const o = JSON.parse(store().getItem(SET)); for (const k of Object.keys(d)) if (typeof o[k] === 'boolean') d[k] = o[k]; } catch (e) { /* pakai bawaan */ }
  return d;
}
export function writeSettings(o) { const s = store(); if (s) try { s.setItem(SET, JSON.stringify(o)); } catch (e) { /* abaikan */ } }
