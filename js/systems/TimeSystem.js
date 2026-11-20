import { CFG, RULES } from '../data/config.js';

// Warna suasana [r, g, b, alpha] menurut jam (menit sejak 00:00).
const KEYS = [
  [0, [15, 25, 70, 0.56]],          // malam
  [299, [15, 25, 70, 0.56]],        // malam bertahan hingga 04.59
  [300, [255, 176, 112, 0.22]],     // fajar mulai pukul 05.00
  [360, [255, 190, 120, 0.12]],
  [420, [255, 190, 120, 0.00]],     // pagi
  [660, [255, 190, 120, 0.00]],     // siang
  [900, [255, 150, 95, 0.04]],      // awal sore
  [990, [255, 125, 75, 0.16]],      // senja
  [1020, [180, 115, 100, 0.22]],    // sore meredup
  [1050, [120, 95, 110, 0.28]],     // senja lanjut
  [1079, [85, 70, 95, 0.32]],       // masih senja pada 17.59
  [1080, [15, 25, 70, 0.52]],       // malam mulai tepat 18.00
  [1440, [15, 25, 70, 0.56]]
];

// Memajukan jam. Mengembalikan true saat tengah malam tercapai.
export function advance(state, dt) {
  state.minutes += dt * ((RULES.END_MINUTES - CFG.START_MINUTES) / RULES.DAY_SECONDS);
  return state.minutes >= RULES.END_MINUTES;
}
export function tint(m) {
  if (m <= KEYS[0][0]) return KEYS[0][1];
  for (let i = 1; i < KEYS.length; i++) {
    if (m <= KEYS[i][0]) {
      const [m0, a] = KEYS[i - 1], [m1, b] = KEYS[i], k = (m - m0) / (m1 - m0);
      return a.map((v, n) => v + (b[n] - v) * k);
    }
  }
  return KEYS[KEYS.length - 1][1];
}
export function drawTint(g, m) {
  const [r, gr, b, a] = tint(m);
  if (a < 0.01) return;
  g.fillStyle = `rgba(${Math.round(r)},${Math.round(gr)},${Math.round(b)},${a.toFixed(3)})`;
  g.fillRect(0, 0, CFG.W, CFG.H);
}
