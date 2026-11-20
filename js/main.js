import { CFG, START_ITEMS, RULES, VERSION } from './data/config.js';
import { HOTBAR } from './data/items.js';
import { CROPS } from './data/crops.js';
import { Game } from './engine/Game.js';
import { Renderer } from './engine/Renderer.js';
import { Input } from './engine/Input.js';
import { World } from './world/World.js';
import { Camera } from './world/Camera.js';
import { Player } from './entities/Player.js';
import { Interaction } from './systems/Interaction.js';
import { NPCSystem } from './systems/NPCSystem.js';
import { NPCRelationship } from './systems/NPCRelationship.js';
import { Farming } from './systems/Farming.js';
import { Inventory } from './systems/Inventory.js';
import { Economy } from './systems/Economy.js';
import { QuestSystem } from './systems/QuestSystem.js';
import { Harmony, LEVEL_NAMES } from './systems/Harmony.js';
import { advance, drawTint } from './systems/TimeSystem.js';
import { rollWeather, WEATHER } from './systems/Weather.js';
import { spend } from './systems/Energy.js';
import * as Save from './systems/Save.js';
import { AudioSys } from './audio/Audio.js';
import { HUD } from './ui/HUD.js';
import { Effects } from './ui/Effects.js';
import { Menus } from './ui/Menus.js';
import { Shop } from './ui/Shop.js';
import { InventoryPanel } from './ui/InventoryPanel.js';
import { TouchControls } from './ui/TouchControls.js';
import { Dialogue } from './ui/Dialogue.js';

const $ = (id) => document.getElementById(id);
const renderer = new Renderer($('game'), $('stage'));
const input = new Input();
const touch = new TouchControls($('joyZone'), $('joyBase'), $('joyKnob'), input);
const world = new World(), camera = new Camera(), player = new Player(), hud = new HUD(), fx = new Effects();
// Satu instance NPCSystem mengelola rutinitas dan pergerakan semua villager di World.
const npcSystem = new NPCSystem();
const npcRelationship = new NPCRelationship();
const interaction = new Interaction(), farming = new Farming(), inventory = new Inventory(START_ITEMS), harmony = new Harmony();
const audio = new AudioSys();
const portrait = matchMedia('(orientation: portrait) and (pointer: coarse)');
const settings = Save.readSettings();
audio.setMusic(settings.music); audio.setSfx(settings.sfx);

function refreshQuestTracker() {
  const el = $('questTracker'); if (!el || !questSystem) return;
  const q = questSystem.activeSummary();
  el.classList.toggle('hidden', !q);
  if (q) { $('questTrackerTitle').textContent = q.title; $('questTrackerProgress').textContent = q.complete ? 'Selesai — kembali ke NPC untuk hadiah' : q.progress + ' / ' + q.goal; }
}

const state = { mode: 'menu', coins: CFG.START_COINS, day: 1, minutes: CFG.START_MINUTES, energy: CFG.MAX_ENERGY,
  selected: 0, target: null, inventory, harmonyName: LEVEL_NAMES[1], trans: null, grown: [],
  showFps: settings.fps, clock: 0, fps: 0, frames: 0, fpsT: 0,
  weather: 'sunny',
  dailyStats: { tilled: 0, planted: 0, watered: 0, rainWatered: 0, harvested: 0, sold: 0, bought: 0, earned: 0, spent: 0 },
  summary: null, expanded: false, decorations: [], houseLevel: 1, maxEnergy: CFG.MAX_ENERGY, toolUpgrades: { hoe: 1, can: 1 }, wellUsedDay: 0 };
