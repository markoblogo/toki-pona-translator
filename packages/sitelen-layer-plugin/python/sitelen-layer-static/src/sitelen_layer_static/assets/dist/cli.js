import { a as m } from "./detector-C1i9sROL.js";
import { a as T } from "./emojiMapping.generated-BeYnd4_4.js";
const c = {
  strategy: "weighted",
  lexiconProfile: "default",
  minTokens: 8,
  rareTokenPenalty: -0.45
}, f = /[a-zA-Z][a-zA-Z'-]*/g, d = /https?:\/\/\S+/gi;
function k(o, t) {
  const e = ["latin"];
  return o.pass ? (e.push("sitelen-emoji"), o.score >= t + 0.08 && e.push("sitelen-pona"), e) : ["latin"];
}
function l(o) {
  return o.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function p(o) {
  return o.toLowerCase().replace(d, " ").match(f) ?? [];
}
function u(o, t = {}) {
  const e = {
    ...c,
    ...t,
    rareTokenPenalty: t.rareTokenPenalty ?? c.rareTokenPenalty
  }, n = m(o, {
    threshold: t.threshold ?? 0.7,
    strategy: e.strategy,
    lexiconProfile: e.lexiconProfile,
    minTokens: e.minTokens,
    rareTokenPenalty: e.rareTokenPenalty
  }), i = [];
  return n.totalTokens < e.minTokens && i.push(`detected token count is low (${n.totalTokens}); minimum is ${e.minTokens}`), n.totalTokens > 0 && n.recognizedTokens === 0 && i.push("no toki pona tokens detected for configured profile"), {
    file: "",
    score: n.score,
    pass: n.pass,
    totalTokens: n.totalTokens,
    recognizedTokens: n.recognizedTokens,
    confidence: n.confidence,
    detectionVersion: n.detectorVersion,
    strategy: e.strategy,
    lexiconProfile: e.lexiconProfile,
    recommendations: k(n, t.threshold ?? 0.7),
    warnings: i
  };
}
function P(o, t, e = {}) {
  return { ...u(l(t), e), file: o };
}
function h(o, t = 10) {
  const e = o.includes("<") ? l(o) : o, n = p(e), i = T.wordMap, a = {};
  for (const s of n) {
    const r = s.toLowerCase();
    i[r] || (a[r] = (a[r] ?? 0) + 1);
  }
  return Object.entries(a).filter(([s, r]) => s.length > 0 && r > 0).sort((s, r) => r[1] - s[1] || s[0].localeCompare(r[0])).slice(0, Math.max(1, t)).map(([s, r]) => ({
    token: s,
    count: r
  }));
}
export {
  l as extractTextFromHtml,
  P as scanHtmlForLayerEligibility,
  u as scanTextForLayerEligibility,
  p as tokenizeText,
  h as topUnmappedEmojiFromText
};
