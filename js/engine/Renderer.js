import { CFG } from '../data/config.js';

// Canvas mengikuti ukuran CSS area permainan, lalu backing store mengikuti DPR.
// Cara ini mencegah canvas menjadi terlalu kecil pada HP dengan DPR tinggi.
export class Renderer {
  constructor(canvas, stage) {
    this.canvas = canvas;
    this.stage = stage;
    this.ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    this.scale = 1;
    this.resize = this.resize.bind(this);
    this.resize();
    addEventListener('resize', this.resize, { passive: true });
    addEventListener('orientationchange', () => requestAnimationFrame(this.resize), { passive: true });
    if (window.visualViewport) window.visualViewport.addEventListener('resize', this.resize, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(this.resize).observe(stage);
  }
  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const vw = Math.max(1, this.stage.clientWidth);
    const vh = Math.max(1, this.stage.clientHeight);
    const fit = Math.max(0.1, Math.min(vw / CFG.W, vh / CFG.H));
    const cssW = Math.floor(CFG.W * fit);
    const cssH = Math.floor(CFG.H * fit);
    const pixelScale = fit * dpr;
    const bw = Math.max(1, Math.round(CFG.W * pixelScale));
    const bh = Math.max(1, Math.round(CFG.H * pixelScale));
    this.scale = bw / CFG.W;
    if (this.canvas.width !== bw || this.canvas.height !== bh) {
      this.canvas.width = bw;
      this.canvas.height = bh;
    }
    if (this.canvas.style.width !== cssW + 'px') this.canvas.style.width = cssW + 'px';
    if (this.canvas.style.height !== cssH + 'px') this.canvas.style.height = cssH + 'px';
  }
  begin() {
    this.ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
  }
  toLogical(e) {
    const r = this.canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width * CFG.W, y: (e.clientY - r.top) / r.height * CFG.H };
  }
}