const economy = new Economy(state, inventory, () => harmony.level);
const questSystem = new QuestSystem(state, refreshQuestTracker);
const shop = new Shop($('shop'), economy, (op, r) => {
  audio.play(!r.ok ? 'error' : op === 'buy' ? 'buy' : 'coin');
  if (r.ok && op === 'buy') { state.dailyStats.bought += r.qty || 1; state.dailyStats.spent += r.amount || 0; }
  if (r.ok && (op === 'sell' || op === 'all')) {
    state.dailyStats.sold += r.qty || 1;
    state.dailyStats.earned += r.amount || 0;
    // Quest Mira menghitung Carrot yang benar-benar berhasil dijual, termasuk tombol Jual Semua.
    questSystem.record('sell', r.crop, r.qty || 1);
  }
  if (r.ok) saveGame();
}, (type) => {
  const prices = { expansion: 300, flower: 35, lamp: 60, scarecrow: 80, house2: 500, house3: 1200, hoeUpgrade: 180, canUpgrade: 220 };
  const labels = { expansion: 'Lahan baru', flower: 'Pot bunga', lamp: 'Lampu taman', scarecrow: 'Orang-orangan sawah', house2: 'Rumah Level 2', house3: 'Rumah Level 3', hoeUpgrade: 'Cangkul Baja', canUpgrade: 'Penyiram Lebar' };
  if (type === 'expansion' && world.expanded) return { ok: false, msg: 'Lahan tambahan sudah dibuka.' };
  if (type === 'house2' && world.houseLevel !== 1) return { ok: false, msg: 'Upgrade rumah ini tidak tersedia.' };
  if (type === 'house3' && world.houseLevel !== 2) return { ok: false, msg: 'Upgrade rumah ini tidak tersedia.' };
  if (type === 'hoeUpgrade' && state.toolUpgrades.hoe >= 2) return { ok: false, msg: 'Cangkul sudah ditingkatkan.' };
  if (type === 'canUpgrade' && state.toolUpgrades.can >= 2) return { ok: false, msg: 'Penyiram sudah ditingkatkan.' };
  if (['flower', 'lamp', 'scarecrow'].includes(type) && world.decorations.length >= (world.expanded ? 8 : 4)) return { ok: false, msg: 'Semua tempat dekorasi sudah terisi.' };
  if (state.coins < prices[type]) return { ok: false, msg: 'Koin belum cukup.' };
  if (type === 'expansion') world.setExpanded(true);
  else if (type === 'house2' || type === 'house3') { world.setHouseLevel(type === 'house2' ? 2 : 3); state.houseLevel = world.houseLevel; state.maxEnergy = CFG.MAX_ENERGY + (world.houseLevel - 1) * 10; }
  else if (type === 'hoeUpgrade') state.toolUpgrades.hoe = 2;
  else if (type === 'canUpgrade') state.toolUpgrades.can = 2;
  else if (!world.addDecoration(type)) return { ok: false, msg: 'Tidak ada tempat kosong untuk dekorasi.' };
  state.expanded = world.expanded; state.decorations = world.decorations; state.houseLevel = world.houseLevel;
  state.coins -= prices[type]; state.dailyStats.bought++; state.dailyStats.spent += prices[type];
  saveGame();
  return { ok: true, msg: labels[type] + ' berhasil dibeli!' };
});
const bag = new InventoryPanel($('inventory'), state, inventory);
const dialogue = new Dialogue($('npcDialogue'));
let saveStatus = 'none', stepT = 0;

// ---------- Simpan dan muat ----------
const SAVE_MODES = ['playing', 'shop', 'inventory', 'paused'];
function snapshot() {
  const plots = [];
  for (const [k, p] of farming.plots) { const [tx, ty] = k.split(',').map(Number); plots.push([tx, ty, p.crop, p.growth, p.watered]); }
  return { coins: state.coins, day: state.day, minutes: state.minutes, energy: state.energy, weather: state.weather, selected: state.selected, quests: questSystem.snapshot(),
    dailyStats: { ...state.dailyStats }, wellUsedDay: state.wellUsedDay, relationships: npcRelationship.snapshot(),
    expanded: world.expanded, regions: { ...world.regionStates }, houseLevel: world.houseLevel, toolUpgrades: { ...state.toolUpgrades }, decorations: world.decorations.map(d => ({ ...d })),
    player: { x: player.x, y: player.y, dir: player.dir }, items: { ...inventory.items }, plots };
}
function saveGame() { return SAVE_MODES.includes(state.mode) ? Save.write(snapshot()) : false; }
function applySave(d) {
  world.reset(); world.setHouseLevel(d.houseLevel || 1); world.setExpanded(d.expanded); world.setRegions(d.regions); world.setDecorations(d.decorations);
  state.expanded = world.expanded; state.decorations = world.decorations; state.houseLevel = world.houseLevel;
  state.maxEnergy = CFG.MAX_ENERGY + (world.houseLevel - 1) * 10;
  Object.assign(state, { coins: d.coins, day: d.day, minutes: d.minutes, energy: d.energy, weather: d.weather || 'sunny', selected: d.selected, trans: null, grown: [],
    dailyStats: { ...d.dailyStats }, toolUpgrades: { ...(d.toolUpgrades || { hoe: 1, can: 1 }) }, summary: null, wellUsedDay: d.wellUsedDay || 0 });
  player.reset(); player.x = d.player.x; player.y = d.player.y; player.dir = d.player.dir;
  farming.reset();
  for (const [tx, ty, crop, growth, watered] of d.plots) farming.plots.set(tx + ',' + ty, { tx, ty, crop, growth, watered });
  inventory.items = { ...d.items };
  questSystem.load(d.quests);
  npcRelationship.load(d.relationships);
  harmony.reset(); harmony.recalc(farming.plots); fx.reset(); camera.snap(player);
  world.lush = harmony.level >= 3; state.harmonyName = LEVEL_NAMES[harmony.level];
}
function refreshContinue() {
  saveStatus = Save.status(world);
  const d = saveStatus === 'ok' ? Save.read(world) : null;
  menus.setText('continueBtn', d ? 'Lanjutkan (Hari ' + d.day + ')' : saveStatus === 'corrupt' ? 'Simpanan rusak' : 'Lanjutkan');
  menus.setDisabled('continueBtn', !d);
}

