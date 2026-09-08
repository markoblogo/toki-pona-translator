const h = /* @__PURE__ */ new Set([
  "a",
  "akesi",
  "ala",
  "alasa",
  "ale",
  "ali",
  "anpa",
  "ante",
  "anu",
  "awen",
  "e",
  "en",
  "esun",
  "ijo",
  "ike",
  "ilo",
  "insa",
  "jaki",
  "jan",
  "jelo",
  "jo",
  "kala",
  "kalama",
  "kama",
  "kasi",
  "ken",
  "kepeken",
  "kili",
  "kin",
  "kipisi",
  "kiwen",
  "ko",
  "kon",
  "kule",
  "kulupu",
  "kute",
  "la",
  "lape",
  "laso",
  "lawa",
  "len",
  "lete",
  "li",
  "lili",
  "linja",
  "lipu",
  "loje",
  "lon",
  "luka",
  "lukin",
  "lupa",
  "ma",
  "mama",
  "mani",
  "meli",
  "mi",
  "mije",
  "moku",
  "moli",
  "monsi",
  "mu",
  "mun",
  "musi",
  "mute",
  "nanpa",
  "nasa",
  "nasin",
  "nena",
  "ni",
  "nimi",
  "noka",
  "o",
  "olin",
  "ona",
  "open",
  "pakala",
  "pali",
  "palisa",
  "pan",
  "pana",
  "pi",
  "pilin",
  "pimeja",
  "pini",
  "pipi",
  "poka",
  "poki",
  "pona",
  "pu",
  "sama",
  "seli",
  "selo",
  "seme",
  "sewi",
  "sijelo",
  "sike",
  "sin",
  "sina",
  "sinpin",
  "sitelen",
  "sona",
  "soweli",
  "suli",
  "suno",
  "supa",
  "suwi",
  "tan",
  "taso",
  "tawa",
  "telo",
  "tenpo",
  "toki",
  "tomo",
  "tu",
  "unpa",
  "uta",
  "utala",
  "walo",
  "wan",
  "waso",
  "wawa",
  "weka",
  "wile",
  "namako",
  "monsuta",
  "tonsi",
  "jasima",
  "kijetesantakalu",
  "ku",
  "lanpan",
  "leko",
  "meso",
  "misikeke",
  "epiku",
  "kokosila",
  "n",
  "oko",
  "su",
  "soko"
]), f = /[a-zA-Z][a-zA-Z'-]*/g, A = /https?:\/\/\S+/gi;
function _(n) {
  const s = n.replace(A, " ").toLowerCase().match(f);
  return s || [];
}
function x(n) {
  return n.match(/(https?:\/\/\S+|[a-zA-Z][a-zA-Z'-]*|\d+|\s+|[^\w\s]+)/g) ?? [n];
}
function C(n) {
  return /^[a-zA-Z][a-zA-Z'-]*$/.test(n);
}
const z = /* @__PURE__ */ new Set(["pu", "ku", "su"]), m = 1, g = -0.45, j = -0.2, L = 4, P = h, S = /* @__PURE__ */ new Set([...h, "lanpan", "kule", "nasin", "tonsi", "kule"]), R = {
  a: 0.9,
  li: 1,
  e: 1,
  en: 0.95,
  la: 0.9,
  pi: 1,
  tawa: 1,
  mi: 1,
  ona: 0.95,
  kepeken: 0.85,
  lukin: 0.7
};
function T(n, e) {
  return n.length > 1 ? !0 : e.has(n);
}
function I(n, e) {
  const s = e.strategy ?? "simple", d = e.minTokens ?? L, l = e.lexiconProfile === "extended" ? S : P, w = e.rareTokenPenalty ?? g, c = _(n), t = c.filter((a) => T(a, l)), i = t.length, u = c.filter((a) => !T(a, l)).length;
  if (i === 0 || i < d)
    return {
      tokens: t,
      totalTokens: i,
      recognizedTokens: 0,
      score: 0,
      confidence: 0,
      pass: !1,
      ignoredShortTokens: u,
      detectorVersion: `${s}:${e.lexiconProfile ?? "default"}:v1`
    };
  if (s === "simple") {
    const a = t.reduce((r, O) => r + (l.has(O) ? 1 : 0), 0), o = a / i;
    return {
      tokens: t,
      totalTokens: i,
      recognizedTokens: a,
      score: o,
      confidence: o,
      pass: o >= e.threshold,
      ignoredShortTokens: u,
      detectorVersion: `${s}:${e.lexiconProfile ?? "default"}:v1`
    };
  }
  const E = t.reduce((a, o) => {
    if (!l.has(o))
      return a;
    let r = R[o] ?? m;
    return o.length <= 2 && (r += j), z.has(o) && (r += w), a + Math.max(0, r);
  }, 0), p = t.length * m, k = p > 0 ? Math.max(0, E / p) : 0, N = t.reduce((a, o) => a + (l.has(o) ? 1 : 0), 0);
  return {
    tokens: t,
    totalTokens: i,
    recognizedTokens: N,
    score: k,
    confidence: k,
    pass: k >= e.threshold,
    ignoredShortTokens: u,
    detectorVersion: `${s}:${e.lexiconProfile ?? "default"}:v1`
  };
}
export {
  I as a,
  C as i,
  x as t
};
