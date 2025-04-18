import { copyFileSync } from 'fs';
import { join } from 'path';

const from = join(process.cwd(), '.env');
const to = join(process.cwd(), 'dist', '.env');

try {
  copyFileSync(from, to);
  console.log('env copied to dist folder.');
} catch (err) {
  console.error('Failed to copy .env file:', err);
}