// Tombol dua langkah: ketukan pertama meminta konfirmasi, ketukan kedua menjalankan.
const armed = {};
function confirmTap(id, normal, ask, run) {
  if (armed[id]) { clearTimeout(armed[id]); armed[id] = 0; menus.setText(id, normal); run(); return; }
  menus.setText(id, ask);
  armed[id] = setTimeout(() => { armed[id] = 0; menus.setText(id, normal); }, 4000);
}
const flash = (id, text, normal) => { menus.setText(id, text); setTimeout(() => menus.setText(id, normal), 1500); };
const persistSettings = () => Save.writeSettings({ music: audio.musicOn, sfx: audio.sfxOn, fps: state.showFps });
const onOff = (v) => (v ? 'Hidup' : 'Mati');

// ---------- Mode permainan ----------
function setMode(m) { state.mode = m; document.body.dataset.mode = m; document.body.classList.toggle('playing', m === 'playing'); }
function pause() { if (state.mode === 'playing') { touch.reset(); saveGame(); setMode('paused'); menus.show('pause'); } }
function resume() { menus.hideAll(); setMode('playing'); }
function openPanel(name, title = 'Toko Kebun', shopMode = 'home') { touch.reset(); setMode(name); menus.show(name); if (name === 'shop') shop.open(title, shopMode); else bag.open(); }
function closePanel() { menus.hideAll(); setMode('playing'); saveGame(); }
function cycleTool(d) {
  if (state.mode === 'playing') state.selected = (state.selected + d + HOTBAR.length) % HOTBAR.length;
}
// Pergantian hari: layar memudar, hari diproses di titik tergelap, lalu memudar kembali.
function startDayEnd(reason) {
  if (state.mode !== 'playing') return;
  touch.reset(); audio.play(reason === 'sleep' ? 'sleep' : 'faint');
  state.trans = { t: 0, reason, done: false, title: '', sub: '' }; setMode('transition');
}
function finishDay() {
  const tr = state.trans;
  state.summary = { day: state.day, stats: { ...state.dailyStats } };
  state.grown = farming.nextDay();
  state.day++; state.minutes = CFG.START_MINUTES;
  state.weather = rollWeather();
  state.dailyStats = { tilled: 0, planted: 0, watered: 0, rainWatered: 0, harvested: 0, sold: 0, bought: 0, earned: 0, spent: 0 };
  if (WEATHER[state.weather].rain) {
    state.dailyStats.rainWatered = farming.waterAll();
  }
  state.energy = tr.reason === 'sleep' ? state.maxEnergy : Math.min(state.maxEnergy, RULES.FAINT_ENERGY);
  tr.title = 'Hari ' + state.day;
  if (state.grown.length) { // saat gelap, arahkan kamera ke tanaman yang tumbuh agar terlihat saat layar menyala
    const n = state.grown.length, mx = state.grown.reduce((s, g) => s + g.tx, 0) / n, my = state.grown.reduce((s, g) => s + g.ty, 0) / n;
    camera.peek(mx * 16 + 8, my * 16 + 8, 2.2);
  }
  tr.sub = tr.reason === 'sleep' ? 'Tidur nyenyak.' : tr.reason === 'faint' ? 'Anda pingsan kelelahan. Energi ' + RULES.FAINT_ENERGY + '%.' : 'Larut malam, Anda tertidur. Energi ' + RULES.FAINT_ENERGY + '%.';
}
function tickTransition(dt) {
  const tr = state.trans; tr.t += dt;
  if (!tr.done && tr.t >= 0.8) { tr.done = true; finishDay(); return; }
  if (tr.done && !tr.fx && tr.t >= 1.2) { // layar sudah mulai terang: nyalakan sinar dan bintang
    tr.fx = true;
    for (const g of state.grown) { fx.glow(g.tx, g.ty, g.ready); fx.burst('grow', g.tx * 16 + 8, g.ty * 16 + 10); }
    if (state.grown.length) audio.play('grow');
  }
  if (tr.done && tr.t >= 1.6) {
    const n = state.grown.length, rd = state.grown.filter((g) => g.ready).length;
    state.trans = null; setMode('playing');
    hud.notify('Hari ' + state.day + ' dimulai.' + (n ? ' ' + n + ' tanaman tumbuh.' : '') + (rd ? ' ' + rd + ' siap panen!' : ''));
    state.grown = []; saveGame();
    if (state.summary) {
      const q = state.summary, st = q.stats;
      $('summaryTitle').textContent = 'Ringkasan Hari ' + q.day;
      $('summaryStats').innerHTML = [
        ['Tanah dicangkul', st.tilled], ['Benih ditanam', st.planted], ['Tanaman disiram', st.watered],
        ['Tanaman tersiram hujan', st.rainWatered || 0],
        ['Tanaman dipanen', st.harvested], ['Hasil panen dijual', st.sold],
        ['Benih dibeli', st.bought], ['Koin diperoleh', st.earned], ['Koin digunakan', st.spent]
      ].map(([k,v]) => `<div class="summary-row"><span>${k}</span><b>${v}</b></div>`).join('');
      setMode('summary'); menus.show('dailySummary');
    }
  }
}

