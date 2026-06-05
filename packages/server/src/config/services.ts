import fs from 'fs';
import path from 'path';
import { getDirname } from '../util/path.js';

const CONFIG_PATH = path.join(getDirname(import.meta.url), '../../config.json');

export function getServices() {
  const config = fs.readFileSync(CONFIG_PATH);
  const { services } = JSON.parse(config.toString());
  return services as { name: string; enable2fa: boolean }[];
}