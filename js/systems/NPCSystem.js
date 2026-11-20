import { CFG } from '../data/config.js';

const TILE = CFG.TILE;
const BODY = { x: 4, y: 10, w: 8, h: 5 };
const SPEED = 22; // NPC berjalan santai, lebih lambat dari pemain.
const STEP = [[0, 1], [0, -1], [-1, 0], [1, 0]];

// Jadwal memakai menit permainan (06.00 = 360). Koordinat adalah tile tujuan.
// Titik tujuan sengaja berada di ruang terbuka, bukan di dalam bangunan/kolam.
export const NPC_SCHEDULES = {
  Mira: [
    { from: 360, to: 480, activity: 'menyiapkan pasar', x: 53, y: 21 },
    { from: 480, to: 720, activity: 'menjaga pasar', x: 53, y: 22 },
    { from: 720, to: 840, activity: 'istirahat di sumur', x: 57, y: 20 },
    { from: 840, to: 1080, activity: 'melayani pasar', x: 53, y: 22 },
    { from: 1080, to: 1260, activity: 'pulang ke rumah', x: 53, y: 15 },
    { from: 1260, to: 1440, activity: 'beristirahat', x: 53, y: 15 },
    { from: 0, to: 360, activity: 'beristirahat', x: 53, y: 15 },
  ],
  Bima: [
    { from: 360, to: 540, activity: 'mengambil air', x: 58, y: 20 },
    { from: 540, to: 720, activity: 'berjalan di desa', x: 55, y: 17 },
    { from: 720, to: 960, activity: 'membantu warga', x: 58, y: 20 },
    { from: 960, to: 1140, activity: 'berkumpul di pasar', x: 55, y: 20 },
    { from: 1140, to: 1320, activity: 'pulang ke rumah', x: 60, y: 15 },
    { from: 1320, to: 1440, activity: 'beristirahat', x: 60, y: 15 },
    { from: 0, to: 360, activity: 'beristirahat', x: 60, y: 15 },
  ],
};

function scheduleAt(name, minutes) {
  const schedule = NPC_SCHEDULES[name] || [];
  return schedule.find(s => minutes >= s.from && minutes < s.to) || schedule[0] || null;
}

function rectFor(x, y) {
  return { x: x + BODY.x, y: y + BODY.y, w: BODY.w, h: BODY.h };
}
function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export class NPCSystem {
  constructor() { this.worldRef = null; this.objectsRef = null; this.npcs = []; }

  bind(world) {
    // World.reset()/setDecorations() mengganti array objects tanpa mengganti instance World.
    if (this.worldRef === world && this.objectsRef === world.objects) return;
    this.worldRef = world;
    this.objectsRef = world.objects;
    this.npcs = world.objects.filter(o => o.k === 'villager');
    for (const npc of this.npcs) {
      npc.px = npc.x * TILE;
      npc.py = npc.y * TILE;
      npc.dir = 0;
      npc.moving = false;
      npc.walkFrame = 0;
      npc.animClock = 0;
      npc.activity = 'menunggu';
      npc.scheduleKey = '';
      npc.path = [];
      npc.pathIndex = 0;
      npc.wait = 0;
    }
  }

  isWalkable(world, tx, ty) {
    if (tx < 0 || ty < 0 || tx >= world.w || ty >= world.h) return false;
    return !world.isBlocked(tx * TILE + BODY.x, ty * TILE + BODY.y, BODY.w, BODY.h);
  }

  findPath(world, start, goal) {
    const key = (x, y) => x + ',' + y;
    const startKey = key(start.x, start.y), goalKey = key(goal.x, goal.y);
    if (startKey === goalKey) return [];
    const queue = [{ x: start.x, y: start.y }], came = new Map([[startKey, null]]);
    let found = false;
    for (let head = 0; head < queue.length && head < world.w * world.h; head++) {
      const p = queue[head];
      for (const [dx, dy] of STEP) {
        const x = p.x + dx, y = p.y + dy, k = key(x, y);
        if (came.has(k) || !this.isWalkable(world, x, y)) continue;
        came.set(k, key(p.x, p.y));
        if (k === goalKey) { found = true; break; }
        queue.push({ x, y });
      }
      if (found) break;
    }
    if (!found) return null;
    const path = []; let cursor = goalKey;
    while (cursor !== startKey) {
      const [x, y] = cursor.split(',').map(Number);
      path.push({ x, y }); cursor = came.get(cursor);
      if (cursor == null) return null;
    }
    return path.reverse();
  }

  chooseDestination(world, npc, schedule) {
    const start = { x: Math.round(npc.px / TILE), y: Math.round(npc.py / TILE) };
    const goal = { x: schedule.x, y: schedule.y };
    const path = this.findPath(world, start, goal);
    npc.path = path || [];
    npc.pathIndex = 0;
    npc.scheduleKey = [schedule.from, schedule.to, schedule.x, schedule.y].join(':');
    npc.activity = schedule.activity;
    // Bila jalur tidak tersedia, NPC tetap aman di lokasi terakhir, tanpa teleportasi.
  }

  update(dt, minutes, world, player) {
    this.bind(world);
    for (const npc of this.npcs) {
      const schedule = scheduleAt(npc.name, minutes);
      if (!schedule) continue;
      const key = [schedule.from, schedule.to, schedule.x, schedule.y].join(':');
      if (npc.scheduleKey !== key) this.chooseDestination(world, npc, schedule);

      npc.moving = false;
      const next = npc.path[npc.pathIndex];
      if (!next) {
        npc.x = npc.px / TILE; npc.y = npc.py / TILE;
        continue;
      }
      const tx = next.x * TILE, ty = next.y * TILE;
      const dx = tx - npc.px, dy = ty - npc.py;
      const distance = Math.hypot(dx, dy);
      if (distance < 0.75) {
        npc.px = tx; npc.py = ty; npc.pathIndex++;
        npc.x = npc.px / TILE; npc.y = npc.py / TILE;
        continue;
      }
      const step = Math.min(distance, SPEED * dt);
      const nx = npc.px + dx / distance * step;
      const ny = npc.py + dy / distance * step;
      const candidate = rectFor(nx, ny);
      const playerRect = rectFor(player.x, player.y);
      const blockedByPlayer = overlaps(candidate, playerRect);
      const blockedByNPC = this.npcs.some(other => other !== npc && overlaps(candidate, rectFor(other.px, other.py)));
      if (!blockedByPlayer && !blockedByNPC && !world.isBlocked(candidate.x, candidate.y, candidate.w, candidate.h)) {
        npc.px = nx; npc.py = ny; npc.moving = true;
        if (Math.abs(dx) > Math.abs(dy)) npc.dir = dx < 0 ? 2 : 3;
        else npc.dir = dy < 0 ? 1 : 0;
        npc.animClock += dt;
        npc.walkFrame = Math.floor(npc.animClock * 8) % 2;
      }
      npc.x = npc.px / TILE; npc.y = npc.py / TILE;
    }
  }
}
