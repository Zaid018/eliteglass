! function(t) {
    "use strict";

    function n(t, n) {
        let e;
        return (...i) => {
            clearTimeout(e), e = setTimeout((() => {
                t(...i)
            }), n)
        }
    }
    class e {
        constructor() {
            this.callbacks = [], window.addEventListener("DOMContentLoaded", (() => this.onDOMContentLoaded()))
        }
        onDOMContentLoaded() {
            this.callbacks.sort(((t, n) => t.priority - n.priority)).forEach((({
                callback: t
            }) => t()))
        }
        runOnLoad(t) {
            "loading" === document.readyState ? this.callbacks.push(t) : t.callback()
        }
    }
    class i {
        constructor(t) {
            this.items = [], this.previousWidth = document.documentElement.clientWidth, this.previousHeight = window.innerHeight;
            const n = t((() => this.onWindowResize()), 100);
            window.addEventListener("resize", n)
        }
        onWindowResize() {
            const t = document.documentElement.clientWidth,
                n = window.innerHeight,
                e = this.previousWidth !== t,
                i = this.previousHeight !== n;
            this.items.forEach((t => {
                const n = () => {
                    t.callback(), t.executed = !0
                };
                (!t.executed || e && t.options.runOnWidthChange || i && t.options.runOnHeightChange) && n()
            })), this.previousWidth = t, this.previousHeight = n
        }
        runOnResize(t, n) {
            this.items.push({
                callback: t,
                options: n,
                executed: n.runOnLoad
            }), this.items.sort(((t, n) => t.options.priority - n.options.priority)), n.runOnLoad && function(t, n = Number.MAX_VALUE) {
                var i;
                (window.canva_scriptExecutor = null !== (i = window.canva_scriptExecutor) && void 0 !== i ? i : new e).runOnLoad({
                    callback: t,
                    priority: n
                })
            }(t, n.priority)
        }
    }

    function s(t) {
        return t * Math.PI / 180
    }

    function o(t) {
        return 180 * t / Math.PI
    }
    class r {
        constructor(t, n) {
            this.x = t, this.y = n
        }
    }
    class a {
        constructor(t, n, e, i, s, o, r) {
            this.s = t, this.t11 = n, this.t12 = e, this.t13 = i, this.t21 = s, this.t22 = o, this.t23 = r
        }
        static translate(t, n) {
            return new a(1, 1, 0, t, 0, 1, n)
        }
        static scale(t) {
            return new a(t, t, 0, 0, 0, t, 0)
        }
        static scaleAround(t, n) {
            return a.translate(-t.x, -t.y).then(a.scale(n)).then(a.translate(t.x, t.y))
        }
        static rotate(t) {
            let n = Math.cos(t),
                e = Math.sin(t);
            return 1 === Math.abs(n) ? e = 0 : 1 === Math.abs(e) && (n = 0), new a(1, n, -e, 0, e, n, 0)
        }
        static rotateAround(t, n) {
            return a.translate(-t.x, -t.y).then(a.rotate(n)).then(a.translate(t.x, t.y))
        }
        rotation() {
            return Math.atan2(+this.t21, +this.t11)
        }
        scale() {
            return this.s
        }
        multiply(t) {
            const n = this.s * t.s,
                e = this.t11 * t.t11 + this.t12 * t.t21,
                i = this.t11 * t.t12 + this.t12 * t.t22,
                s = this.t11 * t.t13 + this.t12 * t.t23 + this.t13,
                o = this.t21 * t.t11 + this.t22 * t.t21,
                r = this.t21 * t.t12 + this.t22 * t.t22,
                h = this.t21 * t.t13 + this.t22 * t.t23 + this.t23;
            return new a(n, e, i, s, o, r, h)
        }
        then(t) {
            return t.multiply(this)
        }
        transformPoint(t) {
            return {
                x: this.t11 * t.x + this.t12 * t.y + this.t13,
                y: this.t21 * t.x + this.t22 * t.y + this.t23
            }
        }
    }
    class h {
        constructor(t, n, e, i, s = 0) {
            this.top = t, this.left = n, this.height = e, this.width = i, this.rotation = s
        }
        static fromCenterBox({
            center: t,
            width: n,
            height: e,
            rotation: i
        }) {
            return new h(t.y - e / 2, t.x - n / 2, e, n, i)
        }
        growAroundToContainPoints(t, n, e = 1e-10) {
            const i = this.scaleAroundToContain(t, n, e);
            return this.transform(a.scaleAround(t, i))
        }
        scaleAroundToContain(t, n, e) {
            const i = a.translate(-t.x, -t.y).then(a.rotate(s(-this.rotation))),
                [o, , , r] = this.corners(),
                [h, c] = [i.transformPoint(o), i.transformPoint(r)],
                u = h.x,
                l = h.y,
                d = c.x,
                w = c.y;
            let m = 0,
                p = 0,
                f = 0,
                g = 0;
            for (const t of n) {
                const n = i.transformPoint(t);
                m = Math.min(m, n.x), f = Math.min(f, n.y), p = Math.max(p, n.x), g = Math.max(g, n.y)
            }
            let x = 0;
            return m < -e && (x = Math.max(x, m / u)), f < -e && (x = Math.max(x, f / l)), p > e && (x = Math.max(x, p / d)), g > e && (x = Math.max(x, g / w)), x
        }
        center() {
            return new r(this.left + this.width / 2, this.top + this.height / 2)
        }
        corners() {
            const t = this.left,
                n = this.top,
                e = this.left + this.width,
                i = this.top + this.height;
            if (0 === this.rotation) return [new r(t, n), new r(e, n), new r(t, i), new r(e, i)]; {
                const o = a.rotateAround(this.center(), s(this.rotation));
                return [o.transformPoint(new r(t, n)), o.transformPoint(new r(e, n)), o.transformPoint(new r(t, i)), o.transformPoint(new r(e, i))]
            }
        }
        fromCssBasis() {
            const t = this.center();
            return a.translate(-t.x + this.left, -t.y + this.top).then(a.rotate(s(this.rotation))).then(a.translate(t.x, t.y))
        }
        transform(t) {
            const n = t.transformPoint(this.center()),
                e = t.scale(),
                i = this.width * e,
                s = this.height * e,
                r = this.rotation + o(t.rotation());
            return h.fromCenterBox({
                center: n,
                width: i,
                height: s,
                rotation: r
            })
        }
    }

    function c(t) {
        const {
            containerWidth: n,
            containerHeight: e
        } = t.dataset;
        if (!n || !e) return;
        const i = new h(0, 0, parseFloat(e), parseFloat(n)),
            {
                imageboxWidth: s,
                imageboxHeight: o,
                imageboxTop: r,
                imageboxLeft: c,
                imageboxRotation: u
            } = t.dataset;
        if (!(s && o && r && c && u)) return;
        const l = new h(parseFloat(r), parseFloat(c), parseFloat(o), parseFloat(s), parseFloat(u)),
            {
                width: d,
                height: w
            } = t.parentElement.getBoundingClientRect(),
            m = {
                x: d / 2,
                y: w / 2
            },
            p = l.top / i.height,
            f = l.left / i.width,
            g = l.height / i.height,
            x = l.width / i.width,
            y = new h(p * w, f * d, g * w, x * d, l.rotation).corners(),
            M = a.translate(m.x - i.width / 2, m.y - i.height / 2),
            b = l.transform(i.fromCssBasis()).transform(M).growAroundToContainPoints(m, y);
        t.style.top = `${b.top}px`, t.style.left = `${b.left}px`, t.style.width = `${b.width}px`, t.style.height = `${b.height}px`
    }(function(t, e, s = n) {
        var o;
        (window.canva_debounceResize = null !== (o = window.canva_debounceResize) && void 0 !== o ? o : new i(s)).runOnResize(t, {
            runOnLoad: !1,
            runOnWidthChange: !0,
            runOnHeightChange: !1,
            priority: Number.MAX_VALUE,
            ...e
        })
    })((function() {
        Array.from(document.querySelectorAll(".scale_rotated_fill")).forEach(c)
    }), {
        runOnLoad: !0,
        runOnHeightChange: !0
    }), t.degreesToRadians = s, t.radiansToDegrees = o, t.scaleRotatedFill = c, Object.defineProperty(t, "__esModule", {
        value: !0
    })
}({});