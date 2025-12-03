export const toRgb = (hex: string) => {
  'worklet';
  const normalized = hex.replace('#', '');
  const value = normalized.length === 8 ? normalized.slice(2) : normalized;
  if (value.length === 6) {
    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
      return null;
    }
    return { r, g, b };
  }
  return null;
};

export const channelToHex = (channel: number) => {
  'worklet';
  const clamped = Math.round(Math.max(0, Math.min(255, channel)));
  const hex = clamped.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};

export const mixColors = (accent: string, base: string, accentWeight = 0.5) => {
  'worklet';
  const accentRgb = toRgb(accent);
  const baseRgb = toRgb(base);
  if (!accentRgb || !baseRgb) {
    return accent;
  }
  const weight = Math.max(0, Math.min(1, accentWeight));
  const r = accentRgb.r * weight + baseRgb.r * (1 - weight);
  const g = accentRgb.g * weight + baseRgb.g * (1 - weight);
  const b = accentRgb.b * weight + baseRgb.b * (1 - weight);
  return `#${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`;
};
