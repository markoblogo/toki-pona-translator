import profile from '@/data/sitelen-emoji-default-stable.v1.json';

// Pinned profile (tagged) from https://github.com/markoblogo/sitelen-emoji-truth
// This is the ONLY source of truth used by the translator.
// If we want to update, we bump the pinned file and redeploy.

type Profile = {
  name: string;
  version: string;
  aliases?: Record<string, string>;
  entries: Record<string, string>;
};

const p = profile as unknown as Profile;

export function mapToSitelenEmoji(words: string[]): string {
  const entries = p.entries || {};
  const aliases = p.aliases || {};

  return words
    .map((raw) => {
      const cleaned = raw.toLowerCase().replace(/[^a-z]/g, '');
      const key = aliases[cleaned] ?? cleaned;
      return entries[key] ?? raw;
    })
    .join(' ');
}
