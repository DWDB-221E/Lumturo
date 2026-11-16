import { mkdir, writeFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';
// Deterministic PNGs with no image dependency; lighthouse silhouette on an opaque field.
function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) { crc ^= byte; for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const name = Buffer.from(type), length = Buffer.alloc(4), crc = Buffer.alloc(4);
  length.writeUInt32BE(data.length); crc.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, crc]);
}
function inside(x, y, points) {
  let result = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i], [xj, yj] = points[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) result = !result;
  }
  return result;
}
await mkdir('public/icons', { recursive: true });
for (const size of [192, 512]) {
  const rows = Buffer.alloc((size * 3 + 1) * size);
  const shapes = [[[.5,.18],[.68,.34],[.32,.34]], [[.34,.37],[.66,.37],[.66,.46],[.34,.46]], [[.4,.49],[.6,.49],[.7,.8],[.3,.8]], [[.12,.37],[.28,.37],[.28,.41],[.12,.41]], [[.72,.37],[.88,.37],[.88,.41],[.72,.41]]];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const foreground = shapes.some(shape => inside((x + .5) / size, (y + .5) / size, shape));
    const color = foreground ? [250,248,243] : [166,61,61];
    color.forEach((value, channel) => { rows[y * (size * 3 + 1) + 1 + x * 3 + channel] = value; });
  }
  const header = Buffer.alloc(13); header.writeUInt32BE(size, 0); header.writeUInt32BE(size, 4); header[8] = 8; header[9] = 2;
  await writeFile(`public/icons/icon-${size}.png`, Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', header), chunk('IDAT', deflateSync(rows)), chunk('IEND', Buffer.alloc(0))]));
}
console.log('Generated lighthouse PNG icons: 192×192 and 512×512.');
