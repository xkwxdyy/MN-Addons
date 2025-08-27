// document.body.style.zoom = "50%";
const notyf = new Notyf({
  position: { x: "center", y: "top" },
  types: [
    {
      type: "success",
      background: "#99c959",
      duration: 2000,
    },
    {
      type: "warning",
      background: "#f8b26a",
      duration: 3000
    },
    {
      type: "error",
      background: "#e15b64",
      duration: 3000,
    }
  ]
});
// const registerSW = () => {
//     if ("serviceWorker" in navigator) {
//         navigator.serviceWorker.register("sw.js" + location.search).then(reg => console.log("Service worker register succeeded"),
//             error => console.error(`Service worker register failed: ${error}`))
//     }
// };
// window.addEventListener("load", () => registerSW());
const isMobile = navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|webOS/);
if (isMobile) {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/gh/timruffles/mobile-drag-drop@3.0.0-rc.0/release/index.min.js";
  script.crossOrigin = "anonymous";
  script.defer = true;
  script.onload = () => {
    MobileDragDrop.polyfill();
  }
  document.body.appendChild(script);
  const link = document.createElement("link");
  link.crossOrigin = "anonymous";
  link.rel = "stylesheet";
  link.href = "https://cdn.jsdelivr.net/gh/timruffles/mobile-drag-drop@3.0.0-rc.0/release/default.css";
  document.body.appendChild(link);
}
let envAPIEndpoint, envAPIKey;

