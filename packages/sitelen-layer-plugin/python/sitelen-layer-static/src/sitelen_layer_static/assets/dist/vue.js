import { createSitelenLayerPlugin as fe } from "./sitelen-layer-plugin.js";
// @__NO_SIDE_EFFECTS__
function gt(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const de = process.env.NODE_ENV !== "production" ? Object.freeze({}) : {};
process.env.NODE_ENV !== "production" && Object.freeze([]);
const He = () => {
}, mt = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), yt = (e) => e.startsWith("onUpdate:"), T = Object.assign, Et = Object.prototype.hasOwnProperty, pe = (e, t) => Et.call(e, t), h = Array.isArray, j = (e) => Ke(e) === "[object Map]", y = (e) => typeof e == "function", R = (e) => typeof e == "string", k = (e) => typeof e == "symbol", _ = (e) => e !== null && typeof e == "object", wt = (e) => (_(e) || y(e)) && y(e.then) && y(e.catch), Nt = Object.prototype.toString, Ke = (e) => Nt.call(e), je = (e) => Ke(e).slice(8, -1), ye = (e) => R(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Le = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, We = Le((e) => e.charAt(0).toUpperCase() + e.slice(1)), bt = Le(
  (e) => e ? `on${We(e)}` : ""
), L = (e, t) => !Object.is(e, t);
let De;
const te = () => De || (De = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Ee(e) {
  if (h(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], r = R(s) ? Rt(s) : Ee(s);
      if (r)
        for (const o in r)
          t[o] = r[o];
    }
    return t;
  } else if (R(e) || _(e))
    return e;
}
const St = /;(?![^(]*\))/g, Ot = /:([^]+)/, vt = /\/\*[^]*?\*\//g;
function Rt(e) {
  const t = {};
  return e.replace(vt, "").split(St).forEach((n) => {
    if (n) {
      const s = n.split(Ot);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function we(e) {
  let t = "";
  if (R(e))
    t = e;
  else if (h(e))
    for (let n = 0; n < e.length; n++) {
      const s = we(e[n]);
      s && (t += s + " ");
    }
  else if (_(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
function F(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let Ue = 0, oe;
function Ne() {
  Ue++;
}
function be() {
  if (--Ue > 0)
    return;
  let e;
  for (; oe; ) {
    let t = oe;
    for (oe = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (s) {
          e || (e = s);
        }
      t = n;
    }
  }
  if (e) throw e;
}
class Vt {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, process.env.NODE_ENV !== "production" && (this.subsHead = void 0);
  }
  track(t) {
  }
  trigger(t) {
    this.version++, this.notify(t);
  }
  notify(t) {
    Ne();
    try {
      if (process.env.NODE_ENV !== "production")
        for (let n = this.subsHead; n; n = n.nextSub)
          n.sub.onTrigger && !(n.sub.flags & 8) && n.sub.onTrigger(
            T(
              {
                effect: n.sub
              },
              t
            )
          );
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      be();
    }
  }
}
const It = /* @__PURE__ */ new WeakMap(), se = /* @__PURE__ */ Symbol(
  process.env.NODE_ENV !== "production" ? "Object iterate" : ""
), xe = /* @__PURE__ */ Symbol(
  process.env.NODE_ENV !== "production" ? "Map keys iterate" : ""
), Ce = /* @__PURE__ */ Symbol(
  process.env.NODE_ENV !== "production" ? "Array iterate" : ""
);
function D(e, t, n, s, r, o) {
  const i = It.get(e);
  if (!i)
    return;
  const c = (a) => {
    a && (process.env.NODE_ENV !== "production" ? a.trigger({
      target: e,
      type: t,
      key: n,
      newValue: s,
      oldValue: r,
      oldTarget: o
    }) : a.trigger());
  };
  if (Ne(), t === "clear")
    i.forEach(c);
  else {
    const a = h(e), u = a && ye(n);
    if (a && n === "length") {
      const p = Number(s);
      i.forEach((l, f) => {
        (f === "length" || f === Ce || !k(f) && f >= p) && c(l);
      });
    } else
      switch ((n !== void 0 || i.has(void 0)) && c(i.get(n)), u && c(i.get(Ce)), t) {
        case "add":
          a ? u && c(i.get("length")) : (c(i.get(se)), j(e) && c(i.get(xe)));
          break;
        case "delete":
          a || (c(i.get(se)), j(e) && c(i.get(xe)));
          break;
        case "set":
          j(e) && c(i.get(se));
          break;
      }
  }
  be();
}
function P(e) {
  const t = /* @__PURE__ */ d(e);
  return t === e || /* @__PURE__ */ E(e) ? t : t.map(V);
}
function Se(e) {
  return e = /* @__PURE__ */ d(e), e;
}
function N(e, t) {
  return /* @__PURE__ */ b(e) ? W(/* @__PURE__ */ Oe(e) ? V(t) : t) : V(t);
}
const Dt = {
  __proto__: null,
  [Symbol.iterator]() {
    return ie(this, Symbol.iterator, (e) => N(this, e));
  },
  concat(...e) {
    return P(this).concat(
      ...e.map((t) => h(t) ? P(t) : t)
    );
  },
  entries() {
    return ie(this, "entries", (e) => (e[1] = N(this, e[1]), e));
  },
  every(e, t) {
    return S(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return S(
      this,
      "filter",
      e,
      t,
      (n) => n.map((s) => N(this, s)),
      arguments
    );
  },
  find(e, t) {
    return S(
      this,
      "find",
      e,
      t,
      (n) => N(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return S(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return S(
      this,
      "findLast",
      e,
      t,
      (n) => N(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return S(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return S(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return ce(this, "includes", e);
  },
  indexOf(...e) {
    return ce(this, "indexOf", e);
  },
  join(e) {
    return P(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return ce(this, "lastIndexOf", e);
  },
  map(e, t) {
    return S(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return K(this, "pop");
  },
  push(...e) {
    return K(this, "push", e);
  },
  reduce(e, ...t) {
    return Te(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Te(this, "reduceRight", e, t);
  },
  shift() {
    return K(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return S(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return K(this, "splice", e);
  },
  toReversed() {
    return P(this).toReversed();
  },
  toSorted(e) {
    return P(this).toSorted(e);
  },
  toSpliced(...e) {
    return P(this).toSpliced(...e);
  },
  unshift(...e) {
    return K(this, "unshift", e);
  },
  values() {
    return ie(this, "values", (e) => N(this, e));
  }
};
function ie(e, t, n) {
  const s = Se(e), r = s[t]();
  return s !== e && !/* @__PURE__ */ E(e) && (r._next = r.next, r.next = () => {
    const o = r._next();
    return o.done || (o.value = n(o.value)), o;
  }), r;
}
const xt = Array.prototype;
function S(e, t, n, s, r, o) {
  const i = Se(e), c = i !== e && !/* @__PURE__ */ E(e), a = i[t];
  if (a !== xt[t]) {
    const l = a.apply(e, o);
    return c ? V(l) : l;
  }
  let u = n;
  i !== e && (c ? u = function(l, f) {
    return n.call(this, N(e, l), f, e);
  } : n.length > 2 && (u = function(l, f) {
    return n.call(this, l, f, e);
  }));
  const p = a.call(i, u, s);
  return c && r ? r(p) : p;
}
function Te(e, t, n, s) {
  const r = Se(e), o = r !== e && !/* @__PURE__ */ E(e);
  let i = n, c = !1;
  r !== e && (o ? (c = s.length === 0, i = function(u, p, l) {
    return c && (c = !1, u = N(e, u)), n.call(this, u, N(e, p), l, e);
  }) : n.length > 3 && (i = function(u, p, l) {
    return n.call(this, u, p, l, e);
  }));
  const a = r[t](i, ...s);
  return c ? N(e, a) : a;
}
function ce(e, t, n) {
  const s = /* @__PURE__ */ d(e), r = s[t](...n);
  return (r === -1 || r === !1) && /* @__PURE__ */ G(n[0]) ? (n[0] = /* @__PURE__ */ d(n[0]), s[t](...n)) : r;
}
function K(e, t, n = []) {
  Ne();
  const s = (/* @__PURE__ */ d(e))[t].apply(e, n);
  return be(), s;
}
const Ct = /* @__PURE__ */ gt("__proto__,__v_isRef,__isVue"), ke = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(k)
);
function Tt(e) {
  return k(e) || (e = String(e)), (/* @__PURE__ */ d(this)).hasOwnProperty(e);
}
class ze {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, s) {
    if (n === "__v_skip") return t.__v_skip;
    const r = this._isReadonly, o = this._isShallow;
    if (n === "__v_isReactive")
      return !r;
    if (n === "__v_isReadonly")
      return r;
    if (n === "__v_isShallow")
      return o;
    if (n === "__v_raw")
      return s === (r ? o ? Wt : Be : o ? Lt : Je).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const i = h(t);
    if (!r) {
      let a;
      if (i && (a = Dt[n]))
        return a;
      if (n === "hasOwnProperty")
        return Tt;
    }
    const c = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ v(t) ? t : s
    );
    if ((k(n) ? ke.has(n) : Ct(n)) || o)
      return c;
    if (/* @__PURE__ */ v(c)) {
      const a = i && ye(n) ? c : c.value;
      return r && _(a) ? /* @__PURE__ */ _e(a) : a;
    }
    return _(c) ? r ? /* @__PURE__ */ _e(c) : /* @__PURE__ */ qe(c) : c;
  }
}
class Pt extends ze {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, r) {
    let o = t[n];
    const i = h(t) && ye(n);
    if (!this._isShallow) {
      const u = /* @__PURE__ */ b(o);
      if (!/* @__PURE__ */ E(s) && !/* @__PURE__ */ b(s) && (o = /* @__PURE__ */ d(o), s = /* @__PURE__ */ d(s)), !i && /* @__PURE__ */ v(o) && !/* @__PURE__ */ v(s))
        return u ? (process.env.NODE_ENV !== "production" && F(
          `Set operation on key "${String(n)}" failed: target is readonly.`,
          t[n]
        ), !0) : (o.value = s, !0);
    }
    const c = i ? Number(n) < t.length : pe(t, n), a = Reflect.set(
      t,
      n,
      s,
      /* @__PURE__ */ v(t) ? t : r
    );
    return t === /* @__PURE__ */ d(r) && (c ? L(s, o) && D(t, "set", n, s, o) : D(t, "add", n, s)), a;
  }
  deleteProperty(t, n) {
    const s = pe(t, n), r = t[n], o = Reflect.deleteProperty(t, n);
    return o && s && D(t, "delete", n, void 0, r), o;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return !k(n) || ke.has(n), s;
  }
  ownKeys(t) {
    return Reflect.ownKeys(t);
  }
}
class $t extends ze {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return process.env.NODE_ENV !== "production" && F(
      `Set operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
  deleteProperty(t, n) {
    return process.env.NODE_ENV !== "production" && F(
      `Delete operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
}
const At = /* @__PURE__ */ new Pt(), Mt = /* @__PURE__ */ new $t(), he = (e) => e, z = (e) => Reflect.getPrototypeOf(e);
function Ft(e, t, n) {
  return function(...s) {
    const r = this.__v_raw, i = j(/* @__PURE__ */ d(r)), c = e === "entries" || e === Symbol.iterator && i, a = r[e](...s), u = n ? he : t ? W : V;
    return T(
      // inheriting all iterator properties
      Object.create(a),
      {
        // iterator protocol
        next() {
          const { value: p, done: l } = a.next();
          return l ? { value: p, done: l } : {
            value: c ? [u(p[0]), u(p[1])] : u(p),
            done: l
          };
        }
      }
    );
  };
}
function Y(e) {
  return function(...t) {
    if (process.env.NODE_ENV !== "production") {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      F(
        `${We(e)} operation ${n}failed: target is readonly.`,
        /* @__PURE__ */ d(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Ht(e, t) {
  const n = {
    get(r) {
      const o = this.__v_raw, i = /* @__PURE__ */ d(o), c = /* @__PURE__ */ d(r), { has: a } = z(i), u = t ? he : e ? W : V;
      if (a.call(i, r))
        return u(o.get(r));
      if (a.call(i, c))
        return u(o.get(c));
      o !== i && o.get(r);
    },
    get size() {
      return this.__v_raw.size;
    },
    has(r) {
      const o = this.__v_raw, i = /* @__PURE__ */ d(r);
      return r === i ? o.has(r) : o.has(r) || o.has(i);
    },
    forEach(r, o) {
      const i = this, c = i.__v_raw, a = t ? he : e ? W : V;
      return c.forEach((u, p) => r.call(o, a(u), a(p), i));
    }
  };
  return T(
    n,
    e ? {
      add: Y("add"),
      set: Y("set"),
      delete: Y("delete"),
      clear: Y("clear")
    } : {
      add(r) {
        const o = /* @__PURE__ */ d(this), i = z(o), c = /* @__PURE__ */ d(r), a = !t && !/* @__PURE__ */ E(r) && !/* @__PURE__ */ b(r) ? c : r;
        return i.has.call(o, a) || L(r, a) && i.has.call(o, r) || L(c, a) && i.has.call(o, c) || (o.add(a), D(o, "add", a, a)), this;
      },
      set(r, o) {
        !t && !/* @__PURE__ */ E(o) && !/* @__PURE__ */ b(o) && (o = /* @__PURE__ */ d(o));
        const i = /* @__PURE__ */ d(this), { has: c, get: a } = z(i);
        let u = c.call(i, r);
        u ? process.env.NODE_ENV !== "production" && Pe(i, c, r) : (r = /* @__PURE__ */ d(r), u = c.call(i, r));
        const p = a.call(i, r);
        return i.set(r, o), u ? L(o, p) && D(i, "set", r, o, p) : D(i, "add", r, o), this;
      },
      delete(r) {
        const o = /* @__PURE__ */ d(this), { has: i, get: c } = z(o);
        let a = i.call(o, r);
        a ? process.env.NODE_ENV !== "production" && Pe(o, i, r) : (r = /* @__PURE__ */ d(r), a = i.call(o, r));
        const u = c ? c.call(o, r) : void 0, p = o.delete(r);
        return a && D(o, "delete", r, void 0, u), p;
      },
      clear() {
        const r = /* @__PURE__ */ d(this), o = r.size !== 0, i = process.env.NODE_ENV !== "production" ? j(r) ? new Map(r) : new Set(r) : void 0, c = r.clear();
        return o && D(
          r,
          "clear",
          void 0,
          void 0,
          i
        ), c;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((r) => {
    n[r] = Ft(r, e, t);
  }), n;
}
function Ye(e, t) {
  const n = Ht(e, t);
  return (s, r, o) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? s : Reflect.get(
    pe(n, r) && r in s ? n : s,
    r,
    o
  );
}
const Kt = {
  get: /* @__PURE__ */ Ye(!1, !1)
}, jt = {
  get: /* @__PURE__ */ Ye(!0, !1)
};
function Pe(e, t, n) {
  const s = /* @__PURE__ */ d(n);
  if (s !== n && t.call(e, s)) {
    const r = je(e);
    F(
      `Reactive ${r} contains both the raw and reactive versions of the same object${r === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const Je = /* @__PURE__ */ new WeakMap(), Lt = /* @__PURE__ */ new WeakMap(), Be = /* @__PURE__ */ new WeakMap(), Wt = /* @__PURE__ */ new WeakMap();
function Ut(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
// @__NO_SIDE_EFFECTS__
function qe(e) {
  return /* @__PURE__ */ b(e) ? e : Ge(
    e,
    !1,
    At,
    Kt,
    Je
  );
}
// @__NO_SIDE_EFFECTS__
function _e(e) {
  return Ge(
    e,
    !0,
    Mt,
    jt,
    Be
  );
}
function Ge(e, t, n, s, r) {
  if (!_(e))
    return process.env.NODE_ENV !== "production" && F(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const o = r.get(e);
  if (o)
    return o;
  const i = Ut(je(e));
  if (i === 0)
    return e;
  const c = new Proxy(
    e,
    i === 2 ? s : n
  );
  return r.set(e, c), c;
}
// @__NO_SIDE_EFFECTS__
function Oe(e) {
  return /* @__PURE__ */ b(e) ? /* @__PURE__ */ Oe(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function b(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function E(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function G(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function d(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ d(t) : e;
}
const V = (e) => _(e) ? /* @__PURE__ */ qe(e) : e, W = (e) => _(e) ? /* @__PURE__ */ _e(e) : e;
// @__NO_SIDE_EFFECTS__
function v(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function kt(e) {
  return zt(e, !1);
}
function zt(e, t) {
  return /* @__PURE__ */ v(e) ? e : new Yt(e, t);
}
class Yt {
  constructor(t, n) {
    this.dep = new Vt(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : /* @__PURE__ */ d(t), this._value = n ? t : V(t), this.__v_isShallow = n;
  }
  get value() {
    return process.env.NODE_ENV !== "production" ? this.dep.track({
      target: this,
      type: "get",
      key: "value"
    }) : this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || /* @__PURE__ */ E(t) || /* @__PURE__ */ b(t);
    t = s ? t : /* @__PURE__ */ d(t), L(t, n) && (this._rawValue = t, this._value = s ? t : V(t), process.env.NODE_ENV !== "production" ? this.dep.trigger({
      target: this,
      type: "set",
      key: "value",
      newValue: t,
      oldValue: n
    }) : this.dep.trigger());
  }
}
const C = [];
function Jt(e) {
  C.push(e);
}
function Bt() {
  C.pop();
}
let le = !1;
function x(e, ...t) {
  if (le) return;
  le = !0;
  const n = C.length ? C[C.length - 1].component : null, s = n && n.appContext.config.warnHandler, r = qt();
  if (s)
    ne(
      s,
      n,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        e + t.map((o) => {
          var i, c;
          return (c = (i = o.toString) == null ? void 0 : i.call(o)) != null ? c : JSON.stringify(o);
        }).join(""),
        n && n.proxy,
        r.map(
          ({ vnode: o }) => `at <${dt(n, o.type)}>`
        ).join(`
`),
        r
      ]
    );
  else {
    const o = [`[Vue warn]: ${e}`, ...t];
    r.length && o.push(`
`, ...Gt(r)), console.warn(...o);
  }
  le = !1;
}
function qt() {
  let e = C[C.length - 1];
  if (!e)
    return [];
  const t = [];
  for (; e; ) {
    const n = t[0];
    n && n.vnode === e ? n.recurseCount++ : t.push({
      vnode: e,
      recurseCount: 0
    });
    const s = e.component && e.component.parent;
    e = s && s.vnode;
  }
  return t;
}
function Gt(e) {
  const t = [];
  return e.forEach((n, s) => {
    t.push(...s === 0 ? [] : [`
`], ...Qt(n));
  }), t;
}
function Qt({ vnode: e, recurseCount: t }) {
  const n = t > 0 ? `... (${t} recursive calls)` : "", s = e.component ? e.component.parent == null : !1, r = ` at <${dt(
    e.component,
    e.type,
    s
  )}`, o = ">" + n;
  return e.props ? [r, ...Xt(e.props), o] : [r + o];
}
function Xt(e) {
  const t = [], n = Object.keys(e);
  return n.slice(0, 3).forEach((s) => {
    t.push(...Qe(s, e[s]));
  }), n.length > 3 && t.push(" ..."), t;
}
function Qe(e, t, n) {
  return R(t) ? (t = JSON.stringify(t), n ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? n ? t : [`${e}=${t}`] : /* @__PURE__ */ v(t) ? (t = Qe(e, /* @__PURE__ */ d(t.value), !0), n ? t : [`${e}=Ref<`, t, ">"]) : y(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = /* @__PURE__ */ d(t), n ? t : [`${e}=`, t]);
}
const ve = {
  sp: "serverPrefetch hook",
  bc: "beforeCreate hook",
  c: "created hook",
  bm: "beforeMount hook",
  m: "mounted hook",
  bu: "beforeUpdate hook",
  u: "updated",
  bum: "beforeUnmount hook",
  um: "unmounted hook",
  a: "activated hook",
  da: "deactivated hook",
  ec: "errorCaptured hook",
  rtc: "renderTracked hook",
  rtg: "renderTriggered hook",
  0: "setup function",
  1: "render function",
  2: "watcher getter",
  3: "watcher callback",
  4: "watcher cleanup function",
  5: "native event handler",
  6: "component event handler",
  7: "vnode hook",
  8: "directive hook",
  9: "transition hook",
  10: "app errorHandler",
  11: "app warnHandler",
  12: "ref function",
  13: "async component loader",
  14: "scheduler flush",
  15: "component update",
  16: "app unmount cleanup function"
};
function ne(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (r) {
    Re(r, t, n);
  }
}
function Xe(e, t, n, s) {
  if (y(e)) {
    const r = ne(e, t, n, s);
    return r && wt(r) && r.catch((o) => {
      Re(o, t, n);
    }), r;
  }
  if (h(e)) {
    const r = [];
    for (let o = 0; o < e.length; o++)
      r.push(Xe(e[o], t, n, s));
    return r;
  } else process.env.NODE_ENV !== "production" && x(
    `Invalid value type passed to callWithAsyncErrorHandling(): ${typeof e}`
  );
}
function Re(e, t, n, s = !0) {
  const r = t ? t.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: i } = t && t.appContext.config || de;
  if (t) {
    let c = t.parent;
    const a = t.proxy, u = process.env.NODE_ENV !== "production" ? ve[n] : `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; c; ) {
      const p = c.ec;
      if (p) {
        for (let l = 0; l < p.length; l++)
          if (p[l](e, a, u) === !1)
            return;
      }
      c = c.parent;
    }
    if (o) {
      ne(o, null, 10, [
        e,
        a,
        u
      ]);
      return;
    }
  }
  Zt(e, n, r, s, i);
}
function Zt(e, t, n, s = !0, r = !1) {
  if (process.env.NODE_ENV !== "production") {
    const o = ve[t];
    if (n && Jt(n), x(`Unhandled error${o ? ` during execution of ${o}` : ""}`), n && Bt(), s)
      throw e;
    console.error(e);
  } else {
    if (r)
      throw e;
    console.error(e);
  }
}
const m = [];
let O = -1;
const M = [];
let I = null, $ = 0;
const en = /* @__PURE__ */ Promise.resolve();
let ge = null;
const tn = 100;
function nn(e) {
  let t = O + 1, n = m.length;
  for (; t < n; ) {
    const s = t + n >>> 1, r = m[s], o = U(r);
    o < e || o === e && r.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function rn(e) {
  if (!(e.flags & 1)) {
    const t = U(e), n = m[m.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= U(n) ? m.push(e) : m.splice(nn(t), 0, e), e.flags |= 1, Ze();
  }
}
function Ze() {
  ge || (ge = en.then(et));
}
function on(e) {
  h(e) ? M.push(...e) : I && e.id === -1 ? I.splice($ + 1, 0, e) : e.flags & 1 || (M.push(e), e.flags |= 1), Ze();
}
function sn(e) {
  if (M.length) {
    const t = [...new Set(M)].sort(
      (n, s) => U(n) - U(s)
    );
    if (M.length = 0, I) {
      I.push(...t);
      return;
    }
    for (I = t, process.env.NODE_ENV !== "production" && (e = e || /* @__PURE__ */ new Map()), $ = 0; $ < I.length; $++) {
      const n = I[$];
      process.env.NODE_ENV !== "production" && tt(e, n) || (n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2);
    }
    I = null, $ = 0;
  }
}
const U = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function et(e) {
  process.env.NODE_ENV !== "production" && (e = e || /* @__PURE__ */ new Map());
  const t = process.env.NODE_ENV !== "production" ? (n) => tt(e, n) : He;
  try {
    for (O = 0; O < m.length; O++) {
      const n = m[O];
      if (n && !(n.flags & 8)) {
        if (process.env.NODE_ENV !== "production" && t(n))
          continue;
        n.flags & 4 && (n.flags &= -2), ne(
          n,
          n.i,
          n.i ? 15 : 14
        ), n.flags & 4 || (n.flags &= -2);
      }
    }
  } finally {
    for (; O < m.length; O++) {
      const n = m[O];
      n && (n.flags &= -2);
    }
    O = -1, m.length = 0, sn(e), ge = null, (m.length || M.length) && et(e);
  }
}
function tt(e, t) {
  const n = e.get(t) || 0;
  if (n > tn) {
    const s = t.i, r = s && ft(s.type);
    return Re(
      `Maximum recursive updates exceeded${r ? ` in component <${r}>` : ""}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
      null,
      10
    ), !0;
  }
  return e.set(t, n + 1), !1;
}
const ae = /* @__PURE__ */ new Map();
process.env.NODE_ENV !== "production" && (te().__VUE_HMR_RUNTIME__ = {
  createRecord: ue(cn),
  rerender: ue(ln),
  reload: ue(an)
});
const Q = /* @__PURE__ */ new Map();
function cn(e, t) {
  return Q.has(e) ? !1 : (Q.set(e, {
    initialDef: X(t),
    instances: /* @__PURE__ */ new Set()
  }), !0);
}
function X(e) {
  return pt(e) ? e.__vccOpts : e;
}
function ln(e, t) {
  const n = Q.get(e);
  n && (n.initialDef.render = t, [...n.instances].forEach((s) => {
    t && (s.render = t, X(s.type).render = t), s.renderCache = [], s.job.flags & 8 || s.update();
  }));
}
function an(e, t) {
  const n = Q.get(e);
  if (!n) return;
  t = X(t), $e(n.initialDef, t);
  const s = [...n.instances];
  for (let r = 0; r < s.length; r++) {
    const o = s[r], i = X(o.type);
    let c = ae.get(i);
    c || (i !== n.initialDef && $e(i, t), ae.set(i, c = /* @__PURE__ */ new Set())), c.add(o), o.appContext.propsCache.delete(o.type), o.appContext.emitsCache.delete(o.type), o.appContext.optionsCache.delete(o.type), o.ceReload ? (c.add(o), o.ceReload(t.styles), c.delete(o)) : o.parent ? rn(() => {
      o.job.flags & 8 || (o.parent.update(), c.delete(o));
    }) : o.appContext.reload ? o.appContext.reload() : typeof window < "u" ? window.location.reload() : console.warn(
      "[HMR] Root or manually mounted instance modified. Full reload required."
    ), o.root.ce && o !== o.root && o.root.ce._removeChildStyle(i);
  }
  on(() => {
    ae.clear();
  });
}
function $e(e, t) {
  T(e, t);
  for (const n in e)
    n !== "__file" && !(n in t) && delete e[n];
}
function ue(e) {
  return (t, n) => {
    try {
      return e(t, n);
    } catch (s) {
      console.error(s), console.warn(
        "[HMR] Something went wrong during Vue component hot-reload. Full reload required."
      );
    }
  };
}
let A, J = [];
function nt(e, t) {
  var n, s;
  A = e, A ? (A.enabled = !0, J.forEach(({ event: r, args: o }) => A.emit(r, ...o)), J = []) : /* handle late devtools injection - only do this if we are in an actual */ /* browser environment to avoid the timer handle stalling test runner exit */ /* (#4815) */ typeof window < "u" && // some envs mock window but not fully
  window.HTMLElement && // also exclude jsdom
  // eslint-disable-next-line no-restricted-syntax
  !((s = (n = window.navigator) == null ? void 0 : n.userAgent) != null && s.includes("jsdom")) ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((o) => {
    nt(o, t);
  }), setTimeout(() => {
    A || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, J = []);
  }, 3e3)) : J = [];
}
let Z = null, un = null;
const fn = (e) => e.__isTeleport;
function rt(e, t) {
  e.shapeFlag & 6 && e.component ? (e.transition = t, rt(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
te().requestIdleCallback;
te().cancelIdleCallback;
function dn(e, t, n = re, s = !1) {
  if (n) {
    const r = n[e] || (n[e] = []), o = t.__weh || (t.__weh = (...i) => {
      const c = In(n), a = Xe(t, n, e, i);
      return c(), a;
    });
    return s ? r.unshift(o) : r.push(o), o;
  } else if (process.env.NODE_ENV !== "production") {
    const r = bt(ve[e].replace(/ hook$/, ""));
    x(
      `${r} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`
    );
  }
}
const ot = (e) => (t, n = re) => {
  (!ut || e === "sp") && dn(e, (...s) => t(...s), n);
}, pn = ot("m"), hn = ot(
  "bum"
), _n = /* @__PURE__ */ Symbol.for("v-ndc"), gn = {};
process.env.NODE_ENV !== "production" && (gn.ownKeys = (e) => (x(
  "Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead."
), Reflect.ownKeys(e)));
const mn = {}, st = (e) => Object.getPrototypeOf(e) === mn, yn = (e) => e.__isSuspense, it = /* @__PURE__ */ Symbol.for("v-fgt"), En = /* @__PURE__ */ Symbol.for("v-txt"), wn = /* @__PURE__ */ Symbol.for("v-cmt");
function Nn(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
const bn = (...e) => lt(
  ...e
), ct = ({ key: e }) => e ?? null, q = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? R(e) || /* @__PURE__ */ v(e) || y(e) ? { i: Z, r: e, k: t, f: !!n } : e : null);
function Sn(e, t = null, n = null, s = 0, r = null, o = e === it ? 0 : 1, i = !1, c = !1) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && ct(t),
    ref: t && q(t),
    scopeId: un,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: o,
    patchFlag: s,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: Z
  };
  return c ? (Ve(a, n), o & 128 && e.normalize(a)) : n && (a.shapeFlag |= R(n) ? 8 : 16), process.env.NODE_ENV !== "production" && a.key !== a.key && x("VNode created with invalid key (NaN). VNode type:", a.type), a;
}
const On = process.env.NODE_ENV !== "production" ? bn : lt;
function lt(e, t = null, n = null, s = 0, r = null, o = !1) {
  if ((!e || e === _n) && (process.env.NODE_ENV !== "production" && !e && x(`Invalid vnode type when creating vnode: ${e}.`), e = wn), Nn(e)) {
    const c = ee(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && Ve(c, n), c.patchFlag = -2, c;
  }
  if (pt(e) && (e = e.__vccOpts), t) {
    t = vn(t);
    let { class: c, style: a } = t;
    c && !R(c) && (t.class = we(c)), _(a) && (/* @__PURE__ */ G(a) && !h(a) && (a = T({}, a)), t.style = Ee(a));
  }
  const i = R(e) ? 1 : yn(e) ? 128 : fn(e) ? 64 : _(e) ? 4 : y(e) ? 2 : 0;
  return process.env.NODE_ENV !== "production" && i & 4 && /* @__PURE__ */ G(e) && (e = /* @__PURE__ */ d(e), x(
    "Vue received a Component that was made a reactive object. This can lead to unnecessary performance overhead and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.",
    `
Component that was made reactive: `,
    e
  )), Sn(
    e,
    t,
    n,
    s,
    r,
    i,
    o,
    !0
  );
}
function vn(e) {
  return e ? /* @__PURE__ */ G(e) || st(e) ? T({}, e) : e : null;
}
function ee(e, t, n = !1, s = !1) {
  const { props: r, ref: o, patchFlag: i, children: c, transition: a } = e, u = t ? Vn(r || {}, t) : r, p = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: u,
    key: u && ct(u),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && o ? h(o) ? o.concat(q(t)) : [o, q(t)] : q(t)
    ) : o,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: process.env.NODE_ENV !== "production" && i === -1 && h(c) ? c.map(at) : c,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== it ? i === -1 ? 16 : i | 16 : i,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: a,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && ee(e.ssContent),
    ssFallback: e.ssFallback && ee(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
  return a && s && rt(
    p,
    a.clone(p)
  ), p;
}
function at(e) {
  const t = ee(e);
  return h(e.children) && (t.children = e.children.map(at)), t;
}
function Rn(e = " ", t = 0) {
  return On(En, null, e, t);
}
function Ve(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (h(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), Ve(e, r()), r._c && (r._d = !0));
      return;
    } else
      n = 32, !t._ && !st(t) && (t._ctx = Z);
  else y(t) ? (t = { default: t, _ctx: Z }, n = 32) : (t = String(t), s & 64 ? (n = 16, t = [Rn(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function Vn(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const r in s)
      if (r === "class")
        t.class !== s.class && (t.class = we([t.class, s.class]));
      else if (r === "style")
        t.style = Ee([t.style, s.style]);
      else if (mt(r)) {
        const o = t[r], i = s[r];
        i && o !== i && !(h(o) && o.includes(i)) ? t[r] = o ? [].concat(o, i) : i : i == null && o == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !yt(r) && (t[r] = i);
      } else r !== "" && (t[r] = s[r]);
  }
  return t;
}
let re = null, me;
{
  const e = te(), t = (n, s) => {
    let r;
    return (r = e[n]) || (r = e[n] = []), r.push(s), (o) => {
      r.length > 1 ? r.forEach((i) => i(o)) : r[0](o);
    };
  };
  me = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => re = n
  ), t(
    "__VUE_SSR_SETTERS__",
    (n) => ut = n
  );
}
const In = (e) => {
  const t = re;
  return me(e), e.scope.on(), () => {
    e.scope.off(), me(t);
  };
};
let ut = !1;
process.env.NODE_ENV;
const Dn = /(?:^|[-_])\w/g, xn = (e) => e.replace(Dn, (t) => t.toUpperCase()).replace(/[-_]/g, "");
function ft(e, t = !0) {
  return y(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function dt(e, t, n = !1) {
  let s = ft(t);
  if (!s && t.__file) {
    const r = t.__file.match(/([^/\\]+)\.\w+$/);
    r && (s = r[1]);
  }
  if (!s && e) {
    const r = (o) => {
      for (const i in o)
        if (o[i] === t)
          return i;
    };
    s = r(e.components) || e.parent && r(
      e.parent.type.components
    ) || r(e.appContext.components);
  }
  return s ? xn(s) : n ? "App" : "Anonymous";
}
function pt(e) {
  return y(e) && "__vccOpts" in e;
}
function Cn() {
  if (process.env.NODE_ENV === "production" || typeof window > "u")
    return;
  const e = { style: "color:#3ba776" }, t = { style: "color:#1677ff" }, n = { style: "color:#f5222d" }, s = { style: "color:#eb2f96" }, r = {
    __vue_custom_formatter: !0,
    header(l) {
      if (!_(l))
        return null;
      if (l.__isVue)
        return ["div", e, "VueInstance"];
      if (/* @__PURE__ */ v(l)) {
        const f = l.value;
        return [
          "div",
          {},
          ["span", e, p(l)],
          "<",
          c(f),
          ">"
        ];
      } else {
        if (/* @__PURE__ */ Oe(l))
          return [
            "div",
            {},
            ["span", e, /* @__PURE__ */ E(l) ? "ShallowReactive" : "Reactive"],
            "<",
            c(l),
            `>${/* @__PURE__ */ b(l) ? " (readonly)" : ""}`
          ];
        if (/* @__PURE__ */ b(l))
          return [
            "div",
            {},
            ["span", e, /* @__PURE__ */ E(l) ? "ShallowReadonly" : "Readonly"],
            "<",
            c(l),
            ">"
          ];
      }
      return null;
    },
    hasBody(l) {
      return l && l.__isVue;
    },
    body(l) {
      if (l && l.__isVue)
        return [
          "div",
          {},
          ...o(l.$)
        ];
    }
  };
  function o(l) {
    const f = [];
    l.type.props && l.props && f.push(i("props", /* @__PURE__ */ d(l.props))), l.setupState !== de && f.push(i("setup", l.setupState)), l.data !== de && f.push(i("data", /* @__PURE__ */ d(l.data)));
    const g = a(l, "computed");
    g && f.push(i("computed", g));
    const w = a(l, "inject");
    return w && f.push(i("injected", w)), f.push([
      "div",
      {},
      [
        "span",
        {
          style: s.style + ";opacity:0.66"
        },
        "$ (internal): "
      ],
      ["object", { object: l }]
    ]), f;
  }
  function i(l, f) {
    return f = T({}, f), Object.keys(f).length ? [
      "div",
      { style: "line-height:1.25em;margin-bottom:0.6em" },
      [
        "div",
        {
          style: "color:#476582"
        },
        l
      ],
      [
        "div",
        {
          style: "padding-left:1.25em"
        },
        ...Object.keys(f).map((g) => [
          "div",
          {},
          ["span", s, g + ": "],
          c(f[g], !1)
        ])
      ]
    ] : ["span", {}];
  }
  function c(l, f = !0) {
    return typeof l == "number" ? ["span", t, l] : typeof l == "string" ? ["span", n, JSON.stringify(l)] : typeof l == "boolean" ? ["span", s, l] : _(l) ? ["object", { object: f ? /* @__PURE__ */ d(l) : l }] : ["span", n, String(l)];
  }
  function a(l, f) {
    const g = l.type;
    if (y(g))
      return;
    const w = {};
    for (const H in l.ctx)
      u(g, H, f) && (w[H] = l.ctx[H]);
    return w;
  }
  function u(l, f, g) {
    const w = l[g];
    if (h(w) && w.includes(f) || _(w) && f in w || l.extends && u(l.extends, f, g) || l.mixins && l.mixins.some((H) => u(H, f, g)))
      return !0;
  }
  function p(l) {
    return /* @__PURE__ */ E(l) ? "ShallowRef" : l.effect ? "ComputedRef" : "Ref";
  }
  window.devtoolsFormatters ? window.devtoolsFormatters.push(r) : window.devtoolsFormatters = [r];
}
process.env.NODE_ENV;
process.env.NODE_ENV;
process.env.NODE_ENV;
function Tn() {
  Cn();
}
process.env.NODE_ENV !== "production" && Tn();
const Pn = "__sitelenLayerPlugin", Ie = "__sitelenLayerPluginDirectiveState";
function $n(e) {
  const t = (n) => n === void 0 ? "__undefined__" : n === null ? "__null__" : typeof n == "function" ? "__function__" : typeof Element < "u" && n instanceof Element ? `element:${n.tagName.toLowerCase()}#${n.id || "no-id"}` : n;
  try {
    return JSON.stringify(e, (n, s) => t(s));
  } catch {
    return "";
  }
}
function ht(e) {
  return e[Ie];
}
function Ae(e, t) {
  e[Ie] = t;
}
function An(e) {
  delete e[Ie];
}
function Me(e, t, n) {
  const s = t ?? {};
  return {
    ...e,
    ...s,
    container: s.container ?? n,
    storageKey: s.storageKey ?? `${Pn}:${n.tagName.toLowerCase()}`
  };
}
function Fe(e) {
  return $n(e);
}
function B(e) {
  const t = ht(e);
  t && (t.plugin?.destroy(), An(e));
}
function Mn(e = {}) {
  const t = /* @__PURE__ */ kt(null);
  return pn(() => {
    if (typeof window > "u")
      return;
    const n = fe(e);
    t.value = n, n.init();
  }), hn(() => {
    t.value?.destroy(), t.value = null;
  }), t;
}
function Fn(e = {}) {
  return {
    mounted(t, n) {
      if (typeof window > "u")
        return;
      const s = t, r = Me(e, n.value, s);
      if (r.autoStart === !1 || r.enabled === !1)
        return;
      const o = fe(r);
      o.init(), Ae(s, {
        plugin: o,
        signature: Fe(r)
      });
    },
    updated(t, n) {
      if (typeof window > "u")
        return;
      const s = t, r = ht(s), o = Me(e, n.value, s), i = Fe(o);
      if (n.value?.autoStart === !1 || n.value?.enabled === !1) {
        B(s);
        return;
      }
      if (r?.signature === i)
        return;
      B(s);
      const c = fe(o);
      c.init(), Ae(s, {
        plugin: c,
        signature: i
      });
    },
    beforeUnmount(t) {
      B(t);
    },
    unmounted(t) {
      B(t);
    }
  };
}
function _t(e = {}) {
  return Fn(e);
}
const Hn = _t(), jn = { useSitelenLayerPlugin: Mn, createSitelenLayerDirective: _t, vSitelenLayer: Hn };
export {
  _t as createSitelenLayerDirective,
  jn as default,
  Mn as useSitelenLayerPlugin,
  Hn as vSitelenLayer
};
