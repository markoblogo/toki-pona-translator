import { createSitelenLayerPlugin as xt } from "./sitelen-layer-plugin.js";
var ke = { exports: {} }, d = {};
var Or;
function Nt() {
  if (Or) return d;
  Or = 1;
  var T = /* @__PURE__ */ Symbol.for("react.element"), f = /* @__PURE__ */ Symbol.for("react.portal"), S = /* @__PURE__ */ Symbol.for("react.fragment"), D = /* @__PURE__ */ Symbol.for("react.strict_mode"), I = /* @__PURE__ */ Symbol.for("react.profiler"), U = /* @__PURE__ */ Symbol.for("react.provider"), x = /* @__PURE__ */ Symbol.for("react.context"), ne = /* @__PURE__ */ Symbol.for("react.forward_ref"), ae = /* @__PURE__ */ Symbol.for("react.suspense"), G = /* @__PURE__ */ Symbol.for("react.memo"), z = /* @__PURE__ */ Symbol.for("react.lazy"), B = Symbol.iterator;
  function oe(t) {
    return t === null || typeof t != "object" ? null : (t = B && t[B] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var N = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, q = Object.assign, de = {};
  function M(t, o, p) {
    this.props = t, this.context = o, this.refs = de, this.updater = p || N;
  }
  M.prototype.isReactComponent = {}, M.prototype.setState = function(t, o) {
    if (typeof t != "object" && typeof t != "function" && t != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, t, o, "setState");
  }, M.prototype.forceUpdate = function(t) {
    this.updater.enqueueForceUpdate(this, t, "forceUpdate");
  };
  function pe() {
  }
  pe.prototype = M.prototype;
  function J(t, o, p) {
    this.props = t, this.context = o, this.refs = de, this.updater = p || N;
  }
  var Q = J.prototype = new pe();
  Q.constructor = J, q(Q, M.prototype), Q.isPureReactComponent = !0;
  var V = Array.isArray, k = Object.prototype.hasOwnProperty, L = { current: null }, W = { key: !0, ref: !0, __self: !0, __source: !0 };
  function H(t, o, p) {
    var y, h = {}, w = null, E = null;
    if (o != null) for (y in o.ref !== void 0 && (E = o.ref), o.key !== void 0 && (w = "" + o.key), o) k.call(o, y) && !W.hasOwnProperty(y) && (h[y] = o[y]);
    var R = arguments.length - 2;
    if (R === 1) h.children = p;
    else if (1 < R) {
      for (var _ = Array(R), A = 0; A < R; A++) _[A] = arguments[A + 2];
      h.children = _;
    }
    if (t && t.defaultProps) for (y in R = t.defaultProps, R) h[y] === void 0 && (h[y] = R[y]);
    return { $$typeof: T, type: t, key: w, ref: E, props: h, _owner: L.current };
  }
  function ve(t, o) {
    return { $$typeof: T, type: t.type, key: o, ref: t.ref, props: t.props, _owner: t._owner };
  }
  function ue(t) {
    return typeof t == "object" && t !== null && t.$$typeof === T;
  }
  function Pe(t) {
    var o = { "=": "=0", ":": "=2" };
    return "$" + t.replace(/[=:]/g, function(p) {
      return o[p];
    });
  }
  var ye = /\/+/g;
  function ie(t, o) {
    return typeof t == "object" && t !== null && t.key != null ? Pe("" + t.key) : o.toString(36);
  }
  function X(t, o, p, y, h) {
    var w = typeof t;
    (w === "undefined" || w === "boolean") && (t = null);
    var E = !1;
    if (t === null) E = !0;
    else switch (w) {
      case "string":
      case "number":
        E = !0;
        break;
      case "object":
        switch (t.$$typeof) {
          case T:
          case f:
            E = !0;
        }
    }
    if (E) return E = t, h = h(E), t = y === "" ? "." + ie(E, 0) : y, V(h) ? (p = "", t != null && (p = t.replace(ye, "$&/") + "/"), X(h, o, p, "", function(A) {
      return A;
    })) : h != null && (ue(h) && (h = ve(h, p + (!h.key || E && E.key === h.key ? "" : ("" + h.key).replace(ye, "$&/") + "/") + t)), o.push(h)), 1;
    if (E = 0, y = y === "" ? "." : y + ":", V(t)) for (var R = 0; R < t.length; R++) {
      w = t[R];
      var _ = y + ie(w, R);
      E += X(w, o, p, _, h);
    }
    else if (_ = oe(t), typeof _ == "function") for (t = _.call(t), R = 0; !(w = t.next()).done; ) w = w.value, _ = y + ie(w, R++), E += X(w, o, p, _, h);
    else if (w === "object") throw o = String(t), Error("Objects are not valid as a React child (found: " + (o === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : o) + "). If you meant to render a collection of children, use an array instead.");
    return E;
  }
  function F(t, o, p) {
    if (t == null) return t;
    var y = [], h = 0;
    return X(t, y, "", "", function(w) {
      return o.call(p, w, h++);
    }), y;
  }
  function $(t) {
    if (t._status === -1) {
      var o = t._result;
      o = o(), o.then(function(p) {
        (t._status === 0 || t._status === -1) && (t._status = 1, t._result = p);
      }, function(p) {
        (t._status === 0 || t._status === -1) && (t._status = 2, t._result = p);
      }), t._status === -1 && (t._status = 0, t._result = o);
    }
    if (t._status === 1) return t._result.default;
    throw t._result;
  }
  var c = { current: null }, K = { transition: null }, he = { ReactCurrentDispatcher: c, ReactCurrentBatchConfig: K, ReactCurrentOwner: L };
  function Z() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return d.Children = { map: F, forEach: function(t, o, p) {
    F(t, function() {
      o.apply(this, arguments);
    }, p);
  }, count: function(t) {
    var o = 0;
    return F(t, function() {
      o++;
    }), o;
  }, toArray: function(t) {
    return F(t, function(o) {
      return o;
    }) || [];
  }, only: function(t) {
    if (!ue(t)) throw Error("React.Children.only expected to receive a single React element child.");
    return t;
  } }, d.Component = M, d.Fragment = S, d.Profiler = I, d.PureComponent = J, d.StrictMode = D, d.Suspense = ae, d.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = he, d.act = Z, d.cloneElement = function(t, o, p) {
    if (t == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + t + ".");
    var y = q({}, t.props), h = t.key, w = t.ref, E = t._owner;
    if (o != null) {
      if (o.ref !== void 0 && (w = o.ref, E = L.current), o.key !== void 0 && (h = "" + o.key), t.type && t.type.defaultProps) var R = t.type.defaultProps;
      for (_ in o) k.call(o, _) && !W.hasOwnProperty(_) && (y[_] = o[_] === void 0 && R !== void 0 ? R[_] : o[_]);
    }
    var _ = arguments.length - 2;
    if (_ === 1) y.children = p;
    else if (1 < _) {
      R = Array(_);
      for (var A = 0; A < _; A++) R[A] = arguments[A + 2];
      y.children = R;
    }
    return { $$typeof: T, type: t.type, key: h, ref: w, props: y, _owner: E };
  }, d.createContext = function(t) {
    return t = { $$typeof: x, _currentValue: t, _currentValue2: t, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, t.Provider = { $$typeof: U, _context: t }, t.Consumer = t;
  }, d.createElement = H, d.createFactory = function(t) {
    var o = H.bind(null, t);
    return o.type = t, o;
  }, d.createRef = function() {
    return { current: null };
  }, d.forwardRef = function(t) {
    return { $$typeof: ne, render: t };
  }, d.isValidElement = ue, d.lazy = function(t) {
    return { $$typeof: z, _payload: { _status: -1, _result: t }, _init: $ };
  }, d.memo = function(t, o) {
    return { $$typeof: G, type: t, compare: o === void 0 ? null : o };
  }, d.startTransition = function(t) {
    var o = K.transition;
    K.transition = {};
    try {
      t();
    } finally {
      K.transition = o;
    }
  }, d.unstable_act = Z, d.useCallback = function(t, o) {
    return c.current.useCallback(t, o);
  }, d.useContext = function(t) {
    return c.current.useContext(t);
  }, d.useDebugValue = function() {
  }, d.useDeferredValue = function(t) {
    return c.current.useDeferredValue(t);
  }, d.useEffect = function(t, o) {
    return c.current.useEffect(t, o);
  }, d.useId = function() {
    return c.current.useId();
  }, d.useImperativeHandle = function(t, o, p) {
    return c.current.useImperativeHandle(t, o, p);
  }, d.useInsertionEffect = function(t, o) {
    return c.current.useInsertionEffect(t, o);
  }, d.useLayoutEffect = function(t, o) {
    return c.current.useLayoutEffect(t, o);
  }, d.useMemo = function(t, o) {
    return c.current.useMemo(t, o);
  }, d.useReducer = function(t, o, p) {
    return c.current.useReducer(t, o, p);
  }, d.useRef = function(t) {
    return c.current.useRef(t);
  }, d.useState = function(t) {
    return c.current.useState(t);
  }, d.useSyncExternalStore = function(t, o, p) {
    return c.current.useSyncExternalStore(t, o, p);
  }, d.useTransition = function() {
    return c.current.useTransition();
  }, d.version = "18.3.1", d;
}
var le = { exports: {} };
le.exports;
var Tr;
function Mt() {
  return Tr || (Tr = 1, (function(T, f) {
    process.env.NODE_ENV !== "production" && (function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var S = "18.3.1", D = /* @__PURE__ */ Symbol.for("react.element"), I = /* @__PURE__ */ Symbol.for("react.portal"), U = /* @__PURE__ */ Symbol.for("react.fragment"), x = /* @__PURE__ */ Symbol.for("react.strict_mode"), ne = /* @__PURE__ */ Symbol.for("react.profiler"), ae = /* @__PURE__ */ Symbol.for("react.provider"), G = /* @__PURE__ */ Symbol.for("react.context"), z = /* @__PURE__ */ Symbol.for("react.forward_ref"), B = /* @__PURE__ */ Symbol.for("react.suspense"), oe = /* @__PURE__ */ Symbol.for("react.suspense_list"), N = /* @__PURE__ */ Symbol.for("react.memo"), q = /* @__PURE__ */ Symbol.for("react.lazy"), de = /* @__PURE__ */ Symbol.for("react.offscreen"), M = Symbol.iterator, pe = "@@iterator";
      function J(e) {
        if (e === null || typeof e != "object")
          return null;
        var r = M && e[M] || e[pe];
        return typeof r == "function" ? r : null;
      }
      var Q = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, V = {
        transition: null
      }, k = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, L = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, W = {}, H = null;
      function ve(e) {
        H = e;
      }
      W.setExtraStackFrame = function(e) {
        H = e;
      }, W.getCurrentStack = null, W.getStackAddendum = function() {
        var e = "";
        H && (e += H);
        var r = W.getCurrentStack;
        return r && (e += r() || ""), e;
      };
      var ue = !1, Pe = !1, ye = !1, ie = !1, X = !1, F = {
        ReactCurrentDispatcher: Q,
        ReactCurrentBatchConfig: V,
        ReactCurrentOwner: L
      };
      F.ReactDebugCurrentFrame = W, F.ReactCurrentActQueue = k;
      function $(e) {
        {
          for (var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), a = 1; a < r; a++)
            n[a - 1] = arguments[a];
          K("warn", e, n);
        }
      }
      function c(e) {
        {
          for (var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), a = 1; a < r; a++)
            n[a - 1] = arguments[a];
          K("error", e, n);
        }
      }
      function K(e, r, n) {
        {
          var a = F.ReactDebugCurrentFrame, u = a.getStackAddendum();
          u !== "" && (r += "%s", n = n.concat([u]));
          var s = n.map(function(i) {
            return String(i);
          });
          s.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, s);
        }
      }
      var he = {};
      function Z(e, r) {
        {
          var n = e.constructor, a = n && (n.displayName || n.name) || "ReactClass", u = a + "." + r;
          if (he[u])
            return;
          c("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", r, a), he[u] = !0;
        }
      }
      var t = {
        /**
         * Checks whether or not this composite component is mounted.
         * @param {ReactClass} publicInstance The instance we want to test.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function(e) {
          return !1;
        },
        /**
         * Forces an update. This should only be invoked when it is known with
         * certainty that we are **not** in a DOM transaction.
         *
         * You may want to call this when you know that some deeper aspect of the
         * component's state has changed but `setState` was not called.
         *
         * This will not invoke `shouldComponentUpdate`, but it will invoke
         * `componentWillUpdate` and `componentDidUpdate`.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueForceUpdate: function(e, r, n) {
          Z(e, "forceUpdate");
        },
        /**
         * Replaces all of the state. Always use this or `setState` to mutate state.
         * You should treat `this.state` as immutable.
         *
         * There is no guarantee that `this.state` will be immediately updated, so
         * accessing `this.state` after calling this method may return the old value.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} completeState Next state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueReplaceState: function(e, r, n, a) {
          Z(e, "replaceState");
        },
        /**
         * Sets a subset of the state. This only exists because _pendingState is
         * internal. This provides a merging strategy that is not available to deep
         * properties which is confusing. TODO: Expose pendingState or don't use it
         * during the merge.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} partialState Next partial state to be merged with state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} Name of the calling function in the public API.
         * @internal
         */
        enqueueSetState: function(e, r, n, a) {
          Z(e, "setState");
        }
      }, o = Object.assign, p = {};
      Object.freeze(p);
      function y(e, r, n) {
        this.props = e, this.context = r, this.refs = p, this.updater = n || t;
      }
      y.prototype.isReactComponent = {}, y.prototype.setState = function(e, r) {
        if (typeof e != "object" && typeof e != "function" && e != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, e, r, "setState");
      }, y.prototype.forceUpdate = function(e) {
        this.updater.enqueueForceUpdate(this, e, "forceUpdate");
      };
      {
        var h = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, w = function(e, r) {
          Object.defineProperty(y.prototype, e, {
            get: function() {
              $("%s(...) is deprecated in plain JavaScript React classes. %s", r[0], r[1]);
            }
          });
        };
        for (var E in h)
          h.hasOwnProperty(E) && w(E, h[E]);
      }
      function R() {
      }
      R.prototype = y.prototype;
      function _(e, r, n) {
        this.props = e, this.context = r, this.refs = p, this.updater = n || t;
      }
      var A = _.prototype = new R();
      A.constructor = _, o(A, y.prototype), A.isPureReactComponent = !0;
      function Ar() {
        var e = {
          current: null
        };
        return Object.seal(e), e;
      }
      var jr = Array.isArray;
      function me(e) {
        return jr(e);
      }
      function Ir(e) {
        {
          var r = typeof Symbol == "function" && Symbol.toStringTag, n = r && e[Symbol.toStringTag] || e.constructor.name || "Object";
          return n;
        }
      }
      function Dr(e) {
        try {
          return Ye(e), !1;
        } catch {
          return !0;
        }
      }
      function Ye(e) {
        return "" + e;
      }
      function _e(e) {
        if (Dr(e))
          return c("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Ir(e)), Ye(e);
      }
      function Lr(e, r, n) {
        var a = e.displayName;
        if (a)
          return a;
        var u = r.displayName || r.name || "";
        return u !== "" ? n + "(" + u + ")" : n;
      }
      function ze(e) {
        return e.displayName || "Context";
      }
      function Y(e) {
        if (e == null)
          return null;
        if (typeof e.tag == "number" && c("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
          return e.displayName || e.name || null;
        if (typeof e == "string")
          return e;
        switch (e) {
          case U:
            return "Fragment";
          case I:
            return "Portal";
          case ne:
            return "Profiler";
          case x:
            return "StrictMode";
          case B:
            return "Suspense";
          case oe:
            return "SuspenseList";
        }
        if (typeof e == "object")
          switch (e.$$typeof) {
            case G:
              var r = e;
              return ze(r) + ".Consumer";
            case ae:
              var n = e;
              return ze(n._context) + ".Provider";
            case z:
              return Lr(e, e.render, "ForwardRef");
            case N:
              var a = e.displayName || null;
              return a !== null ? a : Y(e.type) || "Memo";
            case q: {
              var u = e, s = u._payload, i = u._init;
              try {
                return Y(i(s));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var se = Object.prototype.hasOwnProperty, Be = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, qe, He, Ae;
      Ae = {};
      function Ke(e) {
        if (se.call(e, "ref")) {
          var r = Object.getOwnPropertyDescriptor(e, "ref").get;
          if (r && r.isReactWarning)
            return !1;
        }
        return e.ref !== void 0;
      }
      function Ge(e) {
        if (se.call(e, "key")) {
          var r = Object.getOwnPropertyDescriptor(e, "key").get;
          if (r && r.isReactWarning)
            return !1;
        }
        return e.key !== void 0;
      }
      function Fr(e, r) {
        var n = function() {
          qe || (qe = !0, c("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        n.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: n,
          configurable: !0
        });
      }
      function xr(e, r) {
        var n = function() {
          He || (He = !0, c("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        n.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: n,
          configurable: !0
        });
      }
      function Nr(e) {
        if (typeof e.ref == "string" && L.current && e.__self && L.current.stateNode !== e.__self) {
          var r = Y(L.current.type);
          Ae[r] || (c('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', r, e.ref), Ae[r] = !0);
        }
      }
      var je = function(e, r, n, a, u, s, i) {
        var l = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: D,
          // Built-in properties that belong on the element
          type: e,
          key: r,
          ref: n,
          props: i,
          // Record the component responsible for creating this element.
          _owner: s
        };
        return l._store = {}, Object.defineProperty(l._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(l, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: a
        }), Object.defineProperty(l, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: u
        }), Object.freeze && (Object.freeze(l.props), Object.freeze(l)), l;
      };
      function Mr(e, r, n) {
        var a, u = {}, s = null, i = null, l = null, v = null;
        if (r != null) {
          Ke(r) && (i = r.ref, Nr(r)), Ge(r) && (_e(r.key), s = "" + r.key), l = r.__self === void 0 ? null : r.__self, v = r.__source === void 0 ? null : r.__source;
          for (a in r)
            se.call(r, a) && !Be.hasOwnProperty(a) && (u[a] = r[a]);
        }
        var m = arguments.length - 2;
        if (m === 1)
          u.children = n;
        else if (m > 1) {
          for (var g = Array(m), b = 0; b < m; b++)
            g[b] = arguments[b + 2];
          Object.freeze && Object.freeze(g), u.children = g;
        }
        if (e && e.defaultProps) {
          var C = e.defaultProps;
          for (a in C)
            u[a] === void 0 && (u[a] = C[a]);
        }
        if (s || i) {
          var O = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          s && Fr(u, O), i && xr(u, O);
        }
        return je(e, s, i, l, v, L.current, u);
      }
      function Vr(e, r) {
        var n = je(e.type, r, e.ref, e._self, e._source, e._owner, e.props);
        return n;
      }
      function Ur(e, r, n) {
        if (e == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
        var a, u = o({}, e.props), s = e.key, i = e.ref, l = e._self, v = e._source, m = e._owner;
        if (r != null) {
          Ke(r) && (i = r.ref, m = L.current), Ge(r) && (_e(r.key), s = "" + r.key);
          var g;
          e.type && e.type.defaultProps && (g = e.type.defaultProps);
          for (a in r)
            se.call(r, a) && !Be.hasOwnProperty(a) && (r[a] === void 0 && g !== void 0 ? u[a] = g[a] : u[a] = r[a]);
        }
        var b = arguments.length - 2;
        if (b === 1)
          u.children = n;
        else if (b > 1) {
          for (var C = Array(b), O = 0; O < b; O++)
            C[O] = arguments[O + 2];
          u.children = C;
        }
        return je(e.type, s, i, l, v, m, u);
      }
      function ee(e) {
        return typeof e == "object" && e !== null && e.$$typeof === D;
      }
      var Je = ".", Wr = ":";
      function $r(e) {
        var r = /[=:]/g, n = {
          "=": "=0",
          ":": "=2"
        }, a = e.replace(r, function(u) {
          return n[u];
        });
        return "$" + a;
      }
      var Qe = !1, Yr = /\/+/g;
      function Xe(e) {
        return e.replace(Yr, "$&/");
      }
      function Ie(e, r) {
        return typeof e == "object" && e !== null && e.key != null ? (_e(e.key), $r("" + e.key)) : r.toString(36);
      }
      function ge(e, r, n, a, u) {
        var s = typeof e;
        (s === "undefined" || s === "boolean") && (e = null);
        var i = !1;
        if (e === null)
          i = !0;
        else
          switch (s) {
            case "string":
            case "number":
              i = !0;
              break;
            case "object":
              switch (e.$$typeof) {
                case D:
                case I:
                  i = !0;
              }
          }
        if (i) {
          var l = e, v = u(l), m = a === "" ? Je + Ie(l, 0) : a;
          if (me(v)) {
            var g = "";
            m != null && (g = Xe(m) + "/"), ge(v, r, g, "", function(Ft) {
              return Ft;
            });
          } else v != null && (ee(v) && (v.key && (!l || l.key !== v.key) && _e(v.key), v = Vr(
            v,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            n + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (v.key && (!l || l.key !== v.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              Xe("" + v.key) + "/"
            ) : "") + m
          )), r.push(v));
          return 1;
        }
        var b, C, O = 0, P = a === "" ? Je : a + Wr;
        if (me(e))
          for (var Te = 0; Te < e.length; Te++)
            b = e[Te], C = P + Ie(b, Te), O += ge(b, r, n, C, u);
        else {
          var We = J(e);
          if (typeof We == "function") {
            var Cr = e;
            We === Cr.entries && (Qe || $("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Qe = !0);
            for (var Dt = We.call(Cr), wr, Lt = 0; !(wr = Dt.next()).done; )
              b = wr.value, C = P + Ie(b, Lt++), O += ge(b, r, n, C, u);
          } else if (s === "object") {
            var Sr = String(e);
            throw new Error("Objects are not valid as a React child (found: " + (Sr === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : Sr) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return O;
      }
      function be(e, r, n) {
        if (e == null)
          return e;
        var a = [], u = 0;
        return ge(e, a, "", "", function(s) {
          return r.call(n, s, u++);
        }), a;
      }
      function zr(e) {
        var r = 0;
        return be(e, function() {
          r++;
        }), r;
      }
      function Br(e, r, n) {
        be(e, function() {
          r.apply(this, arguments);
        }, n);
      }
      function qr(e) {
        return be(e, function(r) {
          return r;
        }) || [];
      }
      function Hr(e) {
        if (!ee(e))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return e;
      }
      function Kr(e) {
        var r = {
          $$typeof: G,
          // As a workaround to support multiple concurrent renderers, we categorize
          // some renderers as primary and others as secondary. We only expect
          // there to be two concurrent renderers at most: React Native (primary) and
          // Fabric (secondary); React DOM (primary) and React ART (secondary).
          // Secondary renderers store their context values on separate fields.
          _currentValue: e,
          _currentValue2: e,
          // Used to track how many concurrent renderers this context currently
          // supports within in a single renderer. Such as parallel server rendering.
          _threadCount: 0,
          // These are circular
          Provider: null,
          Consumer: null,
          // Add these to use same hidden class in VM as ServerContext
          _defaultValue: null,
          _globalName: null
        };
        r.Provider = {
          $$typeof: ae,
          _context: r
        };
        var n = !1, a = !1, u = !1;
        {
          var s = {
            $$typeof: G,
            _context: r
          };
          Object.defineProperties(s, {
            Provider: {
              get: function() {
                return a || (a = !0, c("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), r.Provider;
              },
              set: function(i) {
                r.Provider = i;
              }
            },
            _currentValue: {
              get: function() {
                return r._currentValue;
              },
              set: function(i) {
                r._currentValue = i;
              }
            },
            _currentValue2: {
              get: function() {
                return r._currentValue2;
              },
              set: function(i) {
                r._currentValue2 = i;
              }
            },
            _threadCount: {
              get: function() {
                return r._threadCount;
              },
              set: function(i) {
                r._threadCount = i;
              }
            },
            Consumer: {
              get: function() {
                return n || (n = !0, c("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), r.Consumer;
              }
            },
            displayName: {
              get: function() {
                return r.displayName;
              },
              set: function(i) {
                u || ($("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", i), u = !0);
              }
            }
          }), r.Consumer = s;
        }
        return r._currentRenderer = null, r._currentRenderer2 = null, r;
      }
      var ce = -1, De = 0, Ze = 1, Gr = 2;
      function Jr(e) {
        if (e._status === ce) {
          var r = e._result, n = r();
          if (n.then(function(s) {
            if (e._status === De || e._status === ce) {
              var i = e;
              i._status = Ze, i._result = s;
            }
          }, function(s) {
            if (e._status === De || e._status === ce) {
              var i = e;
              i._status = Gr, i._result = s;
            }
          }), e._status === ce) {
            var a = e;
            a._status = De, a._result = n;
          }
        }
        if (e._status === Ze) {
          var u = e._result;
          return u === void 0 && c(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, u), "default" in u || c(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, u), u.default;
        } else
          throw e._result;
      }
      function Qr(e) {
        var r = {
          // We use these fields to store the result.
          _status: ce,
          _result: e
        }, n = {
          $$typeof: q,
          _payload: r,
          _init: Jr
        };
        {
          var a, u;
          Object.defineProperties(n, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return a;
              },
              set: function(s) {
                c("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), a = s, Object.defineProperty(n, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return u;
              },
              set: function(s) {
                c("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), u = s, Object.defineProperty(n, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return n;
      }
      function Xr(e) {
        e != null && e.$$typeof === N ? c("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof e != "function" ? c("forwardRef requires a render function but was given %s.", e === null ? "null" : typeof e) : e.length !== 0 && e.length !== 2 && c("forwardRef render functions accept exactly two parameters: props and ref. %s", e.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), e != null && (e.defaultProps != null || e.propTypes != null) && c("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var r = {
          $$typeof: z,
          render: e
        };
        {
          var n;
          Object.defineProperty(r, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return n;
            },
            set: function(a) {
              n = a, !e.name && !e.displayName && (e.displayName = a);
            }
          });
        }
        return r;
      }
      var er;
      er = /* @__PURE__ */ Symbol.for("react.module.reference");
      function rr(e) {
        return !!(typeof e == "string" || typeof e == "function" || e === U || e === ne || X || e === x || e === B || e === oe || ie || e === de || ue || Pe || ye || typeof e == "object" && e !== null && (e.$$typeof === q || e.$$typeof === N || e.$$typeof === ae || e.$$typeof === G || e.$$typeof === z || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        e.$$typeof === er || e.getModuleId !== void 0));
      }
      function Zr(e, r) {
        rr(e) || c("memo: The first argument must be a component. Instead received: %s", e === null ? "null" : typeof e);
        var n = {
          $$typeof: N,
          type: e,
          compare: r === void 0 ? null : r
        };
        {
          var a;
          Object.defineProperty(n, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return a;
            },
            set: function(u) {
              a = u, !e.name && !e.displayName && (e.displayName = u);
            }
          });
        }
        return n;
      }
      function j() {
        var e = Q.current;
        return e === null && c(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), e;
      }
      function et(e) {
        var r = j();
        if (e._context !== void 0) {
          var n = e._context;
          n.Consumer === e ? c("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : n.Provider === e && c("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return r.useContext(e);
      }
      function rt(e) {
        var r = j();
        return r.useState(e);
      }
      function tt(e, r, n) {
        var a = j();
        return a.useReducer(e, r, n);
      }
      function nt(e) {
        var r = j();
        return r.useRef(e);
      }
      function at(e, r) {
        var n = j();
        return n.useEffect(e, r);
      }
      function ot(e, r) {
        var n = j();
        return n.useInsertionEffect(e, r);
      }
      function ut(e, r) {
        var n = j();
        return n.useLayoutEffect(e, r);
      }
      function it(e, r) {
        var n = j();
        return n.useCallback(e, r);
      }
      function st(e, r) {
        var n = j();
        return n.useMemo(e, r);
      }
      function ct(e, r, n) {
        var a = j();
        return a.useImperativeHandle(e, r, n);
      }
      function ft(e, r) {
        {
          var n = j();
          return n.useDebugValue(e, r);
        }
      }
      function lt() {
        var e = j();
        return e.useTransition();
      }
      function dt(e) {
        var r = j();
        return r.useDeferredValue(e);
      }
      function pt() {
        var e = j();
        return e.useId();
      }
      function vt(e, r, n) {
        var a = j();
        return a.useSyncExternalStore(e, r, n);
      }
      var fe = 0, tr, nr, ar, or, ur, ir, sr;
      function cr() {
      }
      cr.__reactDisabledLog = !0;
      function yt() {
        {
          if (fe === 0) {
            tr = console.log, nr = console.info, ar = console.warn, or = console.error, ur = console.group, ir = console.groupCollapsed, sr = console.groupEnd;
            var e = {
              configurable: !0,
              enumerable: !0,
              value: cr,
              writable: !0
            };
            Object.defineProperties(console, {
              info: e,
              log: e,
              warn: e,
              error: e,
              group: e,
              groupCollapsed: e,
              groupEnd: e
            });
          }
          fe++;
        }
      }
      function ht() {
        {
          if (fe--, fe === 0) {
            var e = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: o({}, e, {
                value: tr
              }),
              info: o({}, e, {
                value: nr
              }),
              warn: o({}, e, {
                value: ar
              }),
              error: o({}, e, {
                value: or
              }),
              group: o({}, e, {
                value: ur
              }),
              groupCollapsed: o({}, e, {
                value: ir
              }),
              groupEnd: o({}, e, {
                value: sr
              })
            });
          }
          fe < 0 && c("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Le = F.ReactCurrentDispatcher, Fe;
      function Ee(e, r, n) {
        {
          if (Fe === void 0)
            try {
              throw Error();
            } catch (u) {
              var a = u.stack.trim().match(/\n( *(at )?)/);
              Fe = a && a[1] || "";
            }
          return `
` + Fe + e;
        }
      }
      var xe = !1, Re;
      {
        var mt = typeof WeakMap == "function" ? WeakMap : Map;
        Re = new mt();
      }
      function fr(e, r) {
        if (!e || xe)
          return "";
        {
          var n = Re.get(e);
          if (n !== void 0)
            return n;
        }
        var a;
        xe = !0;
        var u = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var s;
        s = Le.current, Le.current = null, yt();
        try {
          if (r) {
            var i = function() {
              throw Error();
            };
            if (Object.defineProperty(i.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(i, []);
              } catch (P) {
                a = P;
              }
              Reflect.construct(e, [], i);
            } else {
              try {
                i.call();
              } catch (P) {
                a = P;
              }
              e.call(i.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (P) {
              a = P;
            }
            e();
          }
        } catch (P) {
          if (P && a && typeof P.stack == "string") {
            for (var l = P.stack.split(`
`), v = a.stack.split(`
`), m = l.length - 1, g = v.length - 1; m >= 1 && g >= 0 && l[m] !== v[g]; )
              g--;
            for (; m >= 1 && g >= 0; m--, g--)
              if (l[m] !== v[g]) {
                if (m !== 1 || g !== 1)
                  do
                    if (m--, g--, g < 0 || l[m] !== v[g]) {
                      var b = `
` + l[m].replace(" at new ", " at ");
                      return e.displayName && b.includes("<anonymous>") && (b = b.replace("<anonymous>", e.displayName)), typeof e == "function" && Re.set(e, b), b;
                    }
                  while (m >= 1 && g >= 0);
                break;
              }
          }
        } finally {
          xe = !1, Le.current = s, ht(), Error.prepareStackTrace = u;
        }
        var C = e ? e.displayName || e.name : "", O = C ? Ee(C) : "";
        return typeof e == "function" && Re.set(e, O), O;
      }
      function _t(e, r, n) {
        return fr(e, !1);
      }
      function gt(e) {
        var r = e.prototype;
        return !!(r && r.isReactComponent);
      }
      function Ce(e, r, n) {
        if (e == null)
          return "";
        if (typeof e == "function")
          return fr(e, gt(e));
        if (typeof e == "string")
          return Ee(e);
        switch (e) {
          case B:
            return Ee("Suspense");
          case oe:
            return Ee("SuspenseList");
        }
        if (typeof e == "object")
          switch (e.$$typeof) {
            case z:
              return _t(e.render);
            case N:
              return Ce(e.type, r, n);
            case q: {
              var a = e, u = a._payload, s = a._init;
              try {
                return Ce(s(u), r, n);
              } catch {
              }
            }
          }
        return "";
      }
      var lr = {}, dr = F.ReactDebugCurrentFrame;
      function we(e) {
        if (e) {
          var r = e._owner, n = Ce(e.type, e._source, r ? r.type : null);
          dr.setExtraStackFrame(n);
        } else
          dr.setExtraStackFrame(null);
      }
      function bt(e, r, n, a, u) {
        {
          var s = Function.call.bind(se);
          for (var i in e)
            if (s(e, i)) {
              var l = void 0;
              try {
                if (typeof e[i] != "function") {
                  var v = Error((a || "React class") + ": " + n + " type `" + i + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[i] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw v.name = "Invariant Violation", v;
                }
                l = e[i](r, i, a, n, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (m) {
                l = m;
              }
              l && !(l instanceof Error) && (we(u), c("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", a || "React class", n, i, typeof l), we(null)), l instanceof Error && !(l.message in lr) && (lr[l.message] = !0, we(u), c("Failed %s type: %s", n, l.message), we(null));
            }
        }
      }
      function re(e) {
        if (e) {
          var r = e._owner, n = Ce(e.type, e._source, r ? r.type : null);
          ve(n);
        } else
          ve(null);
      }
      var Ne;
      Ne = !1;
      function pr() {
        if (L.current) {
          var e = Y(L.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
      function Et(e) {
        if (e !== void 0) {
          var r = e.fileName.replace(/^.*[\\\/]/, ""), n = e.lineNumber;
          return `

Check your code at ` + r + ":" + n + ".";
        }
        return "";
      }
      function Rt(e) {
        return e != null ? Et(e.__source) : "";
      }
      var vr = {};
      function Ct(e) {
        var r = pr();
        if (!r) {
          var n = typeof e == "string" ? e : e.displayName || e.name;
          n && (r = `

Check the top-level render call using <` + n + ">.");
        }
        return r;
      }
      function yr(e, r) {
        if (!(!e._store || e._store.validated || e.key != null)) {
          e._store.validated = !0;
          var n = Ct(r);
          if (!vr[n]) {
            vr[n] = !0;
            var a = "";
            e && e._owner && e._owner !== L.current && (a = " It was passed a child from " + Y(e._owner.type) + "."), re(e), c('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', n, a), re(null);
          }
        }
      }
      function hr(e, r) {
        if (typeof e == "object") {
          if (me(e))
            for (var n = 0; n < e.length; n++) {
              var a = e[n];
              ee(a) && yr(a, r);
            }
          else if (ee(e))
            e._store && (e._store.validated = !0);
          else if (e) {
            var u = J(e);
            if (typeof u == "function" && u !== e.entries)
              for (var s = u.call(e), i; !(i = s.next()).done; )
                ee(i.value) && yr(i.value, r);
          }
        }
      }
      function mr(e) {
        {
          var r = e.type;
          if (r == null || typeof r == "string")
            return;
          var n;
          if (typeof r == "function")
            n = r.propTypes;
          else if (typeof r == "object" && (r.$$typeof === z || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          r.$$typeof === N))
            n = r.propTypes;
          else
            return;
          if (n) {
            var a = Y(r);
            bt(n, e.props, "prop", a, e);
          } else if (r.PropTypes !== void 0 && !Ne) {
            Ne = !0;
            var u = Y(r);
            c("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", u || "Unknown");
          }
          typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && c("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function wt(e) {
        {
          for (var r = Object.keys(e.props), n = 0; n < r.length; n++) {
            var a = r[n];
            if (a !== "children" && a !== "key") {
              re(e), c("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", a), re(null);
              break;
            }
          }
          e.ref !== null && (re(e), c("Invalid attribute `ref` supplied to `React.Fragment`."), re(null));
        }
      }
      function _r(e, r, n) {
        var a = rr(e);
        if (!a) {
          var u = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (u += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var s = Rt(r);
          s ? u += s : u += pr();
          var i;
          e === null ? i = "null" : me(e) ? i = "array" : e !== void 0 && e.$$typeof === D ? (i = "<" + (Y(e.type) || "Unknown") + " />", u = " Did you accidentally export a JSX literal instead of a component?") : i = typeof e, c("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", i, u);
        }
        var l = Mr.apply(this, arguments);
        if (l == null)
          return l;
        if (a)
          for (var v = 2; v < arguments.length; v++)
            hr(arguments[v], e);
        return e === U ? wt(l) : mr(l), l;
      }
      var gr = !1;
      function St(e) {
        var r = _r.bind(null, e);
        return r.type = e, gr || (gr = !0, $("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(r, "type", {
          enumerable: !1,
          get: function() {
            return $("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: e
            }), e;
          }
        }), r;
      }
      function Ot(e, r, n) {
        for (var a = Ur.apply(this, arguments), u = 2; u < arguments.length; u++)
          hr(arguments[u], a.type);
        return mr(a), a;
      }
      function Tt(e, r) {
        var n = V.transition;
        V.transition = {};
        var a = V.transition;
        V.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          e();
        } finally {
          if (V.transition = n, n === null && a._updatedFibers) {
            var u = a._updatedFibers.size;
            u > 10 && $("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), a._updatedFibers.clear();
          }
        }
      }
      var br = !1, Se = null;
      function kt(e) {
        if (Se === null)
          try {
            var r = ("require" + Math.random()).slice(0, 7), n = T && T[r];
            Se = n.call(T, "timers").setImmediate;
          } catch {
            Se = function(u) {
              br === !1 && (br = !0, typeof MessageChannel > "u" && c("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var s = new MessageChannel();
              s.port1.onmessage = u, s.port2.postMessage(void 0);
            };
          }
        return Se(e);
      }
      var te = 0, Er = !1;
      function Rr(e) {
        {
          var r = te;
          te++, k.current === null && (k.current = []);
          var n = k.isBatchingLegacy, a;
          try {
            if (k.isBatchingLegacy = !0, a = e(), !n && k.didScheduleLegacyUpdate) {
              var u = k.current;
              u !== null && (k.didScheduleLegacyUpdate = !1, Ue(u));
            }
          } catch (C) {
            throw Oe(r), C;
          } finally {
            k.isBatchingLegacy = n;
          }
          if (a !== null && typeof a == "object" && typeof a.then == "function") {
            var s = a, i = !1, l = {
              then: function(C, O) {
                i = !0, s.then(function(P) {
                  Oe(r), te === 0 ? Me(P, C, O) : C(P);
                }, function(P) {
                  Oe(r), O(P);
                });
              }
            };
            return !Er && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              i || (Er = !0, c("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), l;
          } else {
            var v = a;
            if (Oe(r), te === 0) {
              var m = k.current;
              m !== null && (Ue(m), k.current = null);
              var g = {
                then: function(C, O) {
                  k.current === null ? (k.current = [], Me(v, C, O)) : C(v);
                }
              };
              return g;
            } else {
              var b = {
                then: function(C, O) {
                  C(v);
                }
              };
              return b;
            }
          }
        }
      }
      function Oe(e) {
        e !== te - 1 && c("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), te = e;
      }
      function Me(e, r, n) {
        {
          var a = k.current;
          if (a !== null)
            try {
              Ue(a), kt(function() {
                a.length === 0 ? (k.current = null, r(e)) : Me(e, r, n);
              });
            } catch (u) {
              n(u);
            }
          else
            r(e);
        }
      }
      var Ve = !1;
      function Ue(e) {
        if (!Ve) {
          Ve = !0;
          var r = 0;
          try {
            for (; r < e.length; r++) {
              var n = e[r];
              do
                n = n(!0);
              while (n !== null);
            }
            e.length = 0;
          } catch (a) {
            throw e = e.slice(r + 1), a;
          } finally {
            Ve = !1;
          }
        }
      }
      var Pt = _r, At = Ot, jt = St, It = {
        map: be,
        forEach: Br,
        count: zr,
        toArray: qr,
        only: Hr
      };
      f.Children = It, f.Component = y, f.Fragment = U, f.Profiler = ne, f.PureComponent = _, f.StrictMode = x, f.Suspense = B, f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = F, f.act = Rr, f.cloneElement = At, f.createContext = Kr, f.createElement = Pt, f.createFactory = jt, f.createRef = Ar, f.forwardRef = Xr, f.isValidElement = ee, f.lazy = Qr, f.memo = Zr, f.startTransition = Tt, f.unstable_act = Rr, f.useCallback = it, f.useContext = et, f.useDebugValue = ft, f.useDeferredValue = dt, f.useEffect = at, f.useId = pt, f.useImperativeHandle = ct, f.useInsertionEffect = ot, f.useLayoutEffect = ut, f.useMemo = st, f.useReducer = tt, f.useRef = nt, f.useState = rt, f.useSyncExternalStore = vt, f.useTransition = lt, f.version = S, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    })();
  })(le, le.exports)), le.exports;
}
var kr;
function Vt() {
  return kr || (kr = 1, process.env.NODE_ENV === "production" ? ke.exports = Nt() : ke.exports = Mt()), ke.exports;
}
var $e = Vt();
function Ut(T) {
  const f = (S) => S == null ? S : typeof S == "function" ? "__function__" : typeof Element < "u" && S instanceof Element ? `element:${S.tagName.toLowerCase()}#${S.id || "no-id"}` : S;
  try {
    return JSON.stringify(T, (S, D) => {
      const I = f(D);
      return I && typeof I == "object" && !Array.isArray(I) && !(I instanceof Date), I;
    });
  } catch {
    return String(Object.keys(T).sort().join(","));
  }
}
function Pr(T = {}, f = {}) {
  const S = $e.useRef(null), D = f.enabled ?? !0, I = f.autoInit ?? !0, U = $e.useMemo(() => Ut(T), [T]);
  return $e.useEffect(() => {
    if (!D || !I || typeof window > "u")
      return;
    const x = xt(T);
    return S.current = x, x.init(), () => {
      x.destroy(), S.current = null;
    };
  }, [U, D, I]), S.current;
}
function Wt({
  children: T,
  config: f,
  enabled: S = !0,
  autoInit: D = !0
}) {
  return Pr(f ?? {}, { enabled: S, autoInit: D }), T ?? null;
}
const Yt = { useSitelenLayerPlugin: Pr, SitelenLayerProvider: Wt };
export {
  Wt as S,
  Yt as a,
  $e as r,
  Pr as u
};
