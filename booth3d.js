// ============================================================
// KOPITAISAN CAMPUS EXPO — DENAH 3D v3 (WebGL murni, tanpa library)
// Suasana "senja elegan": langit berbintang, gedung sekolah berbentuk U,
// 15 tenda dengan lampu warna masing-masing, lampu gantung, kunang-kunang,
// kabut jarak, bayangan lembut, dan lingkaran "play" hijau di tengah lapangan.
// Klik tenda = kamera terbang masuk ke booth.
// File ini tidak perlu diedit. Data booth ada di data.js
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
  function mulberry(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function shade(c, k) { return [Math.min(1, c[0] * k), Math.min(1, c[1] * k), Math.min(1, c[2] * k)]; }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function tint(c, k) { return mix(c, [1, 1, 1], Math.min(1, k - 1)); }
 
  // ---------- pembangun geometri ----------
  // v = permukaan (10 angka per titik: posisi, normal, warna, emisi)
  // e = garis tepi, g = garis paving, f = kabel lampu gantung
  function Builder() { this.v = []; this.e = []; this.g = []; this.f = []; this.em = 0; this.x = { tx: 0, tz: 0, c: 1, s: 0 }; }
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
    var v = this.v, em = this.em, cols = col.length === 3 && typeof col[0] === 'object' ? col : [col, col, col];
    [a, b, c].forEach(function (p, i) { v.push(p[0], p[1], p[2], n[0], n[1], n[2], cols[i][0], cols[i][1], cols[i][2], em); });
  };
  Builder.prototype.quad = function (a, b, c, d, col, ctr) { this.tri(a, b, c, col, ctr); this.tri(a, c, d, col, ctr); };
  Builder.prototype.gquad = function (a, b, c, d, cols, ctr) { this.tri(a, b, c, [cols[0], cols[1], cols[2]], ctr); this.tri(a, c, d, [cols[0], cols[2], cols[3]], ctr); };
  Builder.prototype.line = function (a, b) { a = this.P(a); b = this.P(b); this.e.push(a[0], a[1], a[2], b[0], b[1], b[2]); };
  Builder.prototype.gline = function (a, b) { a = this.P(a); b = this.P(b); this.g.push(a[0], a[1], a[2], b[0], b[1], b[2]); };
  Builder.prototype.fline = function (a, b) { a = this.P(a); b = this.P(b); this.f.push(a[0], a[1], a[2], b[0], b[1], b[2]); };
  Builder.prototype.box = function (cx, cy, cz, sx, sy, sz, col, edge) {
    var x0 = cx - sx / 2, x1 = cx + sx / 2, y0 = cy - sy / 2, y1 = cy + sy / 2, z0 = cz - sz / 2, z1 = cz + sz / 2, c = [cx, cy, cz], self = this;
    var p = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
    [[0, 1, 2, 3], [5, 4, 7, 6], [4, 0, 3, 7], [1, 5, 6, 2], [3, 2, 6, 7], [4, 5, 1, 0]].forEach(function (f) {
      self.quad(p[f[0]], p[f[1]], p[f[2]], p[f[3]], col, c);
    });
    if (edge) [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(function (k) { self.line(p[k[0]], p[k[1]]); });
  };
  // limas terpotong
  Builder.prototype.frustum = function (cx, y0, cz, sx, sz, h, tx, tz, col, edge) {
    var b = [[cx - sx / 2, y0, cz - sz / 2], [cx + sx / 2, y0, cz - sz / 2], [cx + sx / 2, y0, cz + sz / 2], [cx - sx / 2, y0, cz + sz / 2]];
    var t = [[cx - tx / 2, y0 + h, cz - tz / 2], [cx + tx / 2, y0 + h, cz - tz / 2], [cx + tx / 2, y0 + h, cz + tz / 2], [cx - tx / 2, y0 + h, cz + tz / 2]];
    var c = [cx, y0 + h / 2, cz], self = this;
    for (var i = 0; i < 4; i++) {
      var j = (i + 1) % 4, k = (i === 2) ? 1.08 : (i === 0 ? 0.92 : 0.84);
      self.quad(b[i], b[j], t[j], t[i], shade(col, k), c);
      if (edge) { self.line(b[i], b[j]); self.line(t[i], t[j]); self.line(b[i], t[i]); }
    }
    self.quad(t[0], t[1], t[2], t[3], col, c);
  };
  // prisma segi-n (tiang, pohon, orang)
  Builder.prototype.prism = function (cx, y0, cz, r0, r1, h, n, col, edge) {
    var c = [cx, y0 + h / 2, cz], self = this;
    for (var i = 0; i < n; i++) {
      var A = i / n * Math.PI * 2, B = (i + 1) / n * Math.PI * 2;
      var p0 = [cx + Math.cos(A) * r0, y0, cz + Math.sin(A) * r0], p1 = [cx + Math.cos(B) * r0, y0, cz + Math.sin(B) * r0];
      var q0 = [cx + Math.cos(A) * r1, y0 + h, cz + Math.sin(A) * r1], q1 = [cx + Math.cos(B) * r1, y0 + h, cz + Math.sin(B) * r1];
      self.quad(p0, p1, q1, q0, col, c);
      self.tri([cx, y0 + h, cz], q0, q1, col, c);
      if (edge) { self.line(p0, p1); self.line(q0, q1); self.line(p0, q0); }
    }
  };
  // cincin datar di lantai
  Builder.prototype.ring = function (cx, cz, r0, r1, y, n, col) {
    for (var i = 0; i < n; i++) {
      var A = i / n * Math.PI * 2, B = (i + 1) / n * Math.PI * 2;
      this.quad([cx + Math.cos(A) * r0, y, cz + Math.sin(A) * r0], [cx + Math.cos(B) * r0, y, cz + Math.sin(B) * r0],
        [cx + Math.cos(B) * r1, y, cz + Math.sin(B) * r1], [cx + Math.cos(A) * r1, y, cz + Math.sin(A) * r1], col, [cx, -3, cz]);
    }
  };
  // atap lengkung
  Builder.prototype.arch = function (cx, y0, cz, rx, ry, depth, col, seg) {
    var z0 = cz - depth / 2, z1 = cz + depth / 2, c = [cx, y0, cz], self = this, prev = null;
    for (var i = 0; i <= seg; i++) {
      var a = Math.PI * i / seg, x = cx + Math.cos(a) * rx, y = y0 + Math.sin(a) * ry;
      if (prev) {
        self.quad([prev[0], prev[1], z0], [x, y, z0], [x, y, z1], [prev[0], prev[1], z1], shade(col, 0.9 + 0.25 * Math.sin(a)), c);
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
    groundFar: hex('#0c0f11'), groundNear: hex('#14181b'),
    plazaFar: hex('#2a2e33'), plazaNear: hex('#454a51'), curb: hex('#6d737b'),
    wall: hex('#4c5158'), wallLight: hex('#5d636b'), roof: hex('#2a2e33'), roofTop: hex('#363b41'), roofDark: hex('#2d3136'),
    glass: hex('#0d1114'), glassLit: hex('#c8995a'), glassGreen: hex('#2e8f5e'), frame: hex('#8b919a'),
    door: hex('#8c6a3a'), bigGlass: hex('#216e4b'),
    tentWall: hex('#d9dde3'), tentRoof: hex('#f2f3f6'), post: hex('#c4c7ce'), valance: hex('#bcc0c8'), table: hex('#d6d0c4'),
    pole: hex('#2a2d31'), trunk: hex('#3a3029')
  };
  var TENT = { w: 3.6, d: 2.8, h: 2.3 };
  var PLAZA = { x0: -15, x1: 15, z0: -11, z1: 13 };
  var FZ = -11.6;       // sisi depan sayap belakang
  var WX = 15.6;        // sisi dalam sayap kiri/kanan (|x|)
  var WZ1 = 13.8;       // ujung sayap kiri/kanan
  var CENTER = [0, 1.2];
  // 15 booth membentuk huruf U:
  // B1–B5 lengan kiri (jauh → dekat), B6–B10 baris bawah (kiri → kanan), B11–B15 lengan kanan (dekat → jauh)
  var SLOTS = (function () {
    var s = [], step = 3.8, zb = 10, ax = 11.05, i;
    for (i = 0; i < 5; i++) s.push({ x: -ax, z: zb - (4 - i) * step, r: Math.PI / 2 });
    for (i = 0; i < 5; i++) s.push({ x: -7.6 + i * step, z: zb, r: Math.PI });
    for (i = 0; i < 5; i++) s.push({ x: ax, z: zb - i * step, r: -Math.PI / 2 });
    return s;
  })();
 
  function win(b, cx, cy, z0, lit) {
    b.em = lit ? 1 : 0;
    b.box(cx, cy, z0 + 0.03, 1.8, 1.15, 0.06, lit ? (lit === 2 ? C.glassGreen : C.glassLit) : C.glass);
    b.em = 0;
    b.box(cx, cy, z0 + 0.07, 0.07, 1.15, 0.04, C.frame);
    b.box(cx, cy + 0.1, z0 + 0.07, 1.8, 0.05, 0.04, C.frame);
    b.box(cx, cy - 0.62, z0 + 0.1, 2.05, 0.07, 0.16, C.frame);
  }
  function litPick(rnd) { var r = rnd(); return r < 0.26 ? (rnd() < 0.4 ? 2 : 1) : 0; }
 
  function tree(b, x, z, s, k) {
    var g1 = mix(hex('#173a29'), hex('#1f5a3c'), k), g2 = mix(hex('#1b4632'), hex('#27704a'), k);
    b.prism(x, 0, z, 0.2 * s, 0.16 * s, 1.0 * s, 6, C.trunk);
    b.prism(x, 0.8 * s, z, 1.7 * s, 0.25 * s, 2.0 * s, 7, g1);
    b.prism(x, 2.0 * s, z, 1.3 * s, 0.2 * s, 1.8 * s, 7, g2);
    b.prism(x, 3.1 * s, z, 0.9 * s, 0.05 * s, 1.6 * s, 7, g1);
  }
 
  var TREES = (function () {
    var r = mulberry(21), a = [], i, z;
    for (z = -15; z <= 19; z += 4.6) { a.push([-(25.5 + r() * 7), z + r() * 2, 0.9 + r() * 0.5, r()]); a.push([25.5 + r() * 7, z + r() * 2, 0.9 + r() * 0.5, r()]); }
    for (i = -34; i <= 34; i += 6.4) a.push([i + r() * 2, -24 - r() * 5, 1.1 + r() * 0.6, r()]);
    for (i = -34; i <= 34; i += 8) a.push([i + r() * 3, 24 + r() * 6, 1 + r() * 0.5, r()]);
    return a;
  })();
 
  function buildStatic() {
    var b = new Builder(), P = PLAZA, rnd = mulberry(7), i, x, z, y;
    // tanah luas
    b.gquad([-240, 0, -140], [240, 0, -140], [240, 0, 180], [-240, 0, 180], [C.groundFar, C.groundFar, C.groundNear, C.groundNear], [0, -5, 0]);
    // lapangan paving
    y = 0.02;
    b.gquad([P.x0, y, P.z0], [P.x1, y, P.z0], [P.x1, y, P.z1], [P.x0, y, P.z1], [C.plazaFar, C.plazaFar, C.plazaNear, C.plazaNear], [0, -5, 0]);
    y = 0.03;
    for (x = P.x0; x <= P.x1 + 0.01; x += 2.5) b.gline([x, y, P.z0], [x, y, P.z1]);
    for (z = P.z0; z <= P.z1 + 0.01; z += 2.4) b.gline([P.x0, y, z], [P.x1, y, z]);
    // jalur masuk dari pintu gedung ke tengah
    b.quad([-1.7, 0.034, -10.4], [1.7, 0.034, -10.4], [1.7, 0.034, -4.4], [-1.7, 0.034, -4.4], hex('#1c3a2c'), [0, -3, -7]);
    b.line([-1.7, 0.04, -10.4], [-1.7, 0.04, -4.4]); b.line([1.7, 0.04, -10.4], [1.7, 0.04, -4.4]);
    // pinggiran
    var cz = (P.z0 + P.z1) / 2;
    b.box(P.x0 - 0.25, 0.11, cz, 0.5, 0.22, P.z1 - P.z0 + 0.5, C.curb, true);
    b.box(P.x1 + 0.25, 0.11, cz, 0.5, 0.22, P.z1 - P.z0 + 0.5, C.curb, true);
    b.box(0, 0.11, P.z1 + 0.25, P.x1 - P.x0 + 1, 0.22, 0.5, C.curb, true);
 
    // ===== gedung sekolah berbentuk U =====
    b.box(0, 3.1, FZ - 2.7, 44, 6.2, 5.4, C.wall, true);                       // sayap belakang
    b.box(-18.8, 3.1, 1.1, 6.4, 6.2, 25.4, C.wall, true);                      // sayap kiri
    b.box(18.8, 3.1, 1.1, 6.4, 6.2, 25.4, C.wall, true);                       // sayap kanan
    // atap datar bergaris hijau
    b.box(0, 6.45, -14.3, 45, 0.5, 6.5, C.roof, true); b.box(0, 6.72, -14.3, 43.6, 0.06, 5.2, C.roofTop);
    b.box(-18.8, 6.45, 1.625, 7.4, 0.5, 25.35, C.roof, true); b.box(-18.8, 6.72, 1.625, 6, 0.06, 23.9, C.roofTop);
    b.box(18.8, 6.45, 1.625, 7.4, 0.5, 25.35, C.roof, true); b.box(18.8, 6.72, 1.625, 6, 0.06, 23.9, C.roofTop);
    b.box(0, 3.2, FZ + 0.1, 44, 0.2, 0.34, C.wallLight);                       // pita antar-lantai (belakang)
 
    // jendela sayap belakang
    for (i = 0; i < 6; i++) {
      var wx = 6.75 + i * 2.75;
      [-wx, wx].forEach(function (sx) { win(b, sx, 1.75, FZ, litPick(rnd)); win(b, sx, 4.7, FZ, litPick(rnd)); });
    }
    for (i = 0; i < 7; i++) {
      var px = 5.375 + i * 2.75;
      [-px, px].forEach(function (sx) { b.box(sx, 3.1, FZ + 0.07, 0.28, 6.2, 0.14, C.wallLight); });
    }
    // jendela sisi dalam sayap kiri & kanan (menghadap lapangan)
    [[-WX, Math.PI / 2, -1], [WX, -Math.PI / 2, 1]].forEach(function (s) {
      b.xf(s[0], 0, s[1]);
      for (z = -9.6; z <= 12.3; z += 2.75) {
        var u = s[2] === -1 ? -z : z;                 // posisi lokal (kiri: -z, kanan: z)
        win(b, u, 1.75, 0, litPick(rnd)); win(b, u, 4.7, 0, litPick(rnd));
        var pu = s[2] === -1 ? -(z + 1.375) : (z + 1.375);
        b.box(pu, 3.1, 0.07, 0.28, 6.2, 0.14, C.wallLight);
      }
      b.box(s[2] === -1 ? -1.1 : 1.1, 3.2, 0.1, 25.4, 0.2, 0.34, C.wallLight);   // pita antar-lantai
    });
    b.xf(0, 0, 0);
    // jendela ujung sayap (menghadap penonton)
    [-18.8, 18.8].forEach(function (cx) {
      [-1.6, 1.6].forEach(function (dx) { win(b, cx + dx, 1.75, WZ1, litPick(rnd)); win(b, cx + dx, 4.7, WZ1, litPick(rnd)); });
      [-3.1, 0, 3.1].forEach(function (dx) { b.box(cx + dx, 3.1, WZ1 + 0.07, 0.28, 6.2, 0.14, C.wallLight); });
    });
 
    // teras tengah (portico) + atap lengkung
    var pcz = FZ - 2.3;
    b.box(0, 3.8, pcz, 9, 7.6, 7, C.wallLight, true);
    b.em = 1; b.box(0, 1.55, FZ + 1.23, 4.6, 3.1, 0.06, C.door); b.em = 0;       // pintu menyala hangat
    [-2.9, 2.9].forEach(function (sx) { b.box(sx, 1.55, FZ + 1.4, 0.34, 3.1, 0.34, C.frame); });
    b.box(0, 3.3, FZ + 1.45, 9.4, 0.22, 0.5, C.roofDark, true);
    b.em = 1; b.box(0, 5.2, FZ + 1.23, 6.8, 1.6, 0.06, C.bigGlass); b.em = 0;
    for (i = -3; i <= 3; i++) b.box(i * 0.97, 5.2, FZ + 1.27, 0.06, 1.6, 0.04, C.frame);
    b.box(0, 5.2, FZ + 1.27, 6.8, 0.05, 0.04, C.frame);
    b.box(0, 7.5, pcz, 10.6, 0.22, 8.4, C.roofDark, true);
    b.arch(0, 7.6, pcz, 5.5, 2.1, 8.4, C.roofDark, 14);
    b.box(0, 0.09, FZ + 2.2, 6.4, 0.18, 1.6, C.curb, true);
    b.box(0, 0.04, FZ + 3.1, 7.4, 0.08, 0.5, C.curb);
 
    // tiang lampu
    [[-14.4, -9.3], [14.4, -9.3], [-14.4, 11.9], [14.4, 11.9]].forEach(function (p) {
      b.prism(p[0], 0, p[1], 0.09, 0.07, 3.4, 6, C.pole);
      b.em = 1; b.box(p[0], 3.55, p[1], 0.34, 0.2, 0.34, hex('#ffd9a0')); b.em = 0;
    });
    // pohon
    TREES.forEach(function (t) { tree(b, t[0], t[1], t[2], t[3]); });
 
    // kabel lampu gantung (3 untai melintang lapangan)
    [-6.5, 0.5, 7.2].forEach(function (zz) {
      var prev = null, n = 36;
      for (i = 0; i <= n; i++) {
        var t = i / n, px2 = -WX + 0.3 + t * (2 * WX - 0.6), py = 5.45 - 0.95 * (1 - Math.pow(2 * t - 1, 2));
        if (prev) b.fline(prev, [px2, py, zz]);
        prev = [px2, py, zz];
      }
    });
 
    return { v: b.v, e: b.e, g: b.g, f: b.f };
  }
 
  // lingkaran emblem "play" di tengah lapangan
  function buildEmblem() {
    var b = new Builder(), y = 0.05, cx = CENTER[0], cz = CENTER[1], col = hex('#139a46');
    b.em = 1;
    b.ring(cx, cz, 5.0, 5.14, y, 64, col);
    b.ring(cx, cz, 3.9, 3.98, y, 64, shade(col, 0.7));
    for (var i = 0; i < 24; i++) {
      var a = i / 24 * Math.PI * 2, r = 4.45;
      b.box(cx + Math.cos(a) * r, y, cz + Math.sin(a) * r, 0.1, 0.02, 0.1, shade(col, 0.85));
    }
    b.tri([cx - 1.0, y, cz - 1.35], [cx - 1.0, y, cz + 1.35], [cx + 1.6, y, cz], col, [cx, -3, cz]);
    return { v: b.v, e: [], g: [], f: [] };
  }
 
  // bayangan lembut: [cx, cz, lebar, panjang, alpha, bentuk]
  function buildBlobs() {
    var a = [], y = 0.038;
    function blob(cx, cz, sx, sz, al, pw) {
      var q = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(function (k) { return [cx + k[0] * sx / 2, y, cz + k[1] * sz / 2, k[0], k[1], al]; });
      [0, 1, 2, 0, 2, 3].forEach(function (i) { a.push.apply(a, q[i]); });
    }
    SLOTS.forEach(function (s) {
      var rot = Math.abs(Math.sin(s.r)) > 0.5, sx = (rot ? TENT.d : TENT.w) + 1.3, sz = (rot ? TENT.w : TENT.d) + 1.3;
      blob(s.x + 0.55, s.z - 0.5, sx, sz, 0.55);
    });
    blob(-14.0, 1.4, 3.4, 27, 0.35);                       // bayangan sayap kiri jatuh ke lapangan
    blob(0.8, -10.4, 46, 3.4, 0.22);                       // bayangan sayap belakang
    TREES.forEach(function (t) { var r = 2.4 * t[2]; blob(t[0] + 0.7, t[1] - 0.5, r * 2, r * 2, 0.45); });
    return a;
  }
 
  // lampu bercahaya (titik): [x,y,z, r,g,b,ukuran, jenis, seed]
  // jenis 0 = bohlam kedip, 1 = kunang-kunang melayang, 2 = cahaya tetap
  function buildPoints() {
    var a = [], rnd = mulberry(11), i;
    function pt(x, y, z, r, g, b, s, k, sd) { a.push(x, y, z, r, g, b, s, k, sd); }
    [-6.5, 0.5, 7.2].forEach(function (zz) {
      for (i = 0; i <= 36; i++) {
        var t = i / 36, x = -WX + 0.3 + t * (2 * WX - 0.6), y = 5.45 - 0.95 * (1 - Math.pow(2 * t - 1, 2));
        pt(x, y - 0.1, zz, 1, 0.82, 0.5, 0.62, 0, rnd());
      }
    });
    [[-14.4, -9.3], [14.4, -9.3], [-14.4, 11.9], [14.4, 11.9]].forEach(function (p) {
      pt(p[0], 3.55, p[1], 1, 0.88, 0.6, 2.4, 2, 0);
      pt(p[0], 3.4, p[1], 0.35, 0.28, 0.16, 7, 2, 0);
    });
    pt(0, 3.0, FZ + 1.7, 0.45, 0.32, 0.16, 7.5, 2, 0);
    for (i = 0; i < 64; i++) {
      var warm = rnd() < 0.3;
      pt((rnd() - 0.5) * 42, 0.7 + rnd() * 5.2, -12 + rnd() * 28, warm ? 1 : 0.35, warm ? 0.85 : 1, warm ? 0.5 : 0.6, 0.28 + rnd() * 0.25, 1, rnd());
    }
    return a;
  }
 
  // satu tenda (lokal: sisi depan terbuka menghadap +z)
  function buildTent(tx, tz, rot, col) {
    var b = new Builder(), w = TENT.w, d = TENT.d, h = TENT.h, pts = [];
    var accDark = shade(col, 0.55), mat = shade(col, 0.4), cloth = hex('#e9ecf0'), skin = hex('#c9a58a');
    b.xf(tx, tz, rot);
    b.box(0, 0.04, 0, w - 0.1, 0.05, d - 0.1, mat);                                  // karpet warna booth
    b.box(0, h / 2, -d / 2 + 0.04, w, h, 0.08, C.tentWall);                          // dinding belakang
    b.box(-w / 2 + 0.04, h / 2, 0, 0.08, h, d, shade(C.tentWall, 0.93));             // dinding kiri
    b.box(w / 2 - 0.04, h / 2, 0, 0.08, h, d, shade(C.tentWall, 0.93));              // dinding kanan
    b.box(-w / 2 + 0.07, h / 2, d / 2 - 0.07, 0.12, h, 0.12, C.post);                // tiang depan
    b.box(w / 2 - 0.07, h / 2, d / 2 - 0.07, 0.12, h, 0.12, C.post);
    b.box(0, h - 0.2, d / 2 - 0.03, w - 0.1, 0.4, 0.06, C.valance);                  // lis depan
    b.em = 1; b.box(0, h - 0.43, d / 2 - 0.01, w - 0.1, 0.07, 0.07, col); b.em = 0;  // strip LED warna booth
    b.box(0, 1.55, -d / 2 + 0.1, w * 0.62, 1.05, 0.03, accDark);                     // banner belakang
    b.em = 0.8;
    b.box(0, 1.98, -d / 2 + 0.12, w * 0.62 - 0.2, 0.06, 0.02, tint(col, 1.3));
    b.box(0, 1.12, -d / 2 + 0.12, w * 0.62 - 0.2, 0.06, 0.02, tint(col, 1.3));
    b.box(0, 1.55, -d / 2 + 0.12, 0.5, 0.5, 0.02, col);
    b.em = 0;
    b.box(0, h + 0.05, 0, w + 0.08, 0.1, d + 0.08, C.tentRoof, true);                // lis atap
    b.frustum(0, h + 0.1, 0, w - 0.04, d - 0.04, 0.9, 0.62, 0.5, C.tentRoof, true);  // atap limas
    // bendera kecil di puncak
    var ay = h + 1.0;
    b.box(0, ay + 0.4, 0, 0.05, 0.8, 0.05, C.post);
    b.em = 0.7; b.tri([0, ay + 0.78, 0], [0, ay + 0.38, 0], [0.75, ay + 0.58, 0], col, [0, ay + 0.58, -1]); b.em = 0;
    // meja
    var tz0 = 0.2;
    b.box(0, 0.77, tz0, w * 0.74, 0.07, 0.72, C.table, true);
    b.box(0, 0.4, tz0 + 0.345, w * 0.74 - 0.04, 0.7, 0.03, cloth);
    b.em = 0.9; b.box(0, 0.62, tz0 + 0.365, w * 0.74 - 0.2, 0.1, 0.02, col); b.em = 0;
    // laptop & brosur di atas meja
    b.box(-0.9, 0.84, tz0, 0.55, 0.04, 0.38, hex('#2a2d32'));
    b.box(-0.9, 1.02, tz0 - 0.17, 0.55, 0.34, 0.025, hex('#1a1c20'));
    b.em = 1; b.box(-0.9, 1.02, tz0 - 0.15, 0.48, 0.27, 0.01, shade(col, 0.9)); b.em = 0;
    b.box(0.95, 0.85, tz0 + 0.05, 0.3, 0.07, 0.22, col);
    b.box(0.95, 0.92, tz0 + 0.05, 0.3, 0.07, 0.22, tint(col, 1.35));
    b.box(0.45, 0.83, tz0 + 0.1, 0.22, 0.05, 0.3, cloth);
    // dua kakak yang berjaga (sosok sederhana)
    [[-0.15, hex('#2b2e33'), 0], [0.6, tint(col, 1.45), 1]].forEach(function (p) {
      b.prism(p[0], 0.0, -0.62, 0.22, 0.17, 0.94, 8, p[1]);
      b.prism(p[0], 0.94, -0.62, 0.12, 0.12, 0.24, 8, skin);
    });
    // garis tepi badan tenda
    var x0 = -w / 2, x1 = w / 2, z0 = -d / 2, z1 = d / 2, p = [[x0, 0, z0], [x1, 0, z0], [x1, h, z0], [x0, h, z0], [x0, 0, z1], [x1, 0, z1], [x1, h, z1], [x0, h, z1]];
    [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(function (k) { b.line(p[k[0]], p[k[1]]); });
    // halo warna di atas pintu + cahaya hangat di dalam
    var hv = b.P([0, h - 0.3, d / 2 + 0.2]), iv = b.P([0, 1.9, -0.2]);
    pts.push(hv[0], hv[1], hv[2], col[0] * 0.55, col[1] * 0.55, col[2] * 0.55, 3.4, 2, 0);
    pts.push(iv[0], iv[1], iv[2], 0.42, 0.34, 0.2, 3.2, 2, 0);
    // kotak pilih (AABB dunia)
    var cs = [[-w / 2, 0, -d / 2], [w / 2, 0, d / 2], [-w / 2, h + 1.3, -d / 2], [w / 2, h + 1.3, d / 2]].map(function (q) { return b.P(q); });
    var mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
    cs.forEach(function (q) { for (var k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], q[k]); mx[k] = Math.max(mx[k], q[k]); } });
    // alas penanda
    var pd = new Builder(), pw = w + 0.9, pdp = d + 0.9, py = 0.045;
    pd.xf(tx, tz, rot);
    pd.quad([-pw / 2, py, -pdp / 2], [pw / 2, py, -pdp / 2], [pw / 2, py, pdp / 2], [-pw / 2, py, pdp / 2], col, [0, -3, 0]);
    return { v: b.v, e: b.e, g: [], f: [], pad: { v: pd.v, e: [], g: [], f: [] }, pts: pts, min: mn, max: mx, c: [(mn[0] + mx[0]) / 2, 0, (mn[2] + mx[2]) / 2] };
  }
 
  // ---------- shader ----------
  var FPREC = '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n';
  // langit berbintang (layar penuh)
  var SVS = 'attribute vec2 aQ;varying vec2 vUv;void main(){vUv=aQ*.5+.5;gl_Position=vec4(aQ,.999,1.);}';
  var SFS = FPREC + 'varying vec2 vUv;uniform float uT;uniform float uAsp;' +
    'float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}' +
    'void main(){vec3 top=vec3(.018,.026,.034);vec3 hor=vec3(.055,.082,.088);' +
    'vec3 c=mix(hor,top,smoothstep(.3,1.,vUv.y));' +
    'vec2 g=(vUv-vec2(.5,.36))*vec2(1.,2.1);c+=exp(-dot(g,g)*4.)*vec3(.03,.2,.11);' +
    'vec2 q=vUv*vec2(uAsp,1.)*70.;vec2 id=floor(q);vec2 f=fract(q)-.5;float h=h21(id);' +
    'vec2 o=(vec2(h21(id+3.1),h21(id+7.7))-.5)*.6;float s=step(.955,h)*smoothstep(.1,.0,length(f-o));' +
    's*=.55+.45*sin(uT*.001*(1.+h*3.)+h*40.);c+=s*vec3(.8,.95,.9)*smoothstep(.45,.85,vUv.y);' +
    'gl_FragColor=vec4(c,1.);}';
  // permukaan padat
  var VS = 'attribute vec3 aPos;attribute vec3 aNor;attribute vec3 aCol;attribute float aEm;uniform mat4 uVP;' +
    'varying vec3 vCol;varying vec3 vNor;varying vec3 vPos;varying float vEm;' +
    'void main(){vCol=aCol;vNor=aNor;vPos=aPos;vEm=aEm;gl_Position=uVP*vec4(aPos,1.);}';
  var FS = FPREC + 'varying vec3 vCol;varying vec3 vNor;varying vec3 vPos;varying float vEm;' +
    'uniform float uGlow;uniform vec3 uTint;uniform float uAlpha;uniform vec3 uCam;uniform vec3 uSpot;uniform vec3 uSpotCol;uniform float uSpotI;uniform vec3 uFog;' +
    'void main(){vec3 n=normalize(vNor);' +
    'float d1=max(dot(n,normalize(vec3(-.35,.85,.45))),0.);float d2=max(dot(n,normalize(vec3(.6,.2,.7))),0.);' +
    'float hemi=.34+.30*(n.y*.5+.5);' +
    'vec3 c=vCol*(hemi+.42*d1+.20*d2)*vec3(.96,1.,1.04);' +
    'float up=smoothstep(.45,.9,n.y);' +
    'vec2 dp=vPos.xz-vec2(0.,1.2);c+=vCol*up*vec3(.05,.22,.12)*exp(-dot(dp,dp)/170.);' +
    'vec2 ds=vPos.xz-uSpot.xz;float sp=exp(-dot(ds,ds)/(uSpot.y*uSpot.y))*uSpotI;' +
    'c+=uSpotCol*sp*(up*.45+(1.-up)*.12);' +
    'c=mix(c,uTint,uGlow*.22);' +
    'c=mix(c,vCol*(1.15+.6*uGlow),clamp(vEm,0.,1.));' +
    'float dist=length(vPos-uCam);float f=1.-exp(-pow(dist*.0105,1.5));' +
    'c=mix(c,uFog,clamp(f,0.,.92));gl_FragColor=vec4(c,uAlpha);}';
  // garis tepi tebal (kuad di ruang layar)
  var EVS = 'attribute vec3 aA;attribute vec3 aB;attribute vec2 aK;uniform mat4 uVP;uniform vec2 uRes;uniform float uW;varying float vD;' +
    'void main(){vec4 pa=uVP*vec4(aA,1.);vec4 pb=uVP*vec4(aB,1.);' +
    'vec2 sa=pa.xy/pa.w*uRes*.5;vec2 sb=pb.xy/pb.w*uRes*.5;vec2 d=sb-sa;float l=length(d);d=l>.0001?d/l:vec2(1.,0.);' +
    'vec2 n=vec2(-d.y,d.x);vec4 p=mix(pa,pb,aK.x);p.xy+=n*aK.y*(uW/uRes)*p.w;p.z-=.0006*p.w;vD=p.w;gl_Position=p;}';
  var EFS = 'precision mediump float;uniform vec4 uCol;varying float vD;' +
    'void main(){float k=clamp(1.-(vD-45.)/150.,.2,1.);gl_FragColor=vec4(uCol.rgb,uCol.a*k);}';
  // titik cahaya
  var PVS = 'attribute vec3 aP;attribute vec4 aC;attribute vec2 aM;uniform mat4 uVP;uniform float uT;uniform float uPx;varying vec3 vC;varying float vA;' +
    'void main(){vec3 p=aP;float k=aM.x;float s=aM.y;float a=1.;' +
    'if(k>.5&&k<1.5){p.x+=sin(uT*.00031+s*6.28)*1.6+sin(uT*.00071+s*31.)*.5;p.z+=cos(uT*.00027+s*9.4)*1.6;p.y+=sin(uT*.0006+s*12.)*.7;a=.3+.7*(.5+.5*sin(uT*.0016+s*50.));}' +
    'else if(k<.5){a=.8+.2*sin(uT*.003+s*80.);}' +
    'gl_Position=uVP*vec4(p,1.);float w=max(gl_Position.w,.1);gl_PointSize=clamp(aC.w*uPx/w,1.5,90.);vC=aC.rgb;vA=a;}';
  var PFS = 'precision mediump float;varying vec3 vC;varying float vA;' +
    'void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;float g=pow(1.-d,2.2);float core=smoothstep(.28,.0,d);' +
    'gl_FragColor=vec4(vC*(g*.9+core*.9),(g*.8+core)*vA);}';
  // bayangan lembut
  var BVS = 'attribute vec3 aP;attribute vec3 aU;uniform mat4 uVP;varying vec3 vU;void main(){vU=aU;gl_Position=uVP*vec4(aP,1.);}';
  var BFS = 'precision mediump float;varying vec3 vU;' +
    'void main(){float d=pow(pow(abs(vU.x),3.)+pow(abs(vU.y),3.),.3333);float a=(1.-smoothstep(.25,1.,d))*vU.z;gl_FragColor=vec4(0.,0.,0.,a);}';
 
  function compile(gl, type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function program(gl, vs, fs, attrs) {
    var p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs)); gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
    attrs.forEach(function (a, i) { gl.bindAttribLocation(p, i, a); });
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }
 
  // ---------- CSS (label & petunjuk di atas kanvas) ----------
  var css = document.createElement('style');
  css.textContent =
    '.ex3{position:relative;width:100%;height:100%;overflow:hidden;background:#07090a;touch-action:pan-y;cursor:grab;user-select:none;-webkit-user-select:none}' +
    '.ex3.drag{cursor:grabbing}.ex3.hover{cursor:pointer}' +
    '.ex3 canvas{position:absolute;inset:0;width:100%;height:100%;display:block}' +
    '.ex3-lab{position:absolute;left:0;top:0;pointer-events:none;display:flex;align-items:center;gap:6px;white-space:nowrap;font-family:"Space Mono",monospace;font-size:11px;font-weight:700;' +
    'color:#fff;background:rgba(10,12,14,.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:3px 9px 3px 7px;border-radius:20px;border:1px solid color-mix(in srgb,var(--c) 70%,transparent);' +
    'box-shadow:0 4px 14px rgba(0,0,0,.45);will-change:transform;transition:opacity .2s,background .2s,color .2s}' +
    '.ex3-lab::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--c);box-shadow:0 0 8px var(--c)}' +
    '.ex3-lab i{font-style:normal;font-family:"DM Sans",sans-serif;font-weight:600;font-size:11px;max-width:0;overflow:hidden;opacity:0;transition:max-width .25s,opacity .25s}' +
    '.ex3-lab.on i{max-width:230px;opacity:1}.ex3-lab.on{background:var(--c);color:#000}.ex3-lab.on::before{background:#000;box-shadow:none}' +
    '.ex3-tag{position:absolute;left:0;top:0;pointer-events:none;font-family:"Space Mono",monospace;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,.5);' +
    'white-space:nowrap;will-change:transform;text-shadow:0 1px 8px rgba(0,0,0,.8);transition:opacity .3s}' +
    '.ex3-tag::before{content:"";display:inline-block;width:6px;height:6px;border-radius:50%;background:#1DB954;margin-right:8px;vertical-align:middle;box-shadow:0 0 8px #1DB954}' +
    '@media(max-width:700px){.ex3-lab{font-size:9px;padding:2px 7px 2px 5px;gap:4px}.ex3-lab.on i{max-width:150px}.ex3-tag{display:none}}';
  document.head.appendChild(css);
 
  // ---------- init ----------
  function init(opts) {
    var box = opts.container, booths = opts.booths;
    var canvas = document.createElement('canvas');
    var gl = canvas.getContext('webgl', { antialias: true, alpha: false, powerPreference: 'high-performance' }) || canvas.getContext('experimental-webgl');
    if (!gl) throw new Error('WebGL tidak tersedia');
    box.classList.add('ex3'); box.innerHTML = ''; box.appendChild(canvas);
 
    var PS = program(gl, VS, FS, ['aPos', 'aNor', 'aCol', 'aEm']);
    var PE = program(gl, EVS, EFS, ['aA', 'aB', 'aK']);
    var PP = program(gl, PVS, PFS, ['aP', 'aC', 'aM']);
    var PB = program(gl, BVS, BFS, ['aP', 'aU']);
    var PK = program(gl, SVS, SFS, ['aQ']);
    function U(p, names) { var o = {}; names.forEach(function (n) { o[n] = gl.getUniformLocation(p, n); }); return o; }
    var uS = U(PS, ['uVP', 'uGlow', 'uTint', 'uAlpha', 'uCam', 'uSpot', 'uSpotCol', 'uSpotI', 'uFog']);
    var uE = U(PE, ['uVP', 'uRes', 'uW', 'uCol']);
    var uP = U(PP, ['uVP', 'uT', 'uPx']);
    var uB = U(PB, ['uVP']);
    var uK = U(PK, ['uT', 'uAsp']);
    var FOG = [0.055, 0.078, 0.084];
 
    gl.enable(gl.DEPTH_TEST); gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(1, 1);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
 
    function attribs(n) { for (var i = 0; i < 6; i++) { if (i < n) gl.enableVertexAttribArray(i); else gl.disableVertexAttribArray(i); } }
    function mkBuf(arr, stride) {
      var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
      return { buf: buf, n: arr.length / stride };
    }
    function lineBuf(arr) {
      var ed = [], K = [[0, -1], [0, 1], [1, 1], [0, -1], [1, 1], [1, -1]];
      for (var i = 0; i < arr.length; i += 6) for (var k = 0; k < 6; k++) ed.push(arr[i], arr[i + 1], arr[i + 2], arr[i + 3], arr[i + 4], arr[i + 5], K[k][0], K[k][1]);
      return mkBuf(ed, 8);
    }
    function mkBatch(g) { var o = mkBuf(g.v, 10); o.edge = lineBuf(g.e || []); o.grid = lineBuf(g.g || []); o.fest = lineBuf(g.f || []); return o; }
    function drawSolid(b) {
      if (!b.n) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, b.buf); attribs(4);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 40, 0); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 40, 12);
      gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 40, 24); gl.vertexAttribPointer(3, 1, gl.FLOAT, false, 40, 36);
      gl.drawArrays(gl.TRIANGLES, 0, b.n);
    }
    function drawLines(l) {
      if (!l.n) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, l.buf); attribs(3);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 32, 12); gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 32, 24);
      gl.drawArrays(gl.TRIANGLES, 0, l.n);
    }
    function drawPts(b) {
      gl.bindBuffer(gl.ARRAY_BUFFER, b.buf); attribs(3);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 36, 0); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 36, 12); gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 36, 28);
      gl.drawArrays(gl.POINTS, 0, b.n);
    }
    function drawBlobs(b) {
      gl.bindBuffer(gl.ARRAY_BUFFER, b.buf); attribs(2);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
      gl.drawArrays(gl.TRIANGLES, 0, b.n);
    }
 
    var sky = mkBuf([-1, -1, 3, -1, -1, 3], 2);
    var stat = mkBatch(buildStatic()), emblem = mkBatch(buildEmblem()), blobs = mkBuf(buildBlobs(), 6);
    var tents = booths.slice(0, SLOTS.length).map(function (bo, i) {
      var s = SLOTS[i], col = hex(bo.color || '#1DB954'), t = buildTent(s.x, s.z, s.r, col);
      return { id: bo.id, name: bo.name, rot: s.r, color: col, hexColor: bo.color, batch: mkBatch(t), pad: mkBatch(t.pad), pts: t.pts, min: t.min, max: t.max, c: t.c, glow: 0, glowT: 0, label: null };
    });
    var allPts = buildPoints(); tents.forEach(function (t) { allPts = allPts.concat(t.pts); });
    var pts = mkBuf(allPts, 9);
 
    // label HTML di atas tenda
    tents.forEach(function (t) {
      var l = document.createElement('div');
      l.className = 'ex3-lab'; l.style.setProperty('--c', t.hexColor || '#1DB954');
      l.innerHTML = '<span>' + String(t.id).replace(/</g, '&lt;') + '</span><i>' + String(t.name).replace(/^Booth\s+/i, '').replace(/</g, '&lt;') + '</i>';
      box.appendChild(l); t.label = l;
    });
    var tags = [{ txt: 'Gedung Sekolah', p: [0, 11.2, FZ - 2.3] }, { txt: 'Area Tengah', p: [0, 0.3, CENTER[1] + 5.6] }].map(function (o) {
      var d = document.createElement('div'); d.className = 'ex3-tag'; d.textContent = o.txt; box.appendChild(d); o.el = d; return o;
    });
 
    // ----- kamera -----
    var FOV = 0.66, W = 1, H = 1, DPR = 1, visible = true, interacted = false, hoverId = null, activeId = opts.active || null;
    var VP = null, camPos = [0, 0, 0], basis = null;
    var HOME = { az: 0, el: 0.62, dist: 48, tx: 0, ty: 1.2, tz: 1 };
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
    var cam = reduce ? Object.assign({}, HOME) : { az: -0.7, el: 1.2, dist: 84, tx: 0, ty: 1.2, tz: 1 }, goal = Object.assign({}, HOME);
    var ease = reduce ? 0.14 : 0.032; if (!reduce) setTimeout(function () { ease = 0.1; }, 2400);
    var shift = { x: 0, y: 0 }, shiftGoal = { x: 0, y: 0 };
    var spot = { x: 0, z: 0, r: 3.4, i: 0, c: [1, 1, 1] };
 
    function wide() { return W >= 900; }
    function homeDist() { var asp = W / H, dw = (wide() ? 29 : 17) / (Math.tan(FOV / 2) * asp); return Math.min(115, Math.max(46, dw)); }
    function layoutShift() {
      var pan = !!activeId;
      if (wide()) { shiftGoal.x = pan ? -0.3 : 0.22; shiftGoal.y = 0; }
      else { shiftGoal.x = 0; shiftGoal.y = pan ? 0.34 : -0.2; }
    }
    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.5 : 2);
      W = Math.max(1, box.clientWidth); H = Math.max(1, box.clientHeight);
      canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
      gl.viewport(0, 0, canvas.width, canvas.height);
      var nd = homeDist(), atHome = Math.abs(goal.dist - HOME.dist) < 0.01 && !activeId;
      HOME.dist = nd; if (atHome) { goal.dist = nd; if (reduce) cam.dist = nd; }
      if (activeId) focusBooth(activeId);
      layoutShift();
    }
    function clampGoal() { goal.el = Math.max(0.16, Math.min(1.42, goal.el)); goal.dist = Math.max(4.5, Math.min(120, goal.dist)); }
    function boothDist() { return wide() ? 8.6 : Math.max(8.6, 2.5 / (Math.tan(FOV / 2) * (W / H))); }
    function focusBooth(id) {
      var t = tents.filter(function (x) { return x.id === id; })[0];
      if (!t) return;
      var az = t.rot, k = Math.round((cam.az - az) / (2 * Math.PI)); az += k * 2 * Math.PI;
      goal.az = az; goal.el = 0.3; goal.dist = boothDist(); goal.ty = 1.15; goal.tx = t.c[0]; goal.tz = t.c[2];
      interacted = true; ease = 0.07; layoutShift();
    }
    function resetView() { Object.assign(goal, HOME); interacted = true; ease = 0.075; layoutShift(); }
    function select(id) {
      if (!id) { activeId = null; resetView(); return; }
      activeId = id; focusBooth(id);
    }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(box); else window.addEventListener('resize', resize);
    resize();
    if (activeId) focusBooth(activeId);
 
    function updateMatrices(t) {
      var drift = (!interacted && !reduce) ? Math.sin(t / 4200) * 0.28 : 0;
      var az = cam.az + drift;
      camPos = [cam.tx + cam.dist * Math.cos(cam.el) * Math.sin(az), cam.ty + cam.dist * Math.sin(cam.el), cam.tz + cam.dist * Math.cos(cam.el) * Math.cos(az)];
      basis = lookAt(camPos, [cam.tx, cam.ty, cam.tz], [0, 1, 0]);
      var m = mul(perspective(FOV, W / H, 0.8, 400), basis.m);
      for (var i = 0; i < 4; i++) { m[i * 4] += shift.x * m[i * 4 + 3]; m[i * 4 + 1] += shift.y * m[i * 4 + 3]; }
      VP = m;
    }
    function project(p) {
      var m = VP, x = m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12], y = m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13],
        w = m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15];
      if (w <= 0) return null;
      return [(x / w * 0.5 + 0.5) * W, (1 - (y / w * 0.5 + 0.5)) * H];
    }
    function pick(px, py) {
      if (!basis) return null;
      var nx = px / W * 2 - 1 - shift.x, ny = 1 - py / H * 2 - shift.y, th = Math.tan(FOV / 2), as = W / H;
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
 
    var raf;
    function frame(t) {
      if (!visible) return;
      ['az', 'el', 'dist', 'tx', 'ty', 'tz'].forEach(function (k) {
        var d = goal[k] - cam[k];
        if (Math.abs(d) > 0.0006) cam[k] += d * ease; else cam[k] = goal[k];
      });
      shift.x += (shiftGoal.x - shift.x) * 0.08; shift.y += (shiftGoal.y - shift.y) * 0.08;
      var tgt = null;
      tents.forEach(function (tt) {
        tt.glowT = tt.id === activeId ? 1 : (tt.id === hoverId ? 0.55 : 0);
        tt.glow += (tt.glowT - tt.glow) * 0.2;
        if (tt.id === activeId) tgt = tt; else if (!tgt && tt.id === hoverId) tgt = tt;
      });
      var ti = tgt ? (tgt.id === activeId ? 1 : 0.55) : 0;
      if (tgt) {
        spot.x += (tgt.c[0] - spot.x) * 0.18; spot.z += (tgt.c[2] - spot.z) * 0.18;
        spot.c = mix(spot.c, tgt.color, 0.15);
      }
      spot.i += (ti - spot.i) * 0.15;
 
      updateMatrices(t);
      var vp = new Float32Array(VP);
      gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST); gl.depthMask(false);
      gl.clearColor(FOG[0], FOG[1], FOG[2], 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      // 0. langit
      gl.useProgram(PK); gl.uniform1f(uK.uT, t); gl.uniform1f(uK.uAsp, W / H);
      gl.bindBuffer(gl.ARRAY_BUFFER, sky.buf); attribs(1); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0); gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.enable(gl.DEPTH_TEST); gl.depthMask(true); gl.enable(gl.BLEND);
      // 1. permukaan padat
      gl.useProgram(PS); gl.uniformMatrix4fv(uS.uVP, false, vp);
      gl.uniform3f(uS.uCam, camPos[0], camPos[1], camPos[2]); gl.uniform3f(uS.uFog, FOG[0], FOG[1], FOG[2]);
      gl.uniform3f(uS.uSpot, spot.x, spot.r, spot.z); gl.uniform3f(uS.uSpotCol, spot.c[0], spot.c[1], spot.c[2]); gl.uniform1f(uS.uSpotI, spot.i);
      gl.uniform1f(uS.uGlow, 0); gl.uniform3f(uS.uTint, 1, 1, 1); gl.uniform1f(uS.uAlpha, 1); drawSolid(stat);
      // emblem hijau berdenyut
      gl.uniform3f(uS.uTint, GREEN[0], GREEN[1], GREEN[2]); gl.uniform1f(uS.uGlow, 0.35 + 0.35 * Math.sin(t / 700)); drawSolid(emblem);
      gl.uniform1f(uS.uGlow, 0);
      // 2. bayangan lembut
      gl.depthMask(false); gl.polygonOffset(-2, -2);
      gl.useProgram(PB); gl.uniformMatrix4fv(uB.uVP, false, vp); drawBlobs(blobs);
      gl.polygonOffset(1, 1);
      // 3. alas penanda booth aktif/hover
      gl.useProgram(PS);
      tents.forEach(function (tt) {
        if (tt.glow < 0.02) return;
        gl.uniform1f(uS.uAlpha, tt.glow * (0.34 + 0.14 * Math.sin(t / 260))); gl.uniform1f(uS.uGlow, 0); drawSolid(tt.pad);
      });
      gl.depthMask(true); gl.uniform1f(uS.uAlpha, 1);
      // 4. tenda
      tents.forEach(function (tt) { gl.uniform1f(uS.uGlow, tt.glow); gl.uniform3fv(uS.uTint, tt.color); drawSolid(tt.batch); });
      // 5. garis
      gl.useProgram(PE); gl.uniformMatrix4fv(uE.uVP, false, vp); gl.uniform2f(uE.uRes, canvas.width, canvas.height);
      gl.depthMask(false);
      gl.uniform1f(uE.uW, 1 * DPR); gl.uniform4f(uE.uCol, 1, 1, 1, 0.07); drawLines(stat.grid);          // petak paving
      gl.uniform1f(uE.uW, 1.1 * DPR); gl.uniform4f(uE.uCol, 1, 0.8, 0.48, 0.4); drawLines(stat.fest);    // kabel lampu
      gl.depthMask(true);
      gl.uniform1f(uE.uW, 1.1 * DPR); gl.uniform4f(uE.uCol, GREEN[0], GREEN[1], GREEN[2], 0.55); drawLines(stat.edge);   // tepi gedung
      gl.uniform1f(uE.uW, (W < 500 ? 1.1 : 1.5) * DPR); gl.uniform4f(uE.uCol, GREEN[0], GREEN[1], GREEN[2], 0.95);
      tents.forEach(function (tt) { drawLines(tt.batch.edge); });
      // 6. titik cahaya (aditif)
      gl.depthMask(false); gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.useProgram(PP); gl.uniformMatrix4fv(uP.uVP, false, vp); gl.uniform1f(uP.uT, t); gl.uniform1f(uP.uPx, canvas.height / (2 * Math.tan(FOV / 2)));
      drawPts(pts);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(true);
 
      // label HTML
      var entered = !!activeId && cam.dist < 26;
      tents.forEach(function (tt) {
        var p = project([tt.c[0], 4.7, tt.c[2]]);
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
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        var was = visible; visible = e[0].isIntersecting;
        if (visible && !was) raf = requestAnimationFrame(frame);
      }, { threshold: 0.01 }).observe(box);
    }
 
    // ----- interaksi -----
    var ptrs = {}, moved = 0, lastPinch = 0, downPt = null;
    function rel(e) { var r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    function touch() { interacted = true; ease = 0.14; }
    function setHover(id) { if (id !== hoverId) { hoverId = id; box.classList.toggle('hover', !!id); if (opts.onHover) opts.onHover(id); } }
    box.addEventListener('pointerdown', function (e) {
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
        if (e.pointerType === 'mouse') { var q = rel(e), t = pick(q[0], q[1]); setHover(t ? t.id : null); }
        return;
      }
      var dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
      var ids = Object.keys(ptrs);
      if (ids.length >= 2) {
        var a = ptrs[ids[0]], b = ptrs[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (lastPinch) { goal.dist *= lastPinch / d; clampGoal(); touch(); }
        lastPinch = d;
      } else if (moved > 4) {
        goal.az -= dx * 0.006; cam.az = goal.az;
        if (p.type !== 'touch') { goal.el += dy * 0.005; cam.el = goal.el; }
        clampGoal(); touch();
      }
    });
    function up(e) {
      var p = ptrs[e.pointerId]; delete ptrs[e.pointerId]; lastPinch = 0; box.classList.remove('drag');
      if (p && downPt && moved <= 6 && e.type === 'pointerup' && !Object.keys(ptrs).length) {
        var q = rel(e), t = pick(q[0], q[1]);
        if (t) { touch(); select(t.id); if (opts.onSelect) opts.onSelect(t.id); }
      }
    }
    box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);
    box.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') setHover(null); });
    box.addEventListener('wheel', function (e) {
      if (!e.ctrlKey && !e.metaKey) return;      // scroll biasa tetap menggulir halaman
      e.preventDefault(); goal.dist *= Math.exp(e.deltaY * 0.0025); clampGoal(); touch();
    }, { passive: false });
    box.addEventListener('dblclick', function () { if (activeId) { select(null); if (opts.onSelect) opts.onSelect(null); } });
 
    return {
      select: select,
      resize: resize,
      zoom: function (f) { goal.dist *= f; clampGoal(); touch(); },
      reset: function () { select(null); },
      count: tents.length
    };
  }
 
  window.Expo3D = { init: init };
})();
 