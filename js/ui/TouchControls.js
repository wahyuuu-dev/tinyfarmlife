// Joystick virtual pada area kiri-bawah. Area sengaja dibatasi agar sentuhan
// pada bagian lain dunia tetap bisa dipakai untuk memilih petak/berinteraksi.
const RADIUS = 42, DEAD = 0.15;
export class TouchControls {
  constructor(zone, base, knob, input) {
    let pid = null, ox = 0, oy = 0;
    const reset = () => {
      if (pid !== null && zone.hasPointerCapture?.(pid)) {
        try { zone.releasePointerCapture(pid); } catch (_) {}
      }
      pid = null;
      input.joy.x = 0;
      input.joy.y = 0;
      base.style.display = 'none';
      knob.style.transform = '';
    };
    zone.addEventListener('pointerdown', (e) => {
      if (pid !== null || e.button !== 0) return;
      pid = e.pointerId;
      ox = e.clientX;
      oy = e.clientY;
      try { zone.setPointerCapture(pid); } catch (_) {}
      base.style.display = 'block';
      base.style.left = (ox - 50) + 'px';
      base.style.top = (oy - 50) + 'px';
      e.preventDefault();
    });
    zone.addEventListener('pointermove', (e) => {
      if (e.pointerId !== pid) return;
      let dx = e.clientX - ox, dy = e.clientY - oy;
      const len = Math.hypot(dx, dy);
      if (len > RADIUS) { dx = dx / len * RADIUS; dy = dy / len * RADIUS; }
      knob.style.transform = `translate(${dx}px,${dy}px)`;
      const nx = dx / RADIUS, ny = dy / RADIUS;
      const m = Math.hypot(nx, ny);
      input.joy.x = m < DEAD ? 0 : nx;
      input.joy.y = m < DEAD ? 0 : ny;
      e.preventDefault();
    });
    for (const t of ['pointerup', 'pointercancel', 'lostpointercapture'])
      zone.addEventListener(t, (e) => { if (e.pointerId === pid) reset(); });
    this.reset = reset;
  }
}
