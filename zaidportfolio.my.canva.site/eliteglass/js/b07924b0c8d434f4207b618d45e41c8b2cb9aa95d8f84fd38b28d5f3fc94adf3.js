! function() {
    "use strict";

    function e(e, t) {
        let r;
        return (...a) => {
            clearTimeout(r), r = setTimeout((() => {
                e(...a)
            }), t)
        }
    }
    class t {
        constructor() {
            this.callbacks = [], window.addEventListener("DOMContentLoaded", (() => this.onDOMContentLoaded()))
        }
        onDOMContentLoaded() {
            this.callbacks.sort(((e, t) => e.priority - t.priority)).forEach((({
                callback: e
            }) => e()))
        }
        runOnLoad(e) {
            "loading" === document.readyState ? this.callbacks.push(e) : e.callback()
        }
    }

    function r(e, r = Number.MAX_VALUE) {
        var a;
        (window.canva_scriptExecutor = null !== (a = window.canva_scriptExecutor) && void 0 !== a ? a : new t).runOnLoad({
            callback: e,
            priority: r
        })
    }
    class a {
        constructor(e) {
            this.items = [], this.previousWidth = document.documentElement.clientWidth, this.previousHeight = window.innerHeight;
            const t = e((() => this.onWindowResize()), 100);
            window.addEventListener("resize", t)
        }
        onWindowResize() {
            const e = document.documentElement.clientWidth,
                t = window.innerHeight,
                r = this.previousWidth !== e,
                a = this.previousHeight !== t;
            this.items.forEach((e => {
                const t = () => {
                    e.callback(), e.executed = !0
                };
                (!e.executed || r && e.options.runOnWidthChange || a && e.options.runOnHeightChange) && t()
            })), this.previousWidth = e, this.previousHeight = t
        }
        runOnResize(e, t) {
            this.items.push({
                callback: e,
                options: t,
                executed: t.runOnLoad
            }), this.items.sort(((e, t) => e.options.priority - t.options.priority)), t.runOnLoad && r(e, t.priority)
        }
    }

    function i(t, r, i = e) {
        var n;
        (window.canva_debounceResize = null !== (n = window.canva_debounceResize) && void 0 !== n ? n : new a(i)).runOnResize(t, {
            runOnLoad: !1,
            runOnWidthChange: !0,
            runOnHeightChange: !1,
            priority: Number.MAX_VALUE,
            ...r
        })
    }
    class n extends Error {}
    class o extends n {}
    class s extends n {}
    class c extends n {}
    class u extends n {}
    class l extends n {}
    class h extends n {}
    let d = 0;

    function f() {
        return d++
    }
    class g {
        constructor(e) {
            this.geometry = e.geometry, this.shader = e.shader, this.attributes = e.attributes, this.textures = e.textures, this.uniforms = e.uniforms, this.renderTarget = e.renderTarget, this.enableBlend = e.enableBlend
        }
    }
    class m {
        constructor(e) {
            this.resources = new Map, this.create = e, this.backend = this.createBackend()
        }
        createBackend() {
            const e = this.create();
            return e.onContextLost = () => {
                var e;
                null === (e = this.onContextLost) || void 0 === e || e.call(this)
            }, e
        }
        load(e) {
            this.backend.load(e);
            const t = Array.isArray(e) ? e : e.resources;
            for (const e of t) this.resources.set(e.id, e)
        }
        update(e) {
            this.backend.update(e)
        }
        clear(e, t) {
            this.backend.clear(e, t)
        }
        render(e) {
            this.backend.render(e)
        }
        flush() {
            this.backend.flush()
        }
        release(e) {
            this.backend.release(e);
            const t = Array.isArray(e) ? e : e.resources;
            for (const e of t) this.resources.delete(e.id)
        }
        dispose() {
            this.backend.dispose(), this.resources.clear()
        }
        restore() {
            this.backend.dispose(), this.backend = this.createBackend(), this.backend.load(Array.from(this.resources.values()))
        }
        resize(e, t) {
            if (e === this.canvas.width && t === this.canvas.height) return;
            this.backend.resize(e, t);
            const r = Array.from(this.resources.values()).filter((e => "texture" === e.resourceType && !e.source && "relative" === e.size));
            this.backend.update(r)
        }
        get canvas() {
            return this.backend.canvas
        }
    }
    class v {
        constructor(e) {
            this.id = f(), this.resourceType = "shader", this.vertexSource = e.vertexSource, this.fragmentSource = e.fragmentSource
        }
    }
    const b = "preserve",
        p = "fixed";
    class x {
        constructor(e) {
            this.id = f(), this.resourceType = "texture", this.textureType = "image", this.size = p, this.colorFormat = "rgba", this.numberFormat = "u8", this.source = e.source, this.name = e.name, this.alpha = e.alpha || b
        }
        get width() {
            return this.source.width
        }
        get height() {
            return this.source.height
        }
    }
    class w {
        constructor(e) {
            this.id = f(), this.resourceType = "texture", this.textureType = "binary", this.size = p, this.source = e.source, this.name = e.name, this.alpha = e.alpha || b, this.width = e.width, this.height = e.height
        }
        get colorFormat() {
            const e = this.source.length / (this.width * this.height);
            if (3 === e) return "rgb";
            if (4 === e) return "rgba";
            throw new l(`Invalid number of color channels for binary texture with ID: ${this.id}. Number of channels must be 3 (RGB) or 4 (RGBA) but the provided data has ${e} channels.`)
        }
        get numberFormat() {
            return this.source instanceof Uint8Array ? "u8" : "f32"
        }
    }
    class R {
        constructor(e) {
            this.id = f(), this.resourceType = "texture", this.textureType = "render", this.source = null, this.name = e.name, this.alpha = e.alpha || b, this.width = e.width || 0, this.height = e.height || 0, this.size = e.size || p, this.colorFormat = e.colorFormat, this.numberFormat = e.numberFormat
        }
    }

    function T(e, t) {
        const r = e.createBuffer();
        e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, r), e.bufferData(e.ELEMENT_ARRAY_BUFFER, t.indices, e.STATIC_DRAW);
        const a = new Map;
        for (const [r, i] of Object.entries(t.accessors)) {
            const t = e.createBuffer();
            e.bindBuffer(e.ARRAY_BUFFER, t), e.bufferData(e.ARRAY_BUFFER, i.buffer, e.STATIC_DRAW), a.set(r, t)
        }
        return e.bindBuffer(e.ARRAY_BUFFER, null), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, null), {
            indices: r,
            buffers: a
        }
    }
    const y = new Map([
            ["i8", 5120],
            ["i16", 5122],
            ["u8", 5121],
            ["u16", 5123],
            ["f32", 5126]
        ]),
        C = {
            FLOAT: {
                type: "float",
                name: "float",
                length: 1
            },
            VEC2: {
                type: "float",
                name: "vec2",
                length: 2
            },
            VEC3: {
                type: "float",
                name: "vec3",
                length: 3
            },
            VEC4: {
                type: "float",
                name: "vec4",
                length: 4
            }
        },
        E = {
            MAT2: {
                type: "matrix",
                name: "mat2",
                length: 4
            },
            MAT3: {
                type: "matrix",
                name: "mat3",
                length: 9
            },
            MAT4: {
                type: "matrix",
                name: "mat4",
                length: 16
            }
        },
        A = {
            INT: {
                type: "int",
                name: "int",
                length: 1
            },
            IVEC2: {
                type: "int",
                name: "ivec2",
                length: 2
            },
            IVEC3: {
                type: "int",
                name: "ivec3",
                length: 3
            },
            IVEC4: {
                type: "int",
                name: "ivec4",
                length: 4
            },
            SAMPLER2D: {
                type: "int",
                name: "sampler2D",
                length: 1
            }
        },
        F = new Map([
            [5126, C.FLOAT],
            [35664, C.VEC2],
            [35665, C.VEC3],
            [35666, C.VEC4],
            [35674, E.MAT2],
            [35675, E.MAT3],
            [35676, E.MAT4],
            [5124, A.INT],
            [35667, A.IVEC2],
            [35668, A.IVEC3],
            [35669, A.IVEC4],
            [35678, A.SAMPLER2D]
        ]);
    class _ {
        constructor(e, t, r) {
            this.name = e.name, this.location = t;
            const a = F.get(e.type);
            if (!a) throw new l(`Type of uniform '${e.name}' is not supported.`);
            this.meta = a, this._data = this.parseData(r)
        }
        parseData(e) {
            if (!e) return new Array(this.meta.length).fill(0);
            if (e.length !== this.meta.length) throw new l(`Could not set uniform '${this.meta.type} ${this.name}'. Expected data with a length of ${this.meta.length} but your data has a length of ${e.length}.`);
            return e
        }
        equals(e) {
            const t = this._data,
                r = e;
            if (t.length !== r.length) return !1;
            for (let e = 0; e < t.length; e++)
                if (t[e] !== r[e]) return !1;
            return !0
        }
        get data() {
            return this._data
        }
        set data(e) {
            this._data = this.parseData(e)
        }
    }

    function D(e, t) {
        const {
            meta: r,
            name: a,
            location: i,
            data: n
        } = t;
        if ("int" === r.type) switch (r.length) {
            case 1:
                e.uniform1iv(i, n);
                break;
            case 2:
                e.uniform2iv(i, n);
                break;
            case 3:
                e.uniform3iv(i, n);
                break;
            case 4:
                e.uniform4iv(i, n);
                break;
            default:
                throw new l(`Could not set the value for uniform '${a}'. Make sure its length is between 1 and 4 (inclusive).`)
        } else if ("float" === r.type) switch (r.length) {
            case 1:
                e.uniform1fv(i, n);
                break;
            case 2:
                e.uniform2fv(i, n);
                break;
            case 3:
                e.uniform3fv(i, n);
                break;
            case 4:
                e.uniform4fv(i, n);
                break;
            default:
                throw new l(`Could not set the value for uniform '${a}'. Make sure its length is between 1 and 4 (inclusive).`)
        } else switch (r.length) {
            case 4:
                e.uniformMatrix2fv(i, !1, n);
                break;
            case 9:
                e.uniformMatrix3fv(i, !1, n);
                break;
            case 16:
                e.uniformMatrix4fv(i, !1, n);
                break;
            default:
                throw new l(`Could not set the value for uniform '${a}'. Make sure its length is between 2 and 4 (inclusive).`)
        }
    }

    function B(e, t, r) {
        (function(e) {
            const t = e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT);
            if (!t) return !1;
            return t.precision > 10
        })(e) && (r = function(e) {
            return e.replace("precision mediump float;", "precision highp float;")
        }(r));
        const a = e.createShader(t);
        if (!a) throw new s("Could not create shader");
        e.shaderSource(a, r), e.compileShader(a);
        if (e.getShaderParameter(a, e.COMPILE_STATUS)) return a; {
            const r = e.getShaderInfoLog(a);
            e.deleteShader(a);
            const i = t === e.VERTEX_SHADER ? "vertex" : "fragment";
            throw new o(`Could not compile ${i} shader. Details: ${r}`)
        }
    }

    function M(e, t) {
        const r = function(e, t, r) {
            const a = e.createProgram();
            if (!a) throw new s("Could not create program");
            const i = B(e, e.VERTEX_SHADER, t),
                n = B(e, e.FRAGMENT_SHADER, r);
            if (e.attachShader(a, i), e.attachShader(a, n), e.linkProgram(a), e.deleteShader(i), e.deleteShader(n), e.getProgramParameter(a, e.LINK_STATUS)) return a;
            throw new o(`Could not link program. Details: ${e.getProgramInfoLog(a)}`)
        }(e, t.vertexSource, t.fragmentSource);
        e.useProgram(r);
        const a = e.getProgramParameter(r, e.ACTIVE_ATTRIBUTES),
            i = new Map;
        for (let t = 0; t < a; t++) {
            const a = e.getActiveAttrib(r, t),
                n = a ? e.getAttribLocation(r, a.name) : -1;
            if (!a || -1 === n) throw new h(`Could not cache attribute. Could not find attribute or location at index ${t}. This is likely a bug with the renderer.`);
            const o = F.get(a.type);
            if (!o) throw new l(`Type of attribute '${a.name}' is not supported.`);
            e.enableVertexAttribArray(n), i.set(a.name, {
                location: n,
                meta: o
            })
        }
        const n = e.getProgramParameter(r, e.ACTIVE_UNIFORMS),
            c = new Map,
            u = new Map;
        let d = 0;
        for (let t = 0; t < n; t++) {
            const a = e.getActiveUniform(r, t),
                i = a ? e.getUniformLocation(r, a.name) : null;
            if (!a || !i) throw new h(`Could not cache uniform. Could not find uniform or location at index ${t}. This is likely a bug with the renderer.`);
            if (a.type === e.SAMPLER_2D || a.type === e.SAMPLER_CUBE) {
                const t = new _(a, i, [d]);
                c.set(t.name, t), D(e, t), d++
            } else {
                const t = new _(a, i);
                u.set(t.name, t), D(e, t)
            }
        }
        return e.useProgram(null), {
            program: r,
            attributes: i,
            textures: c,
            uniforms: u
        }
    }

    function P(e, t) {
        return function(e, t) {
            return {
                width: "fixed" === e.size ? e.width || t.width : (e.width || 1) * t.width,
                height: "fixed" === e.size ? e.height || t.height : (e.height || 1) * t.height
            }
        }(t, {
            width: e.drawingBufferWidth,
            height: e.drawingBufferHeight
        })
    }

    function k(e, t, r) {
        if (e instanceof WebGLRenderingContext && "f32" === t.numberFormat && !e.getExtension("OES_texture_float")) throw new u("No support for floating point textures");
        const a = r || e.createTexture();
        if (!a) throw new s(`Could not create WebGLTexture for texture with ID: '${t.id}'.`);
        e.bindTexture(e.TEXTURE_2D, a), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, "premultiply" === t.alpha);
        const i = "rgb" === t.colorFormat ? e.RGB : e.RGBA,
            n = "f32" === t.numberFormat ? e.FLOAT : e.UNSIGNED_BYTE,
            o = "f32" === t.numberFormat ? e.NEAREST : e.LINEAR;
        if ("image" !== t.textureType) {
            let r;
            r = e instanceof WebGLRenderingContext ? i : i === e.RGB ? n === e.FLOAT ? e.RGB32F : e.RGB : n === e.FLOAT ? e.RGBA32F : e.RGBA;
            const {
                width: a,
                height: o
            } = P(e, t);
            e.texImage2D(e.TEXTURE_2D, 0, r, a, o, 0, i, n, t.source)
        } else "tagName" in (c = t.source) && "IMG" === c.tagName && function(e) {
            const t = document.createElement("a");
            return t.href = e, "data:" !== t.protocol && "blob:" !== t.protocol
        }(t.source.src) && !t.source.crossOrigin && console.warn(`Fragl warning: ${t.source.src} image may come from a different origin but you did not set the crossOrigin attribute.`), e.texImage2D(e.TEXTURE_2D, 0, i, i, n, t.source);
        var c;
        return e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, o), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, o), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.bindTexture(e.TEXTURE_2D, null), a
    }
    class I {
        constructor(e, t) {
            var r, a;
            this.geometryCache = new Map, this.shaderCache = new Map, this.textureCache = new Map, this.handleContextLost = () => {
                this.onContextLost && this.onContextLost()
            }, this.container = e, this.env = (null == t ? void 0 : t.env) || window, this.canvas = document.createElement("canvas"), this.container.appendChild(this.canvas), this.canvas.style.width = "100%", this.canvas.style.height = "100%", this.canvas.width = ((null == t ? void 0 : t.width) || this.canvas.clientWidth) * this.env.devicePixelRatio, this.canvas.height = ((null == t ? void 0 : t.height) || this.canvas.clientHeight) * this.env.devicePixelRatio, this.canvas.addEventListener("webglcontextlost", this.handleContextLost, {
                once: !0
            });
            let i = "Unknown";
            const n = e => {
                e.statusMessage && (i = e.statusMessage)
            };
            this.canvas.addEventListener("webglcontextcreationerror", n);
            const o = {
                    alpha: null === (r = null == t ? void 0 : t.alpha) || void 0 === r || r,
                    antialias: null === (a = null == t ? void 0 : t.antialias) || void 0 === a || a,
                    depth: !1,
                    stencil: !1,
                    preserveDrawingBuffer: !!(null == t ? void 0 : t.preserveDrawingBuffer),
                    powerPreference: "high-performance"
                },
                c = (null == t ? void 0 : t.useWebGl2) ? this.canvas.getContext("webgl2", o) : this.canvas.getContext("webgl", o);
            if (this.canvas.removeEventListener("webglcontextcreationerror", n), !c) throw new s(`A WebGL context could not be created. Reason: ${i}`);
            this.gl = c, this.fbo = c.createFramebuffer()
        }
        flush() {
            this.gl.flush()
        }
        resize(e, t) {
            this.canvas.width = (e || this.canvas.clientWidth) * this.env.devicePixelRatio, this.canvas.height = (t || this.canvas.clientHeight) * this.env.devicePixelRatio
        }
        load(e) {
            const t = this.gl,
                r = Array.isArray(e) ? e : e.resources;
            for (const e of r)
                if ("shader" === e.resourceType) {
                    if (this.shaderCache.has(e.id)) continue;
                    this.shaderCache.set(e.id, M(t, e))
                } else if ("geometry" === e.resourceType) {
                if (this.geometryCache.has(e.id)) continue;
                this.geometryCache.set(e.id, T(t, e))
            } else {
                if (this.textureCache.has(e.id)) continue;
                this.textureCache.set(e.id, k(t, e))
            }
        }
        update(e) {
            const t = this.gl,
                r = Array.isArray(e) ? e : e.resources;
            for (const e of r)
                if ("texture" === e.resourceType) {
                    const r = this.textureCache.get(e.id);
                    if (!r) throw new c(`Could not update texture with ID: '${e.id}'. Did you remember to use load()?`);
                    k(t, e, r)
                }
        }
        clear(e, t) {
            const r = this.gl;
            if (t) {
                const e = this.textureCache.get(t.id);
                if (!e) throw new c(`Could not find render target with ID: ${t.id}. Did you remember to use load()?`);
                r.bindFramebuffer(r.FRAMEBUFFER, this.fbo), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, e, 0)
            } else r.bindFramebuffer(r.FRAMEBUFFER, null);
            r.clearColor(...e), r.clear(r.COLOR_BUFFER_BIT)
        }
        render(e) {
            var t, r;
            const a = this.gl,
                i = Array.isArray(e) ? e : e.renderables;
            for (const e of i) {
                const i = this.shaderCache.get(e.shader.id);
                if (!i) throw new c(`Could not find shader with ID: ${e.shader.id}. Did you remember to use load()?`);
                e.enableBlend ? (a.enable(a.BLEND), a.blendFunc(a.ONE, a.ONE_MINUS_SRC_ALPHA)) : a.disable(a.BLEND), a.useProgram(i.program);
                const n = this.geometryCache.get(e.geometry.id);
                if (!n) throw new c(`Could not find geometry with ID: ${e.geometry.id}. Did you remember to use load()?`);
                a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, n.indices);
                const o = !!e.geometry.instances,
                    s = o ? a.getExtension("ANGLE_instanced_arrays") : null;
                if (o && !s) throw new u("Instancing is required but not supported on this device");
                for (const [c, {
                        location: u,
                        meta: l
                    }] of i.attributes.entries()) {
                    const i = e.attributes[c],
                        d = y.get(i.type);
                    if (!d) throw new h(`Could not determine type for attribute ${c}. This is likely a bug with the renderer.`);
                    const f = n.buffers.get(i.name);
                    if (!f) throw new h(`Could not locate geometry buffer "${i.name}. This is likely a bug with the renderer`);
                    a.bindBuffer(a.ARRAY_BUFFER, f), a.vertexAttribPointer(u, l.length, d, null !== (t = i.normalized) && void 0 !== t && t, null !== (r = i.stride) && void 0 !== r ? r : 0, i.offset), o && i.divisor && s.vertexAttribDivisorANGLE(u, i.divisor)
                }
                const d = { ...e.uniforms,
                    ...this.commonUniforms
                };
                for (const [e, t] of i.uniforms.entries()) {
                    const r = d[e];
                    if (!r) throw new l(`Could not find a value for uniform '${e}'. Make sure you provide a value.`);
                    t.equals(r) || (t.data = r, D(a, t))
                }
                for (const [t, r] of i.textures.entries()) {
                    a.activeTexture(a.TEXTURE0 + r.data[0]), a.bindTexture(a.TEXTURE_2D, null);
                    const i = e.textures[t];
                    if (!i) throw new l(`Could not find a texture associated with uniform '${t}'. Make sure you provide a value.`);
                    const n = this.textureCache.get(i.id);
                    if (!n) throw new c(`Could not find texture with ID: ${i.id}. Did you remember to use load()?`);
                    a.bindTexture(a.TEXTURE_2D, n)
                }
                if (e.renderTarget) {
                    const t = this.textureCache.get(e.renderTarget.id);
                    if (!t) throw new c(`Could not find render target with ID: ${e.renderTarget.id}. Did you remember to use load()?`);
                    const {
                        width: r,
                        height: i
                    } = P(a, e.renderTarget);
                    a.bindFramebuffer(a.FRAMEBUFFER, this.fbo), a.framebufferTexture2D(a.FRAMEBUFFER, a.COLOR_ATTACHMENT0, a.TEXTURE_2D, t, 0), a.viewport(0, 0, r, i)
                } else a.bindFramebuffer(a.FRAMEBUFFER, null), a.viewport(0, 0, a.drawingBufferWidth, a.drawingBufferHeight);
                o ? s.drawElementsInstancedANGLE(a.TRIANGLES, e.geometry.indices.length, a.UNSIGNED_SHORT, 0, e.geometry.instances) : a.drawElements(a.TRIANGLES, e.geometry.indices.length, a.UNSIGNED_SHORT, 0)
            }
        }
        release(e) {
            const t = Array.isArray(e) ? e : e.resources;
            for (const e of t) this.deleteResource(e.id, e.resourceType)
        }
        dispose() {
            const e = this.gl;
            for (const e of this.geometryCache.keys()) this.deleteResource(e, "geometry");
            for (const e of this.shaderCache.keys()) this.deleteResource(e, "shader");
            for (const e of this.textureCache.keys()) this.deleteResource(e, "texture");
            this.geometryCache.clear(), this.shaderCache.clear(), this.textureCache.clear(), e.deleteFramebuffer(this.fbo), e.bindBuffer(e.ARRAY_BUFFER, null), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, null), e.bindRenderbuffer(e.RENDERBUFFER, null), e.bindFramebuffer(e.FRAMEBUFFER, null);
            const t = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS);
            for (let r = 0; r < t; r++) e.activeTexture(e.TEXTURE0 + r), e.bindTexture(e.TEXTURE_2D, null), e.bindTexture(e.TEXTURE_CUBE_MAP, null);
            this.canvas.width = this.canvas.height = 0, this.canvas.removeEventListener("webglcontextlost", this.handleContextLost), this.canvas.remove()
        }
        deleteResource(e, t) {
            const r = this.gl;
            if ("shader" === t) {
                const t = this.shaderCache.get(e);
                r.deleteProgram((null == t ? void 0 : t.program) || null), this.shaderCache.delete(e)
            } else if ("geometry" === t) {
                const t = this.geometryCache.get(e) || null;
                if (t) {
                    for (const e of Object.values(t.buffers)) r.bindBuffer(r.ARRAY_BUFFER, e), r.bufferData(r.ARRAY_BUFFER, 1, r.STATIC_DRAW), r.deleteBuffer(e);
                    r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, t.indices), r.bufferData(r.ELEMENT_ARRAY_BUFFER, 1, r.STATIC_DRAW), r.deleteBuffer(t.indices)
                }
                this.geometryCache.delete(e)
            } else {
                const t = this.textureCache.get(e);
                r.deleteTexture(t || null), this.textureCache.delete(e)
            }
        }
        get commonUniforms() {
            return {
                uResolution: [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight],
                uViewSize: [this.canvas.clientWidth, this.canvas.clientHeight],
                uDevicePixelRatio: [this.env.devicePixelRatio]
            }
        }
    }
    const L = "uPrevResult",
        U = new class {
            constructor(e) {
                this.id = f(), this.resourceType = "geometry";
                for (const [t, r] of Object.entries(e.accessors)) r.name = t;
                this.accessors = e.accessors, this.indices = e.indices, this.instances = e.instances
            }
        }({
            accessors: {
                position: {
                    type: "f32",
                    offset: 0,
                    buffer: new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1])
                }
            },
            indices: new Uint16Array([0, 3, 1, 0, 2, 3])
        }),
        S = {
            aPosition: U.accessors.position
        };

    function O(e) {
        return `\nattribute vec2 aPosition;\nvarying vec2 vTexCoord;\n\nvoid main()\n{\n    gl_Position = vec4(aPosition, 0.0, 1.0);\n    vTexCoord = aPosition * 0.5 + 0.5;\n    ${e?"vTexCoord.y = 1.0 - vTexCoord.y;":""}\n}\n  `
    }

    function N(e) {
        return t = e, Array.isArray(t) ? e : [e];
        var t
    }

    function z(e, t, r, a) {
        return new R({
            name: e,
            width: t,
            height: r,
            size: a || "relative",
            colorFormat: "rgba",
            numberFormat: "u8"
        })
    }
    class G {
        constructor(e) {
            this.index = 0, this.buffers = null != e ? e : [new R({
                colorFormat: "rgba",
                numberFormat: "u8"
            }), new R({
                colorFormat: "rgba",
                numberFormat: "u8"
            })]
        }
        currentBuffer() {
            return this.buffers[this.index]
        }
        nextBuffer() {
            return this.index = (this.index + 1) % this.buffers.length, this.buffers[this.index]
        }
    }
    class $ {
        static createPingpongBuffers({
            width: e,
            height: t,
            size: r
        } = {}) {
            return new G([z("bufferA", e, t, r), z("bufferB", e, t, r)])
        }
        constructor(e) {
            var t, r, a, i, n, o, s, c, u;
            if (this.allRenderables = [], this.renderablePassMap = new Map, this.uniforms = {}, this.renderTarget = null === (t = e.options) || void 0 === t ? void 0 : t.renderTarget, e.uniforms)
                for (const [t, r] of Object.entries(e.uniforms)) this.uniforms[t] = N(r);
            const h = [];
            for (let t = 0; t < e.passes.length; t++) {
                const r = e.passes[t];
                "string" == typeof r ? h.push({
                    fragment: r
                }) : h.push(r)
            }
            this.buffers = (null === (r = e.options) || void 0 === r ? void 0 : r.buffers) || $.createPingpongBuffers(null === (a = e.options) || void 0 === a ? void 0 : a.renderTarget);
            const d = new Set;
            for (const e of h)
                if (e.inputs) {
                    for (const t of e.inputs) {
                        if (t === L) throw new l("Your render pass should not define uPrevResult. This will be automatically added.");
                        d.add(t)
                    }
                    e.output && d.add(e.output)
                }
            const f = new Map;
            for (const t of d) f.set(t, z(t, null === (n = null === (i = e.options) || void 0 === i ? void 0 : i.renderTarget) || void 0 === n ? void 0 : n.width, null === (s = null === (o = e.options) || void 0 === o ? void 0 : o.renderTarget) || void 0 === s ? void 0 : s.height, null === (u = null === (c = e.options) || void 0 === c ? void 0 : c.renderTarget) || void 0 === u ? void 0 : u.size));
            this.createRenderables(h, e, f)
        }
        createRenderables(e, t, r) {
            var a;
            e.forEach((e => {
                const a = this.createRenderable(e, t, r);
                this.renderablePassMap.set(a, e), this.allRenderables.push(a)
            })), (null === (a = t.options) || void 0 === a ? void 0 : a.renderTarget) || this.allRenderables.push(new g({
                geometry: U,
                shader: new v({
                    vertexSource: O(!0),
                    fragmentSource: "precision mediump float;\n\nuniform sampler2D uPrevResult;\nvarying vec2 vTexCoord;\n\nvoid main()\n{\n    gl_FragColor = texture2D(uPrevResult, vTexCoord);\n    gl_FragColor.rgb *= gl_FragColor.a;\n}\n  "
                }),
                attributes: S,
                textures: {
                    [L]: this.buffers.currentBuffer()
                },
                uniforms: this.uniforms
            })), this.rewireRenderables(this.allRenderables)
        }
        createRenderable(e, t, r) {
            const a = { ...t.textures
                },
                i = new g({
                    geometry: U,
                    textures: a,
                    attributes: S,
                    uniforms: this.uniforms,
                    shader: new v({
                        vertexSource: O(),
                        fragmentSource: e.fragment
                    })
                });
            if (e.inputs)
                for (const t of e.inputs) {
                    const e = r.get(t);
                    if (!e) throw new l(`Unable to assign texture input. Could not find texture '${t}'.`);
                    a[t] = e
                }
            if (e.output) {
                const t = r.get(e.output);
                if (!t) throw new l(`Unable to assign texture output. Could not find texture '${e.output}'.`);
                i.renderTarget = t
            }
            return i
        }
        update(e) {
            if (e.textures)
                for (const [t, r] of Object.entries(e.textures))
                    if (r)
                        for (const e of this.allRenderables) e.textures[t] = r;
            if (e.uniforms)
                for (const [t, r] of Object.entries(e.uniforms)) this.uniforms[t] && (this.uniforms[t] = N(r))
        }
        get resources() {
            const e = new Set,
                t = new Set,
                r = new Set;
            for (const a of this.allRenderables) {
                e.add(a.geometry), t.add(a.shader);
                for (const e of Object.values(a.textures)) r.add(e);
                a.renderTarget && r.add(a.renderTarget)
            }
            return [...e, ...t, ...r]
        }
        get renderables() {
            const e = Object.fromEntries(Object.entries(this.uniforms).map((([e, t]) => [e, 1 === t.length ? t[0] : t]))),
                t = this.allRenderables.filter((t => {
                    var r;
                    const a = null === (r = this.renderablePassMap.get(t)) || void 0 === r ? void 0 : r.shouldRender;
                    return !a || a(e)
                }));
            return this.rewireRenderables(t), t
        }
        rewireRenderables(e) {
            const t = e => {
                    var t;
                    e.textures.uPrevResult = this.buffers.currentBuffer();
                    (null === (t = this.renderablePassMap.get(e)) || void 0 === t ? void 0 : t.output) || (e.renderTarget = this.buffers.nextBuffer())
                },
                r = e => {
                    e.textures.uPrevResult = this.buffers.currentBuffer(), this.renderTarget && (e.renderTarget = this.renderTarget)
                };
            e.forEach(((a, i) => {
                i === e.length - 1 ? r(a) : t(a)
            }))
        }
    }
    class H {
        constructor(e, t) {
            this.ps = e, this.xs = t
        }
        static fromPoints(e) {
            const t = e.length,
                r = new Float64Array(t),
                a = new Float64Array(t);
            for (let i = 1; i < t - 1; i++) {
                const t = e[i - 1],
                    n = e[i],
                    o = e[i + 1],
                    s = o.x - t.x,
                    c = (n.x - t.x) / s,
                    u = c * a[i - 1] + 2,
                    l = (o.y - n.y) / (o.x - n.x) - (n.y - t.y) / (n.x - t.x);
                r[i] = (6 * l / s - c * r[i - 1]) / u, a[i] = (c - 1) / u
            }
            for (let e = t - 2; e >= 0; --e) a[e] = a[e] * a[e + 1] + r[e];
            return new H(e, a)
        }
        interpolate(e) {
            const {
                ps: t,
                xs: r
            } = this;
            let a = 0,
                i = this.ps.length - 1;
            for (; i - a > 1;) {
                const r = i + a >> 1;
                t[r].x > e ? i = r : a = r
            }
            const n = t[i],
                o = t[a],
                s = n.x - o.x,
                c = (n.x - e) / s,
                u = (e - o.x) / s,
                l = r[a],
                h = r[i];
            return c * o.y + u * n.y + (l * (c ** 3 - c) + h * (u ** 3 - u)) * s ** 2 / 6
        }
    }
    const W = "x",
        X = "C",
        j = new RegExp("^([0-9a-fA-F]{2})?([0-9a-fA-F]{2})?([0-9a-fA-F]{2})?([0-9a-fA-F]{2})?([0-9a-fA-F]{2})?([0-9a-fA-F]{2})?([0-9a-fA-F]{2})?([0-9a-fA-F]{2})?([0-9a-fA-F]{2})?([0-9a-fA-F]{2})?([0-9a-fA-F]{2})?([0-9a-fA-F]{2})?([0-9a-fA-F]{2})?([0-9a-fA-F]{2})?$");
    const V = Object.freeze({
        brightness: 0,
        contrast: 0,
        saturation: 0,
        tint: 0,
        tintAmount: 50,
        blur: 0,
        xpro: 0,
        warmth: 0,
        clarity: 0,
        vibrance: 0,
        highlights: 0,
        shadows: 0,
        vignette: 0,
        fade: 0
    });

    function Y(e) {
        if (! function(e) {
                if (!j.test(e)) return !1;
                const t = [...Array(14).keys()].map((e => 2 * e)).map((t => t < e.length ? parseInt(e.substring(t, t + 2), 16) : null)),
                    r = e => Number.isFinite(e);
                return (null == t[0] || r(t[0] - 100)) && (null == t[1] || r(t[1] - 100)) && (null == t[2] || r(t[2] - 100)) && (null == t[3] || r(t[3] - 100)) && (null == t[4] || r(t[4] - 100)) && (null == t[5] || r(t[5])) && (null == t[6] || r(t[6] - 100)) && (null == t[7] || r(t[7])) && (null == t[8] || r(t[8] - 100)) && (null == t[9] || r(t[9])) && (null == t[10] || r(t[10])) && (null == t[11] || r(t[11] - 100)) && (null == t[12] || r(t[12] - 100)) && (null == t[13] || r(t[13]))
            }(e)) return V;
        const t = [...Array(14).keys()].map((e => 2 * e)).map((t => t < e.length ? parseInt(e.substring(t, t + 2), 16) : null));
        return { ...V,
            ...null != t[0] && {
                brightness: t[0] - 100
            },
            ...null != t[1] && {
                contrast: t[1] - 100
            },
            ...null != t[2] && {
                saturation: t[2] - 100
            },
            ...null != t[3] && {
                tint: t[3] - 100
            },
            ...null != t[4] && {
                blur: t[4] - 100
            },
            ...null != t[5] && {
                vignette: t[5]
            },
            ...null != t[6] && {
                xpro: t[6] - 100
            },
            ...null != t[7] && {
                tintAmount: t[7]
            },
            ...null != t[8] && {
                warmth: t[8] - 100
            },
            ...null != t[9] && {
                clarity: t[9]
            },
            ...null != t[10] && {
                vibrance: t[10]
            },
            ...null != t[11] && {
                highlights: t[11] - 100
            },
            ...null != t[12] && {
                shadows: t[12] - 100
            },
            ...null != t[13] && {
                fade: t[13]
            }
        }
    }
    const q = ["precision mediump float;uniform sampler2D a;varying highp vec2 vTexCoord;uniform int d;void main(){if(d==0){gl_FragColor=texture2D(a,vTexCoord);return;}vec2 b=vec2(vTexCoord.x,vTexCoord.y/2.-1e-3);vec4 e=texture2D(a,b);vec2 c=vec2(vTexCoord.x,vTexCoord.y/2.+.499);vec4 f=texture2D(a,c);gl_FragColor=vec4(f.rgb,e.r);}", "precision mediump float;uniform float D,E,F;uniform vec3 G;uniform sampler2D uPrevResult;varying vec2 vTexCoord;vec4 V(vec4 a,float b){return vec4(a.rgb+b,a.a);}vec4 W(vec4 b,float a){float c=a>0.?1./(1.-a):1.+a;return vec4((b.rgb-.5)*c+.5,b.a);}vec4 X(vec4 c,float a){vec3 d=vec3(.3086,.6094,.082),b=vec3(1.-a)*d;mat3 e=mat3(vec3(b.x)+vec3(a,0,0),vec3(b.y)+vec3(0,a,0),vec3(b.z)+vec3(0,0,a));return vec4(max(vec3(0),e*c.rgb),c.a);}vec4 Y(vec4 a,vec3 b){return vec4(a.rgb-(a.rgb-b)*.1,a.a);}void main(){gl_FragColor=texture2D(uPrevResult,vTexCoord);if(D!=0.)gl_FragColor=clamp(V(gl_FragColor,D),0.,1.);if(E!=0.)gl_FragColor=clamp(W(gl_FragColor,E),0.,1.);if(F!=1.)gl_FragColor=clamp(X(gl_FragColor,F),0.,1.);if(G!=vec3(0.,0.,0.))gl_FragColor=Y(gl_FragColor,G);}", {
        fragment: "precision mediump float;uniform float s;uniform vec2 uResolution;uniform sampler2D uPrevResult;varying vec2 vTexCoord;float h(float b,float a){return .39894*exp(-.5*pow(b/a,2.))/a;}vec4 t(sampler2D d,vec2 e,vec2 q,float b){float f=0.;vec4 g=vec4(0.);vec2 r=1./uResolution;float c=h(0.,b);vec4 k=texture2D(d,e);k.rgb*=k.a,g+=k*c,f+=c;float u=b*2.5;for(float a=1.;a<=200.;a+=2.){if(a>u)break;float i=a+1.,l=h(a,b),m=h(i,b);c=l+m;vec2 j=q*(a*l+i*m)/c*r;vec4 n=texture2D(d,e+j),o=texture2D(d,e-j);n.rgb*=n.a,o.rgb*=o.a,g+=(n+o)*c,f+=c*2.;}vec4 p=g/f;p.rgb/=p.a;return p;}void main(){if(s==0.){gl_FragColor=texture2D(uPrevResult,vTexCoord);return;}gl_FragColor=t(uPrevResult,vTexCoord,vec2(1.,0.),s);}",
        output: X
    }, {
        fragment: "precision mediump float;uniform float s;uniform vec2 uResolution;uniform sampler2D C,uPrevResult;varying vec2 vTexCoord;float h(float b,float a){return .39894*exp(-.5*pow(b/a,2.))/a;}vec4 t(sampler2D d,vec2 e,vec2 q,float b){float f=0.;vec4 g=vec4(0.);vec2 r=1./uResolution;float c=h(0.,b);vec4 k=texture2D(d,e);k.rgb*=k.a,g+=k*c,f+=c;float u=b*2.5;for(float a=1.;a<=200.;a+=2.){if(a>u)break;float i=a+1.,l=h(a,b),m=h(i,b);c=l+m;vec2 j=q*(a*l+i*m)/c*r;vec4 n=texture2D(d,e+j),o=texture2D(d,e-j);n.rgb*=n.a,o.rgb*=o.a,g+=(n+o)*c,f+=c*2.;}vec4 p=g/f;p.rgb/=p.a;return p;}void main(){if(s==0.){gl_FragColor=texture2D(uPrevResult,vTexCoord);return;}gl_FragColor=t(C,vTexCoord,vec2(0.,1.),s);}",
        inputs: [X],
        output: W
    }, {
        fragment: "precision mediump float;uniform float s,H,I,J;uniform sampler2D x,uPrevResult,z,A;varying vec2 vTexCoord;vec4 Z(vec4 a,vec4 c,float b){return b<=0.?a:mix(c,a,1.+b/20.);}vec4 _(vec4 a,float b){a.rgb=b>0.?mix(a.rgb,vec3(texture2D(A,vec2(a.r,.5)).r,texture2D(A,vec2(a.g,.5)).g,texture2D(A,vec2(a.b,.5)).b),b):mix(a.rgb,vec3(texture2D(z,vec2(a.r,.5)).r,texture2D(z,vec2(a.g,.5)).g,texture2D(z,vec2(a.b,.5)).b),-b);return a;}vec4 aa(vec4 a,float b){return vec4(a.r+b,a.g,a.b-b,a.a);}void main(){gl_FragColor=s==0.?texture2D(uPrevResult,vTexCoord):texture2D(x,vTexCoord);if(H!=0.){vec4 a=texture2D(uPrevResult,vTexCoord);gl_FragColor=clamp(Z(a,gl_FragColor,H),0.,1.);}if(J!=0.)gl_FragColor=clamp(_(gl_FragColor,J),0.,1.);if(I!=0.)gl_FragColor=aa(gl_FragColor,I);}",
        inputs: [W]
    }, {
        fragment: "precision mediump float;uniform float v;uniform vec2 uResolution;uniform sampler2D uPrevResult;varying vec2 vTexCoord;float h(float b,float a){return .39894*exp(-.5*pow(b/a,2.))/a;}vec4 t(sampler2D d,vec2 e,vec2 q,float b){float f=0.;vec4 g=vec4(0.);vec2 r=1./uResolution;float c=h(0.,b);vec4 k=texture2D(d,e);k.rgb*=k.a,g+=k*c,f+=c;float u=b*2.5;for(float a=1.;a<=200.;a+=2.){if(a>u)break;float i=a+1.,l=h(a,b),m=h(i,b);c=l+m;vec2 j=q*(a*l+i*m)/c*r;vec4 n=texture2D(d,e+j),o=texture2D(d,e-j);n.rgb*=n.a,o.rgb*=o.a,g+=(n+o)*c,f+=c*2.;}vec4 p=g/f;p.rgb/=p.a;return p;}void main(){if(v==0.){gl_FragColor=texture2D(uPrevResult,vTexCoord);return;}gl_FragColor=t(uPrevResult,vTexCoord,vec2(1.,0.),15.);}",
        output: X
    }, {
        fragment: "precision mediump float;uniform float v;uniform vec2 uResolution;uniform sampler2D C,uPrevResult;varying vec2 vTexCoord;float h(float b,float a){return .39894*exp(-.5*pow(b/a,2.))/a;}vec4 t(sampler2D d,vec2 e,vec2 q,float b){float f=0.;vec4 g=vec4(0.);vec2 r=1./uResolution;float c=h(0.,b);vec4 k=texture2D(d,e);k.rgb*=k.a,g+=k*c,f+=c;float u=b*2.5;for(float a=1.;a<=200.;a+=2.){if(a>u)break;float i=a+1.,l=h(a,b),m=h(i,b);c=l+m;vec2 j=q*(a*l+i*m)/c*r;vec4 n=texture2D(d,e+j),o=texture2D(d,e-j);n.rgb*=n.a,o.rgb*=o.a,g+=(n+o)*c,f+=c*2.;}vec4 p=g/f;p.rgb/=p.a;return p;}void main(){if(v==0.){gl_FragColor=texture2D(uPrevResult,vTexCoord);return;}gl_FragColor=t(C,vTexCoord,vec2(0.,1.),15.);}",
        inputs: [X],
        output: W
    }, {
        fragment: "precision mediump float;uniform float v,K,L,M,N,O;uniform vec2 uResolution;uniform sampler2D B,x,uPrevResult;varying vec2 vTexCoord;const mat4 y=mat4(.255,.341,.105,0.,.652,-.465,.319,0.,.093,.125,-.424,0.,0.,.5,.5,1.),P=mat4(1.,1.,1.,0.,1.944,-.748,-.08,0.,.793,0.,-2.161,0.,-1.368,.374,1.121,1.);float Q(vec3 a){vec3 b=vec3(.2125,.7154,.0721);return dot(a,b);}float R(in vec2 a){a=a*2.-1.,a.y*=1.25-.5*step(0.,a.y),a.xy*=a.xy,a.xy=clamp(a.xy,0.,1.),a*=255.,a=floor(a);return sqrt(clamp(a.x+a.y,0.,255.)/255.);}vec4 S(vec4 c,float a){vec3 d=vec3(.2125,.7154,.0721),b=vec3(1.-a)*d;mat3 e=mat3(vec3(b.x)+vec3(a,0,0),vec3(b.y)+vec3(0,a,0),vec3(b.z)+vec3(0,0,a));return vec4(clamp(e*c.rgb,0.,1.),c.a);}float T(in float a){return pow(1.-a,3.);}vec4 ba(vec4 a,float c){const mat3 d=mat3(.334,0,-.5,.333,.434,.25,.333,-.433,.251);vec3 b=d*a.rgb;b.gb+=.5;float e=R(b.gb),f=T(clamp(e,0.,1.));vec4 g=f*a,i=S(g,1.+c);return a.a*i+(1.-i.a)*a;}float w(float c,float a,float d,float b,float e){return b+(e-b)*(c-a)/(d-a);}float U(float a){float c=1.-step(.1429,a),d=step(.1429,a)-step(.2857,a),e=step(.2857,a)-step(.7143,a),f=step(.7143,a)-step(.8571,a),g=step(.8571,a),b=w(a,0.,.1429,0.,.75)*c;b+=w(a,.1429,.2857,.75,1.)*d,b+=w(a,.2857,.7143,1.,1.)*e,b+=w(a,.7143,.8571,1.,.75)*f,b+=w(a,.8571,1.,.75,0.)*g;return b;}vec4 ca(vec4 a,vec2 e,float f){float g=Q(a.rgb);vec4 b=vec4(a.rgb,a.a*U(g)),d=texture2D(x,e);b.rgb*=b.a,a.rgb*=a.a,d.a=1.;vec4 c=mix(d,b,1.+f);c=clamp(c,0.,1.),a=a.a*c+(1.-c.a)*a,a.rgb/=a.a;return a;}vec4 da(vec4 b,float c){vec4 a=y*b;float d=.8*step(0.,c)+.2,e=pow(a.r,3.),f=clamp(a.r*(1.+c*d),0.,1.);a.r=mix(a.r,f,e),b=P*a,b.r=clamp(b.r,0.,1.);return b;}vec4 ea(vec4 b,float c){vec4 a=y*b;float d=pow(1.-a.r,3.),e=clamp(a.r*(1.+c),0.,1.);a.r=mix(a.r,e,d),b=P*a,b.r=clamp(b.r,0.,1.);return b;}vec4 fa(vec4 a,float b){return vec4(mix(a.rgb,vec3(texture2D(B,vec2(a.r,.5)).r,texture2D(B,vec2(a.g,.5)).g,texture2D(B,vec2(a.b,.5)).b),b),a.a);}vec4 ga(vec4 b,vec2 d,vec2 a,float f){b.rgb*=b.a;float c=min(a.x,a.y);vec2 e=(d*2.-1.)/vec2(a.y/c,a.x/c);float g=clamp((length(e)-.7)/.6,0.,1.);b=mix(b,vec4(0.,0.,0.,1.),g*f),b.rgb/=b.a;return b;}void main(){gl_FragColor=texture2D(uPrevResult,vTexCoord);if(v!=0.)gl_FragColor=clamp(ca(gl_FragColor,vTexCoord,v),0.,1.);if(N!=0.)gl_FragColor=clamp(ba(gl_FragColor,N),0.,1.);if(L!=0.)gl_FragColor=clamp(da(gl_FragColor,L),0.,1.);if(M!=0.)gl_FragColor=clamp(ea(gl_FragColor,M),0.,1.);if(O!=0.)gl_FragColor=clamp(ga(gl_FragColor,vTexCoord,uResolution,O),0.,1.);if(K!=0.)gl_FragColor=fa(gl_FragColor,K);}",
        inputs: [W]
    }];
    class K {
        constructor() {
            this.initialized = !1, this.lastDimensions = {
                width: 0,
                height: 0
            }
        }
        initialize(e) {
            const t = new x({
                    source: e.element
                }),
                r = {
                    a: t,
                    A: ee(Q),
                    z: ee(Z),
                    B: ee({
                        r: J,
                        g: J,
                        b: J
                    })
                },
                a = new $({
                    passes: q,
                    textures: r,
                    uniforms: te({
                        filter: V,
                        width: 0,
                        height: 0,
                        backgroundRemoved: !1
                    })
                }),
                i = document.createElement("div"),
                n = new m((() => new I(i, {
                    env: {
                        devicePixelRatio: 1
                    }
                })));
            n.onContextLost = () => {
                n.restore()
            }, n.load([t]), n.load(a), this.renderer = n, this.effect = a, this.sourceImageTexture = t, this.initialized = !0, this.timeoutId = window.setTimeout(this.dispose, 16e3)
        }
        supportsImageBitmapRendering() {
            return !!window.createImageBitmap && "undefined" != typeof ImageBitmapRenderingContext
        }
        render({
            source: e,
            filter: t,
            backgroundRemoved: r,
            width: a,
            height: i
        }) {
            if (this.initialized || this.initialize(e), !this.renderer || !this.effect || !this.sourceImageTexture) throw new Error("Renderer is not initialized");
            this.timeoutId && clearTimeout(this.timeoutId), this.timeoutId = window.setTimeout(this.dispose, 16e3);
            return function(e, t) {
                if (0 === e.width && 0 === e.height || 0 === t.width && 0 === t.height) return !0;
                if (e.width === t.width && e.height === t.height) return !1;
                const r = Math.trunc(e.width / e.height),
                    a = Math.trunc(t.width / t.height),
                    i = r < 1 && a < 1;
                if (!(r >= 1 && a >= 1 || i)) return !0;
                const n = e.width * e.height,
                    o = t.width * t.height;
                if (o <= n) return !1;
                return o / n > 2
            }(this.lastDimensions, {
                width: a,
                height: i
            }) && (this.renderer.resize(a, i), this.lastDimensions = {
                width: a,
                height: i
            }), this.lastSource !== e && (this.renderer.release([this.sourceImageTexture]), this.sourceImageTexture = new x({
                source: e.element
            }), this.renderer.load([this.sourceImageTexture]), this.lastSource = e), this.renderer.update([this.sourceImageTexture]), this.effect.update({
                textures: {
                    a: this.sourceImageTexture
                },
                uniforms: te({
                    filter: t ? Y(t) : V,
                    width: a,
                    height: i,
                    backgroundRemoved: r
                })
            }), this.renderer.render(this.effect), this.renderer.canvas
        }
        dispose() {
            var e;
            this.timeoutId && clearTimeout(this.timeoutId), null === (e = this.renderer) || void 0 === e || e.dispose(), this.renderer = void 0, this.effect = void 0, this.timeoutId = void 0, this.initialized = !1
        }
    }
    const J = [{
            x: 0,
            y: 69
        }, {
            x: 79,
            y: 96
        }, {
            x: 127,
            y: 127
        }, {
            x: 255,
            y: 225
        }],
        Q = {
            r: [{
                x: 0,
                y: 0
            }, {
                x: 77,
                y: 26
            }, {
                x: 179,
                y: 204
            }, {
                x: 255,
                y: 255
            }],
            g: [{
                x: 0,
                y: 0
            }, {
                x: 64,
                y: 38
            }, {
                x: 191,
                y: 217
            }, {
                x: 255,
                y: 255
            }],
            b: [{
                x: 0,
                y: 0
            }, {
                x: 85,
                y: 102
            }, {
                x: 170,
                y: 153
            }, {
                x: 255,
                y: 204
            }]
        },
        Z = {
            r: [{
                x: 0,
                y: 0
            }, {
                x: 77,
                y: 26
            }, {
                x: 179,
                y: 51
            }, {
                x: 242,
                y: 255
            }],
            g: [{
                x: 0,
                y: 0
            }, {
                x: 64,
                y: 102
            }, {
                x: 153,
                y: 153
            }, {
                x: 255,
                y: 255
            }],
            b: [{
                x: 0,
                y: 0
            }, {
                x: 77,
                y: 79
            }, {
                x: 153,
                y: 153
            }, {
                x: 255,
                y: 255
            }]
        };

    function ee(e) {
        const t = H.fromPoints(e.r),
            r = H.fromPoints(e.g),
            a = H.fromPoints(e.b),
            i = new Uint8Array(768);
        for (let e = 0; e < 256; e++) i[3 * e + 0] = Math.max(0, Math.min(255, t.interpolate(e))), i[3 * e + 1] = Math.max(0, Math.min(255, r.interpolate(e))), i[3 * e + 2] = Math.max(0, Math.min(255, a.interpolate(e)));
        return new w({
            width: 256,
            height: 1,
            source: i
        })
    }

    function te({
        filter: e,
        width: t,
        height: r,
        backgroundRemoved: a
    }) {
        const {
            r: i,
            g: n,
            b: o
        } = 0 !== e.tint ? function({
            h: e,
            s: t,
            l: r
        }) {
            if (0 === t) return {
                r: e,
                g: e,
                b: e
            }; {
                const a = r < .5 ? r * (1 + t) : r + t - r * t,
                    i = 2 * r - a;
                return {
                    r: re(i, a, e + 1 / 3),
                    g: re(i, a, e),
                    b: re(i, a, e - 1 / 3)
                }
            }
        }({
            h: ae(e.tint / 200 + .5 - 1 / 7, 1),
            s: 1,
            l: .5
        }) : {
            r: 0,
            g: 0,
            b: 0
        };
        return {
            D: e.brightness / 200,
            E: e.contrast / 100 * .6,
            F: e.saturation / 100 + 1,
            G: [i, n, o],
            s: (e.blur >= 0 ? e.blur : 3) * Math.max(t, r) / 2e3,
            H: Math.min(Math.max(-e.blur, 0), 100),
            J: e.xpro / 100,
            I: e.warmth / 100 * .1,
            N: e.vibrance / 100,
            v: e.clarity / 100,
            L: e.highlights / 100,
            M: e.shadows / 100,
            K: e.fade / 100,
            O: e.vignette / 100 * .7,
            d: a ? 1 : 0
        }
    }

    function re(e, t, r) {
        return r < 0 && (r += 1), r > 1 && (r -= 1), r < 1 / 6 ? e + 6 * (t - e) * r : r < .5 ? t : r < 2 / 3 ? e + (t - e) * (2 / 3 - r) * 6 : e
    }

    function ae(e, t) {
        return (e % t + t) % t
    }
    const {
        effectsRenderer: ie
    } = {
        effectsRenderer: new K
    }, ne = (e, t) => {
        var r;
        const a = (e => {
                const {
                    filter: t
                } = e.dataset;
                return t
            })(e),
            i = (e => {
                const {
                    modifiers: t
                } = e.dataset;
                return null != t && t.split(",").includes("STACKED_ALPHA_MASK")
            })(e);
        if (!i && !a) return;
        const n = ie.supportsImageBitmapRendering() ? t.getContext("bitmaprenderer") : t.getContext("2d");
        if (null == n) return;
        null === (r = e.parentNode) || void 0 === r || r.prepend(t), e.style.visibility = "hidden";
        let o = 0;
        const s = () => {
            (() => {
                const r = e.clientWidth,
                    o = e.clientHeight,
                    s = e.style.transform,
                    c = {
                        type: "video",
                        element: e
                    },
                    u = ie.render({
                        source: c,
                        backgroundRemoved: i,
                        filter: a,
                        width: r,
                        height: o
                    });
                ie.supportsImageBitmapRendering() && n instanceof ImageBitmapRenderingContext ? createImageBitmap(u).then((e => {
                    t.width = r, t.height = o, t.style.transform = s, n.transferFromImageBitmap(e)
                })) : n instanceof CanvasRenderingContext2D && (t.width = r, t.height = o, t.style.transform = s, n.clearRect(0, 0, r, o), n.drawImage(u, 0, 0, r, o))
            })(), o = requestAnimationFrame(s)
        };
        e.onpause = () => cancelAnimationFrame(o), e.onplay = () => {
            o = requestAnimationFrame(s)
        }, e.paused || (o = requestAnimationFrame(s))
    }, oe = new Map;
    r((() => {
        document.querySelectorAll("video[data-modifiers], video[data-filter]").forEach((e => oe.set(e, (() => {
            const e = document.createElement("canvas");
            return e.style.position = "absolute", e.style.top = "0", e.style.left = "0", e
        })())));
        i((() => {
            oe.forEach(((e, t) => ne(t, e)))
        }), {
            runOnLoad: !0
        })
    }))
}();