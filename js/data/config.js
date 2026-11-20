export const CFG = {
  W: 480, H: 270, TILE: 16, MAP_W: 96, MAP_H: 64,
  PLAYER_SPEED: 70, START_COINS: 100, MAX_ENERGY: 100, START_MINUTES: 360,
};
export const PAL = {
  // Palet inti resmi Cozy Pixel Art.
  green: '#5aa84a', greenDark: '#3d7a38', greenLight: '#7cc45c',
  brown: '#7a4e2d', brownDark: '#5a3820', brownLight: '#a06c40',
  cream: '#f6ecd0', creamDark: '#e3d3a8', orange: '#e8873a', sky: '#6cb8e6', ink: '#2b2118',

  // Vegetasi khusus (lush grass dan tajuk pohon); nilai dipertahankan dari aset V1.4.0.
  greenLush: '#68be50', greenLushDark: '#4a9a40', greenLushLight: '#8ad868',
  canopyEdge: '#173d2c', canopyMid: '#235a3c', canopyBase: '#2e7048',
  canopyHighlight: '#3f8a58', canopyAccent: '#56a46c',

  // Air dan tepian air.
  water: '#4f9fd6', waterHighlight: '#8fd0f2', wetSoilWater: '#4f7fa6',

  // Tanah, jalur, dan petak pertanian.
  soilWarmMid: '#8a5a34', earthMid: '#b8955a', pathBase: '#cfae72', pathLight: '#e0c590',
  soilDry: '#6e4426', soilDryDark: '#4f2f18',
  soilWet: '#52331c', soilWetDark: '#3a2312', soilWetLight: '#6b4a30',

  // Batu dan lumut. Varian object/tile dibedakan agar warna lama tidak berubah diam-diam.
  stoneTile: '#777d7b', stoneTileDark: '#5d6463', stoneTileLight: '#aeb5ad',
  mossGround: '#687b55', mossGroundDark: '#4a6242', mossGroundLight: '#91a66c', mossAccent: '#78945b',
  stoneObject: '#777b79', stoneObjectLight: '#aeb3a8', stoneObjectHighlight: '#d2d0bd', caveDark: '#292d30',

  // Bangunan dan material khusus.
  roofShadow: '#c25e2e', roofHighlight: '#d9783a', wallShadow: '#a89c86', roofStone: '#8a8f98',
  houseDetail: '#e7d8b5', houseGreenTrim: '#6b9d55', terracotta: '#a85c32',

  // Hasil panen, bunga, dan aksen alam.
  tomato: '#d94a3a', carrotShadow: '#c96a24', harvestGold: '#d9b84a', harvestGoldLight: '#f0d070',
  wheatYoung: '#9ccf5a', flowerWhite: '#fffdf5', flowerYellow: '#f2c230', flowerPink: '#f08aa8', flowerAccent: '#d94a8c', labelText: '#fffdf5',
  lampGlow: '#fff2b0',

  // Karakter dan label dunia.
  skin: '#f1c9a0', miraHair: '#6a3d28', bimaHair: '#3d2b20', miraClothes: '#d94a8c',
  bimaClothes: '#3d7a9a', hatHighlight: '#f0a860',

  // Bayangan/transparansi Canvas yang dipakai lintas aset.
  shadowSoft: 'rgba(0,0,0,.2)', shadowGround: 'rgba(0,0,0,.18)',
  shadowPlayer: 'rgba(0,0,0,.22)', labelBackground: 'rgba(43,33,24,.88)',
};

// Biaya energi tiap aksi dan isi inventory awal (benih untuk mencoba sistem pertanian).
export const COST = { till: 2, plant: 1, water: 1, harvest: 1 };
export const START_ITEMS = { seed_carrot: 5, seed_wheat: 3, seed_tomato: 2, seed_daisy: 3 };

// Aturan permainan (Tahap 6).
export const RULES = { DAY_SECONDS: 240, END_MINUTES: 1440, FAINT_ENERGY: 60 };
// Harmony Garden: bonus tumbuh, bonus harga (Daisy di sebelah tanaman), bonus level 3, ambang level.
export const HARMONY = { growthBonus: 1.5, fineBonus: 0.15, levelBonus: 0.05, level2: 3, level3: 6 };

export const VERSION = '1.4.0';
