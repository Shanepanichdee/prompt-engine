function isSingleToken(codePoint: number): boolean {
  return (
    (codePoint >= 0x4e00 && codePoint <= 0x9fff) || // CJK Unified
    (codePoint >= 0x3400 && codePoint <= 0x4dbf) || // CJK Extension A
    (codePoint >= 0x3040 && codePoint <= 0x309f) || // Hiragana
    (codePoint >= 0x30a0 && codePoint <= 0x30ff) || // Katakana
    (codePoint >= 0xac00 && codePoint <= 0xd7af) || // Hangul
    (codePoint >= 0x0e00 && codePoint <= 0x0e7f) || // Thai
    (codePoint >= 0x0600 && codePoint <= 0x06ff)    // Arabic
  );
}

export function estimateTokens(text: string): number {
  let tokens = 0;
  for (const char of text) {
    const cp = char.codePointAt(0) ?? 0;
    tokens += isSingleToken(cp) ? 1 : 0.25;
  }
  return Math.ceil(tokens);
}
