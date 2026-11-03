// If PERSQO_TOKEN is set (for example in the Vercel project's Environment Variables),
// write it into public/.well-known/persqo.txt before the build. The file must hold the token only.
import { writeFileSync } from 'node:fs';

const token = (process.env.PERSQO_TOKEN || '').trim();
if (token) {
  writeFileSync(new URL('../public/.well-known/persqo.txt', import.meta.url), `${token}\n`);
  console.log('persqo.txt: token written from PERSQO_TOKEN');
} else {
  console.log('persqo.txt: PERSQO_TOKEN not set, keeping the file as is');
}