const TOOL_COLOR = { hoe: '#8a8f98', can: '#6cb8e6' };
function act() {
  const t = state.target;
  if (state.mode !== 'playing' || !t) return;
  if (t.kind === 'shop') { audio.play('click'); return openPanel('shop', 'Toko Kebun', 'home'); }
  if (t.kind === 'market') { audio.play('click'); return openPanel('shop', 'Pasar Desa', 'market'); }
  if (t.kind === 'well') {
    if (state.wellUsedDay === state.day) return hud.notify('Sumur sudah digunakan hari ini. Coba lagi besok.');
    if (state.energy >= state.maxEnergy) return hud.notify('Energi masih penuh. Sumur bisa digunakan saat energimu berkurang.');
    const restored = Math.min(15, state.maxEnergy - state.energy);
    state.energy += restored; state.wellUsedDay = state.day; saveGame(); audio.play('water');
    return hud.notify('Air sumur menyegarkan! +' + restored + ' energi. Kembali besok untuk menggunakannya lagi.', 4);
  }
  if (t.kind === 'house') return startDayEnd('sleep');
  if (t.kind === 'regionGate') {
    const info = world.regionInfo(t.region);
    if (!info) return hud.notify('Wilayah ini belum tersedia.');
    if (world.regionStates[t.region]) return hud.notify(info.title + ' sudah terbuka.');
    if (state.coins < info.cost) return hud.notify('Butuh ' + info.cost + ' koin untuk membuka ' + info.title + '. Koinmu: ' + state.coins + '.');
    state.coins -= info.cost;
    world.unlockRegion(t.region);
    saveGame();
    audio.play('coin');
    hud.notify(info.title + ' berhasil dibuka! ' + info.description, 5);
    return;
  }
  if (t.kind === 'villager') {
    if (!t.villager) return hud.notify('Warga desa sedang tidak tersedia.');
    audio.play('click');
    setMode('dialogue');
    dialogue.open(t.villager, () => { setMode('playing'); hud.notify('Kamu mengobrol dengan ' + t.villager.name + '.'); saveGame(); }, (name) => { const msg = questSystem.interact(name); hud.notify(msg, 4); saveGame(); return msg; }, () => questSystem.actionFor(t.villager.name), () => npcRelationship.actions(t.villager.name, state.day, inventory).map(action => ({ ...action, run: action.run ? () => { const msg = action.run(); saveGame(); return msg; } : undefined })), () => npcRelationship.status(t.villager.name));
    return;
  }
  if (t.kind !== 'soil') return hud.notify(interaction.act(), 3);
  const item = HOTBAR[state.selected];
  const r = farming.apply(item, t.tx, t.ty, inventory, state.toolUpgrades);
  hud.notify(r.msg);
  if (!r.ok) return audio.play('error');
  const cx = t.tx * 16 + 8, cy = t.ty * 16 + 8;
  if (r.kind === 'till') state.dailyStats.tilled++;
  if (r.kind === 'plant') {
    state.dailyStats.planted++;
    if (WEATHER[state.weather].rain) {
      const plot = farming.get(t.tx, t.ty);
      if (plot && !plot.watered) { plot.watered = true; state.dailyStats.rainWatered++; }
    }
  }
  if (r.kind === 'water') state.dailyStats.watered += r.qty || 1;
  if (r.kind === 'harvest') { state.dailyStats.harvested++; if (questSystem.record('harvest', r.crop, 1)) saveGame(); }
  player.act(TOOL_COLOR[item.id] || item.color); audio.play(r.kind);
  if (r.kind === 'till') fx.burst('dirt', cx, cy);
  else if (r.kind === 'plant') fx.burst('dust', cx, cy);
  else if (r.kind === 'water') fx.burst('water', cx, cy - 2);
  else { fx.burst('sparkle', cx, cy); fx.text('+1 ' + CROPS[r.crop].name, cx, cy - 12, r.fine ? '#f2c230' : '#fffdf5'); }
  if (spend(state, r.energy)) startDayEnd('faint');
}