{ const t = Uint8Array, e = Uint16Array, n = Int32Array, r = new t([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]), o = new t([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]), l = new t([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), s = (t, r) => { const o = new e(31); for (let e = 0; e < 31; ++e)o[e] = r += 1 << t[e - 1]; const l = new n(o[30]); for (let t = 1; t < 30; ++t)for (let e = o[t]; e < o[t + 1]; ++e)l[e] = e - o[t] << 5 | t; return { b: o, r: l } }, { b: f, r: c } = s(r, 2); f[28] = 258, c[258] = 28; const { b: i, r: a } = s(o, 0), h = new e(32768); for (let t = 0; t < 32768; ++t) { let e = (43690 & t) >> 1 | (21845 & t) << 1; e = (52428 & e) >> 2 | (13107 & e) << 2, e = (61680 & e) >> 4 | (3855 & e) << 4, h[t] = ((65280 & e) >> 8 | (255 & e) << 8) >> 1 } const u = (t, n, r) => { const o = t.length; let l = 0; const s = new e(n); for (; l < o; ++l)t[l] && ++s[t[l] - 1]; const f = new e(n); for (l = 1; l < n; ++l)f[l] = f[l - 1] + s[l - 1] << 1; let c; if (r) { c = new e(1 << n); const r = 15 - n; for (l = 0; l < o; ++l)if (t[l]) { const e = l << 4 | t[l], o = n - t[l]; let s = f[t[l] - 1]++ << o; for (const t = s | (1 << o) - 1; s <= t; ++s)c[h[s] >> r] = e } } else for (c = new e(o), l = 0; l < o; ++l)t[l] && (c[l] = h[f[t[l] - 1]++] >> 15 - t[l]); return c }, w = new t(288); for (let t = 0; t < 144; ++t)w[t] = 8; for (let t = 144; t < 256; ++t)w[t] = 9; for (let t = 256; t < 280; ++t)w[t] = 7; for (let t = 280; t < 288; ++t)w[t] = 8; const g = new t(32); for (let t = 0; t < 32; ++t)g[t] = 5; const b = u(w, 9, 0), d = u(w, 9, 1), m = u(g, 5, 0), y = u(g, 5, 1), M = t => { let e = t[0]; for (let n = 1; n < t.length; ++n)t[n] > e && (e = t[n]); return e }, p = (t, e, n) => { const r = e / 8 | 0; return (t[r] | t[r + 1] << 8) >> (7 & e) & n }, k = (t, e) => { const n = e / 8 | 0; return (t[n] | t[n + 1] << 8 | t[n + 2] << 16) >> (7 & e) }, v = t => (t + 7) / 8 | 0, x = (e, n, r) => { (null == n || n < 0) && (n = 0), (null == r || r > e.length) && (r = e.length); const o = new t(r - n); return o.set(e.subarray(n, r)), o }, E = ["unexpected EOF", "invalid block type", "invalid length/literal", "invalid distance", "stream finished", "no stream handler", , "no callback", "invalid UTF-8 data", "extra field too long", "date not in range 1980-2099", "filename too long", "stream finishing", "invalid zip data"], A = (t, e, n) => { const r = new Error(e || E[t]); if (r.code = t, Error.captureStackTrace && Error.captureStackTrace(r, A), !n) throw r; return r }, T = (e, n, s, c) => { const a = e.length, h = c ? c.length : 0; if (!a || n.f && !n.l) return s || new t(0); const w = !s || 2 != n.i, g = n.i; s || (s = new t(3 * a)); const b = e => { let n = s.length; if (e > n) { const r = new t(Math.max(2 * n, e)); r.set(s), s = r } }; let m = n.f || 0, E = n.p || 0, T = n.b || 0, U = n.l, z = n.d, F = n.m, S = n.n; const I = 8 * a; do { if (!U) { m = p(e, E, 1); const r = p(e, E + 1, 3); if (E += 3, !r) { const t = v(E) + 4, r = e[t - 4] | e[t - 3] << 8, o = t + r; if (o > a) { g && A(0); break } w && b(T + r), s.set(e.subarray(t, o), T), n.b = T += r, n.p = E = 8 * o, n.f = m; continue } if (1 == r) U = d, z = y, F = 9, S = 5; else if (2 == r) { const n = p(e, E, 31) + 257, r = p(e, E + 10, 15) + 4, o = n + p(e, E + 5, 31) + 1; E += 14; const s = new t(o), f = new t(19); for (let t = 0; t < r; ++t)f[l[t]] = p(e, E + 3 * t, 7); E += 3 * r; const c = M(f), i = (1 << c) - 1, a = u(f, c, 1); for (let t = 0; t < o;) { const n = a[p(e, E, i)]; E += 15 & n; const r = n >> 4; if (r < 16) s[t++] = r; else { let n = 0, o = 0; for (16 == r ? (o = 3 + p(e, E, 3), E += 2, n = s[t - 1]) : 17 == r ? (o = 3 + p(e, E, 7), E += 3) : 18 == r && (o = 11 + p(e, E, 127), E += 7); o--;)s[t++] = n } } const h = s.subarray(0, n), w = s.subarray(n); F = M(h), S = M(w), U = u(h, F, 1), z = u(w, S, 1) } else A(1); if (E > I) { g && A(0); break } } w && b(T + 131072); const x = (1 << F) - 1, O = (1 << S) - 1; let j = E; for (; ; j = E) { const t = U[k(e, E) & x], n = t >> 4; if (E += 15 & t, E > I) { g && A(0); break } if (t || A(2), n < 256) s[T++] = n; else { if (256 == n) { j = E, U = null; break } { let t = n - 254; if (n > 264) { const o = n - 257, l = r[o]; t = p(e, E, (1 << l) - 1) + f[o], E += l } const l = z[k(e, E) & O], a = l >> 4; l || A(3), E += 15 & l; let u = i[a]; if (a > 3) { const t = o[a]; u += k(e, E) & (1 << t) - 1, E += t } if (E > I) { g && A(0); break } w && b(T + 131072); const d = T + t; if (T < u) { const t = h - u, e = Math.min(u, d); for (t + T < 0 && A(3); T < e; ++T)s[T] = c[t + T] } for (; T < d; T += 4)s[T] = s[T - u], s[T + 1] = s[T + 1 - u], s[T + 2] = s[T + 2 - u], s[T + 3] = s[T + 3 - u]; T = d } } } n.l = U, n.p = j, n.b = T, n.f = m, U && (m = 1, n.m = F, n.d = z, n.n = S) } while (!m); return T == s.length ? s : x(s, 0, T) }, U = (t, e, n) => { n <<= 7 & e; const r = e / 8 | 0; t[r] |= n, t[r + 1] |= n >> 8 }, z = (t, e, n) => { n <<= 7 & e; const r = e / 8 | 0; t[r] |= n, t[r + 1] |= n >> 8, t[r + 2] |= n >> 16 }, F = (n, r) => { const o = []; for (let t = 0; t < n.length; ++t)n[t] && o.push({ s: t, f: n[t] }); const l = o.length, s = o.slice(); if (!l) return { t: C, l: 0 }; if (1 == l) { const e = new t(o[0].s + 1); return e[o[0].s] = 1, { t: e, l: 1 } } o.sort(((t, e) => t.f - e.f)), o.push({ s: -1, f: 25001 }); let f = o[0], c = o[1], i = 0, a = 1, h = 2; for (o[0] = { s: -1, f: f.f + c.f, l: f, r: c }; a != l - 1;)f = o[o[i].f < o[h].f ? i++ : h++], c = o[i != a && o[i].f < o[h].f ? i++ : h++], o[a++] = { s: -1, f: f.f + c.f, l: f, r: c }; let u = s[0].s; for (let t = 1; t < l; ++t)s[t].s > u && (u = s[t].s); const w = new e(u + 1); let g = S(o[a - 1], w, 0); if (g > r) { let t = 0, e = 0; const n = g - r, o = 1 << n; for (s.sort(((t, e) => w[e.s] - w[t.s] || t.f - e.f)); t < l; ++t) { const n = s[t].s; if (!(w[n] > r)) break; e += o - (1 << g - w[n]), w[n] = r } for (e >>= n; e > 0;) { const n = s[t].s; w[n] < r ? e -= 1 << r - w[n]++ - 1 : ++t } for (; t >= 0 && e; --t) { const n = s[t].s; w[n] == r && (--w[n], ++e) } g = r } return { t: new t(w), l: g } }, S = (t, e, n) => -1 == t.s ? Math.max(S(t.l, e, n + 1), S(t.r, e, n + 1)) : e[t.s] = n, I = t => { let n = t.length; for (; n && !t[--n];); const r = new e(++n); let o = 0, l = t[0], s = 1; const f = t => { r[o++] = t }; for (let e = 1; e <= n; ++e)if (t[e] == l && e != n) ++s; else { if (!l && s > 2) { for (; s > 138; s -= 138)f(32754); s > 2 && (f(s > 10 ? s - 11 << 5 | 28690 : s - 3 << 5 | 12305), s = 0) } else if (s > 3) { for (f(l), --s; s > 6; s -= 6)f(8304); s > 2 && (f(s - 3 << 5 | 8208), s = 0) } for (; s--;)f(l); s = 1, l = t[e] } return { c: r.subarray(0, o), n: n } }, O = (t, e) => { let n = 0; for (let r = 0; r < e.length; ++r)n += t[r] * e[r]; return n }, j = (t, e, n) => { const r = n.length, o = v(e + 2); t[o] = 255 & r, t[o + 1] = r >> 8, t[o + 2] = 255 ^ t[o], t[o + 3] = 255 ^ t[o + 1]; for (let e = 0; e < r; ++e)t[o + e + 4] = n[e]; return 8 * (o + 4 + r) }, q = (t, n, s, f, c, i, a, h, d, y, M) => { U(n, M++, s), ++c[256]; const { t: p, l: k } = F(c, 15), { t: v, l: x } = F(i, 15), { c: E, n: A } = I(p), { c: T, n: S } = I(v), q = new e(19); for (let t = 0; t < E.length; ++t)++q[31 & E[t]]; for (let t = 0; t < T.length; ++t)++q[31 & T[t]]; const { t: B, l: C } = F(q, 7); let D = 19; for (; D > 4 && !B[l[D - 1]]; --D); const G = y + 5 << 3, H = O(c, w) + O(i, g) + a, J = O(c, p) + O(i, v) + a + 14 + 3 * D + O(q, B) + 2 * q[16] + 3 * q[17] + 7 * q[18]; if (d >= 0 && G <= H && G <= J) return j(n, M, t.subarray(d, d + y)); let K, L, N, P; if (U(n, M, 1 + (J < H)), M += 2, J < H) { K = u(p, k, 0), L = p, N = u(v, x, 0), P = v; const t = u(B, C, 0); U(n, M, A - 257), U(n, M + 5, S - 1), U(n, M + 10, D - 4), M += 14; for (let t = 0; t < D; ++t)U(n, M + 3 * t, B[l[t]]); M += 3 * D; const e = [E, T]; for (let r = 0; r < 2; ++r) { const o = e[r]; for (let e = 0; e < o.length; ++e) { const r = 31 & o[e]; U(n, M, t[r]), M += B[r], r > 15 && (U(n, M, o[e] >> 5 & 127), M += o[e] >> 12) } } } else K = b, L = w, N = m, P = g; for (let t = 0; t < h; ++t) { const e = f[t]; if (e > 255) { const t = e >> 18 & 31; z(n, M, K[t + 257]), M += L[t + 257], t > 7 && (U(n, M, e >> 23 & 31), M += r[t]); const l = 31 & e; z(n, M, N[l]), M += P[l], l > 3 && (z(n, M, e >> 5 & 8191), M += o[l]) } else z(n, M, K[e]), M += L[e] } return z(n, M, K[256]), M + L[256] }, B = new n([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), C = new t(0), D = (l, s, f, i, h, u) => { const w = u.z || l.length, g = new t(i + w + 5 * (1 + Math.ceil(w / 7e3)) + h), b = g.subarray(i, g.length - h), d = u.l; let m = 7 & (u.r || 0); if (s) { m && (b[0] = u.r >> 3); const t = B[s - 1], i = t >> 13, h = 8191 & t, g = (1 << f) - 1, y = u.p || new e(32768), M = u.h || new e(g + 1), p = Math.ceil(f / 3), k = 2 * p, v = t => (l[t] ^ l[t + 1] << p ^ l[t + 2] << k) & g, x = new n(25e3), E = new e(288), A = new e(32); let T = 0, U = 0, z = u.i || 0, F = 0, S = u.w || 0, I = 0; for (; z + 2 < w; ++z) { const t = v(z); let e = 32767 & z, n = M[t]; if (y[e] = n, M[t] = e, S <= z) { const s = w - z; if ((T > 7e3 || F > 24576) && (s > 423 || !d)) { m = q(l, b, 0, x, E, A, U, F, I, z - I, m), F = T = U = 0, I = z; for (let t = 0; t < 286; ++t)E[t] = 0; for (let t = 0; t < 30; ++t)A[t] = 0 } let f = 2, u = 0, g = h, M = e - n & 32767; if (s > 2 && t == v(z - M)) { const t = Math.min(i, s) - 1, r = Math.min(32767, z), o = Math.min(258, s); for (; M <= r && --g && e != n;) { if (l[z + f] == l[z + f - M]) { let e = 0; for (; e < o && l[z + e] == l[z + e - M]; ++e); if (e > f) { if (f = e, u = M, e > t) break; const r = Math.min(M, e - 2); let o = 0; for (let t = 0; t < r; ++t) { const e = z - M + t & 32767, r = e - y[e] & 32767; r > o && (o = r, n = e) } } } e = n, n = y[e], M += e - n & 32767 } } if (u) { x[F++] = 268435456 | c[f] << 18 | a[u]; const t = 31 & c[f], e = 31 & a[u]; U += r[t] + o[e], ++E[257 + t], ++A[e], S = z + f, ++T } else x[F++] = l[z], ++E[l[z]] } } for (z = Math.max(z, S); z < w; ++z)x[F++] = l[z], ++E[l[z]]; m = q(l, b, d, x, E, A, U, F, I, z - I, m), d || (u.r = 7 & m | b[m / 8 | 0] << 3, m -= 7, u.h = M, u.p = y, u.i = z, u.w = S) } else { for (let t = u.w || 0; t < w + d; t += 65535) { let e = t + 65535; e >= w && (b[m / 8 | 0] = d, e = w), m = j(b, m + 1, l.subarray(t, e)) } u.i = w } return x(g, 0, i + v(m) + h) }, G = (e, n, r, o, l) => { if (!l && (l = { l: 1 }, n.dictionary)) { const r = n.dictionary.subarray(-32768), o = new t(r.length + e.length); o.set(r), o.set(e, r.length), e = o, l.w = r.length } return D(e, null == n.level ? 6 : n.level, null == n.mem ? Math.ceil(1.5 * Math.max(8, Math.min(13, Math.log(e.length)))) : 12 + n.mem, r, o, l) }; function H(t, e) { return G(t, e || {}, 0, 0) } function J(t, e) { return T(t, { i: 2 }, e && e.out, e && e.dictionary) } self.deflateSync = H; self.inflateSync = J; }

const stringToUint = string => {
  let uintArray = new Uint8Array(string.length);
  for (let i = 0; i < string.length; i++) {
    uintArray[i] = string.charCodeAt(i);
  }
  return uintArray;
}
const uintToString = uintArray => {
  let str = "";
  let len = Math.ceil(uintArray.byteLength / 32767);
  for (let i = 0; i < len; i++) {
    str += String.fromCharCode.apply(null, uintArray.subarray(i * 32767, Math.min((i + 1) * 32767, uintArray.byteLength)));
  }
  return str;
}
let isCompressedChats = localStorage.getItem("compressedChats") === "true";
const originSetItem = localStorage.setItem;
localStorage.setItem = (key, value) => {
  try {
    if (isCompressedChats && key === "chats") value = uintToString(deflateSync(new TextEncoder().encode(value), { level: 1 }));
    originSetItem.call(localStorage, key, value)
  } catch (e) {
    if (isCompressedChats) {
      notyf.error(translations[locale]["localQuotaExceedTip"])
      return;
    }
    let isKeyChats = key === "chats";
    let compressed = uintToString(deflateSync(new TextEncoder().encode(isKeyChats ? value : localStorage.getItem("chats")), { level: 1 }));
    originSetItem.call(localStorage, "chats", compressed);
    originSetItem.call(localStorage, "compressedChats", true);
    isCompressedChats = true;
    if (!isKeyChats) originSetItem.call(localStorage, key, value);
  }
}


const localeList = ["en", "zh"];
let locale; // UI语言
const setLangEle = document.getElementById("setLang");
const setLang = () => {
  let langClass = locale + "Lang";
  localStorage.setItem("UILang", locale)
  setLangEle.classList = "setDetail themeDetail langDetail " + langClass;
}
setLangEle.onclick = (ev) => {
  let idx = Array.prototype.indexOf.call(setLangEle.children, ev.target);
  if (locale !== localeList[idx]) {
    locale = localeList[idx];
    setLang();
    changeLocale();
  }
}
const initLang = () => {
  let localLang = localStorage.getItem("UILang") || (navigator.language.startsWith("zh-") ? "zh" : "en");
  let isInit = locale === void 0;
  if (locale !== localLang) {
    locale = localLang;
    if (!isInit) changeLocale();
  };
  setLang();
}
initLang();
const translations = {
  "en": {
    "description": "Simple and powerful ChatGPT app",
    "newChat": "New chat",
    "newChatName": "New chat",
    "newFolder": "New folder",
    "newFolderName": "New folder",
    "search": "Search",
    "matchCaseTip": "Match case",
    "forceRe": "Force refresh",
    "clearAll": "Clear all chats",
    "setting": "Setting",
    "nav": "Navigate",
    "winedWin": "Window",
    "fullWin": "Full screen",
    "quickSet": "Quick setting",
    "chat": "Chat",
    "tts": "TTS",
    "stt": "STT",
    "gptModel": "GPT model",
    "gptBrowsing": "GPT-4-browsing",
    "avatar": "Avatar",
    "systemRole": "System role",
    "presetRole": "Preset",
    "default": "Default",
    "assistant": "Assistant",
    "cat": "Cat girl",
    "emoji": "Emoji",
    "withImg": "Image",
    "defaultText": "",
    "assistantText": "You are a helpful assistant, answer as concisely as possible.",
    "catText": "You are a cute cat girl, you must end every sentence with 'meow'",
    "emojiText": "Your personality is very lively, there must be at least one emoji icon in every sentence",
    "imageText": "When you need to send pictures, please generate them in markdown language, without backslashes or code boxes. When you need to use the unsplash API, follow the format, https://source.unsplash.com/960x640/?<English keywords>",
    "nature": "Nature",
    "natureNeg": "Accurate",
    "naturePos": "Creativity",
    "quality": "Quality",
    "qualityNeg": "Repetitive",
    "qualityPos": "Nonsense",
    "chatsWidth": "Chats width",
    "typeSpeed": "Typing speed",
    "continuousLen": "Context messages",
    "msgAbbr": " msgs.",
    "slow": "Slow",
    "fast": "Fast",
    "longReply": "Long reply",
    "ttsService": "TTS API",
    "azureTTS": "Azure",
    "edgeTTS": "Edge",
    "systemTTS": "System",
    "azureRegion": "Azure region",
    "loadVoice": "Load voice",
    "voiceName": "Choose voice",
    "userVoice": "User voice",
    "replyVoice": "Reply voice",
    "TTSTest": "Hello, nice to meet you.",
    "play": "Play",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "style": "Style",
    "role": "Role",
    "volume": "Volume",
    "low": "Low",
    "high": "High",
    "rate": "Rate",
    "slow": "Slow",
    "fast": "Fast",
    "pitch": "Pitch",
    "neutral": "Neutral",
    "intense": "Intense",
    "contSpeech": "Continuous speech",
    "autoSpeech": "Auto speech",
    "unsupportRecTip": "Voice recognition is not supported in the current environment. Please refer to the documentation.",
    "lang": "Language",
    "dialect": "Dialect",
    "autoSendKey": "Auto send keyword",
    "autoStopKey": "Auto stop keyword",
    "autoSendDelay": "Auto send delay time",
    "second": "s",
    "keepListenMic": "Keep listen",
    "send": "Send",
    "askTip": "Type message here",
    "clearChat": "Clear chat",
    "general": "General",
    "hotkey": "Hotkey",
    "data": "Data",
    "theme": "Theme",
    "darkTheme": "Dark",
    "lightTheme": "Light",
    "autoTheme": "Auto",
    "systemTheme": "System",
    "customDarkTheme": "Custom dark theme",
    "startDark": "Start",
    "endDark": "End",
    "aiEndpoint": "OpenAI endpoint",
    "aiKey": "OpenAI API key",
    "aiCustomModel": "Custom model",
    "used": "Used ",
    "available": "Avail ",
    "navKey": "Toggle nav",
    "fullKey": "Window size",
    "themeKey": "Toggle theme",
    "themeKey": "Toggle lang",
    "inputKey": "Message",
    "voiceKey": "Voice",
    "resetTip": "Restore default",
    "recKey": "Recognition",
    "speechKey": "Start speech",
    "export": "Export",
    "import": "Import",
    "clear": "Clear",
    "reset": "Reset",
    "localStore": "Local storage",
    "forceReTip": "Force refresh page?",
    "noSpeechTip": "No speech was detected. You may need to adjust your microphone settings.",
    "noMicTip": "No microphone was found. Ensure that a microphone is installed and microphone settings are configured correctly.",
    "noMicPerTip": "Permission to use microphone is blocked.",
    "azureInvalidTip": "Access is denied due to invalid access key or API endpoint!",
    "errorAiKeyTip": "Invalid or incorrect API key, please check API key!",
    "copyCode": "Copy code",
    "copySuccess": "Success",
    "update": "Update",
    "cancel": "Cancel",
    "delMsgTip": "Delete this message?",
    "edit": "Edit",
    "refresh": "Refresh",
    "continue": "Continue",
    "copy": "Copy",
    "del": "Delete",
    "downAudio": "Download audio",
    "speech": "Speech",
    "chats": " chats",
    "delFolderTip": "Delete this folder?",
    "delChatTip": "Delete this chat?",
    "exportSuccTip": "Export successful!",
    "importSuccTip": "Import successful!",
    "importFailTip": "Import failed, please check the file format!",
    "clearChatSuccTip": "Clear chats data successful!",
    "resetSetSuccTip": "Reset settings successful!",
    "clearAllTip": "Delete all chats and folders?",
    "resetSetTip": "Restore all settings to default?",
    "hotkeyConflict": "Hotkey conflict, please choose another key!",
    "customDarkTip": "Start time and end time cannot be the same!",
    "timeoutTip": "Request timeout, please try again later!",
    "largeReqTip": "Request is too large, please delete part of the chat or cancel continuous chat!",
    "noModelPerTip": "Not permission to use this model, please choose another GPT model!",
    "apiRateTip": "Trigger API call rate limit, please try again later!",
    "exceedLimitTip": "API usage exceeded limit, please check your bill!",
    "badGateTip": "Gateway error or timeout, please try again later!",
    "badEndpointTip": "Failed to access the endpoint, please check the endpoint!",
    "clearChatTip": "Clear this chat?",
    "cantSpeechTip": "Current voice cannot synthesize this message, please choose another voice or message!",
    "localQuotaExceedTip": "Local storage exceeded limit, please export chats data and clear or delete some chats!",
  },
  "zh": {
    "description": "简洁而强大的ChatGPT应用",
    "newChat": "新建会话",
    "newChatName": "新的会话",
    "newFolder": "新建文件夹",
    "newFolderName": "新文件夹",
    "search": "搜索",
    "matchCaseTip": "区分大小写",
    "forceRe": "强制刷新",
    "clearAll": "清空全部",
    "setting": "设置",
    "nav": "导航",
    "winedWin": "窗口",
    "fullWin": "全屏",
    "quickSet": "快速设置",
    "chat": "会话",
    "tts": "语音合成",
    "stt": "语音识别",
    "gptModel": "GPT模型",
    "gptBrowsing": "GPT-4-联网",
    "avatar": "用户头像",
    "systemRole": "系统角色",
    "presetRole": "预设角色",
    "default": "默认",
    "assistant": "助手",
    "cat": "猫娘",
    "emoji": "表情",
    "withImg": "有图",
    "defaultText": "",
    "assistantText": "你是一个乐于助人的助手，尽量简明扼要地回答",
    "catText": "你是一个可爱的猫娘，每句话结尾都要带个'喵'",
    "emojiText": "你的性格很活泼，每句话中都要有至少一个emoji图标",
    "imageText": "当你需要发送图片的时候，请用 markdown 语言生成，不要反斜线，不要代码框，需要使用 unsplash API时，遵循一下格式， https://source.unsplash.com/960x640/? ＜英文关键词＞",
    "nature": "角色性格",
    "natureNeg": "准确严谨",
    "naturePos": "灵活创新",
    "quality": "回答质量",
    "qualityNeg": "重复保守",
    "qualityPos": "胡言乱语",
    "chatsWidth": "会话宽度",
    "typeSpeed": "打字机速度",
    "continuousLen": "上下文消息数",
    "msgAbbr": "条",
    "slow": "慢",
    "fast": "快",
    "longReply": "长回复",
    "ttsService": "语音合成服务",
    "azureTTS": "Azure语音",
    "edgeTTS": "Edge语音",
    "systemTTS": "系统语音",
    "azureRegion": "Azure区域",
    "loadVoice": "加载语音",
    "voiceName": "选择语音",
    "userVoice": "用户语音",
    "replyVoice": "回答语音",
    "TTSTest": "你好，很高兴认识你。",
    "play": "播放",
    "pause": "暂停",
    "resume": "恢复",
    "stop": "停止",
    "style": "风格",
    "role": "角色",
    "volume": "音量",
    "low": "低",
    "high": "高",
    "rate": "语速",
    "slow": "慢",
    "fast": "快",
    "pitch": "音调",
    "neutral": "平淡",
    "intense": "起伏",
    "contSpeech": "连续朗读",
    "autoSpeech": "自动朗读",
    "unsupportRecTip": "当前环境不支持语音识别，请查阅文档。",
    "lang": "语言",
    "dialect": "方言",
    "autoSendKey": "自动发送关键词",
    "autoStopKey": "自动停止关键词",
    "autoSendDelay": "自动发送延迟时间",
    "second": "秒",
    "keepListenMic": "保持监听",
    "send": "发送",
    "askTip": "来问点什么吧",
    "clearChat": "清空会话",
    "general": "通用",
    "hotkey": "快捷键",
    "data": "数据",
    "theme": "主题",
    "darkTheme": "深色",
    "lightTheme": "浅色",
    "autoTheme": "自动",
    "systemTheme": "跟随系统",
    "customDarkTheme": "自定义深色主题时间",
    "startDark": "开始时间",
    "endDark": "结束时间",
    "aiEndpoint": "OpenAI接口",
    "aiKey": "API密钥",
    "aiCustomModel": "自定义模型",
    "used": "已用 ",
    "available": "可用 ",
    "navKey": "切换导航",
    "fullKey": "全屏/窗口",
    "themeKey": "切换主题",
    "langKey": "切换语言",
    "inputKey": "输入框",
    "voiceKey": "语音",
    "resetTip": "重置设置",
    "recKey": "语音输入",
    "speechKey": "朗读会话",
    "export": "导出",
    "import": "导入",
    "clear": "清空",
    "reset": "重置",
    "localStore": "本地存储",
    "forceReTip": "是否强制刷新页面？",
    "noSpeechTip": "未识别到语音，请调整麦克风后重试！",
    "noMicTip": "未识别到麦克风，请确保已安装麦克风！",
    "noMicPerTip": "未允许麦克风权限！",
    "azureInvalidTip": "由于订阅密钥无效或 API 端点错误，访问被拒绝！",
    "errorAiKeyTip": "API密钥错误或失效，请检查API密钥！",
    "copyCode": "复制代码",
    "copySuccess": "复制成功",
    "update": "更新",
    "cancel": "取消",
    "delMsgTip": "是否删除此消息？",
    "edit": "编辑",
    "refresh": "刷新",
    "continue": "继续",
    "copy": "复制",
    "del": "删除",
    "downAudio": "下载语音",
    "speech": "朗读",
    "chats": "个会话",
    "delFolderTip": "是否删除此文件夹？",
    "delChatTip": "是否删除此会话？",
    "exportSuccTip": "导出成功！",
    "importSuccTip": "导入成功！",
    "importFailTip": "导入失败，请检查文件格式！",
    "clearChatSuccTip": "清空会话成功！",
    "resetSetSuccTip": "重置设置成功！",
    "clearAllTip": "是否删除所有会话和文件夹？",
    "resetSetTip": "是否还原所有设置为默认值？",
    "hotkeyConflict": "快捷键冲突，请选择其他键位！",
    "customDarkTip": "开始时间和结束时间不能相同！",
    "timeoutTip": "请求超时，请稍后重试！",
    "largeReqTip": "请求内容过大，请删除部分对话或关闭连续对话！",
    "noModelPerTip": "无权使用此模型，请选择其他GPT模型！",
    "apiRateTip": "触发API调用频率限制，请稍后重试！",
    "exceedLimitTip": "API使用超出限额，请检查您的账单！",
    "badGateTip": "网关错误或超时，请稍后重试！",
    "badEndpointTip": "访问接口失败，0-----接口！",
    "clearChatTip": "是否清空此会话？",
    "cantSpeechTip": "当前语音无法合成此消息，请选择其他语音或消息！",
    "localQuotaExceedTip": "本地存储超出限额，请导出会话并清空或删除部分会话！",
  },
};
const translateElement = (ele, type) => {
  const key = ele.getAttribute("data-i18n-" + type);
  const translation = translations[locale][key];
  if (type === "title") {
    ele.setAttribute("title", translation);
  } else if (type === "place") {
    ele.setAttribute("placeholder", " "+translation);
  } else if (type === "value") {
    ele.setAttribute("value", translation);
  } else {
    ele.textContent = translation;
  }
}
const initLocale = () => {
  document.querySelectorAll("[data-i18n-title]").forEach(ele => { translateElement(ele, "title") });
  document.querySelectorAll("[data-i18n-place]").forEach(ele => { translateElement(ele, "place") });
  document.querySelectorAll("[data-i18n-value]").forEach(ele => { translateElement(ele, "value") });
  document.querySelectorAll("[data-i18n-key]").forEach(ele => { translateElement(ele, "key") });
  document.querySelectorAll("[data-i18n-theme]").forEach(ele => {
    let key = themeMode === 2 ? "autoTheme" : themeMode === 1 ? "lightTheme" : "darkTheme";
    ele.setAttribute("title", translations[locale][key])
  })
  document.querySelectorAll("[data-i18n-window]").forEach(ele => {
    let key = isFull ? "winedWin" : "fullWin";
    ele.setAttribute("title", translations[locale][key])
  })
  document.head.children[3].setAttribute("content", translations[locale]["description"])
};
initLocale();
const changeLocale = () => {
  initLocale();
  document.querySelectorAll("[data-type='chatEdit'],[data-type='folderEdit']").forEach(ele => {
    ele.children[0].textContent = translations[locale]["edit"];
  });
  document.querySelectorAll("[data-type='chatDel'],[data-type='folderDel']").forEach(ele => {
    ele.children[0].textContent = translations[locale]["del"];
  });
  document.querySelectorAll("[data-type='folderAddChat']").forEach(ele => {
    ele.children[0].textContent = translations[locale]["newChat"];
  });
  document.querySelectorAll("[data-id]").forEach(ele => {
    let key = ele.getAttribute("data-id");
    if (key.endsWith("Md")) {
      if (key === "speechMd" || key === "pauseMd" || key === "resumeMd") {
        ele.children[0].textContent = translations[locale][key.slice(0, -2)];
      } else if (key === "refreshMd") {
        ele.setAttribute("title", translations[locale][ele.classList.contains("refreshReq") ? "refresh" : "continue"]);
      } else {
        ele.setAttribute("title", translations[locale][key.slice(0, -2)]);
      }
    }
  });
  document.querySelectorAll(".folderNum").forEach(ele => {
    let num = ele.textContent.match(/\d+/)[0];
    ele.textContent = num + translations[locale]["chats"];
  });
  document.querySelectorAll(".u-mdic-copy-btn").forEach(ele => {
    ele.setAttribute("text", translations[locale]["copyCode"]);
  })
  document.querySelectorAll(".u-mdic-copy-notify").forEach(ele => {
    ele.setAttribute("text", translations[locale]["copySuccess"]);
  })
  if (editingIdx !== void 0) {
    document.querySelector("[data-i18n-key='send']").textContent = translations[locale]["update"];
    document.querySelector("[data-i18n-title='clearChat']").setAttribute("title", translations[locale]["cancel"]);
  }
  loadPrompt();
}

const windowEle = document.getElementsByClassName("chat_window")[0];
const messagesEle = document.getElementsByClassName("messages")[0];
const chatlog = document.getElementById("chatlog");
const stopEle = document.getElementById("stopChat");
const sendBtnEle = document.getElementById("sendbutton");
const clearEle = document.getElementsByClassName("clearConv")[0];
const inputAreaEle = document.getElementById("chatinput");
const settingEle = document.getElementById("setting");
const dialogEle = document.getElementById("setDialog");
const lightEle = document.getElementById("toggleLight");
const setLightEle = document.getElementById("setLight");
const autoThemeEle = document.getElementById("autoDetail");
const systemEle = document.getElementById("systemInput");
const speechServiceEle = document.getElementById("preSetService");
const newChatEle = document.getElementById("newChat");
const folderListEle = document.getElementById("folderList");
const chatListEle = document.getElementById("chatList");
const searchChatEle = document.getElementById("searchChat");
const voiceRecEle = document.getElementById("voiceRecIcon");
const voiceRecSetEle = document.getElementById("voiceRecSetting");
const preEle = document.getElementById("preSetSystem");
let voiceType = 1; // 设置 0: 提问语音，1：回答语音
let voiceRole = []; // 语音
let voiceTestText; // 测试语音文本
let voiceVolume = []; //音量
let voiceRate = []; // 语速
let voicePitch = []; // 音调
let enableContVoice; // 连续朗读
let enableAutoVoice; // 自动朗读
let existVoice = 2; // 3:Azure语音 2:使用edge在线语音, 1:使用本地语音, 0:不支持语音
let azureToken;
let azureTokenTimer;
let azureRegion;
let azureKey;
let azureRole = [];
let azureStyle = [];
const supportSpe = !!(window.speechSynthesis && window.SpeechSynthesisUtterance);
const isSafeEnv = location.hostname.match(/127.|localhost/) || location.protocol.match(/https:|file:/); // https或本地安全环境
const supportRec = !!window.webkitSpeechRecognition && isSafeEnv; // 是否支持语音识别输入
let recing = false;
let autoSendWord; // 自动发送关键词
let autoStopWord; // 自动停止关键词
let autoSendTime; // 自动发送延迟时间
let keepListenMic; // 保持监听麦克风
let autoSendTimer;
let resetRecRes;
let toggleRecEv;
const isAndroid = /\bAndroid\b/i.test(navigator.userAgent);
const isApple = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);
const isPWA = navigator.standalone || window.matchMedia("(display-mode: standalone)").matches;
if (isPWA) {
  let bottomEle = document.querySelector(".bottom_wrapper");
  let footerEle = document.querySelector(".navFooter");
  footerEle.style.marginBottom = bottomEle.style.marginBottom = "8px";
};
const dayMs = 8.64e7;
const noLoading = () => {
  return !loading && (!currentResEle || currentResEle.dataset.loading !== "true")
};
inputAreaEle.focus();
const textInputEvent = () => {
  if (noLoading()) sendBtnEle.classList.toggle("activeSendBtn", inputAreaEle.value.trim().length);
  inputAreaEle.style.height = "47px";
  inputAreaEle.style.height = inputAreaEle.scrollHeight + "px";
};
inputAreaEle.oninput = textInputEvent;

// 定义一个函数来根据窗口宽度来显示或隐藏导航栏
const adjustNavBasedOnWidth = () => {
  if (window.innerWidth > 900) {
    const pinNav = localStorage.getItem("pinNav") === "true";
    document.body.classList.toggle("show-nav", pinNav);
    return
  }
  if (window.innerWidth < 800) {
    document.body.classList.remove("show-nav");
  }
};

// 页面加载时调用该函数
// window.addEventListener("load", adjustNavBasedOnWidth);

// 窗口大小变化时也调用该函数
// window.addEventListener("resize", adjustNavBasedOnWidth);


const toggleNavEv = () => {
  let isShowNav = document.body.classList.toggle("show-nav");
  if (window.innerWidth > 800) {
    localStorage.setItem("pinNav", isShowNav)
  }
}
document.body.addEventListener("mousedown", event => {
  if (event.target.className === "toggler") {
    toggleNavEv();
  } else if (event.target.className === "overlay") {
    document.body.classList.remove("show-nav");
  } else if (event.target === document.body) {
    if (window.innerWidth <= 800) {
      document.body.classList.remove("show-nav");
    }
  }
});
const endSetEvent = (ev) => {
  if (!document.getElementById("sysDialog").contains(ev.target)) {
    ev.preventDefault();
    ev.stopPropagation();
    endSet();
  }
}
const endSet = () => {
  document.getElementById("sysMask").style.display = "none";
  document.body.removeEventListener("click", endSetEvent, true);
}
document.getElementById("closeSet").onclick = endSet;
document.getElementById("sysSetting").onclick = () => {
  document.getElementById("sysMask").style.display = "flex";
  checkStorage();
  document.getElementById("sysMask").onmousedown = endSetEvent;
};
const clearAutoSendTimer = () => {
  if (autoSendTimer !== void 0) {
    clearTimeout(autoSendTimer);
    autoSendTimer = void 0;
  }
}
const initRecSetting = () => {
  if (supportRec) {
    noRecTip.style.display = "none";
    yesRec.style.display = "block";
    hotKeyVoiceRec.parentElement.style.display = "block";
    document.getElementById("voiceRec").style.display = "block";
    inputAreaEle.classList.add("message_if_voice");
    let langs = [ // from https://www.google.com/intl/en/chrome/demos/speech.html
      ['中文', ['cmn-Hans-CN', '普通话 (大陆)'],
        ['cmn-Hans-HK', '普通话 (香港)'],
        ['cmn-Hant-TW', '中文 (台灣)'],
        ['yue-Hant-HK', '粵語 (香港)']],
      ['English', ['en-US', 'United States'],
        ['en-GB', 'United Kingdom'],
        ['en-AU', 'Australia'],
        ['en-CA', 'Canada'],
        ['en-IN', 'India'],
        ['en-KE', 'Kenya'],
        ['en-TZ', 'Tanzania'],
        ['en-GH', 'Ghana'],
        ['en-NZ', 'New Zealand'],
        ['en-NG', 'Nigeria'],
        ['en-ZA', 'South Africa'],
        ['en-PH', 'Philippines']]
    ];
    if (locale !== "zh") langs = langs.reverse();
    langs.forEach((lang, i) => {
      select_language.options.add(new Option(lang[0], i));
      selectLangOption.options.add(new Option(lang[0], i))
    });
    const updateCountry = function () {
      selectLangOption.selectedIndex = select_language.selectedIndex = this.selectedIndex;
      select_dialect.innerHTML = "";
      selectDiaOption.innerHTML = "";
      let list = langs[select_language.selectedIndex];
      for (let i = 1; i < list.length; i++) {
        select_dialect.options.add(new Option(list[i][1], list[i][0]));
        selectDiaOption.options.add(new Option(list[i][1], list[i][0]));
      }
      select_dialect.style.visibility = list[1].length == 1 ? "hidden" : "visible";
      selectDiaOption.parentElement.style.visibility = list[1].length == 1 ? "hidden" : "visible";
      localStorage.setItem("voiceRecLang", select_dialect.value);
    };
    let localLangIdx = 0;
    let localDiaIdx = 0;
    let localRecLang = localStorage.getItem("voiceRecLang") || langs[0][1][0];
    if (localRecLang) {
      let localIndex = langs.findIndex(item => {
        let diaIdx = item.findIndex(lang => { return lang instanceof Array && lang[0] === localRecLang });
        if (diaIdx !== -1) {
          localDiaIdx = diaIdx - 1;
          return true;
        }
        return false;
      });
      if (localIndex !== -1) localLangIdx = localIndex;
    }
    selectLangOption.onchange = updateCountry;
    select_language.onchange = updateCountry;
    selectDiaOption.onchange = select_dialect.onchange = function () {
      selectDiaOption.selectedIndex = select_dialect.selectedIndex = this.selectedIndex;
      localStorage.setItem("voiceRecLang", select_dialect.value);
    }
    selectLangOption.selectedIndex = select_language.selectedIndex = localLangIdx;
    select_language.dispatchEvent(new Event("change"));
    selectDiaOption.selectedIndex = select_dialect.selectedIndex = localDiaIdx;
    select_dialect.dispatchEvent(new Event("change"));
    let localAutoSendWord = localStorage.getItem("autoVoiceSendWord");
    autoSendWord = autoSendText.value = localAutoSendWord || autoSendText.getAttribute("value") || "";
    autoSendText.onchange = () => {
      autoSendWord = autoSendText.value;
      localStorage.setItem("autoVoiceSendWord", autoSendWord);
    }
    autoSendText.dispatchEvent(new Event("change"));
    let localAutoStopWord = localStorage.getItem("autoVoiceStopWord");
    autoStopWord = autoStopText.value = localAutoStopWord || autoStopText.getAttribute("value") || "";
    autoStopText.onchange = () => {
      autoStopWord = autoStopText.value;
      localStorage.setItem("autoVoiceStopWord", autoStopWord);
    }
    autoStopText.dispatchEvent(new Event("change"));
    let outEle = document.getElementById("autoSendTimeout");
    let localTimeout = localStorage.getItem("autoVoiceSendOut");
    outEle.value = autoSendTime = parseInt(localTimeout || outEle.getAttribute("value"));
    outEle.oninput = () => {
      outEle.style.backgroundSize = (outEle.value - outEle.min) * 100 / (outEle.max - outEle.min) + "% 100%";
      autoSendTime = parseInt(outEle.value);
      localStorage.setItem("autoVoiceSendOut", outEle.value);
    }
    outEle.dispatchEvent(new Event("input"));
    outEle.onchange = () => {
      let hasAutoTimer = !!autoSendTimer;
      clearAutoSendTimer();
      if (hasAutoTimer) setAutoTimer();
    }
    const keepMicEle = document.getElementById("keepListenMic");
    let localKeepMic = localStorage.getItem("keepListenMic");
    keepMicEle.checked = keepListenMic = (localKeepMic || keepMicEle.getAttribute("checked")) === "true";
    keepMicEle.onchange = () => {
      keepListenMic = keepMicEle.checked;
      localStorage.setItem("keepListenMic", keepListenMic);
    }
    keepMicEle.dispatchEvent(new Event("change"));
    let recIns = new webkitSpeechRecognition();
    // prevent some Android bug
    recIns.continuous = !isAndroid;
    recIns.interimResults = true;
    recIns.maxAlternatives = 1;
    let recRes = tempRes = "";
    let preRes, affRes;
    const setAutoTimer = () => {
      if (autoSendTime) {
        autoSendTimer = setTimeout(() => {
          genFunc();
          autoSendTimer = void 0;
        }, autoSendTime * 1000);
      }
    }
    const resEvent = (event) => {
      if (typeof (event.results) === "undefined") {
        toggleRecEvent();
        return;
      }
      let isFinal;
      let autoFlag;
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        isFinal = event.results[i].isFinal;
        if (isFinal) {
          recRes += event.results[i][0].transcript
          if (autoSendWord) {
            let idx = recRes.indexOf(autoSendWord);
            if (idx !== -1) {
              recRes = recRes.slice(0, idx);
              autoFlag = 1;
              break;
            }
          }
          if (autoStopWord) {
            let idx = recRes.indexOf(autoStopWord);
            if (idx !== -1) {
              recRes = recRes.slice(0, idx);
              autoFlag = 2;
              break;
            }
          }
        }
        else { tempRes = recRes + event.results[i][0].transcript }
      }
      inputAreaEle.value = preRes + (isFinal ? recRes : tempRes) + affRes;
      textInputEvent();
      inputAreaEle.focus();
      inputAreaEle.selectionEnd = inputAreaEle.value.length - affRes.length;
      if (autoFlag) {
        if (autoFlag === 1) genFunc();
        else endEvent(false, false);
      }
      clearAutoSendTimer();
      if (autoFlag !== 1) setAutoTimer();
    };
    resetRecRes = () => {
      preRes = inputAreaEle.value.slice(0, inputAreaEle.selectionStart);
      affRes = inputAreaEle.value.slice(inputAreaEle.selectionEnd);
      recRes = tempRes = "";
    }
    const stopAction = () => {
      clearAutoSendTimer();
      recIns.onresult = null;
      recIns.onerror = null;
      recIns.onend = null;
      voiceRecEle.classList.remove("voiceRecing");
      recing = false;
    }
    const endEvent = (event, flag) => {
      if (flag !== void 0) {
        if (!flag) {
          recIns.stop();
          stopAction();
        }
      } else if (event) {
        if (keepListenMic && event.type === "end") {
          recIns.start();
          resetRecRes();
        } else {
          if (event.type === "error") recIns.stop();
          stopAction();
        }
      }
    };
    const errorEvent = (ev) => {
      if (event.error === "no-speech") {
        notyf.open({
          type: "warning",
          message: translations[locale]["noSpeechTip"]
        });
      }
      if (event.error === "audio-capture") {
        notyf.error(translations[locale]["noMicTip"])
        endEvent(ev);
      }
      if (event.error === "not-allowed") {
        notyf.error(translations[locale]["noMicPerTip"])
        endEvent(ev);
      }
    }
    const closeEvent = (ev) => {
      if (voiceRecSetEle.contains(ev.target)) return;
      if (!voiceRecSetEle.contains(ev.target)) {
        voiceRecSetEle.style.display = "none";
        document.removeEventListener("mousedown", closeEvent, true);
        voiceRecEle.classList.remove("voiceLong");
      }
    }
    const longEvent = () => {
      voiceRecSetEle.style.display = "block";
      document.addEventListener("mousedown", closeEvent, true);
    }
    const toggleRecEvent = () => {
      if (voiceRecEle.classList.toggle("voiceRecing")) {
        try {
          resetRecRes();
          recIns.lang = select_dialect.value;
          recIns.start();
          recIns.onresult = resEvent;
          recIns.onerror = errorEvent;
          recIns.onend = endEvent;
          recing = true;
        } catch (e) {
          endEvent(false, false);
        }
      } else {
        endEvent(false, false);
      }
    };
    toggleRecEv = toggleRecEvent;
    let timer;
    const voiceDownEvent = (ev) => {
      ev.preventDefault();
      let i = 0;
      voiceRecEle.classList.add("voiceLong");
      timer = setInterval(() => {
        i += 1;
        if (i >= 3) {
          clearInterval(timer);
          timer = void 0;
          longEvent();
        }
      }, 100)
    };
    const voiceUpEvent = (ev) => {
      ev.preventDefault();
      if (timer !== void 0) {
        toggleRecEvent();
        clearInterval(timer);
        timer = void 0;
        voiceRecEle.classList.remove("voiceLong");
      }
    }
    voiceRecEle.onmousedown = voiceDownEvent;
    voiceRecEle.ontouchstart = voiceDownEvent;
    voiceRecEle.onmouseup = voiceUpEvent;
    voiceRecEle.ontouchend = voiceUpEvent;
  };
};
initRecSetting();
if (!supportSpe) {
  speechServiceEle.remove(2);
}
const initVoiceVal = () => {
  let localVoiceType = localStorage.getItem("existVoice");
  speechServiceEle.value = existVoice = parseInt(localVoiceType || "2");
}
initVoiceVal();
const clearAzureVoice = () => {
  azureKey = void 0;
  azureRegion = void 0;
  azureRole = [];
  azureStyle = [];
  document.getElementById("azureExtra").style.display = "none";
  azureKeyInput.parentElement.style.display = "none";
  preSetAzureRegion.parentElement.style.display = "none";
  if (azureTokenTimer) {
    clearInterval(azureTokenTimer);
    azureTokenTimer = void 0;
  }
}
speechServiceEle.onchange = () => {
  existVoice = parseInt(speechServiceEle.value);
  localStorage.setItem("existVoice", existVoice);
  toggleVoiceCheck(true);
  if (checkAzureAbort && !checkAzureAbort.signal.aborted) {
    checkAzureAbort.abort();
    checkAzureAbort = void 0;
  }
  if (checkEdgeAbort && !checkEdgeAbort.signal.aborted) {
    checkEdgeAbort.abort();
    checkEdgeAbort = void 0;
  }
}
let azureVoiceData, edgeVoiceData, systemVoiceData, checkAzureAbort, checkEdgeAbort;
const toggleVoiceCheck = (bool) => {
  checkVoiceLoad.style.display = bool ? "flex" : "none";
  speechDetail.style.display = bool ? "none" : "block";
}
const loadAzureVoice = () => {
  let checking = false;
  const checkAzureFunc = () => {
    if (checking) return;
    if (azureKey) {
      checking = true;
      checkVoiceLoad.classList.add("voiceChecking");
      if (azureTokenTimer) {
        clearInterval(azureTokenTimer);
      }
      checkAzureAbort = new AbortController();
      setTimeout(() => {
        if (checkAzureAbort && !checkAzureAbort.signal.aborted) {
          checkAzureAbort.abort();
          checkAzureAbort = void 0;
        }
      }, 15000);
      Promise.all([getAzureToken(checkAzureAbort.signal), getVoiceList(checkAzureAbort.signal)]).then(() => {
        azureTokenTimer = setInterval(() => {
          getAzureToken();
        }, 540000);
        toggleVoiceCheck(false);
      }).catch(e => {
      }).finally(() => {
        checkVoiceLoad.classList.remove("voiceChecking");
        checking = false;
      })
    }
  };
  checkVoiceLoad.onclick = checkAzureFunc;
  const getAzureToken = (signal) => {
    return new Promise((res, rej) => {
      fetch("https://" + azureRegion + ".api.cognitive.microsoft.com/sts/v1.0/issueToken", {
        signal,
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": azureKey
        }
      }).then(response => {
        response.text().then(text => {
          try {
            let json = JSON.parse(text);
            notyf.error(translations[locale]["azureInvalidTip"]);
            rej();
          } catch (e) {
            azureToken = text;
            res();
          }
        });
      }).catch(e => {
        rej();
      })
    })
  };
  const getVoiceList = (signal) => {
    return new Promise((res, rej) => {
      if (azureVoiceData) {
        initVoiceSetting(azureVoiceData);
        res();
      } else {
        let localAzureVoiceData = localStorage.getItem(azureRegion + "voiceData");
        if (localAzureVoiceData) {
          azureVoiceData = JSON.parse(localAzureVoiceData);
          initVoiceSetting(azureVoiceData);
          res();
        } else {
          fetch("https://" + azureRegion + ".tts.speech.microsoft.com/cognitiveservices/voices/list", {
            signal,
            headers: {
              "Ocp-Apim-Subscription-Key": azureKey
            }
          }).then(response => {
            response.json().then(json => {
              azureVoiceData = json;
              localStorage.setItem(azureRegion + "voiceData", JSON.stringify(json));
              initVoiceSetting(json);
              res();
            }).catch(e => {
              notyf.error(translations[locale]["azureInvalidTip"]);
              rej();
            })
          }).catch(e => {
            rej();
          })
        }
      }
    })
  };
  let azureRegionEle = document.getElementById("preSetAzureRegion");
  if (!azureRegionEle.options.length) {
    const azureRegions = ['southafricanorth', 'eastasia', 'southeastasia', 'australiaeast', 'centralindia', 'japaneast', 'japanwest', 'koreacentral', 'canadacentral', 'northeurope', 'westeurope', 'francecentral', 'germanywestcentral', 'norwayeast', 'switzerlandnorth', 'switzerlandwest', 'uksouth', 'uaenorth', 'brazilsouth', 'centralus', 'eastus', 'eastus2', 'northcentralus', 'southcentralus', 'westcentralus', 'westus', 'westus2', 'westus3'];
    azureRegions.forEach((region, i) => {
      let option = document.createElement("option");
      option.value = region;
      option.text = region;
      azureRegionEle.options.add(option);
    });
  }
  let localAzureRegion = localStorage.getItem("azureRegion");
  if (localAzureRegion) {
    azureRegion = localAzureRegion;
    azureRegionEle.value = localAzureRegion;
  }
  azureRegionEle.onchange = () => {
    azureRegion = azureRegionEle.value;
    localStorage.setItem("azureRegion", azureRegion);
    toggleVoiceCheck(true);
  }
  azureRegionEle.dispatchEvent(new Event("change"));
  let azureKeyEle = document.getElementById("azureKeyInput");
  let localAzureKey = localStorage.getItem("azureKey");
  if (localAzureKey) {
    azureKey = localAzureKey;
    azureKeyEle.value = localAzureKey;
  }
  azureKeyEle.onchange = () => {
    azureKey = azureKeyEle.value;
    localStorage.setItem("azureKey", azureKey);
    toggleVoiceCheck(true);
  }
  azureKeyEle.dispatchEvent(new Event("change"));
  if (azureKey) {
    checkAzureFunc();
  }
}
const loadLocalVoice = () => {
  if (systemVoiceData) {
    initVoiceSetting(systemVoiceData);
  } else {
    let initedVoice = false;
    const getLocalVoice = () => {
      let voices = speechSynthesis.getVoices();
      if (voices.length) {
        if (!initedVoice) {
          initedVoice = true;
          systemVoiceData = voices;
          initVoiceSetting(voices);
        }
        return true;
      } else {
        return false;
      }
    }
    let syncExist = getLocalVoice();
    if (!syncExist) {
      if ("onvoiceschanged" in speechSynthesis) {
        speechSynthesis.onvoiceschanged = () => {
          getLocalVoice();
        }
      } else if (speechSynthesis.addEventListener) {
        speechSynthesis.addEventListener("voiceschanged", () => {
          getLocalVoice();
        })
      }
      let timeout = 0;
      let timer = setInterval(() => {
        if (getLocalVoice() || timeout > 1000) {
          if (timeout > 1000) {
            existVoice = 0;
          }
          clearInterval(timer);
          timer = null;
        }
        timeout += 300;
      }, 300)
    }
  }
};
const initVoiceSetting = (voices) => {
  let isOnline = existVoice >= 2;
  let voicesEle = document.getElementById("preSetSpeech");
  // 支持中文和英文
  voices = isOnline ? voices.filter(item => item.Locale.match(/^(zh-|en-)/)) : voices.filter(item => item.lang.match(/^(zh-|en-)/));
  if (isOnline) {
    voices.map(item => {
      item.name = item.FriendlyName || (`${item.DisplayName} Online (${item.VoiceType}) - ${item.LocaleName}`);
      item.lang = item.Locale;
    })
  }
  voices.sort((a, b) => {
    if (a.lang.slice(0, 2) === b.lang.slice(0, 2)) {
      if (a.lang.slice(0, 2) === "zh") {
        return (a.lang === b.lang) ? 0 : (a.lang > b.lang) ? 1 : -1; // zh-CN 在前
      } else {
        return 0
      }
    }
    return (locale === "zh" ? (a.lang < b.lang) : (a.lang > b.lang)) ? 1 : -1; // 中文UI，则中文"z"在前
  });
  voices.map(item => {
    if (item.name.match(/^(Google |Microsoft )/)) {
      item.displayName = item.name.replace(/^.*? /, "");
    } else {
      item.displayName = item.name;
    }
  });
  voicesEle.innerHTML = "";
  voices.forEach((voice, i) => {
    let option = document.createElement("option");
    option.value = i;
    option.text = voice.displayName;
    voicesEle.options.add(option);
  });
  voicesEle.onchange = () => {
    voiceRole[voiceType] = voices[voicesEle.value];
    localStorage.setItem("voice" + voiceType, voiceRole[voiceType].name);
    if (voiceRole[voiceType].StyleList || voiceRole[voiceType].RolePlayList) {
      document.getElementById("azureExtra").style.display = "block";
      let voiceStyles = voiceRole[voiceType].StyleList;
      let voiceRoles = voiceRole[voiceType].RolePlayList;
      if (voiceRoles) {
        preSetVoiceRole.innerHTML = "";
        voiceRoles.forEach((role, i) => {
          let option = document.createElement("option");
          option.value = role;
          option.text = role;
          preSetVoiceRole.options.add(option);
        });
        let localRole = localStorage.getItem("azureRole" + voiceType);
        if (localRole && voiceRoles.indexOf(localRole) !== -1) {
          preSetVoiceRole.value = localRole;
          azureRole[voiceType] = localRole;
        } else {
          preSetVoiceRole.selectedIndex = 0;
          azureRole[voiceType] = voiceRole[0];
        }
        preSetVoiceRole.onchange = () => {
          azureRole[voiceType] = preSetVoiceRole.value;
          localStorage.setItem("azureRole" + voiceType, preSetVoiceRole.value);
        }
        preSetVoiceRole.dispatchEvent(new Event("change"));
      } else {
        azureRole[voiceType] = void 0;
        localStorage.removeItem("azureRole" + voiceType);
      }
      preSetVoiceRole.style.display = voiceRoles ? "block" : "none";
      preSetVoiceRole.previousElementSibling.style.display = voiceRoles ? "block" : "none";
      if (voiceStyles) {
        preSetVoiceStyle.innerHTML = "";
        voiceStyles.forEach((style, i) => {
          let option = document.createElement("option");
          option.value = style;
          option.text = style;
          preSetVoiceStyle.options.add(option);
        });
        let localStyle = localStorage.getItem("azureStyle" + voiceType);
        if (localStyle && voiceStyles.indexOf(localStyle) !== -1) {
          preSetVoiceStyle.value = localStyle;
          azureStyle[voiceType] = localStyle;
        } else {
          preSetVoiceStyle.selectedIndex = 0;
          azureStyle[voiceType] = voiceStyles[0];
        }
        preSetVoiceStyle.onchange = () => {
          azureStyle[voiceType] = preSetVoiceStyle.value;
          localStorage.setItem("azureStyle" + voiceType, preSetVoiceStyle.value)
        }
        preSetVoiceStyle.dispatchEvent(new Event("change"));
      } else {
        azureStyle[voiceType] = void 0;
        localStorage.removeItem("azureStyle" + voiceType);
      }
      preSetVoiceStyle.style.display = voiceStyles ? "block" : "none";
      preSetVoiceStyle.previousElementSibling.style.display = voiceStyles ? "block" : "none";
    } else {
      document.getElementById("azureExtra").style.display = "none";
      azureRole[voiceType] = void 0;
      localStorage.removeItem("azureRole" + voiceType);
      azureStyle[voiceType] = void 0;
      localStorage.removeItem("azureStyle" + voiceType);
    }
  };
  const loadAnother = (type) => {
    type = type ^ 1;
    let localVoice = localStorage.getItem("voice" + type);
    if (localVoice) {
      let localIndex = voices.findIndex(item => { return item.name === localVoice });
      if (localIndex === -1) localIndex = 0;
      voiceRole[type] = voices[localIndex];
    } else {
      voiceRole[type] = voices[0];
    }
    if (existVoice === 3) {
      let localStyle = localStorage.getItem("azureStyle" + type);
      azureStyle[type] = localStyle ? localStyle : void 0;
      let localRole = localStorage.getItem("azureRole" + type);
      azureRole[type] = localRole ? localRole : void 0;
    }
  }
  const voiceChange = () => {
    let localVoice = localStorage.getItem("voice" + voiceType);
    if (localVoice) {
      let localIndex = voices.findIndex(item => { return item.name === localVoice });
      if (localIndex === -1) localIndex = 0;
      voiceRole[voiceType] = voices[localIndex];
      voicesEle.value = localIndex;
    } else {
      voiceRole[voiceType] = voices[0];
    }
    voicesEle.dispatchEvent(new Event("change"));
  }
  voiceChange();
  loadAnother(voiceType);
  let volumeEle = document.getElementById("voiceVolume");
  let localVolume = localStorage.getItem("voiceVolume0");
  voiceVolume[0] = parseFloat(localVolume || volumeEle.getAttribute("value"));
  const voiceVolumeChange = () => {
    let localVolume = localStorage.getItem("voiceVolume" + voiceType);
    volumeEle.value = voiceVolume[voiceType] = parseFloat(localVolume || volumeEle.getAttribute("value"));
    volumeEle.style.backgroundSize = (volumeEle.value - volumeEle.min) * 100 / (volumeEle.max - volumeEle.min) + "% 100%";
  }
  volumeEle.oninput = () => {
    volumeEle.style.backgroundSize = (volumeEle.value - volumeEle.min) * 100 / (volumeEle.max - volumeEle.min) + "% 100%";
    voiceVolume[voiceType] = parseFloat(volumeEle.value);
    localStorage.setItem("voiceVolume" + voiceType, volumeEle.value);
  }
  voiceVolumeChange();
  let rateEle = document.getElementById("voiceRate");
  let localRate = localStorage.getItem("voiceRate0");
  voiceRate[0] = parseFloat(localRate || rateEle.getAttribute("value"));
  const voiceRateChange = () => {
    let localRate = localStorage.getItem("voiceRate" + voiceType);
    rateEle.value = voiceRate[voiceType] = parseFloat(localRate || rateEle.getAttribute("value"));
    rateEle.style.backgroundSize = (rateEle.value - rateEle.min) * 100 / (rateEle.max - rateEle.min) + "% 100%";
  }
  rateEle.oninput = () => {
    rateEle.style.backgroundSize = (rateEle.value - rateEle.min) * 100 / (rateEle.max - rateEle.min) + "% 100%";
    voiceRate[voiceType] = parseFloat(rateEle.value);
    localStorage.setItem("voiceRate" + voiceType, rateEle.value);
  }
  voiceRateChange();
  let pitchEle = document.getElementById("voicePitch");
  let localPitch = localStorage.getItem("voicePitch0");
  voicePitch[0] = parseFloat(localPitch || pitchEle.getAttribute("value"));
  const voicePitchChange = () => {
    let localPitch = localStorage.getItem("voicePitch" + voiceType);
    pitchEle.value = voicePitch[voiceType] = parseFloat(localPitch || pitchEle.getAttribute("value"));
    pitchEle.style.backgroundSize = (pitchEle.value - pitchEle.min) * 100 / (pitchEle.max - pitchEle.min) + "% 100%";
  }
  pitchEle.oninput = () => {
    pitchEle.style.backgroundSize = (pitchEle.value - pitchEle.min) * 100 / (pitchEle.max - pitchEle.min) + "% 100%";
    voicePitch[voiceType] = parseFloat(pitchEle.value);
    localStorage.setItem("voicePitch" + voiceType, pitchEle.value);
  }
  voicePitchChange();
  document.getElementById("voiceTypes").onclick = (ev) => {
    let type = ev.target.dataset.type;
    if (type !== void 0) {
      type = parseInt(type);
      if (type != voiceType) {
        voiceType = type;
        ev.target.classList.add("selVoiceType");
        ev.target.parentElement.children[type ^ 1].classList.remove("selVoiceType");
        voiceChange();
        voiceVolumeChange();
        voiceRateChange();
        voicePitchChange();
      }
    };
  };
  const voiceTestEle = document.getElementById("testVoiceText");
  let localTestVoice = localStorage.getItem("voiceTestText");
  voiceTestText = voiceTestEle.value = localTestVoice || voiceTestEle.getAttribute("value");
  voiceTestEle.oninput = () => {
    voiceTestText = voiceTestEle.value;
    localStorage.setItem("voiceTestText", voiceTestText);
  }
  const contVoiceEle = document.getElementById("enableContVoice");
  let localCont = localStorage.getItem("enableContVoice");
  contVoiceEle.checked = enableContVoice = (localCont || contVoiceEle.getAttribute("checked")) === "true";
  contVoiceEle.onchange = () => {
    enableContVoice = contVoiceEle.checked;
    localStorage.setItem("enableContVoice", enableContVoice);
  }
  contVoiceEle.dispatchEvent(new Event("change"));
  const autoVoiceEle = document.getElementById("enableAutoVoice");
  let localAuto = localStorage.getItem("enableAutoVoice");
  autoVoiceEle.checked = enableAutoVoice = (localAuto || autoVoiceEle.getAttribute("checked")) === "true";
  autoVoiceEle.onchange = () => {
    enableAutoVoice = autoVoiceEle.checked;
    localStorage.setItem("enableAutoVoice", enableAutoVoice);
  }
  autoVoiceEle.dispatchEvent(new Event("change"));
};
speechServiceEle.dispatchEvent(new Event("change"));