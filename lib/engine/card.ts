import { characterArtPath } from '../content/stories';
import type { Character } from './types';
/** Browser-native typography card: no external render service or user-data upload. */
export async function downloadCard(
  character: Character,
  episode: string,
): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  const colors = { peach: '#f0c7b5', lilac: '#ded1f0', green: '#d9e5ce' };
  ctx.fillStyle = colors[character.color as keyof typeof colors] ?? '#f8f5ed';
  ctx.fillRect(0, 0, 1080, 1350);
  ctx.strokeStyle = '#24231f';
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, 1008, 1278);
  ctx.fillStyle = '#24231f';
  ctx.font = 'bold 26px Arial';
  ctx.fillText('OFFICIALLY UNOFFICIAL', 80, 100);
  ctx.textAlign = 'right';
  ctx.fillText(`CAST ${parseInt(character.code, 2) + 1}/16`, 1000, 100);
  ctx.textAlign = 'left';
  const image = new Image();
  image.src = characterArtPath(character.code);
  await image.decode();
  ctx.drawImage(image, 230, 160, 620, 620);
  ctx.fillStyle = '#24231f';
  ctx.font = 'bold 25px Arial';
  ctx.fillText('YOU ARE', 80, 815);
  ctx.font = 'bold 68px Arial';
  let y = 900;
  const words = character.name.split(' ');
  let line = '';
  for (const word of words) {
    if (ctx.measureText(`${line} ${word}`).width > 900 && line) {
      ctx.fillText(line, 80, y);
      y += 78;
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  ctx.fillText(line, 80, y);
  y += 65;
  ctx.font = 'italic 30px Georgia';
  line = '';
  for (const word of character.tagline.split(' ')) {
    if (ctx.measureText(`${line} ${word}`).width > 880 && line) {
      ctx.fillText(line, 80, y);
      y += 42;
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  ctx.fillText(line, 80, y);
  ctx.font = 'bold 48px Arial';
  ctx.fillText('plottwist ✳', 80, 1245);
  ctx.font = '20px Arial';
  ctx.textAlign = 'right';
  ctx.fillText(episode, 1000, 1220);
  ctx.fillText('For the plot. Not a psychological assessment.', 1000, 1255);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Card export failed'))),
      'image/png',
    ),
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `plottwist-${character.name.toLowerCase().replaceAll(' ', '-')}.png`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
