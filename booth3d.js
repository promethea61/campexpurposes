// ============================================================
// PROMETHEA — DENAH BOOTH 3D v2 (WebGL murni, tanpa library)
// Dipanggil otomatis oleh campus_expo.js. Tidak perlu diedit.
// Gaya: abu-abu elegan + garis tepi hijau. Terinspirasi diorama low-poly:
// gedung sekolah dua lantai + portico lengkung, 15 tenda berbentuk U,
// paving berpetak, bayangan lembut. Klik booth = kamera masuk ke booth.
// ============================================================
(function () {
  'use strict';

  // ---------- matematika kecil ----------
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function norm(a) { var l = Math.sqrt(dot(a, a)) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function perspective(fovy, asp, n, f) {
    var t = 1 / Math.tan(fovy / 2);
    return [t / asp, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, 2 * f * n / (n - f), 0];
  }
  function lookAt(e, c, up) {
    var z = norm(sub(e, c)), x = norm(cross(up, z)), y = cross(z, x);
    return { m: [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, e), -dot(y, e), -dot(z, e), 1], x: x, y: y, z: z };
  }
  function mul(a, b) {
    var o = new Array(16);
    for (var c = 0; c < 4; c++) for (var r = 0; r < 4; r++) {
      var s = 0; for (var k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      o[c * 4 + r] = s;
    }
    return o;
  }
  function hex(h) {
    h = h.replace('#', '');
    return [parseInt(h.substr(0, 2), 16) / 255, parseInt(h.substr(2, 2), 16) / 255, parseInt(h.substr(4, 2), 16) / 255];
  }
  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
  function shade(c, k) { return [Math.min(1, c[0] * k), Math.min(1, c[1] * k), Math.min(1, c[2] * k)]; }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }

  // ---------- pembangun geometri (flat shading + garis tepi) ----------
  function Builder() { this.v = []; this.e = []; this.g = []; this.x = { tx: 0, tz: 0, c: 1, s: 0 }; }
  Builder.prototype.xf = function (tx, tz, rot) { this.x = { tx: tx, tz: tz, c: Math.cos(rot), s: Math.sin(rot) }; };
  Builder.prototype.P = function (p) {
    var x = this.x;
    return [p[0] * x.c + p[2] * x.s + x.tx, p[1], -p[0] * x.s + p[2] * x.c + x.tz];
  };
  Builder.prototype.tri = function (a, b, c, col, ctr) {
    a = this.P(a); b = this.P(b); c = this.P(c); ctr = this.P(ctr);
    var n = norm(cross(sub(b, a), sub(c, a)));
    var mid = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3];
    if (dot(n, sub(mid, ctr)) < 0) n = [-n[0], -n[1], -n[2]];
    var v = this.v, cols = col.length === 3 && typeof col[0] === 'object' ? col : [col, col, col];
    [a, b, c].forEach(function (p, i) { v.push(p[0], p[1], p[2], n[0], n[1], n[2], cols[i][0], cols[i][1], cols[i][2]); });
  };
  Builder.prototype.quad = function (a, b, c, d, col, ctr) { this.tri(a, b, c, col, ctr); this.tri(a, c, d, col, ctr); };
  Builder.prototype.gquad = function (a, b, c, d, cols, ctr) { this.tri(a, b, c, [cols[0], cols[1], cols[2]], ctr); this.tri(a, c, d, [cols[0], cols[2], cols[3]], ctr); };
  Builder.prototype.line = function (a, b) { a = this.P(a); b = this.P(b); this.e.push(a[0], a[1], a[2], b[0], b[1], b[2]); };
  Builder.prototype.gline = function (a, b) { a = this.P(a); b = this.P(b); this.g.push(a[0], a[1], a[2], b[0], b[1], b[2]); };
  Builder.prototype.box = function (cx, cy, cz, sx, sy, sz, col, edge) {
    var x0 = cx - sx / 2, x1 = cx + sx / 2, y0 = cy - sy / 2, y1 = cy + sy / 2, z0 = cz - sz / 2, z1 = cz + sz / 2, c = [cx, cy, cz], self = this;
    var p = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
    [[0, 1, 2, 3], [5, 4, 7, 6], [4, 0, 3, 7], [1, 5, 6, 2], [3, 2, 6, 7], [4, 5, 1, 0]].forEach(function (f) {
      self.quad(p[f[0]], p[f[1]], p[f[2]], p[f[3]], col, c);
    });
    if (edge) [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(function (k) { self.line(p[k[0]], p[k[1]]); });
  };
  // limas terpotong (atap tenda & atap gedung)
  Builder.prototype.frustum = function (cx, y0, cz, sx, sz, h, tx, tz, col, edge) {
    var b = [[cx - sx / 2, y0, cz - sz / 2], [cx + sx / 2, y0, cz - sz / 2], [cx + sx / 2, y0, cz + sz / 2], [cx - sx / 2, y0, cz + sz / 2]];
    var t = [[cx - tx / 2, y0 + h, cz - tz / 2], [cx + tx / 2, y0 + h, cz - tz / 2], [cx + tx / 2, y0 + h, cz + tz / 2], [cx - tx / 2, y0 + h, cz + tz / 2]];
    var c = [cx, y0 + h / 2, cz], self = this;
    for (var i = 0; i < 4; i++) {
      var j = (i + 1) % 4;
      // sisi depan sedikit lebih terang, sisi samping lebih gelap → kesan volume
      var k = (i === 2) ? 1.06 : (i === 0 ? 0.94 : 0.88);
      self.quad(b[i], b[j], t[j], t[i], shade(col, k), c);
      if (edge) { self.line(b[i], b[j]); self.line(t[i], t[j]); self.line(b[i], t[i]); }
    }
    self.quad(t[0], t[1], t[2], t[3], col, c);
  };
  // atap lengkung (setengah silinder sepanjang sumbu z)
  Builder.prototype.arch = function (cx, y0, cz, rx, ry, depth, col, seg) {
    var z0 = cz - depth / 2, z1 = cz + depth / 2, c = [cx, y0, cz], self = this, prev = null;
    for (var i = 0; i <= seg; i++) {
      var a = Math.PI * i / seg, x = cx + Math.cos(a) * rx, y = y0 + Math.sin(a) * ry;
      if (prev) {
        self.quad([prev[0], prev[1], z0], [x, y, z0], [x, y, z1], [prev[0], prev[1], z1], shade(col, 0.9 + 0.2 * Math.sin(a)), c);
        self.tri([cx, y0, z0], [prev[0], prev[1], z0], [x, y, z0], col, c);
        self.tri([cx, y0, z1], [prev[0], prev[1], z1], [x, y, z1], col, c);
        self.line([prev[0], prev[1], z0], [x, y, z0]); self.line([prev[0], prev[1], z1], [x, y, z1]);
      }
      prev = [x, y];
    }
    self.line([cx + rx, y0, z0], [cx + rx, y0, z1]); self.line([cx - rx, y0, z0], [cx - rx, y0, z1]);
    self.line([cx, y0 + ry, z0], [cx, y0 + ry, z1]);
  };
  // ---------- isi adegan ----------
  var GREEN = hex('#1DB954');
  var C = {
    groundFar: hex('#17181b'), groundNear: hex('#24262a'),
    plazaFar: hex('#3a3d42'), plazaNear: hex('#5a5e65'), curb: hex('#8a8e96'),
    wall: hex('#6b6f77'), wallLight: hex('#7d818a'), roof: hex('#858a92'), roofDark: hex('#4f535a'), door: hex('#141518'),
    glass: hex('#1d1f23'), frame: hex('#9a9ea7'),
    tentWall: hex('#dadde3'), tentRoof: hex('#f1f2f5'), post: hex('#c4c7ce'), valance: hex('#b4b8c0'), table: hex('#cfc9be'), tableLeg: hex('#2a2c30'), floor: hex('#5b5f66')
  };
  var TENT = { w: 3.6, d: 2.8, h: 2.3 };
  var PLAZA = { x0: -15, x1: 15, z0: -11, z1: 13 };
  var FZ = -11.6; // sisi depan sayap gedung
  // 15 booth membentuk huruf U — urutan = urutan BOOTHS:
  // B1–B5 lengan kiri (jauh → dekat), B6–B10 baris bawah (kiri → kanan), B11–B15 lengan kanan (dekat → jauh)
  // Semua booth menghadap ke dalam; baris bawah menghadap gedung sekolah.
  var SLOTS = (function () {
    var s = [], step = 3.8, zb = 10, ax = 11.05, i;
    for (i = 0; i < 5; i++) s.push({ x: -ax, z: zb - (4 - i) * step, r: Math.PI / 2 });
    for (i = 0; i < 5; i++) s.push({ x: -7.6 + i * step, z: zb, r: Math.PI });
    for (i = 0; i < 5; i++) s.push({ x: ax, z: zb - i * step, r: -Math.PI / 2 });
    return s;
  })();

  function windows(b, cx, y) {
    b.box(cx, y, FZ + 0.03, 1.8, 1.15, 0.06, C.glass);
    b.box(cx, y, FZ + 0.07, 0.07, 1.15, 0.04, C.frame);
    b.box(cx, y + 0.1, FZ + 0.07, 1.8, 0.05, 0.04, C.frame);
    b.box(cx, y - 0.62, FZ + 0.1, 2.05, 0.07, 0.16, C.frame);
  }

  function buildStatic() {
    var b = new Builder(), P = PLAZA, i, x, z;
    // tanah luas
    b.gquad([-80, 0, -34], [80, 0, -34], [80, 0, 46], [-80, 0, 46], [C.groundFar, C.groundFar, C.groundNear, C.groundNear], [0, -5, 0]);
    // lapangan paving: gradien jauh gelap → dekat terang
    var y = 0.02;
    b.gquad([P.x0, y, P.z0], [P.x1, y, P.z0], [P.x1, y, P.z1], [P.x0, y, P.z1], [C.plazaFar, C.plazaFar, C.plazaNear, C.plazaNear], [0, -5, 0]);
    // petak paving (garis tipis) — dibuat setelah lapangan
    y = 0.03;
    for (x = P.x0; x <= P.x1 + 0.01; x += 2.5) b.gline([x, y, P.z0], [x, y, P.z1]);
    for (z = P.z0; z <= P.z1 + 0.01; z += 2.4) b.gline([P.x0, y, z], [P.x1, y, z]);
    // pinggiran (curb) dengan tepi hijau
    var cz = (P.z0 + P.z1) / 2;
    b.box(P.x0 - 0.25, 0.11, cz, 0.5, 0.22, P.z1 - P.z0 + 0.5, C.curb, true);
    b.box(P.x1 + 0.25, 0.11, cz, 0.5, 0.22, P.z1 - P.z0 + 0.5, C.curb, true);
    b.box(0, 0.11, P.z1 + 0.25, P.x1 - P.x0 + 1, 0.22, 0.5, C.curb, true);

    // ===== gedung sekolah =====
    b.box(0, 3.1, FZ - 2.7, 44, 6.2, 5.4, C.wall, true);                    // badan sayap
    b.frustum(0, 6.2, FZ - 2.7, 46, 7.8, 1.5, 37, 2.2, C.roof, true);       // atap limas
    b.box(0, 3.2, FZ + 0.1, 44, 0.2, 0.34, C.wallLight, false);             // pita antar-lantai
    for (i = 0; i < 6; i++) {                                               // jendela 2 lantai × 2 sayap
      var wx = 6.75 + i * 2.75;
      [-wx, wx].forEach(function (sx) { windows(b, sx, 1.75); windows(b, sx, 4.7); });
    }
    for (i = 0; i < 7; i++) {                                               // pilaster antar-jendela
      var px = 5.375 + i * 2.75;
      [-px, px].forEach(function (sx) { b.box(sx, 3.1, FZ + 0.07, 0.28, 6.2, 0.14, C.wallLight, false); });
    }
    // teras tengah (portico) + lengkung
    var pcz = FZ - 2.3;
    b.box(0, 3.8, pcz, 9, 7.6, 7, C.wallLight, true);
    b.box(0, 1.55, FZ + 1.23, 4.6, 3.1, 0.06, C.door);                      // pintu masuk
    [-2.9, 2.9].forEach(function (sx) { b.box(sx, 1.55, FZ + 1.4, 0.34, 3.1, 0.34, C.frame, false); });
    b.box(0, 3.3, FZ + 1.45, 9.4, 0.22, 0.5, C.roofDark, true);             // balkon
    b.box(0, 5.2, FZ + 1.23, 6.8, 1.6, 0.06, C.glass);                      // jendela besar lantai 2
    for (i = -3; i <= 3; i++) b.box(i * 0.97, 5.2, FZ + 1.27, 0.06, 1.6, 0.04, C.frame);
    b.box(0, 5.2, FZ + 1.27, 6.8, 0.05, 0.04, C.frame);
    b.box(0, 7.5, pcz, 10.6, 0.22, 8.4, C.roofDark, true);                  // lis atap
    b.arch(0, 7.6, pcz, 5.5, 2.1, 8.4, C.roofDark, 12);                     // atap lengkung
    b.box(0, 0.09, FZ + 2.2, 6.4, 0.18, 1.6, C.curb, true);                 // tangga depan
    b.box(0, 0.04, FZ + 3.1, 7.4, 0.08, 0.5, C.curb, false);

    return { v: b.v, e: b.e, g: b.g };
  }

  // bayangan lembut (digambar dengan alpha)
  function buildShadows() {
    var b = new Builder(), blk = [0, 0, 0];
    SLOTS.forEach(function (s) {
      var rot = Math.abs(Math.sin(s.r)) > 0.5, sx = (rot ? TENT.d : TENT.w) + 0.9, sz = (rot ? TENT.w : TENT.d) + 0.9;
      var cx = s.x - 0.75, cz = s.z - 0.6, y = 0.036;
      b.quad([cx - sx / 2, y, cz - sz / 2], [cx + sx / 2, y, cz - sz / 2], [cx + sx / 2, y, cz + sz / 2], [cx - sx / 2, y, cz + sz / 2], blk, [cx, -3, cz]);
    });
    return { v: b.v, e: [], g: [] };
  }

  // satu tenda (lokal: sisi depan terbuka menghadap +z)
  function buildTent(tx, tz, rot, col) {
    var b = new Builder(), w = TENT.w, d = TENT.d, h = TENT.h;
    var acc = mix(col, [0.5, 0.52, 0.55], 0.12), accDark = shade(col, 0.7);
    b.xf(tx, tz, rot);
    b.box(0, 0.05, 0, w - 0.1, 0.05, d - 0.1, C.floor);                       // alas
    b.box(0, h / 2, -d / 2 + 0.04, w, h, 0.08, C.tentWall);                   // dinding belakang
    b.box(-w / 2 + 0.04, h / 2, 0, 0.08, h, d, shade(C.tentWall, 0.94));      // dinding kiri
    b.box(w / 2 - 0.04, h / 2, 0, 0.08, h, d, shade(C.tentWall, 0.94));       // dinding kanan
    b.box(-w / 2 + 0.07, h / 2, d / 2 - 0.07, 0.12, h, 0.12, C.post);         // tiang depan
    b.box(w / 2 - 0.07, h / 2, d / 2 - 0.07, 0.12, h, 0.12, C.post);
    b.box(0, h - 0.2, d / 2 - 0.03, w - 0.1, 0.4, 0.06, C.valance);           // lis depan
    b.box(0, h - 0.43, d / 2 - 0.02, w - 0.1, 0.07, 0.07, acc);               // aksen warna bidang
    b.box(0, 1.42, -d / 2 + 0.1, w * 0.6, 0.85, 0.03, accDark);               // banner belakang
    b.box(0, 1.42, -d / 2 + 0.115, w * 0.6 - 0.14, 0.05, 0.02, tint(col, 1.25));
    b.box(0, h + 0.05, 0, w + 0.08, 0.1, d + 0.08, C.tentRoof, true);         // lis atap
    b.frustum(0, h + 0.1, 0, w - 0.04 + 0.0, d - 0.04, 0.9, 0.62, 0.5, C.tentRoof, true); // atap limas
    // meja + kaki
    var tz0 = 0.18;
    b.box(0, 0.76, tz0, w * 0.74, 0.07, 0.7, C.table, true);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (k) { b.box(k[0] * w * 0.33, 0.37, tz0 + k[1] * 0.26, 0.05, 0.74, 0.05, C.tableLeg); });
    // garis tepi badan tenda
    var x0 = -w / 2, x1 = w / 2, z0 = -d / 2, z1 = d / 2, p = [[x0, 0, z0], [x1, 0, z0], [x1, h, z0], [x0, h, z0], [x0, 0, z1], [x1, 0, z1], [x1, h, z1], [x0, h, z1]];
    [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(function (k) { b.line(p[k[0]], p[k[1]]); });
    // kotak pick (AABB dunia)
    var cs = [[-w / 2, 0, -d / 2], [w / 2, 0, d / 2], [-w / 2, h + 1, -d / 2], [w / 2, h + 1, d / 2]].map(function (q) { return b.P(q); });
    var mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
    cs.forEach(function (q) { for (var k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], q[k]); mx[k] = Math.max(mx[k], q[k]); } });
    // alas penanda (menyala saat dipilih)
    var pd = new Builder(), pw = w + 0.9, pdp = d + 0.9, py = 0.045;
    pd.xf(tx, tz, rot);
    pd.quad([-pw / 2, py, -pdp / 2], [pw / 2, py, -pdp / 2], [pw / 2, py, pdp / 2], [-pw / 2, py, pdp / 2], col, [0, -3, 0]);
    return { v: b.v, e: b.e, g: [], pad: { v: pd.v, e: [], g: [] }, min: mn, max: mx, c: [(mn[0] + mx[0]) / 2, 0, (mn[2] + mx[2]) / 2] };
  }
  function tint(c, k) { return mix(c, [1, 1, 1], Math.min(1, k - 1)); }

  // ---------- shader ----------
  var VS = 'attribute vec3 aPos;attribute vec3 aNor;attribute vec3 aCol;uniform mat4 uVP;varying vec3 vCol;varying vec3 vNor;' +
    'void main(){vCol=aCol;vNor=aNor;gl_Position=uVP*vec4(aPos,1.0);}';
  var FS = 'precision mediump float;varying vec3 vCol;varying vec3 vNor;uniform float uGlow;uniform vec3 uTint;uniform float uAlpha;' +
    'void main(){vec3 n=normalize(vNor);' +
    'float d1=max(dot(n,normalize(vec3(.4,.9,.35))),0.0);float d2=max(dot(n,normalize(vec3(-.6,.25,-.5))),0.0);' +
    'float l=.56+.5*d1+.12*d2+.06*n.y;vec3 c=vCol*l;c=mix(c,uTint,uGlow*.26);c+=uTint*uGlow*.08;gl_FragColor=vec4(c,uAlpha);}';
  // garis tepi tebal (kuad di ruang layar)
  var EVS = 'attribute vec3 aA;attribute vec3 aB;attribute vec2 aK;uniform mat4 uVP;uniform vec2 uRes;uniform float uW;' +
    'void main(){vec4 pa=uVP*vec4(aA,1.0);vec4 pb=uVP*vec4(aB,1.0);' +
    'vec2 sa=pa.xy/pa.w*uRes*.5;vec2 sb=pb.xy/pb.w*uRes*.5;vec2 d=sb-sa;float l=length(d);d=l>.0001?d/l:vec2(1.,0.);' +
    'vec2 n=vec2(-d.y,d.x);vec4 p=mix(pa,pb,aK.x);p.xy+=n*aK.y*(uW/uRes)*p.w;p.z-=.0006*p.w;gl_Position=p;}';
  var EFS = 'precision mediump float;uniform vec4 uCol;void main(){gl_FragColor=uCol;}';

  function compile(gl, type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function program(gl, vs, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs)); gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }

  // ---------- CSS ----------
  var css = document.createElement('style');
  css.textContent =
    '.ex3{position:relative;width:100%;aspect-ratio:16/9;min-height:300px;max-height:620px;border-radius:14px;overflow:hidden;' +
    'background:radial-gradient(ellipse at 50% 18%,#3d4046 0%,#25272b 50%,#141517 100%);border:1px solid #2a2a2a;touch-action:pan-y;cursor:grab;user-select:none;-webkit-user-select:none}' +
    '.ex3::after{content:"";position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 90px rgba(0,0,0,.55);border-radius:14px}' +
    '@media(max-width:560px){.ex3{aspect-ratio:4/3.6}.ex3-lab{font-size:9px!important;padding:1px 5px!important;border-left-width:3px!important;gap:3px!important}.ex3-lab.on i{max-width:170px}.ex3-tag{display:none!important}}' +
    '.ex3.drag{cursor:grabbing}.ex3.hover{cursor:pointer}' +
    '.ex3 canvas{position:absolute;inset:0;width:100%;height:100%;display:block}' +
    '.ex3-lab{position:absolute;left:0;top:0;pointer-events:none;display:flex;align-items:center;gap:6px;white-space:nowrap;font-family:"Space Mono",monospace;font-size:11px;font-weight:700;' +
    'color:#111;background:rgba(255,255,255,.94);padding:3px 8px;border-radius:20px;border-left:4px solid var(--c);box-shadow:0 4px 12px rgba(0,0,0,.4);will-change:transform;transition:opacity .15s,background .2s}' +
    '.ex3-lab i{font-style:normal;font-family:"DM Sans",sans-serif;font-weight:600;font-size:11px;max-width:0;overflow:hidden;opacity:0;transition:max-width .25s,opacity .25s}' +
    '.ex3-lab.on i{max-width:240px;opacity:.95}.ex3-lab.on{background:var(--c);color:#000}' +
    '.ex3-tag{position:absolute;left:0;top:0;pointer-events:none;font-family:"Space Mono",monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.55);' +
    'white-space:nowrap;will-change:transform;text-shadow:0 1px 6px rgba(0,0,0,.6)}' +
    '.ex3-tag::before{content:"";display:inline-block;width:6px;height:6px;border-radius:50%;background:#1DB954;margin-right:8px;vertical-align:middle}' +
    '.ex3-ui{position:absolute;right:10px;bottom:10px;display:flex;gap:6px;z-index:5}' +
    '.ex3-ui button{width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.1);color:#fff;font-size:16px;cursor:pointer;font-family:inherit;line-height:1;backdrop-filter:blur(6px)}' +
    '.ex3-ui button:hover{background:rgba(29,185,84,.35);border-color:#1DB954}' +
    '.ex3-panel{position:absolute;top:10px;right:10px;bottom:10px;width:min(350px,42%);overflow:auto;z-index:6;cursor:default;color:#fff;background:rgba(14,15,17,.9);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.1);border-top:3px solid var(--c,#1DB954);border-radius:14px;box-shadow:0 20px 50px rgba(0,0,0,.5);opacity:0;transform:translateX(14px);pointer-events:none;transition:opacity .35s,transform .35s;scrollbar-width:thin}' +
    '.ex3-panel.show{opacity:1;transform:none;pointer-events:auto}' +
    '@media(max-width:700px){.ex3-panel{display:none}}' +
    '.ex3-hint{position:absolute;left:12px;top:10px;font-size:11px;color:#c3c3c3;background:rgba(0,0,0,.4);padding:4px 10px;border-radius:20px;pointer-events:none;transition:opacity .4s;z-index:5}';
  document.head.appendChild(css);

  // ---------- init ----------
  function init(opts) {
    var box = opts.container, booths = opts.booths;
    var canvas = document.createElement('canvas');
    var gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false }) || canvas.getContext('experimental-webgl');
    if (!gl) throw new Error('WebGL tidak tersedia');
    box.classList.add('ex3'); box.innerHTML = ''; box.appendChild(canvas);

    var P1 = program(gl, VS, FS), P2 = program(gl, EVS, EFS);
    var L1 = { aPos: gl.getAttribLocation(P1, 'aPos'), aNor: gl.getAttribLocation(P1, 'aNor'), aCol: gl.getAttribLocation(P1, 'aCol'),
      uVP: gl.getUniformLocation(P1, 'uVP'), uGlow: gl.getUniformLocation(P1, 'uGlow'), uTint: gl.getUniformLocation(P1, 'uTint'), uAlpha: gl.getUniformLocation(P1, 'uAlpha') };
    var L2 = { aA: gl.getAttribLocation(P2, 'aA'), aB: gl.getAttribLocation(P2, 'aB'), aK: gl.getAttribLocation(P2, 'aK'),
      uVP: gl.getUniformLocation(P2, 'uVP'), uRes: gl.getUniformLocation(P2, 'uRes'), uW: gl.getUniformLocation(P2, 'uW'), uCol: gl.getUniformLocation(P2, 'uCol') };
    gl.enable(gl.DEPTH_TEST); gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(1, 1); gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    function lineBuf(arr) {
      var ed = [], K = [[0, -1], [0, 1], [1, 1], [0, -1], [1, 1], [1, -1]];
      for (var i = 0; i < arr.length; i += 6) for (var k = 0; k < 6; k++) ed.push(arr[i], arr[i + 1], arr[i + 2], arr[i + 3], arr[i + 4], arr[i + 5], K[k][0], K[k][1]);
      var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ed), gl.STATIC_DRAW);
      return { buf: buf, n: ed.length / 8 };
    }
    function mkBatch(g) {
      var o = {}, buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(g.v), gl.STATIC_DRAW);
      o.buf = buf; o.n = g.v.length / 9;
      o.edge = lineBuf(g.e || []); o.grid = lineBuf(g.g || []);
      return o;
    }
    function drawFaces(b) {
      if (!b.n) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, b.buf);
      gl.enableVertexAttribArray(L1.aPos); gl.vertexAttribPointer(L1.aPos, 3, gl.FLOAT, false, 36, 0);
      gl.enableVertexAttribArray(L1.aNor); gl.vertexAttribPointer(L1.aNor, 3, gl.FLOAT, false, 36, 12);
      gl.enableVertexAttribArray(L1.aCol); gl.vertexAttribPointer(L1.aCol, 3, gl.FLOAT, false, 36, 24);
      gl.drawArrays(gl.TRIANGLES, 0, b.n);
    }
    function drawLines(l) {
      if (!l.n) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, l.buf);
      gl.enableVertexAttribArray(L2.aA); gl.vertexAttribPointer(L2.aA, 3, gl.FLOAT, false, 32, 0);
      gl.enableVertexAttribArray(L2.aB); gl.vertexAttribPointer(L2.aB, 3, gl.FLOAT, false, 32, 12);
      gl.enableVertexAttribArray(L2.aK); gl.vertexAttribPointer(L2.aK, 2, gl.FLOAT, false, 32, 24);
      gl.drawArrays(gl.TRIANGLES, 0, l.n);
    }

    var stat = mkBatch(buildStatic()), shad = mkBatch(buildShadows());
    var tents = booths.slice(0, SLOTS.length).map(function (bo, i) {
      var s = SLOTS[i], col = hex(bo.color || '#1DB954'), t = buildTent(s.x, s.z, s.r, col);
      return { id: bo.id, name: bo.name, rot: s.r, color: col, hexColor: bo.color, batch: mkBatch(t), pad: mkBatch(t.pad), min: t.min, max: t.max, c: t.c, glow: 0, glowT: 0, label: null };
    });

    tents.forEach(function (t) {
      var l = document.createElement('div');
      l.className = 'ex3-lab'; l.style.setProperty('--c', t.hexColor || '#1DB954');
      l.innerHTML = '<span>' + String(t.id).replace(/</g, '&lt;') + '</span><i>' + String(t.name).replace(/^Booth\s+/i, '').replace(/</g, '&lt;') + '</i>';
      box.appendChild(l); t.label = l;
    });
    // penanda area (gedung & lapangan)
    var tags = [{ txt: 'Gedung Sekolah', p: [0, 10.6, FZ - 2.3] }, { txt: 'Area Tengah', p: [0, 0.2, -0.5] }].map(function (o) {
      var d = document.createElement('div'); d.className = 'ex3-tag'; d.textContent = o.txt; box.appendChild(d); o.el = d; return o;
    });
    var hint = document.createElement('div'); hint.className = 'ex3-hint';
    hint.textContent = 'Geser untuk memutar · tap booth untuk masuk'; box.appendChild(hint);
    var panel = document.createElement('div'); panel.className = 'ex3-panel'; box.appendChild(panel);
    var panelHTML = '', panelColor = '#1DB954';
    function updatePanel() {
      panel.innerHTML = panelHTML; panel.style.setProperty('--c', panelColor);
      panel.classList.toggle('show', !!activeId && !!panelHTML); panel.scrollTop = 0;
    }
    var ui = document.createElement('div'); ui.className = 'ex3-ui';
    ui.innerHTML = '<button data-k="in" aria-label="Perbesar">＋</button><button data-k="out" aria-label="Perkecil">－</button><button data-k="reset" aria-label="Atur ulang tampilan">⟲</button>';
    box.appendChild(ui);

    // kamera (dengan intro: turun pelan dari atas)
    var HOME = { az: 0, el: 0.7, dist: 43, tx: 0, ty: 1, tz: 0.5 };
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
    var cam = reduce ? Object.assign({}, HOME) : { az: -0.55, el: 1.12, dist: 62, tx: 0, ty: 1, tz: 0.5 }, goal = Object.assign({}, HOME);
    var ease = reduce ? 0.14 : 0.045; if (!reduce) setTimeout(function () { ease = 0.14; }, 1800);
    var FOV = 0.66, W = 1, H = 1, DPR = 1, dirty = true, visible = true, interacted = false, hoverId = null, activeId = opts.active || null;
    var VP = null, camPos = [0, 0, 0], basis = null;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.5 : 2);
      W = Math.max(1, box.clientWidth); H = Math.max(1, box.clientHeight);
      canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
      gl.viewport(0, 0, canvas.width, canvas.height); dirty = true;
      var nd = 43 * Math.max(1, Math.pow(1.75 / (W / H), 0.6)), atHome = Math.abs(goal.dist - HOME.dist) < 0.01 && !interacted;
      HOME.dist = nd; if (atHome) { goal.dist = nd; if (reduce) cam.dist = nd; }
    }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(box); else window.addEventListener('resize', resize);
    resize();

    function clampGoal() {
      goal.el = Math.max(0.2, Math.min(1.4, goal.el));
      goal.dist = Math.max(4.5, Math.min(66, goal.dist));
    }
    // "masuk" ke booth: kamera berdiri di depan bukaan tenda dan menghadap mejanya
    function focusBooth(id) {
      var t = tents.filter(function (x) { return x.id === id; })[0];
      if (!t) return;
      var az = t.rot, k = Math.round((cam.az - az) / (2 * Math.PI)); az += k * 2 * Math.PI;
      var off = W >= 700 ? 1.8 : 0;            // geser agar booth tidak tertutup panel info
      goal.az = az; goal.el = 0.36; goal.dist = 7.6; goal.ty = 1.15;
      goal.tx = t.c[0] + Math.cos(az) * off; goal.tz = t.c[2] - Math.sin(az) * off;
      interacted = true; hint.style.opacity = 0; ease = 0.07; dirty = true;
    }
    function resetView() { Object.assign(goal, HOME); interacted = true; ease = 0.08; dirty = true; }
    function exitBooth() { activeId = null; updatePanel(); resetView(); }

    function updateMatrices(t) {
      var drift = (!interacted && !reduce) ? Math.sin(t / 4200) * 0.3 : 0;
      var az = cam.az + drift;
      camPos = [cam.tx + cam.dist * Math.cos(cam.el) * Math.sin(az), cam.ty + cam.dist * Math.sin(cam.el), cam.tz + cam.dist * Math.cos(cam.el) * Math.cos(az)];
      basis = lookAt(camPos, [cam.tx, cam.ty, cam.tz], [0, 1, 0]);
      VP = mul(perspective(FOV, W / H, 0.5, 300), basis.m);
    }
    function project(p) {
      var m = VP, x = m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12], y = m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13],
        w = m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15];
      if (w <= 0) return null;
      return [(x / w * 0.5 + 0.5) * W, (1 - (y / w * 0.5 + 0.5)) * H];
    }
    function pick(px, py) {
      var nx = px / W * 2 - 1, ny = 1 - py / H * 2, th = Math.tan(FOV / 2), as = W / H;
      var f = [-basis.z[0], -basis.z[1], -basis.z[2]];
      var dir = norm([f[0] + basis.x[0] * nx * th * as + basis.y[0] * ny * th, f[1] + basis.x[1] * nx * th * as + basis.y[1] * ny * th, f[2] + basis.x[2] * nx * th * as + basis.y[2] * ny * th]);
      var best = null, bt = 1e9;
      tents.forEach(function (t) {
        var t0 = -1e9, t1 = 1e9, ok = true;
        for (var k = 0; k < 3; k++) {
          if (Math.abs(dir[k]) < 1e-6) { if (camPos[k] < t.min[k] || camPos[k] > t.max[k]) ok = false; continue; }
          var a = (t.min[k] - camPos[k]) / dir[k], b = (t.max[k] - camPos[k]) / dir[k];
          if (a > b) { var s = a; a = b; b = s; }
          t0 = Math.max(t0, a); t1 = Math.min(t1, b);
        }
        if (ok && t0 <= t1 && t1 > 0 && t0 < bt) { bt = t0; best = t; }
      });
      return best;
    }

    function frame(t) {
      if (!visible) return;
      var moving = false;
      ['az', 'el', 'dist', 'tx', 'ty', 'tz'].forEach(function (k) {
        var d = goal[k] - cam[k];
        if (Math.abs(d) > 0.0006) { cam[k] += d * ease; moving = true; } else cam[k] = goal[k];
      });
      tents.forEach(function (tt) {
        tt.glowT = tt.id === activeId ? 1 : (tt.id === hoverId ? 0.55 : 0);
        var d = tt.glowT - tt.glow;
        if (Math.abs(d) > 0.01) { tt.glow += d * 0.2; moving = true; } else tt.glow = tt.glowT;
      });
      var drifting = !interacted && !reduce, pulsing = activeId != null;
      if (dirty || moving || drifting || pulsing) {
        updateMatrices(t);
        var vp = new Float32Array(VP);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // 1. permukaan padat
        gl.useProgram(P1); gl.uniformMatrix4fv(L1.uVP, false, vp);
        gl.uniform1f(L1.uGlow, 0); gl.uniform3f(L1.uTint, 1, 1, 1); gl.uniform1f(L1.uAlpha, 1); drawFaces(stat);
        // 2. bayangan lembut
        gl.depthMask(false); gl.uniform1f(L1.uAlpha, 0.24); drawFaces(shad);
        // 3. alas penanda booth aktif/hover (berdenyut)
        tents.forEach(function (tt) {
          if (tt.glow < 0.02) return;
          gl.uniform1f(L1.uAlpha, tt.glow * (0.28 + 0.12 * Math.sin(t / 260))); gl.uniform1f(L1.uGlow, 0); drawFaces(tt.pad);
        });
        gl.depthMask(true); gl.uniform1f(L1.uAlpha, 1);
        // 4. tenda
        tents.forEach(function (tt) { gl.uniform1f(L1.uGlow, tt.glow); gl.uniform3fv(L1.uTint, tt.color); drawFaces(tt.batch); });
        gl.disableVertexAttribArray(L1.aPos); gl.disableVertexAttribArray(L1.aNor); gl.disableVertexAttribArray(L1.aCol);
        // 5. garis
        gl.useProgram(P2); gl.uniformMatrix4fv(L2.uVP, false, vp); gl.uniform2f(L2.uRes, canvas.width, canvas.height);
        gl.depthMask(false);
        gl.uniform1f(L2.uW, 1 * DPR); gl.uniform4f(L2.uCol, 1, 1, 1, 0.075); drawLines(stat.grid);     // petak paving
        gl.depthMask(true);
        gl.uniform1f(L2.uW, (W < 500 ? 1.1 : 1.5) * DPR); gl.uniform4f(L2.uCol, GREEN[0], GREEN[1], GREEN[2], 1); // tepi hijau
        drawLines(stat.edge); tents.forEach(function (tt) { drawLines(tt.batch.edge); });
        gl.disableVertexAttribArray(L2.aA); gl.disableVertexAttribArray(L2.aB); gl.disableVertexAttribArray(L2.aK);
        // label
        var entered = !!activeId && cam.dist < 26;
        tents.forEach(function (tt) {
          var p = project([tt.c[0], 4.3, tt.c[2]]);
          if (!p || (entered && tt.id !== activeId && tt.id !== hoverId)) { tt.label.style.opacity = 0; return; }
          tt.label.style.opacity = 1;
          tt.label.style.transform = 'translate(' + Math.round(p[0]) + 'px,' + Math.round(p[1]) + 'px) translate(-50%,-100%)';
          tt.label.classList.toggle('on', tt.id === activeId || tt.id === hoverId);
          tt.label.style.zIndex = tt.id === activeId ? 3 : (tt.id === hoverId ? 2 : 1);
        });
        tags.forEach(function (o) {
          var p = project(o.p);
          if (!p || entered) { o.el.style.opacity = 0; return; }
          o.el.style.opacity = 1;
          o.el.style.transform = 'translate(' + Math.round(p[0]) + 'px,' + Math.round(p[1]) + 'px) translate(-50%,-50%)';
        });
        dirty = false;
      }
      raf = requestAnimationFrame(frame);
    }
    var raf = requestAnimationFrame(frame);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        var was = visible; visible = e[0].isIntersecting;
        if (visible && !was) { dirty = true; raf = requestAnimationFrame(frame); }
      }, { threshold: 0.01 }).observe(box);
    }

    // interaksi
    var ptrs = {}, moved = 0, lastPinch = 0, downPt = null;
    function rel(e) { var r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    function touch() { interacted = true; ease = 0.14; hint.style.opacity = 0; }
    box.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.ex3-ui, .ex3-panel')) return;
      ptrs[e.pointerId] = { x: e.clientX, y: e.clientY, type: e.pointerType };
      downPt = { x: e.clientX, y: e.clientY }; moved = 0;
      try { box.setPointerCapture(e.pointerId); } catch (er) {}
      box.classList.add('drag');
      var ids = Object.keys(ptrs);
      if (ids.length === 2) { var a = ptrs[ids[0]], b = ptrs[ids[1]]; lastPinch = Math.hypot(a.x - b.x, a.y - b.y); }
    });
    box.addEventListener('pointermove', function (e) {
      var p = ptrs[e.pointerId];
      if (!p) {
        if (e.pointerType === 'mouse') {
          var q = rel(e), t = pick(q[0], q[1]), id = t ? t.id : null;
          if (id !== hoverId) { hoverId = id; box.classList.toggle('hover', !!id); dirty = true; }
        }
        return;
      }
      var dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
      var ids = Object.keys(ptrs);
      if (ids.length >= 2) {
        var a = ptrs[ids[0]], b = ptrs[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (lastPinch) { goal.dist *= lastPinch / d; clampGoal(); touch(); dirty = true; }
        lastPinch = d;
      } else if (moved > 4) {
        goal.az -= dx * 0.006; cam.az = goal.az;
        if (p.type !== 'touch') { goal.el += dy * 0.005; cam.el = goal.el; }
        clampGoal(); touch(); dirty = true;
      }
    });
    function up(e) {
      var p = ptrs[e.pointerId]; delete ptrs[e.pointerId]; lastPinch = 0; box.classList.remove('drag');
      if (p && downPt && moved <= 6 && e.type === 'pointerup' && !Object.keys(ptrs).length) {
        var q = rel(e), t = pick(q[0], q[1]);
        if (t) { touch(); setActive(t.id); if (opts.onSelect) opts.onSelect(t.id); }
      }
    }
    box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);
    box.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && hoverId) { hoverId = null; box.classList.remove('hover'); dirty = true; } });
    box.addEventListener('wheel', function (e) {
      if (!e.ctrlKey && !e.metaKey) return;      // scroll biasa tetap menggulir halaman
      e.preventDefault(); goal.dist *= Math.exp(e.deltaY * 0.0025); clampGoal(); touch(); dirty = true;
    }, { passive: false });
    box.addEventListener('dblclick', function (e) { if (e.target.closest('.ex3-panel')) return; exitBooth(); });
    ui.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; touch();
      if (b.dataset.k === 'in') goal.dist *= 0.8; else if (b.dataset.k === 'out') goal.dist *= 1.25; else { exitBooth(); }
      clampGoal(); dirty = true;
    });

    function setActive(id) { activeId = id; if (id) focusBooth(id); updatePanel(); dirty = true; }
    function setPanel(html, color) { panelHTML = html || ''; panelColor = color || '#1DB954'; updatePanel(); }
    if (activeId) focusBooth(activeId);
    return { setActive: setActive, setPanel: setPanel, reset: exitBooth, resize: resize, boothCount: tents.length };
  }

  window.Expo3D = { init: init };
})();
