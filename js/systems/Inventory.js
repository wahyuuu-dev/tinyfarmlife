// Penyimpanan jumlah item (benih dan hasil panen). Panel inventory dibuat di Tahap 5.
export class Inventory {
  constructor(start = {}) { this.reset(start); }
  reset(start = {}) { this.items = { ...start }; }
  count(id) {
    const n = this.items[id];
    return Number.isInteger(n) && n > 0 ? n : 0;
  }
  add(id, n = 1) {
    if (typeof id !== 'string' || !id || !Number.isInteger(n) || n <= 0) return false;
    this.items[id] = this.count(id) + n;
    return true;
  }
  remove(id, n = 1) {
    if (typeof id !== 'string' || !id || !Number.isInteger(n) || n <= 0 || this.count(id) < n) return false;
    this.items[id] -= n;
    return true;
  }
}
