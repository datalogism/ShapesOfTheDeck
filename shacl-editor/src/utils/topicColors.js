const PALETTE = [
  '#e74c3c', '#d35400', '#f39c12', '#27ae60',
  '#2980b9', '#8e44ad', '#1abc9c', '#c0392b',
];

const cache = new Map();

export function topicColor(topic) {
  if (!topic) return null;
  if (cache.has(topic)) return cache.get(topic);
  let h = 0;
  for (let i = 0; i < topic.length; i++) h = (h * 31 + topic.charCodeAt(i)) & 0xffff;
  const color = PALETTE[h % PALETTE.length];
  cache.set(topic, color);
  return color;
}

export function topicColorAlpha(topic, alpha = 0.15) {
  const c = topicColor(topic);
  if (!c) return null;
  const r = parseInt(c.slice(1, 3), 16);
  const g = parseInt(c.slice(3, 5), 16);
  const b = parseInt(c.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
