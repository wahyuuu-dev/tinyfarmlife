// Cuaca harian Tiny Farm Life V1.2.0. Cuaca disimpan agar reload tidak mengubah hasil undian.
export const WEATHER = {
  sunny: { id: 'sunny', label: 'Cerah', icon: '☀', rain: false },
  cloudy: { id: 'cloudy', label: 'Mendung', icon: '☁', rain: false },
  rainy: { id: 'rainy', label: 'Hujan', icon: '☂', rain: true },
};

export function rollWeather(random = Math.random) {
  const n = random();
  if (n < 0.25) return 'rainy';
  if (n < 0.55) return 'cloudy';
  return 'sunny';
}

export function isWeather(value) {
  return Object.prototype.hasOwnProperty.call(WEATHER, value);
}