function showDailySummary() { return state.mode === 'summary'; }

function startNew() {
  Object.assign(state, { coins: CFG.START_COINS, day: 1, minutes: CFG.START_MINUTES, energy: CFG.MAX_ENERGY, selected: 0, trans: null, grown: [],
    weather: 'sunny',
    dailyStats: { tilled: 0, planted: 0, watered: 0, rainWatered: 0, harvested: 0, sold: 0, bought: 0, earned: 0, spent: 0 },
    summary: null, wellUsedDay: 0 });
  player.reset(); camera.snap(player); farming.reset(); inventory.reset(START_ITEMS); harmony.reset(); fx.reset(); questSystem.load(null); npcRelationship.load(null);
  world.reset(); state.expanded = false; state.decorations = world.decorations; state.houseLevel = 1; state.maxEnergy = CFG.MAX_ENERGY; state.toolUpgrades = { hoe: 1, can: 1 }; world.lush = false; state.harmonyName = LEVEL_NAMES[1]; resume();
  hud.notify('Selamat datang di kebunmu. Mulailah sesuai keinginanmu!');
}

const menus = new Menus({
  new() {
    if (state.mode === 'menu' && saveStatus === 'ok') return confirmTap('newBtn', 'Game Baru', 'Timpa simpanan? Tekan lagi', startNew);
    startNew();
  },
  continue() {
    const d = Save.read(world);
    if (!d) return refreshContinue();
    applySave(d); resume(); hud.notify('Simpanan dimuat. Hari ' + d.day + '.');
  },
  save() { flash('saveBtn', saveGame() ? 'Tersimpan!' : 'Gagal menyimpan', 'Simpan Game'); },
  summaryContinue() { state.summary = null; resume(); },
  resume, close: closePanel,
  quit() { setMode('menu'); menus.show('menu'); refreshContinue(); },
  toggleMusic() { audio.setMusic(!audio.musicOn); menus.setText('musicBtn', 'Musik: ' + onOff(audio.musicOn)); persistSettings(); },
  toggleSfx() { audio.setSfx(!audio.sfxOn); menus.setText('sfxBtn', 'Efek suara: ' + onOff(audio.sfxOn)); persistSettings(); },
  toggleFs() {
    if (document.fullscreenElement) { document.exitFullscreen(); return; }
    const p = document.documentElement.requestFullscreen(); if (p && p.catch) p.catch(() => {});
  },
  toggleFps() { state.showFps = !state.showFps; menus.setText('fpsBtn', 'Tampilkan FPS: ' + onOff(state.showFps)); persistSettings(); },
  resetSave() {
    confirmTap('resetBtn', 'Hapus Simpanan', 'Yakin? Tekan lagi', () => {
      Save.clear(); refreshContinue(); flash('resetBtn', 'Simpanan dihapus', 'Hapus Simpanan');
    });
  },
});
menus.setText('musicBtn', 'Musik: ' + onOff(audio.musicOn));
menus.setText('sfxBtn', 'Efek suara: ' + onOff(audio.sfxOn));
menus.setText('fpsBtn', 'Tampilkan FPS: ' + onOff(state.showFps));
document.body.dataset.mode = state.mode;
$('verText').textContent = 'v' + VERSION;
if (!(document.fullscreenEnabled && document.documentElement.requestFullscreen)) $('fsBtn').style.display = 'none';
document.addEventListener('fullscreenchange', () => menus.setText('fsBtn', 'Layar penuh: ' + onOff(!!document.fullscreenElement)));
refreshContinue();

