export interface EmojiEntry {
  token: string;
  output: string;
  aliases?: string[];
}

export interface NormalizedEmojiMapping {
  entries: EmojiEntry[];
  wordMap: Record<string, string>;
  punctuationMap: Record<string, string>;
  metadata: {
    source: string;
    version: string;
    generatedAt: string;
  };
}

interface UpstreamProfile {
  name?: string;
  version?: string;
  generated_at?: string;
  entries?: Record<string, string>;
  aliases?: Record<string, string>;
}

const PUNCT_TOKENS: Record<string, string> = {
  _punct_period: '.',
  _punct_colon: ':'
};

function normalizeToken(token: string): string {
  return token.trim().toLowerCase();
}

function safeString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export function normalizeEmojiMapping(
  input: unknown,
  source = 'unknown'
): NormalizedEmojiMapping {
  const profile = (input ?? {}) as UpstreamProfile;
  const entries = profile.entries ?? {};
  const aliases = profile.aliases ?? {};

  const outputEntries: EmojiEntry[] = [];
  const wordMap: Record<string, string> = {};
  const punctuationMap: Record<string, string> = {};

  Object.entries(entries).forEach(([rawToken, rawOutput]) => {
    const output = safeString(rawOutput);
    if (!output) {
      return;
    }

    const normalizedToken = normalizeToken(rawToken);
    if (!normalizedToken) {
      return;
    }

    const punct = PUNCT_TOKENS[normalizedToken];
    if (punct) {
      punctuationMap[punct] = output;
      return;
    }

    wordMap[normalizedToken] = output;
    outputEntries.push({ token: normalizedToken, output });
  });

  Object.entries(aliases).forEach(([rawAlias, rawCanonical]) => {
    const alias = normalizeToken(rawAlias);
    const canonical = normalizeToken(rawCanonical);
    if (!alias || !canonical) {
      return;
    }

    const canonicalOutput = wordMap[canonical];
    if (!canonicalOutput) {
      return;
    }

    wordMap[alias] = canonicalOutput;

    const existing = outputEntries.find((entry) => entry.token === canonical);
    if (!existing) {
      return;
    }

    const nextAliases = new Set(existing.aliases ?? []);
    nextAliases.add(alias);
    existing.aliases = Array.from(nextAliases);
  });

  return {
    entries: outputEntries.sort((a, b) => a.token.localeCompare(b.token)),
    wordMap,
    punctuationMap,
    metadata: {
      source,
      version: safeString(profile.version) ?? 'unknown',
      generatedAt: safeString(profile.generated_at) ?? 'unknown'
    }
  };
}
