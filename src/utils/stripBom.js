// from https://github.com/sindresorhus/strip-bom/blob/d5696fdc9eeb6cc8d97e390cf1de7558f74debd5/index.js#L3

export default function stripBom (string) {
  // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
  // conversion translates it to FEFF (UTF-16 BOM)
  if (string.charCodeAt(0) === 0xFEFF) {
    return string.slice(1)
  }

  return string
};
