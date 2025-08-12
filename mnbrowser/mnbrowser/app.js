(function(e) {
    function t(t) {
        for (var l, s, i = t[0], r = t[1], a = t[2], m = 0, b = []; m < i.length; m++)
            s = i[m],
            Object.prototype.hasOwnProperty.call(c, s) && c[s] && b.push(c[s][0]),
            c[s] = 0;
        for (l in r)
            Object.prototype.hasOwnProperty.call(r, l) && (e[l] = r[l]);
        u && u(t);
        while (b.length)
            b.shift()();
        return o.push.apply(o, a || []),
        n()
    }
    function n() {
        for (var e, t = 0; t < o.length; t++) {
            for (var n = o[t], l = !0, i = 1; i < n.length; i++) {
                var r = n[i];
                0 !== c[r] && (l = !1)
            }
            l && (o.splice(t--, 1),
            e = s(s.s = n[0]))
        }
        return e
    }
    var l = {}
      , c = {
        app: 0
    }
      , o = [];
    function s(t) {
        if (l[t])
            return l[t].exports;
        var n = l[t] = {
            i: t,
            l: !1,
            exports: {}
        };
        return e[t].call(n.exports, n, n.exports, s),
        n.l = !0,
        n.exports
    }
    s.m = e,
    s.c = l,
    s.d = function(e, t, n) {
        s.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: n
        })
    }
    ,
    s.r = function(e) {
        "undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    s.t = function(e, t) {
        if (1 & t && (e = s(e)),
        8 & t)
            return e;
        if (4 & t && "object" === typeof e && e && e.__esModule)
            return e;
        var n = Object.create(null);
        if (s.r(n),
        Object.defineProperty(n, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var l in e)
                s.d(n, l, function(t) {
                    return e[t]
                }
                .bind(null, l));
        return n
    }
    ,
    s.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e["default"]
        }
        : function() {
            return e
        }
        ;
        return s.d(t, "a", t),
        t
    }
    ,
    s.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    s.p = "";
    var i = window["webpackJsonp"] = window["webpackJsonp"] || []
      , r = i.push.bind(i);
    i.push = t,
    i = i.slice();
    for (var a = 0; a < i.length; a++)
        t(i[a]);
    var u = r;
    o.push([0, "chunk-vendors"]),
    n()
}
)({
    0: function(e, t, n) {
        e.exports = n("56d7")
    },
    "08b7": function(e, t, n) {},
    "1ef1": function(e, t, n) {},
    "2b0f": function(e, t, n) {
        "use strict";
        n("74a0")
    },
    "56d7": function(e, t, n) {
        "use strict";
        n.r(t);
        var l = n("89b0");
        const c = {
            key: 0,
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            style: {
                fill: "rgba(112, 112, 112, 0.5)"
            }
        }
          , o = Object(l["f"])("path", {
            d: "M6 21v-3H3v-2h5v5zm10 0v-5h5v2h-3v3zM3 8V6h3V3h2v5zm13 0V3h2v3h3v2z"
        }, null, -1)
          , s = [o]
          , i = {
            key: 1,
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            style: {
                fill: "#ffffff"
            }
        }
          , r = Object(l["f"])("path", {
            d: "M3 21v-5h2v3h3v2zm13 0v-2h3v-3h2v5zM3 8V3h5v2H5v3zm16 0V5h-3V3h5v5z"
        }, null, -1)
          , a = [r]
          , u = {
            key: 0,
            ref: "fullScreenElement",
            style: {
                position: "fixed",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0"
            }
        }
          , m = Object(l["f"])("h1", null, "全屏模式", -1)
          , b = [m]
          , d = {
            class: "bg"
        }
          , h = {
            key: 0,
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "#ffffff"
        }
          , f = Object(l["f"])("path", {
            d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z"
        }, null, -1)
          , p = [f]
          , g = {
            key: 1,
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "#ffffff"
        }
          , O = Object(l["f"])("path", {
            d: "M6 4l15 8-15 8z"
        }, null, -1)
          , j = Object(l["f"])("path", {
            d: "M0 0h24v24H0z",
            fill: "none"
        }, null, -1)
          , v = [O, j]
          , w = {
            class: "set_box_inner"
        }
          , y = Object(l["f"])("div", {
            class: "setName"
        }, "小时格式:", -1)
          , x = {
            class: "pickItem"
        }
          , S = Object(l["f"])("div", {
            class: "setName"
        }, "缩放比例:", -1)
          , T = {
            style: {
                width: "32px",
                "padding-left": "8px"
            }
        }
          , k = Object(l["f"])("div", {
            class: "setName"
        }, "亮度调节:", -1)
          , _ = {
            style: {
                width: "32px",
                "padding-left": "8px"
            }
        }
          , F = Object(l["f"])("div", {
            class: "setName"
        }, "显示:", -1)
          , V = Object(l["f"])("span", null, "背景", -1)
          , C = Object(l["f"])("span", null, "秒", -1)
          , M = Object(l["f"])("div", {
            class: "setName"
        }, "正计时:", -1)
          , B = Object(l["f"])("div", {
            class: "setName"
        }, "倒计时:", -1)
          , z = Object(l["f"])("span", {
            class: "iconTime"
        }, null, -1)
          , R = Object(l["f"])("span", {
            style: {
                "vertical-align": "middle"
            }
        }, "5m", -1)
          , H = [z, R]
          , q = Object(l["f"])("span", {
            class: "iconTime"
        }, null, -1)
          , I = Object(l["f"])("span", {
            style: {
                "vertical-align": "middle"
            }
        }, "10m", -1)
          , N = [q, I]
          , A = Object(l["f"])("span", {
            class: "iconTomato"
        }, null, -1)
          , D = Object(l["f"])("span", {
            style: {
                "vertical-align": "middle"
            }
        }, "25m", -1)
          , E = [A, D]
          , P = Object(l["f"])("span", {
            class: "iconCancel"
        }, null, -1)
          , W = Object(l["f"])("span", {
            style: {
                "vertical-align": "middle"
            }
        }, "关闭", -1)
          , L = [P, W]
          , U = Object(l["f"])("div", {
            class: "setName"
        }, "自定义:", -1)
          , J = Object(l["f"])("footer", {
            style: {
                position: "relative",
                margin: "-2px 20px 0px"
            }
        }, [Object(l["f"])("a", {
            href: "https://flipflow.neverup.cn/guide/help.html",
            target: "_blank",
            style: {
                color: "#666",
                "text-decoration": "none",
                "font-size": "15px"
            }
        }, " 帮助文档 "), Object(l["f"])("span", {
            style: {
                position: "absolute",
                right: "0",
                color: "#fff"
            }
        })], -1);
        function X(e, t, n, o, r, m) {
            const f = Object(l["q"])("clock")
              , O = Object(l["q"])("slider")
              , j = Object(l["q"])("timePicker")
              , z = Object(l["q"])("setbox");
            return Object(l["l"])(),
            Object(l["e"])(l["a"], null, [Object(l["f"])("div", null, [Object(l["f"])("button"), r.isFullScreen ? (Object(l["l"])(),
            Object(l["e"])("div", u, b, 512)) : Object(l["d"])("", !0)]), Object(l["f"])("div", d, [Object(l["f"])("div", {
                class: "timer",
                style: Object(l["i"])({
                    transform: "translateY(-50%) scale(" + e.scale / 100 + ")",
                    filter: "brightness(" + e.brightness / 100 + ")"
                })
            }, [Object(l["g"])(f, {
                class: Object(l["h"])([e.showSecond ? "timer_hms" : "timer_hm"]),
                cid: "clock_h",
                msg: e.num_h,
                ampm: 0 === e.hourFormat,
                bg: e.showBg
            }, null, 8, ["class", "msg", "ampm", "bg"]), Object(l["g"])(f, {
                class: Object(l["h"])([e.showSecond ? "timer_hms" : "timer_hm"]),
                cid: "clock_m",
                msg: e.num_m,
                bg: e.showBg
            }, null, 8, ["class", "msg", "bg"]), e.showSecond ? (Object(l["l"])(),
            Object(l["c"])(f, {
                key: 0,
                class: Object(l["h"])([e.showSecond ? "timer_hms" : "timer_hm"]),
                cid: "clock_s",
                msg: e.num_s,
                bg: e.showBg
            }, null, 8, ["class", "msg", "bg"])) : Object(l["d"])("", !0)], 4), Object(l["x"])(Object(l["f"])("div", {
                class: "watchBtn",
                onClick: t[2] || (t[2] = (...e)=>o.startStop && o.startStop(...e))
            }, [Object(l["f"])("div", null, [e.watching ? (Object(l["l"])(),
            Object(l["e"])("svg", h, p)) : (Object(l["l"])(),
            Object(l["e"])("svg", g, v))]), Object(l["f"])("button", {
                class: "timerBtnplus",
                onClick: t[1] || (t[1] = (...e)=>o.cancelTimer && o.cancelTimer(...e))
            })], 512), [[l["u"], e.timeMode > 0]]), Object(l["g"])(z, {
                class: "set_box",
                ref: "setRef",
                onCloseSet: o.saveSet
            }, {
                default: Object(l["w"])(()=>[Object(l["f"])("ul", w, [Object(l["f"])("li", null, [y, Object(l["f"])("ul", x, [Object(l["f"])("li", {
                    onClick: t[3] || (t[3] = t=>e.hourFormat = 0),
                    onTouchstart: t[4] || (t[4] = t=>e.hourFormat = 0),
                    class: Object(l["h"])({
                        "pick-active": 0 === e.hourFormat
                    })
                }, "12h ", 34), Object(l["f"])("li", {
                    onClick: t[5] || (t[5] = t=>e.hourFormat = 1),
                    onTouchstart: t[6] || (t[6] = t=>e.hourFormat = 1),
                    class: Object(l["h"])({
                        "pick-active": 1 === e.hourFormat
                    })
                }, "24h ", 34), Object(l["f"])("li", {
                    onClick: t[7] || (t[7] = t=>e.hourFormat = 2),
                    onTouchstart: t[8] || (t[8] = t=>e.hourFormat = 2),
                    class: Object(l["h"])({
                        "pick-active": 2 === e.hourFormat
                    })
                }, "024h ", 34)])]), Object(l["f"])("li", null, [S, Object(l["g"])(O, {
                    modelValue: e.scale,
                    "onUpdate:modelValue": t[9] || (t[9] = t=>e.scale = t)
                }, null, 8, ["modelValue"]), Object(l["f"])("div", T, Object(l["r"])(e.scale), 1)]), Object(l["f"])("li", null, [k, Object(l["g"])(O, {
                    modelValue: e.brightness,
                    "onUpdate:modelValue": t[10] || (t[10] = t=>e.brightness = t)
                }, null, 8, ["modelValue"]), Object(l["f"])("div", _, Object(l["r"])(e.brightness), 1)]), Object(l["f"])("li", null, [F, Object(l["f"])("div", {
                    onClick: t[12] || (t[12] = t=>e.showBg = !e.showBg),
                    onTouchstart: t[13] || (t[13] = t=>e.showBg = !e.showBg),
                    style: {
                        "margin-right": "12px",
                        cursor: "pointer"
                    }
                }, [Object(l["x"])(Object(l["f"])("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": t[11] || (t[11] = t=>e.showBg = t),
                    style: {
                        margin: "0",
                        "vertical-align": "middle",
                        width: "18px",
                        height: "18px",
                        cursor: "pointer"
                    }
                }, null, 512), [[l["t"], e.showBg]]), V], 32), Object(l["f"])("div", {
                    onClick: t[15] || (t[15] = t=>e.showSecond = !e.showSecond),
                    onTouchstart: t[16] || (t[16] = t=>e.showSecond = !e.showSecond),
                    style: {
                        cursor: "pointer"
                    }
                }, [Object(l["x"])(Object(l["f"])("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": t[14] || (t[14] = t=>e.showSecond = t),
                    style: {
                        margin: "0",
                        "vertical-align": "middle",
                        width: "18px",
                        height: "18px",
                        cursor: "pointer"
                    }
                }, null, 512), [[l["t"], e.showSecond]]), C], 32)]), Object(l["f"])("li", null, [M, Object(l["f"])("button", {
                    class: "timerBtn startBtn",
                    onClick: t[17] || (t[17] = (...e)=>o.stopWatch && o.stopWatch(...e)),
                    onTouchstart: t[18] || (t[18] = (...e)=>o.stopWatch && o.stopWatch(...e))
                }, "开始", 32), Object(l["f"])("button", {
                    class: "timerBtn startBtn",
                    onClick: t[19] || (t[19] = (...e)=>o.cancelWatch && o.cancelWatch(...e)),
                    onTouchstart: t[20] || (t[20] = (...e)=>o.cancelWatch && o.cancelWatch(...e))
                }, "重置", 32)]), Object(l["f"])("li", null, [B, Object(l["f"])("button", {
                    class: "timerBtn",
                    onClick: t[21] || (t[21] = e=>o.getTimer(5)),
                    onTouchstart: t[22] || (t[22] = e=>o.getTimer(5))
                }, H, 32), Object(l["f"])("button", {
                    class: "timerBtn",
                    onClick: t[23] || (t[23] = e=>o.getTimer(10)),
                    onTouchstart: t[24] || (t[24] = e=>o.getTimer(10))
                }, N, 32), Object(l["f"])("button", {
                    class: "timerBtn",
                    onClick: t[25] || (t[25] = e=>o.getTimer(25)),
                    onTouchstart: t[26] || (t[26] = e=>o.getTimer(25))
                }, E, 32), Object(l["f"])("button", {
                    class: "timerBtn",
                    onClick: t[27] || (t[27] = (...e)=>o.cancelTimer && o.cancelTimer(...e)),
                    onTouchstart: t[28] || (t[28] = (...e)=>o.cancelTimer && o.cancelTimer(...e)),
                    style: {
                        "margin-right": "0px"
                    }
                }, L, 32)]), Object(l["f"])("li", null, [U, Object(l["g"])(j, {
                    numRange: 24,
                    modelValue: e.my_h,
                    "onUpdate:modelValue": t[29] || (t[29] = t=>e.my_h = t)
                }, null, 8, ["modelValue"]), Object(l["g"])(j, {
                    numRange: 60,
                    modelValue: e.my_m,
                    "onUpdate:modelValue": t[30] || (t[30] = t=>e.my_m = t)
                }, null, 8, ["modelValue"]), Object(l["g"])(j, {
                    numRange: 60,
                    modelValue: e.my_s,
                    "onUpdate:modelValue": t[31] || (t[31] = t=>e.my_s = t)
                }, null, 8, ["modelValue"]), Object(l["f"])("button", {
                    class: "timerBtn",
                    onClick: t[32] || (t[32] = e=>o.getTimer(0)),
                    onTouchstart: t[33] || (t[33] = e=>o.getTimer(0)),
                    style: {
                        "margin-left": "4px"
                    }
                }, "开始", 32)])]), J]),
                _: 1
            }, 8, ["onCloseSet"])])], 64)
        }
        const G = {
            class: "clock"
        }
          , Y = ["id"];
        function $(e, t, n, c, o, s) {
            return Object(l["l"])(),
            Object(l["e"])("div", G, [Object(l["f"])("canvas", {
                id: n.cid,
                class: "clock_canva",
                width: "800",
                height: "800"
            }, null, 8, Y)])
        }
        const K = (e,t,n,l)=>{
            const c = e / l
              , o = c * c;
            return t + (n - t) * o
        }
          , Q = (e,t,n,l)=>{
            const c = e / l
              , o = -c * c + 2 * c;
            return t + (n - t) * o
        }
          , Z = (e,t,n,l)=>{
            if (e < l / 2)
                return K(e, t, (t + n) / 2, l / 2);
            {
                const c = e - l / 2
                  , o = (t + n) / 2;
                return Q(c, o, n, l / 2)
            }
        }
        ;
        var ee = Z
          , te = {
            props: {
                cid: String,
                msg: {
                    default: "13"
                },
                bg: {
                    default: !0
                },
                ampm: {
                    default: !1
                }
            },
            setup(e) {
                const t = Object(l["m"])({
                    r: 64,
                    fontSize: 660,
                    fontFamily: "Arial",
                    flipping: !1,
                    tempVal: "08",
                    tempAp: "AM",
                    ctx: null,
                    intervalId: null,
                    prevMsg: e.msg,
                    prevAmpm: e.ampm,
                    lastBg: e.bg
                })
                  , n = t=>{
                    const n = {
                        ap: ""
                    };
                    return n.num = t,
                    e.ampm && "number" === typeof t && (t < 13 ? n.ap = "AM" : t < 24 && (n.ap = "PM",
                    n.num -= 12)),
                    n
                }
                  , c = ()=>{
                    const l = document.querySelector("#" + e.cid);
                    if (!l.getContext)
                        return;
                    const c = l.getContext("2d");
                    t.ctx = c,
                    c.translate(0, 400),
                    c.textAlign = "center",
                    c.textBaseline = "middle",
                    c.font = "normal bold " + t.fontSize + "px " + t.fontFamily;
                    const {ap: o, num: s} = n(t.prevMsg);
                    t.tempAp = o,
                    t.tempVal = s,
                    b(s, o, !0),
                    b(s, o, !1)
                }
                  , o = e=>{
                    const n = t.ctx
                      , l = t.r;
                    n.beginPath(),
                    n.moveTo(0, 0),
                    n.lineTo(800, 0),
                    e ? (n.lineTo(800, l - 400),
                    n.quadraticCurveTo(800, -400, 800 - l, -400),
                    n.lineTo(l, -400),
                    n.quadraticCurveTo(0, -400, 0, l - 400)) : (n.lineTo(800, 400 - l),
                    n.quadraticCurveTo(800, 400, 800 - l, 400),
                    n.lineTo(l, 400),
                    n.quadraticCurveTo(0, 400, 0, 400 - l)),
                    n.clip()
                }
                  , s = (e,t,n)=>{
                    const l = e.createLinearGradient(0, -400, 0, 400);
                    return l.addColorStop(0, t),
                    l.addColorStop(1, n),
                    l
                }
                  , i = ()=>{
                    const e = t.ctx;
                    e.fillStyle = s(e, "#161616", "#0c0c0c"),
                    e.fillRect(0, -400, 800, 800)
                }
                  , r = ()=>{
                    const e = t.ctx;
                    e.clearRect(0, -400, 800, 800)
                }
                  , a = e=>{
                    const n = t.ctx
                      , l = 100
                      , c = 264;
                    n.save(),
                    n.font = "normal bold 80px " + t.fontFamily,
                    "AM" === e ? (n.fillStyle = "#bbbbbb",
                    n.fillText(e, l, -c)) : (n.fillStyle = "#b9b9b9",
                    n.fillText(e, l, c)),
                    n.restore()
                }
                  , u = e=>{
                    const n = t.ctx;
                    n.fillStyle = s(n, "#bcbcbc", "#b8b8b8"),
                    n.fillText(e, 400, 0)
                }
                  , m = (e=12)=>{
                    const n = t.ctx;
                    n.fillStyle = "#000000",
                    n.fillRect(0, -e / 2, 800, e)
                }
                  , b = (n,l,c=!0,s=1,b=!1)=>{
                    const d = t.ctx;
                    d.save(),
                    d.scale(1, s),
                    o(c),
                    b || !e.bg ? r() : i(),
                    e.ampm && a(l),
                    u(n),
                    m(),
                    d.restore()
                }
                  , d = (e,l,c)=>{
                    if (t.flipping)
                        return;
                    const {ap: o, num: s} = n(e)
                      , {ap: i, num: r} = n(t.prevMsg)
                      , a = s !== r || o !== i;
                    c !== t.lastBg || t.prevAmpm;
                    t.flipping = !0;
                    const u = (new Date).getTime()
                      , m = 600
                      , d = ()=>{
                        const n = (new Date).getTime()
                          , h = n - u;
                        if (h > m)
                            return t.flipping = !1,
                            t.tempVal = s,
                            t.tempAp = o,
                            b(s, o, !0, 1, !c),
                            b(s, o, !1, 1, !c),
                            t.prevMsg = e,
                            t.prevAmpm = l,
                            void (t.lastBg = c);
                        let f = !0;
                        const p = Math.PI
                          , g = Math.sin(ee(h, -90, 90, m) * p / 180);
                        h < m / 2 ? a && (b(s, o, !0, 1, !c),
                        b(r, i, !0, -g, !c)) : (f && (f = !1,
                        a && b(s, o, !0, 1, !c)),
                        a && (b(r, i, !1, 1, !c),
                        b(s, o, !1, g, !c))),
                        requestAnimationFrame(d)
                    }
                    ;
                    d()
                }
                  , h = ()=>{
                    d(e.msg, e.ampm, e.bg)
                }
                ;
                Object(l["k"])(()=>{
                    c(),
                    t.intervalId = setInterval(h, 1e3),
                    window.addEventListener("focus", h)
                }
                ),
                Object(l["j"])(()=>{
                    clearInterval(t.intervalId),
                    window.removeEventListener("focus", h)
                }
                ),
                Object(l["v"])([()=>e.msg, ()=>e.ampm, ()=>e.bg], e=>{
                    const [t,n,l] = e;
                    d(t, n, l)
                }
                )
            }
        }
          , ne = (n("f372"),
        n("9c21"))
          , le = n.n(ne);
        const ce = le()(te, [["render", $]]);
        var oe = ce;
        const se = {
            class: "setbox"
        }
          , ie = Object(l["f"])("div", {
            class: "pic_set"
        }, null, -1)
          , re = [ie];
        function ae(e, t, n, c, o, s) {
            return Object(l["l"])(),
            Object(l["e"])("div", se, [Object(l["f"])("div", {
                class: "set-warp",
                onMouseleave: t[1] || (t[1] = (...e)=>c.hideSet && c.hideSet(...e))
            }, [Object(l["f"])("div", {
                class: "setting",
                onMouseenter: t[0] || (t[0] = e=>c.isShow = !0)
            }, re, 32)], 32), Object(l["x"])(Object(l["f"])("div", {
                class: "set_item setLoad",
                ref: "setDom",
                onMouseleave: t[2] || (t[2] = (...e)=>c.hideSet && c.hideSet(...e))
            }, [Object(l["p"])(e.$slots, "default")], 544), [[l["u"], c.isShow]])])
        }
        var ue = {
            setup(e, {emit: t}) {
                const n = Object(l["n"])(!1)
                  , c = Object(l["n"])(null)
                  , o = ()=>{
                    n.value = !1,
                    t("closeSet")
                }
                  , s = e=>{
                    e.toElement && c.value !== e.toElement && o()
                }
                ;
                return Object(l["k"])(()=>{
                    c.value.classList.remove("setLoad")
                }
                ),
                {
                    isShow: n,
                    setDom: c,
                    hideSet: s,
                    hidesetF: o
                }
            }
        };
        n("b5a5");
        const me = le()(ue, [["render", ae]]);
        var be = me;
        function de(e, t, n, c, o, s) {
            return Object(l["l"])(),
            Object(l["e"])("div", {
                class: "slider",
                ref: "mySlider",
                style: Object(l["i"])({
                    height: n.barHeight
                }),
                onMousedown: t[0] || (t[0] = (...e)=>c.sliderHandle && c.sliderHandle(...e)),
                onTouchstart: t[1] || (t[1] = (...e)=>c.sliderHandle && c.sliderHandle(...e))
            }, [Object(l["f"])("div", {
                class: "bar-line-right",
                style: Object(l["i"])({
                    width: n.barHeight,
                    height: n.lineHeight
                })
            }, null, 4), Object(l["f"])("div", {
                class: "bar-line",
                style: Object(l["i"])({
                    width: "calc(100% - " + n.barHeight + ")",
                    height: n.lineHeight,
                    "background-size": n.modelValue + "%"
                })
            }, [Object(l["f"])("div", {
                class: "bar-handle",
                style: Object(l["i"])({
                    width: n.barHeight,
                    height: n.barHeight,
                    left: n.modelValue + "%"
                })
            }, null, 4)], 4)], 36)
        }
        var he = {
            props: {
                modelValue: Number,
                barHeight: {
                    default: "20px"
                },
                lineHeight: {
                    default: "4px"
                }
            },
            setup(e, {emit: t}) {
                const n = Object(l["n"])(null)
                  , c = l=>{
                    l.preventDefault();
                    let c = e.barHeight.match(/(\d+)/)[1];
                    c = parseInt(c);
                    const o = n.value
                      , s = o.getBoundingClientRect().left
                      , i = o.offsetWidth
                      , r = e=>{
                        let n = e;
                        const l = i - c;
                        e < 0 ? n = 0 : e > l && (n = l),
                        t("update:modelValue", parseInt(100 * n / l))
                    }
                      , a = e=>{
                        r(e - s - c / 2)
                    }
                    ;
                    "mousedown" === l.type ? (a(l.pageX),
                    document.onmousemove = e=>a(e.pageX),
                    document.onmouseup = ()=>{
                        document.onmousemove = null,
                        document.onmouseup = null
                    }
                    ) : "touchstart" === l.type && (a(l.touches[0].pageX),
                    document.ontouchmove = e=>a(e.touches[0].pageX),
                    document.ontouchend = ()=>{
                        document.ontouchmove = null,
                        document.ontouchend = null
                    }
                    )
                }
                ;
                return {
                    sliderHandle: c,
                    mySlider: n
                }
            }
        };
        n("2b0f");
        const fe = le()(he, [["render", de]]);
        var pe = fe;
        const ge = {
            class: "time-panel-box"
        }
          , Oe = {
            class: "time-panel"
        }
          , je = {
            class: "scroll-box",
            ref: "sb"
        }
          , ve = {
            class: "panel-item"
        };
        function we(e, t, n, c, o, s) {
            return Object(l["l"])(),
            Object(l["e"])("div", ge, [Object(l["f"])("div", Oe, [Object(l["f"])("div", je, [Object(l["f"])("ul", ve, [(Object(l["l"])(!0),
            Object(l["e"])(l["a"], null, Object(l["o"])(e.temp, (e,t)=>(Object(l["l"])(),
            Object(l["e"])("li", {
                key: t
            }, Object(l["r"])(e), 1))), 128))])], 512), Object(l["f"])("div", {
                class: "panel-up",
                onClick: t[0] || (t[0] = e=>c.changeNum(-1))
            }, "︿"), Object(l["f"])("div", {
                class: "panel-down",
                onClick: t[1] || (t[1] = e=>c.changeNum(1))
            }, "﹀")])])
        }
        n("b577");
        var ye = {
            props: {
                modelValue: Number,
                numRange: {
                    default: 12
                }
            },
            setup(e, {emit: t}) {
                const n = Object(l["m"])({
                    val: 0,
                    temp: [],
                    sb: null,
                    timeout: null
                })
                  , c = ()=>{
                    for (let t = 0; t < e.numRange; t++) {
                        const e = t > 9 ? t : "0" + t;
                        n.temp.push(e)
                    }
                }
                ;
                c();
                const o = (e,t=300)=>(n.timeout = null,
                function() {
                    clearTimeout(n.timeout),
                    n.timeout = setTimeout(()=>{
                        e.apply(this, arguments)
                    }
                    , t)
                }
                )
                  , s = e=>{
                    n.timeout && clearTimeout(n.timeout);
                    const l = n.sb
                      , c = l.scrollTop
                      , o = 24
                      , s = n.temp.length;
                    for (let n = s - 1; n >= 0; n--)
                        if (c > o * n - o / 2) {
                            let c = n + e;
                            c < 0 && (c = 0),
                            c > s - 1 && (c = s - 1),
                            l.scrollTop = o * c,
                            t("update:modelValue", c);
                            break
                        }
                }
                  , i = o(()=>{
                    s(0)
                }
                );
                return Object(l["k"])(()=>{
                    n.sb.scrollTop = 24 * e.modelValue,
                    setTimeout(()=>{
                        n.sb.addEventListener("scroll", i)
                    }
                    , 0)
                }
                ),
                {
                    ...Object(l["s"])(n),
                    changeNum: s,
                    comfirmNum: i
                }
            }
        };
        n("834b");
        const xe = le()(ye, [["render", we]]);
        var Se = xe;
        const Te = e=>{
            const t = e.toString();
            return t[1] ? e : "0" + t
        }
          , ke = ()=>{
            const e = new Date
              , t = e.getHours()
              , n = e.getMinutes()
              , l = e.getSeconds();
            return {
                h: t,
                m: n,
                s: l
            }
        }
        ;
        var _e = {
            data() {
                return {
                    isFullScreen: !1
                }
            },
            components: {
                clock: oe,
                setbox: be,
                slider: pe,
                timePicker: Se
            },
            methods: {
                toggleFullScreen() {
                    this.isFullScreen ? this.exitFullScreen() : this.enterFullScreen()
                },
                enterFullScreen() {
                    let e = document.documentElement;
                    e.requestFullscreen ? e.requestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.webkitRequestFullscreen ? e.webkitRequestFullscreen() : e.msRequestFullscreen && e.msRequestFullscreen(),
                    this.isFullScreen = !0
                },
                exitFullScreen() {
                    document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.msExitFullscreen && document.msExitFullscreen(),
                    this.isFullScreen = !1
                }
            },
            setup() {
                const e = Object(l["m"])({
                    setRef: null,
                    num_h: "你",
                    num_m: "好",
                    num_s: "!",
                    hourFormat: 0,
                    scale: 80,
                    brightness: 100,
                    showBg: !0,
                    showSecond: !0,
                    timeMode: 0,
                    tempTime: 0,
                    stopTime: 0,
                    watching: !0,
                    my_h: 0,
                    my_m: 0,
                    my_s: 0,
                    setShow: null
                })
                  , t = t=>e.hourFormat < 2 ? t : Te(t)
                  , n = t=>{
                    e.watching = !0;
                    let n = 0;
                    n = 0 === t ? 1e3 * (3600 * e.my_h + 60 * e.my_m + e.my_s) : 6e4 * t;
                    const l = (new Date).getTime();
                    e.tempTime = l + n,
                    e.timeMode = 1,
                    e.setRef.hidesetF()
                }
                  , c = ()=>{
                    if (e.watching) {
                        const t = (new Date).getTime();
                        let n = e.tempTime - t;
                        return n <= 0 ? {
                            h: "ok",
                            m: "ok",
                            s: "ok"
                        } : (n = parseInt(n / 1e3),
                        {
                            h: parseInt(n / 3600),
                            m: parseInt(n / 60) % 60,
                            s: n % 60
                        })
                    }
                    return {
                        h: e.num_h,
                        m: e.num_m,
                        s: e.num_s
                    }
                }
                  , o = ()=>{
                    e.timeMode = 0,
                    e.setRef.hidesetF()
                }
                  , s = ()=>{
                    e.tempTime = (new Date).getTime(),
                    e.watching = !0,
                    e.timeMode = 2,
                    e.setRef.hidesetF()
                }
                  , i = ()=>{
                    if (e.watching) {
                        const t = (new Date).getTime();
                        let n = t - e.tempTime;
                        return n = parseInt(n / 1e3),
                        {
                            h: parseInt(n / 3600),
                            m: parseInt(n / 60) % 60,
                            s: n % 60
                        }
                    }
                    return {
                        h: e.num_h,
                        m: e.num_m,
                        s: e.num_s
                    }
                }
                  , r = ()=>{
                    e.timeMode = 0,
                    e.setRef.hidesetF()
                }
                  , a = ()=>{
                    const t = document.getElementsByClassName("pic_set")[0];
                    if (t.style.opacity = 1,
                    e.setShow && clearTimeout(e.setShow),
                    e.setShow = setTimeout(()=>{
                        t.style.opacity = ""
                    }
                    , 400),
                    e.watching)
                        e.watching = !1,
                        e.stopTime = (new Date).getTime();
                    else {
                        e.watching = !0;
                        const t = (new Date).getTime();
                        e.tempTime = e.tempTime + t - e.stopTime
                    }
                }
                ;
                setInterval(()=>{
                    let n = {};
                    const l = e.timeMode;
                    0 === l ? n = ke() : 1 === l ? n = c() : 2 === l && (n = i()),
                    e.num_h = t(n.h),
                    e.num_m = Te(n.m),
                    e.num_s = Te(n.s)
                }
                , 200);
                const u = ()=>{
                    const t = ["hourFormat", "scale", "brightness", "showBg", "showSecond", "my_h", "my_m", "my_s"]
                      , n = {};
                    for (const l of t)
                        n[l] = e[l];
                    localStorage.info = JSON.stringify(n)
                }
                  , m = ()=>{
                    if (localStorage.info) {
                        const t = JSON.parse(localStorage.info);
                        for (const n in t)
                            e[n] = t[n]
                    }
                }
                ;
                return m(),
                Object(l["k"])(()=>{
                    document.onkeydown = e=>{
                        32 !== e.keyCode && 13 !== e.keyCode || a()
                    }
                }
                ),
                {
                    ...Object(l["s"])(e),
                    getTimer: n,
                    cancelTimer: o,
                    stopWatch: s,
                    startStop: a,
                    cancelWatch: r,
                    saveSet: u
                }
            }
        };
        n("d25c");
        const Fe = le()(_e, [["render", X]]);
        var Ve = Fe;
        console.log = ()=>{}
        ,
        Object(l["b"])(Ve).mount("#app")
    },
    "74a0": function(e, t, n) {},
    "834b": function(e, t, n) {
        "use strict";
        n("1ef1")
    },
    b5a5: function(e, t, n) {
        "use strict";
        n("c64d")
    },
    b92b: function(e, t, n) {},
    c64d: function(e, t, n) {},
    d25c: function(e, t, n) {
        "use strict";
        n("08b7")
    },
    f372: function(e, t, n) {
        "use strict";
        n("b92b")
    }
});
//# sourceMappingURL=app.916787af.js.map
