const WORD_PATTERN = /[a-zA-Z][a-zA-Z'-]*/g;
const URL_PATTERN = /https?:\/\/\S+/gi;

export function tokenizeForDetection(text: string): string[] {
  const withoutUrls = text.replace(URL_PATTERN, ' ');
  const matches = withoutUrls.toLowerCase().match(WORD_PATTERN);
  if (!matches) {
    return [];
  }

  return matches;
}

export function tokenizeForReplacement(text: string): string[] {
  const parts = text.match(/(https?:\/\/\S+|[a-zA-Z][a-zA-Z'-]*|\d+|\s+|[^\w\s]+)/g);
  return parts ?? [text];
}

export function isWordToken(token: string): boolean {
  return /^[a-zA-Z][a-zA-Z'-]*$/.test(token);
}
