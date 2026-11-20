import { CROPS } from '../data/crops.js';
import { HARMONY } from '../data/config.js';

// Jual-beli. Koin di state.coins, barang di Inventory.
// Hasil panen biasa 'crop_x'; hasil dengan bonus Daisy 'fine_x' (Harmoni).
export class Economy {
  constructor(state, inv, getLevel = () => 1) { this.state = state; this.inv = inv; this.getLevel = getLevel; }
  price(crop, fine = false) {
    const m = 1 + (fine ? HARMONY.fineBonus : 0) + (this.getLevel() >= 3 ? HARMONY.levelBonus : 0);
    return Math.round(CROPS[crop].sellPrice * m);
  }
  buy(crop, qty = 1) {
    const c = CROPS[crop];
    if (!c || !Number.isInteger(qty) || qty <= 0) return { ok: false, msg: 'Pembelian tidak valid.' };
    const cost = c.seedPrice * qty;
    if (this.state.coins < cost) return { ok: false, msg: 'Koin tidak cukup.' };
    this.state.coins -= cost; this.inv.add('seed_' + crop, qty);
    return { ok: true, msg: 'Beli benih ' + c.name + ' (-' + cost + ' koin)', crop, qty, amount: cost };
  }
  sell(crop, qty = 1, fine = false) {
    const c = CROPS[crop];
    if (!c) return { ok: false, msg: 'Hasil panen tidak dikenal.' };
    const id = (fine ? 'fine_' : 'crop_') + crop;
    if (c.sellPrice <= 0) return { ok: false, msg: c.name + ' tidak dijual.' };
    if (!Number.isInteger(qty) || qty < 0) return { ok: false, msg: 'Jumlah penjualan tidak valid.' };
    const n = Math.min(qty, this.inv.count(id));
    if (n <= 0) return { ok: false, msg: 'Tidak ada ' + c.name + ' untuk dijual.' };
    if (!this.inv.remove(id, n)) return { ok: false, msg: 'Inventaris berubah. Coba lagi.' };
    const gain = n * this.price(crop, fine); this.state.coins += gain;
    return { ok: true, msg: 'Jual ' + n + ' ' + c.name + (fine ? ' Harmoni' : '') + ' (+' + gain + ' koin)', crop, qty: n, amount: gain, fine };
  }
  sellAll(crop, fine = false) { return this.sell(crop, this.inv.count((fine ? 'fine_' : 'crop_') + crop), fine); }
}