// ---------- Input ----------
input.onKeyDown = (code) => {
  if (code === 'Escape' || code === 'KeyP') { if (state.mode === 'dialogue') dialogue.close(); else if (state.mode === 'playing') pause(); else if (state.mode === 'paused') resume(); else if (state.mode === 'shop' || state.mode === 'inventory') closePanel(); }
  if (code === 'KeyE') { if (state.mode === 'playing') openPanel('inventory'); else if (state.mode === 'inventory') closePanel(); }
  if ((code === 'Space' || code === 'Enter' || code === 'KeyF') && state.mode !== 'dialogue') act();
  if (code === 'KeyQ') cycleTool(-1);
  const n = code.startsWith('Digit') ? Number(code.slice(5)) : 0;
  if (state.mode === 'playing' && n >= 1 && n <= HOTBAR.length) state.selected = n - 1;
};
for (const ev of ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown']) addEventListener(ev, () => audio.unlock());
document.addEventListener('click', (e) => { if (e.target.closest('.btn')) audio.play('click'); });
$('btnPause').addEventListener('click', pause);
$('btnPause').addEventListener('pointerdown', (e) => e.stopPropagation());
$('btnBag').addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); if (state.mode === 'playing') openPanel('inventory'); });
for (const [id, fn] of [['btnAct', act], ['btnTool', () => cycleTool(1)]])
  $(id).addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); fn(); });
$('game').addEventListener('pointerdown', (e) => {
  if (state.mode !== 'playing') return;
  const p = renderer.toLogical(e), i = hud.slotAt(p.x, p.y);
  if (i >= 0) state.selected = i;
  else if (e.pointerType === 'mouse') act();
});
$('game').addEventListener('wheel', (e) => cycleTool(e.deltaY > 0 ? 1 : -1), { passive: true });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { pause(); saveGame(); audio.suspend(); } else audio.resume();
});
addEventListener('pagehide', () => { touch.reset(); saveGame(); });
addEventListener('blur', () => { if (state.mode === 'playing') pause(); });
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('contextmenu', (e) => e.preventDefault());

camera.snap(player);

// ---------- Loop ----------
function update(dt) {
  state.clock += dt;
  document.body.classList.toggle('portrait-device', portrait.matches);
  if (portrait.matches && state.mode === 'playing') pause();
  const m = state.mode;
  if (m !== 'menu') fx.update(dt);
  if (m === 'playing') {
    player.update(dt, input.getMove(), world);
    npcSystem.update(dt, state.minutes, world, player);
    interaction.update(player, world, farming);
    state.target = interaction.target;
    camera.follow(player, dt);
    hud.update(dt);
    fx.ambient(camera, dt, state.minutes);
    if (player.moving) { if ((stepT -= dt) <= 0) { audio.play('step'); stepT = 0.3; } } else stepT = 0;
    audio.setMood(state.minutes >= 1080 ? 'night' : 'day');
    const up = harmony.update(dt, farming, state.minutes);
    state.harmonyName = LEVEL_NAMES[harmony.level]; world.lush = harmony.level >= 3;
    if (up) { hud.notify('Harmoni kebun naik: ' + LEVEL_NAMES[up]); audio.play('levelup'); }
    if (advance(state, dt)) startDayEnd('late');
  } else if (m === 'transition') tickTransition(dt);
  state.frames++; state.fpsT += dt;
  if (state.fpsT >= 0.5) { state.fps = Math.round(state.frames / state.fpsT); state.frames = 0; state.fpsT = 0; }
}

