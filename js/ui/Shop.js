import { CROPS } from '../data/crops.js';

const IDS = Object.keys(CROPS), SELL = IDS.filter((id) => CROPS[id].sellPrice > 0);
const chip = (c) => `<i class="chip" style="background:${c}"></i>`;

// Satu ekonomi dan inventaris dipakai bersama, tetapi fungsi Toko Kebun dan Pasar Desa dipisahkan.
export class Shop {
  constructor(root, economy, onResult, onSpecial) {
    this.root = root; this.economy = economy; this.onSpecial = onSpecial; this.onResult = onResult;
    this.buyEl = root.querySelector('#shopBuy'); this.sellEl = root.querySelector('#shopSell');
    this.coinsEl = root.querySelector('#shopCoins'); this.msgEl = root.querySelector('#shopMsg');
    this.specialEl = root.querySelector('#shopSpecial'); this.titleEl = root.querySelector('#shopTitle');
    this.tabsEl = root.querySelector('#shopTabs'); this.seedView = root.querySelector('#seedShopView');
    this.decorView = root.querySelector('#decorShopView'); this.marketView = root.querySelector('#marketShopView');
    this.activeTab = 'seeds'; this.mode = 'home';
    root.addEventListener('click', (e) => {
      const tab = e.target.closest('button[data-shop-tab]');
      if (tab) { if (this.mode === 'home') this.setTab(tab.dataset.shopTab); return; }
      const special = e.target.closest('button[data-special]');
      if (special && !special.disabled && this.mode === 'home') {
        const r = this.onSpecial ? this.onSpecial(special.dataset.special) : { ok: false, msg: 'Fitur belum tersedia.' };
        this.msgEl.textContent = r.msg; if (this.onResult) this.onResult('special', r); this.refresh(); return;
      }
      const b = e.target.closest('button[data-op]');
      if (!b || b.disabled) return;
      const { op, crop } = b.dataset, fine = b.dataset.fine === '1';
      // Validasi konteks UI dilakukan kembali sebelum transaksi dijalankan.
      if (op === 'buy' && this.mode !== 'home') return;
      if (op !== 'buy' && this.mode !== 'market') return;
      const r = op === 'buy' ? this.economy.buy(crop) : op === 'sell' ? this.economy.sell(crop, 1, fine) : this.economy.sellAll(crop, fine);
      this.msgEl.textContent = r.msg; if (this.onResult) this.onResult(op, r); this.refresh();
    });
  }
  setTab(tab) {
    this.activeTab = tab === 'decor' ? 'decor' : 'seeds';
    this.seedView.classList.toggle('hidden', this.activeTab !== 'seeds');
    this.decorView.classList.toggle('hidden', this.activeTab !== 'decor');
    this.root.querySelectorAll('[data-shop-tab]').forEach((b) => {
      const active = b.dataset.shopTab === this.activeTab;
      b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active));
    });
  }
  open(title = 'Toko Kebun', mode = 'home') {
    this.mode = mode === 'market' ? 'market' : 'home';
    this.msgEl.textContent = ''; if (this.titleEl) this.titleEl.textContent = title;
    const isMarket = this.mode === 'market';
    if (this.tabsEl) this.tabsEl.classList.toggle('hidden', isMarket);
    this.seedView.classList.toggle('hidden', isMarket);
    this.decorView.classList.toggle('hidden', isMarket);
    this.marketView.classList.toggle('hidden', !isMarket);
    if (!isMarket) this.setTab('seeds');
    this.refresh();
  }
  refresh() {
    const { state, inv } = this.economy;
    this.coinsEl.textContent = state.coins + ' koin';
    this.buyEl.innerHTML = this.mode === 'home' ? IDS.map((id) => {
      const c = CROPS[id];
      return `<div class="row">${chip(c.color)}<span class="name">${c.name}<br><span class="sub">${c.seedPrice} koin benih · ${c.days} hari · ${c.sellPrice > 0 ? 'jual ' + c.sellPrice : 'dekoratif'} · punya ${inv.count('seed_' + id)}</span></span>
        <button class="mini" data-op="buy" data-crop="${id}" ${state.coins < c.seedPrice ? 'disabled' : ''}>Beli</button></div>`;
    }).join('') : '';
    const rows = [];
    for (const id of SELL) for (const fine of [false, true]) {
      const n = inv.count((fine ? 'fine_' : 'crop_') + id);
      if (fine && n === 0) continue;
      const off = n === 0 ? 'disabled' : '', d = `data-crop="${id}" data-fine="${fine ? 1 : 0}"`;
      rows.push(`<div class="row">${chip(CROPS[id].color)}<span class="name">${CROPS[id].name}${fine ? ' Harmoni' : ''}<br><span class="sub">${this.economy.price(id, fine)} koin, punya ${n}</span></span>
        <button class="mini" data-op="sell" ${d} ${off}>Jual</button><button class="mini" data-op="all" ${d} ${off}>Semua</button></div>`);
    }
    this.sellEl.innerHTML = this.mode === 'market' ? (rows.length ? rows.join('') : '<p class="market-empty">Belum ada hasil panen untuk dijual.</p>') : '';
    if (this.specialEl) {
      const expanded = !!state.expanded, decorations = state.decorations || [];
      const max = expanded ? 8 : 4, full = decorations.length >= max;
      const houseLevel = state.houseLevel || 1, tools = state.toolUpgrades || { hoe: 1, can: 1 };
      const specialRows = [
        `<div class="special-row"><span><b>Cangkul Baja</b><small>Upgrade cangkul · energi mencangkul 2 → 1 · 180 koin</small></span><button class="mini" data-special="hoeUpgrade" ${tools.hoe >= 2 || state.coins < 180 ? 'disabled' : ''}>${tools.hoe >= 2 ? 'Dimiliki' : 'Upgrade'}</button></div>`,
        `<div class="special-row"><span><b>Penyiram Lebar</b><small>Menyiram tanaman dalam area 3 × 3 · 220 koin</small></span><button class="mini" data-special="canUpgrade" ${tools.can >= 2 || state.coins < 220 ? 'disabled' : ''}>${tools.can >= 2 ? 'Dimiliki' : 'Upgrade'}</button></div>`,
        `<div class="special-row"><span><b>Upgrade rumah · Level 2</b><small>Rumah lebih besar · energi maksimum 100 → 110 · 500 koin</small></span><button class="mini" data-special="house2" ${houseLevel !== 1 || state.coins < 500 ? 'disabled' : ''}>${houseLevel >= 2 ? 'Dimiliki' : 'Upgrade'}</button></div>`,
        `<div class="special-row"><span><b>Upgrade rumah · Level 3</b><small>Rumah lebih luas · energi maksimum 110 → 120 · 1.200 koin</small></span><button class="mini" data-special="house3" ${houseLevel !== 2 || state.coins < 1200 ? 'disabled' : ''}>${houseLevel >= 3 ? 'Dimiliki' : 'Upgrade'}</button></div>`,
        `<div class="special-row"><span><b>Perluas lahan</b><small>Tambah 60 petak · 300 koin</small></span><button class="mini" data-special="expansion" ${expanded || state.coins < 300 ? 'disabled' : ''}>${expanded ? 'Terbuka' : 'Beli'}</button></div>`,
        `<div class="special-row"><span><b>Pot bunga</b><small>Hias kebun · 35 koin</small></span><button class="mini" data-special="flower" ${full || state.coins < 35 ? 'disabled' : ''}>Beli</button></div>`,
        `<div class="special-row"><span><b>Lampu taman</b><small>Hias kebun · 60 koin</small></span><button class="mini" data-special="lamp" ${full || state.coins < 60 ? 'disabled' : ''}>Beli</button></div>`,
        `<div class="special-row"><span><b>Orang-orangan sawah</b><small>Hias kebun · 80 koin</small></span><button class="mini" data-special="scarecrow" ${full || state.coins < 80 ? 'disabled' : ''}>Beli</button></div>`
      ];
      this.specialEl.innerHTML = this.mode === 'home' ? specialRows.join('') : '';
    }
    if (this.mode === 'home') this.setTab(this.activeTab);
  }
}
