import fs from 'node:fs';
import path from 'node:path';

type Settings = {
  contactEmail?: string;
  instagram?: string;
  youtube?: string;
  x?: string;
  amazonTag?: string;
};

export async function getSingleton(): Promise<Settings> {
  try {
    const p = path.join(process.cwd(), 'content/settings/site.yaml');
    const raw = fs.readFileSync(p, 'utf8');
    const out: Settings = {};
    for (const line of raw.split('\n')) {
      const m = line.match(/^(\w+):\s*(.*)$/);
      if (m) (out as any)[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
    return out;
  } catch {
    return {};
  }
}