// Penanda tile target: empat sudut oranye yang berdenyut.
function marker(c) {
  const t = state.target; if (!t) return;
  const a = Math.floor(state.clock * 4) % 2, x = t.tx * 16, y = t.ty * 16, xr = x + 16 - a, yb = y + 16 - a;
  c.fillStyle = '#e8873a';
  c.fillRect(x + a, y + a, 4, 1); c.fillRect(x + a, y + a, 1, 4);
  c.fillRect(xr - 4, y + a, 4, 1); c.fillRect(xr - 1, y + a, 1, 4);
  c.fillRect(x + a, yb - 1, 4, 1); c.fillRect(x + a, yb - 4, 1, 4);
  c.fillRect(xr - 4, yb - 1, 4, 1); c.fillRect(xr - 1, yb - 4, 1, 4);
}

function fade(g) {
  const tr = state.trans; if (!tr) return;
  const a = tr.t < 0.8 ? tr.t / 0.8 : Math.max(0, (1.6 - tr.t) / 0.8);
  g.fillStyle = `rgba(20,15,10,${a.toFixed(3)})`; g.fillRect(0, 0, CFG.W, CFG.H);
  if (tr.done && a > 0.05) {
    g.globalAlpha = a; g.textAlign = 'center'; g.textBaseline = 'top'; g.fillStyle = '#f6ecd0';
    g.font = 'bold 16px "Courier New", monospace'; g.fillText(tr.title, CFG.W / 2, CFG.H / 2 - 16);
    g.font = 'bold 8px "Courier New", monospace'; g.fillText(tr.sub, CFG.W / 2, CFG.H / 2 + 6);
    g.globalAlpha = 1; g.textAlign = 'left';
  }
}

function drawWeather(g) {
  if (state.weather === 'cloudy') {
    g.fillStyle = 'rgba(70, 82, 96, 0.10)'; g.fillRect(0, 0, CFG.W, CFG.H);
  } else if (state.weather === 'rainy') {
    g.fillStyle = 'rgba(60, 90, 120, 0.13)'; g.fillRect(0, 0, CFG.W, CFG.H);
    g.strokeStyle = 'rgba(205, 225, 240, 0.62)'; g.lineWidth = 1;
    const t = state.clock * 90;
    for (let i = 0; i < 48; i++) {
      const x = (i * 73 + t * (0.65 + (i % 4) * 0.08)) % CFG.W;
      const y = (i * 47 + t * 1.8) % CFG.H;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x - 2, y + 5); g.stroke();
    }
  }
}

function render() {
  // Hemat baterai: saat jeda/menu/panel terbuka, gambar ulang cukup 30 kali per detik.
  if (state.mode !== 'playing' && state.mode !== 'transition') { state.skip = !state.skip; if (state.skip) return; }
  renderer.begin();
  const g = renderer.ctx;
  const extras = [{ y: player.y + 16, draw: (c) => player.draw(c) }];
  if (state.mode === 'playing') extras.push({ y: -1, draw: marker });
  world.draw(g, camera, state.clock, extras, (c, x0, y0, x1, y1) => {
    harmony.drawGround(c, x0, y0, x1, y1, world);
    farming.drawGround(c, x0, y0, x1, y1);
  });
  if (state.mode !== 'menu') {
    drawWeather(g);
    drawTint(g, state.minutes); harmony.drawFlyers(g, camera, state.minutes); fx.draw(g, camera); hud.draw(g, state);
  }
  if (state.mode === 'transition') fade(g);
  if (state.showFps) { g.font = 'bold 8px "Courier New", monospace'; g.textBaseline = 'top'; g.fillStyle = '#fff'; g.fillText(state.fps + ' FPS', 4, CFG.H - 12); }
}

new Game(update, render).start();
