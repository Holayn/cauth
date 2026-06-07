import fs from 'fs';
import path from 'path';
import { DATA_DIR } from './env.js';

const CONFIG_PATH = path.join(DATA_DIR, 'config.json');

export function getServices() {
  const config = fs.readFileSync(CONFIG_PATH);
  const { services } = JSON.parse(config.toString());
  return services as { name: string; enable2fa: boolean }[];
}