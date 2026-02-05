export function rot13(input: string) {
  return input.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
  });
}

export function toBase64(input: string) {
  if (typeof btoa === 'function') {
    return btoa(input);
  }
  return Buffer.from(input, 'utf-8').toString('base64');
}

export function fromBase64(input: string) {
  if (typeof atob === 'function') {
    return atob(input);
  }
  return Buffer.from(input, 'base64').toString('utf-8');
}

export function toHex(input: string) {
  return Array.from(input)
    .map((char) => char.charCodeAt(0).toString(16))
    .join('');
}

export function toBinary(input: string) {
  return Array.from(input)
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}
