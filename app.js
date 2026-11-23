// ============================================================
// KOPITAISAN CAMPUS EXPO — logika halaman
// Data diambil dari data.js. File ini tidak perlu diedit.
// ============================================================
(function () {
  'use strict';
  var D = window.EXPO, CFG = D.CONFIG, RUNDOWN = D.RUNDOWN, FAC = D.FACULTIES, QUIZ = D.QUIZ,
    SB = D.SUPABASE, COM = D.COMMITTEE, ASK = D.ASK_DEFAULT, BOOTHS = D.BOOTHS;
 
  // ---------- helper ----------
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function byId(id) { return FAC.filter(function (f) { return f.id === id; })[0]; }
  function boothById(id) { return BOOTHS.filter(function (b) { return b.id === id; })[0]; }
  function boothIdx(id) { for (var i = 0; i < BOOTHS.length; i++) if (BOOTHS[i].id === id) return i; return -1; }
  function boothColor(b) { var f = byId(b.faculties[0]); return b.color || (f ? f.color : '#1DB954'); }
  function boothIcon(b) { var f = byId(b.faculties[0]); return f ? f.icon : '✦'; }
  function person(p) { return typeof p === 'string' ? { name: p } : (p || {}); }
  var FAV_KEY = 'expoFavs';
  function getFavs() { try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch (e) { return []; } }
  function setFavs(a) { try { localStorage.setItem(FAV_KEY, JSON.stringify(a)); } catch (e) {} }
 
  var toastT;
    function say(m, type) {
      var el = $('#toast'); el.textContent = m; el.className = 'toast';
      if (type) el.classList.add(type);
      el.classList.add('show');
      clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('show'); }, 2600);
    }
 
  var S = { booth: null, tour: false, tourT: null, sel: FAC[0].id, filter: 'all', view: 'cards' };
  var ctl = null;
  var hero = $('#hero'), panel = $('#bpanel');
 
  function goTop() { if (window.scrollY > 40) window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function scrollToEl(id) { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
 
  // ============================================================
  // HERO
  // ============================================================
  function renderHero() {
    $('#heroCopy').innerHTML =
      '<div class="badge">' + esc(CFG.badge) + '</div>' +
      '<h1 class="h-title">' + esc(CFG.titleTop) + '<br><span class="mid">' + esc(CFG.titleMid) + '</span><br>' + esc(CFG.titleBottom) + '</h1>' +
      '<p class="h-desc">' + esc(CFG.desc) + '</p>' +
      '<div class="h-btns"><button class="btn" data-go="tour">▶ Putar Tur Booth</button><button class="btn ghost" data-go="quiz">🎯 Temukan Jurusanmu</button></div>' +
      '<div class="h-stats">' + CFG.stats.map(function (s) { return '<div><div class="h-stat-n">' + esc(s.n) + '</div><div class="h-stat-l">' + esc(s.l) + '</div></div>'; }).join('') + '</div>';
  }

  // ---------- ambient particles di hero ----------
  function initHeroParticles() {
    var canvas = document.createElement('canvas');
    canvas.className = 'hero-particles';
    canvas.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none';
    var heroEl = $('#hero');
    heroEl.insertBefore(canvas, heroEl.firstChild);
    var ctx = canvas.getContext('2d');
    var particles = [], W = 0, H = 0, raf = null, colors = ['#1DB954','#7C6CF0','#EC4899','#F97316','#EAB308'];
    function resize() {
      W = canvas.width = heroEl.clientWidth;
      H = canvas.height = heroEl.clientHeight;
    }
    function spawn() {
      if (particles.length < 60) particles.push({
        x: Math.random() * W, y: H + 20,
        vx: (Math.random() - 0.5) * 0.3, vy: -0.2 - Math.random() * 0.5,
        r: 1.5 + Math.random() * 2.5, a: 0.15 + Math.random() * 0.35,
        c: colors[Math.floor(Math.random() * colors.length)], life: 1
      });
    }
    function step() {
      ctx.clearRect(0, 0, W, H);
      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.002;
        if (p.life <= 0 || p.y < -20) { particles.splice(i, 1); continue; }
        ctx.globalAlpha = p.a * p.life;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c; ctx.fill();
      }
      ctx.globalAlpha = 1;
      spawn(); raf = requestAnimationFrame(step);
    }
    function onVis() {
      if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
      else if (!raf) { step(); }
    }
    resize(); step();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVis);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        if (es[0].isIntersecting && !raf) step();
        else if (!es[0].isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
      }, { threshold: 0.01 }).observe(heroEl);
    }
  }

  function renderRail() {
    $('#rail').innerHTML = BOOTHS.map(function (b) {
      return '<button class="rchip" style="--c:' + boothColor(b) + '" data-act="booth" data-id="' + esc(b.id) + '" aria-label="' + esc(b.name) + '"><i></i><b>' + esc(b.id) + '</b><span>' + esc(b.name.replace(/^Booth\s+/i, '')) + '</span></button>';
    }).join('');
  }
 
  // ---------- isi panel booth ----------
  function boothPeople(b, color) {
    var list = (b.people || []).map(person).filter(function (p) { return p.name; });
    if (!list.length) return '<div class="bp-person soon"><div class="bp-av">?</div><div>Segera diumumkan 👀</div></div>';
    return list.map(function (p) {
      var has = !!p.photo, sub = [p.major, p.campus].filter(Boolean).join(' · ') || p.role || '';
      return '<div class="bp-person"><div class="bp-av' + (has ? ' has' : '') + '" style="--c:' + color + '"' + (has ? ' data-act="photo" data-src="' + esc(p.photo) + '" data-cap="' + esc(p.name + (sub ? ' · ' + sub : '')) + '"' : '') + '>' +
        '<span>' + esc(p.name.trim().charAt(0).toUpperCase()) + '</span>' + (has ? '<img src="' + esc(p.photo) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.remove()">' : '') + '</div>' +
        '<div><div class="bp-pn">' + esc(p.name) + '</div>' + (sub ? '<div class="bp-ps">' + esc(sub) + '</div>' : '') + '</div></div>';
    }).join('');
  }
  function boothPanel(b) {
    var color = boothColor(b), facs = b.faculties.map(byId).filter(Boolean), topics = b.topics || (facs.length ? ASK : []);
    var jur = facs.length
      ? '<div class="bp-sec"><div class="bp-lbl">Jurusan yang bisa ditanyakan</div>' + facs.map(function (f) {
        return '<div class="bp-fac" style="--fc:' + f.color + '"><div class="bp-fac-h"><i>' + esc(f.icon) + '</i>' + esc(f.name) + '<button data-act="jump" data-id="' + f.id + '">Lihat bidang ›</button></div>' +
          '<div class="bp-chips">' + f.majors.map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('') + '</div></div>';
      }).join('') + '</div>'
      : '<div class="bp-sec"><div class="bp-lbl">Tentang booth ini</div><div class="bp-note">' + esc(b.note || 'Booth umum. Detail segera diumumkan.') + '</div></div>';
    var ask = topics.length ? '<div class="bp-sec"><div class="bp-lbl">Bisa kamu tanyakan</div><div class="bp-chips ask">' + topics.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div></div>' : '';
    var idx = boothIdx(b.id);
    return '<div class="bp-top"><span class="bp-id">' + esc(b.id) + '</span><span class="bp-cnt">' + (idx + 1) + ' / ' + BOOTHS.length + '</span><button class="bp-x" data-act="exit">↩ Keluar booth</button></div>' +
      '<div class="bp-name">' + esc(b.name.replace(/^Booth\s+/i, '')) + '</div>' + jur +
      '<div class="bp-sec"><div class="bp-lbl">Kakak yang berjaga</div>' + boothPeople(b, color) + '</div>' + ask +
      '<div class="bp-nav"><button data-act="navb" data-d="-1">‹ Sebelumnya</button><button data-act="navb" data-d="1">Berikutnya ›</button></div>';
  }
 
  // ---------- pilih / keluar booth ----------
  function selectBooth(id, fromCtl) {
    var b = boothById(id); if (!b) return;
    S.booth = b.id;
    hero.classList.add('in-booth', 'touched');
    panel.style.setProperty('--c', boothColor(b));
    panel.innerHTML = boothPanel(b); panel.classList.add('show'); panel.scrollTop = 0;
    if (ctl && !fromCtl) ctl.select(b.id);
    if (S.tour) armTour();
    syncUI();
    try { history.replaceState(null, '', '#' + b.id.toLowerCase()); } catch (e) {}
  }
  function exitBooth(fromCtl) {
    S.booth = null; stopTour();
    hero.classList.remove('in-booth'); panel.classList.remove('show');
    if (ctl && !fromCtl) ctl.select(null);
    syncUI();
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  }
  function navBooth(d) {
    var i = boothIdx(S.booth), n = BOOTHS.length;
    i = i < 0 ? (d > 0 ? 0 : n - 1) : (i + d + n) % n;
    goTop(); selectBooth(BOOTHS[i].id);
  }
 
  // ---------- tur otomatis ----------
  function armTour() {
    clearInterval(S.tourT);
    if (!S.tour) return;
    S.tourT = setInterval(function () {
      if (window.scrollY > window.innerHeight * 0.6) return;   // jangan jalan kalau hero tidak terlihat
      var i = boothIdx(S.booth); selectBooth(BOOTHS[(i + 1) % BOOTHS.length].id);
    }, 7500);
  }
  function startTour() {
    S.tour = true; goTop();
    if (!S.booth) selectBooth(BOOTHS[0].id); else armTour();
    say('▶ Tur booth jalan otomatis. Tap ⏸ untuk berhenti.'); syncUI();
  }
  function stopTour() { S.tour = false; clearInterval(S.tourT); syncUI(); }
 
  // ---------- sinkron tampilan ----------
  function syncUI() {
    $$('.rchip').forEach(function (c) { c.classList.toggle('on', c.dataset.id === S.booth); });
    $$('.tile').forEach(function (c) { c.classList.toggle('on', c.dataset.id === S.booth); });
    $$('.m-booth').forEach(function (c) { c.classList.toggle('on', c.dataset.id === S.booth); });
    var active = $('.rchip.on'); if (active && active.scrollIntoView) { try { active.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); } catch (e) {} }
    renderDock();
  }
  function renderDock() {
    var b = boothById(S.booth), idx = b ? boothIdx(b.id) : -1, n = BOOTHS.length;
    var people = b ? (b.people || []).map(person).filter(function (p) { return p.name; }).length : 0;
    var left = b
      ? '<span class="dk-art" style="--c:' + boothColor(b) + '">' + esc(b.id) + '</span><span class="dk-t"><b>' + esc(b.name.replace(/^Booth\s+/i, '')) + '</b><span>' + (people ? people + ' kakak berjaga' : 'Kakak segera diumumkan') + ' · booth ' + (idx + 1) + ' dari ' + n + '</span></span>'
      : '<span class="dk-art idle">▶</span><span class="dk-t"><b>Belum ada booth dipilih</b><span>Tap tenda di denah, atau tekan ▶ untuk tur</span></span>';
    $('#dock').innerHTML =
      '<button class="dk-l" data-act="gohero" style="--c:' + (b ? boothColor(b) : '#1DB954') + '" aria-label="Kembali ke denah 3D">' + left + '</button>' +
      '<div class="dk-c"><div class="dk-btns">' +
      '<button class="dk-b" data-act="navb" data-d="-1" aria-label="Booth sebelumnya">⏮</button>' +
      '<button class="dk-play" data-act="tour" aria-label="' + (S.tour ? 'Jeda tur' : 'Putar tur booth') + '">' + (S.tour ? '⏸' : '▶') + '</button>' +
      '<button class="dk-b" data-act="navb" data-d="1" aria-label="Booth berikutnya">⏭</button>' +
      (b ? '<button class="dk-b" data-act="exit" aria-label="Keluar booth" title="Keluar booth">↩</button>' : '') +
      '</div><div class="dk-prog"><span>' + (idx + 1 > 0 ? pad(idx + 1) : '00') + '</span><div class="dk-bar"><i style="width:' + ((idx + 1) / n * 100) + '%"></i></div><span>' + pad(n) + '</span></div></div>' +
      '<div class="dk-r"><button class="dk-link" data-act="share">↗ Bagikan</button><button class="dk-link" data-act="ask">💬 Tanya Panitia</button></div>';
  }
 
  // ---------- inisialisasi 3D ----------
  function init3d() {
    var host = $('#hero3d');
    try {
      if (!window.Expo3D) throw new Error('booth3d.js tidak termuat');
      ctl = window.Expo3D.init({
        container: host,
        booths: BOOTHS.map(function (b) { return { id: b.id, name: b.name, color: boothColor(b) }; }),
        onSelect: function (id) { if (id) selectBooth(id, true); else exitBooth(true); }
      });
    } catch (e) {
      ctl = null; $('#heroFallback').hidden = false; $('#heroHint').style.display = 'none'; $('#ctrls').style.display = 'none';
      if (window.console) console.warn('[3D]', e.message || e);
    }
    host.addEventListener('pointerdown', function () { hero.classList.add('touched'); });
  }
 
  // ============================================================
  // INFO, COUNTDOWN, MARQUEE
  // ============================================================
  function renderInfo() {
    $('#infoCards').innerHTML = CFG.info.map(function (i) {
      return '<div class="info-item"><div class="info-ic">' + i.icon + '</div><div><div class="info-l">' + esc(i.l) + '</div><div class="info-v">' + esc(i.v) + '</div></div></div>';
    }).join('');
    var all = []; FAC.forEach(function (f) { f.majors.forEach(function (m) { if (all.indexOf(m) < 0) all.push(m); }); });
    var m = all.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('');
    $('#marquee').innerHTML = '<div class="marquee-track">' + m + m + '</div>';
  }
  function tick() {
    var box = $('#count'), t = CFG.date ? new Date(CFG.date).getTime() : NaN;
    if (isNaN(t)) { box.classList.add('tba'); return; }
    box.classList.remove('tba');
    var diff = Math.max(0, t - Date.now());
    var v = { d: Math.floor(diff / 86400000), h: Math.floor(diff % 86400000 / 3600000), m: Math.floor(diff % 3600000 / 60000), s: Math.floor(diff % 60000 / 1000) };
    Object.keys(v).forEach(function (k) { var n = box.querySelector('[data-u="' + k + '"]'); if (n) n.textContent = pad(v[k]); });
    $('#countTitle').textContent = diff === 0 ? 'Hari-H! Yuk gabung' : 'Menuju Campus Expo';
  }
 
  // ============================================================
  // DAFTAR BOOTH (kartu + denah 2D)
  // ============================================================
  function renderBoothFilter() {
    var nf = BOOTHS.filter(function (b) { return b.faculties.length; }).length, ng = BOOTHS.length - nf;
    var opts = [['all', 'Semua · ' + BOOTHS.length], ['fac', 'Per jurusan · ' + nf], ['gen', 'Umum · ' + ng]];
    $('#boothFilter').innerHTML = opts.map(function (o) { return '<button class="chip' + (S.filter === o[0] ? ' on' : '') + '" data-act="filter" data-f="' + o[0] + '">' + o[1] + '</button>'; }).join('');
  }
  function renderTiles() {
    var list = BOOTHS.filter(function (b) { return S.filter === 'all' || (S.filter === 'fac' && b.faculties.length) || (S.filter === 'gen' && !b.faculties.length); });
    $('#boothTiles').innerHTML = list.map(function (b) {
      var f = byId(b.faculties[0]), sub = f ? b.faculties.map(byId).filter(Boolean).map(function (x) { return x.majors.slice(0, 3).join(', '); }).join(' · ') : (b.note || '');
      return '<button class="tile' + (S.booth === b.id ? ' on' : '') + '" style="--c:' + boothColor(b) + '" data-act="booth" data-id="' + esc(b.id) + '" data-top="1">' +
        '<div class="tile-art"><b>' + esc(b.id) + '</b><span class="tile-ic">' + esc(boothIcon(b)) + '</span></div>' +
        '<h3>' + esc(b.name.replace(/^Booth\s+/i, '')) + '</h3><p>' + esc(sub) + '</p><span class="tile-go" aria-hidden="true">▶</span></button>';
    }).join('');
  }
  function renderMap2d() {
    $('#map2d').innerHTML = '<div class="m-door top">▼ Gedung sekolah ▼</div><div class="m-grid"><div class="m-center"><b>▶</b>Area Tengah<br>Open Space</div>' +
      BOOTHS.map(function (b, i) {
        var pos = i < 5 ? [1, i + 1] : (i < 10 ? [i - 3, 5] : [7, 5 - (i - 10)]);
        return '<button class="m-booth' + (S.booth === b.id ? ' on' : '') + '" data-act="booth" data-id="' + esc(b.id) + '" data-top="1" style="--c:' + boothColor(b) + ';grid-column:' + pos[0] + ';grid-row:' + pos[1] + '"><span class="m-id">' + esc(b.id) + '</span><span class="m-n">' + esc(b.name.replace(/^Booth\s+/i, '')) + '</span></button>';
      }).join('') + '</div><div class="m-door">▲ Bagian depan lapangan ▲</div>';
  }
  function setBoothView(v) {
    S.view = v;
    $$('#boothSeg button').forEach(function (b) { b.classList.toggle('on', b.dataset.v === v); });
    $('#boothTiles').hidden = v !== 'cards'; $('#boothFilter').hidden = v !== 'cards'; $('#map2d').hidden = v !== 'map';
  }
 
  // ============================================================
  // FORUM JURUSAN
  // ============================================================
  function renderFacGrid() {
    var half = Math.ceil(FAC.length / 2);
    function cell(f) {
      return '<button class="fac" data-act="fac" data-id="' + f.id + '" style="--c:' + f.color + '" data-s="' + esc((f.name + ' ' + f.en + ' ' + f.majors.join(' ')).toLowerCase()) + '">' +
        '<span class="fac-top"><span class="fac-n">' + f.id + '</span><span class="fac-heart">♥</span></span><span class="fac-name">' + esc(f.name) + '</span></button>';
    }
    $('#facA').innerHTML = FAC.slice(0, half).map(cell).join('');
    $('#facB').innerHTML = FAC.slice(half).map(cell).join('');
  }
  function renderDetail() {
    var f = byId(S.sel), d = $('#facDetail'); if (!f) return;
    var fav = getFavs().indexOf(f.id) >= 0, where = BOOTHS.filter(function (b) { return b.faculties.indexOf(f.id) >= 0; });
    d.style.setProperty('--c', f.color);
    d.innerHTML = '<div class="d-top">Bidang / ' + f.id + '</div><div class="d-icon">' + f.icon + '</div><h3>' + esc(f.name) + '</h3><div class="d-en">' + esc(f.en) + '</div><p>' + esc(f.desc) + '</p>' +
      '<div class="d-sub">Jurusan populer</div><div class="d-chips">' + f.majors.map(function (m) { return '<span class="d-chip">' + esc(m) + '</span>'; }).join('') + '</div>' +
      '<div class="d-sub">Temukan di booth</div>' +
      (where.length ? '<div class="d-chips">' + where.map(function (b) { return '<button class="pl-chip" style="--c:' + f.color + '" data-act="booth" data-id="' + esc(b.id) + '" data-top="1">📍 ' + esc(b.id) + '</button>'; }).join('') + '</div>' : '<div class="d-soon">Booth bidang ini segera diumumkan 👀</div>') +
      '<div class="d-btns"><button class="btn fav-btn' + (fav ? ' on' : '') + '" data-act="fav" data-id="' + f.id + '">' + (fav ? '♥ Tersimpan di Playlist' : '♡ Simpan ke Playlist Jurusanku') + '</button>' +
      (where[0] ? '<button class="btn" data-act="booth" data-id="' + esc(where[0].id) + '" data-top="1">Masuk ke booth ' + esc(where[0].id) + '</button>' : '') + '</div>';
  }
  function renderPlaylist() {
    var el = $('#playlist'), favs = getFavs().map(byId).filter(Boolean);
    el.innerHTML = '<span class="pl-lbl">♥ Playlist Jurusanku</span>' + (favs.length
      ? favs.map(function (f) { return '<button class="pl-chip" style="--c:' + f.color + '" data-act="fac" data-id="' + f.id + '">' + esc(f.name) + '</button>'; }).join('') + '<button class="pl-share" data-act="share">Bagikan ↗</button>'
      : '<span class="pl-empty">Tap ♡ di bidang yang kamu suka, nanti tersimpan di sini.</span>');
    var set = getFavs(); $$('.fac').forEach(function (b) { b.classList.toggle('fav', set.indexOf(b.dataset.id) >= 0); });
  }
  function selectFac(id, scroll) {
    if (!byId(id)) return; S.sel = id;
    $$('.fac').forEach(function (b) { b.classList.toggle('active', b.dataset.id === id); });
    renderDetail();
    if (scroll && window.innerWidth <= 1000) { var d = $('#facDetail'); if (d) d.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
  }
  function toggleFav(id) {
    var favs = getFavs(), i = favs.indexOf(id);
    if (i >= 0) favs.splice(i, 1); else favs.push(id);
    setFavs(favs); renderPlaylist(); renderDetail();
    say(i >= 0 ? '♡ ' + byId(id).name + ' dihapus dari playlist' : '♥ ' + byId(id).name + ' masuk Playlist Jurusanku');
  }
  function filterFac(q) {
    q = q.toLowerCase().trim();
    var res = $('#facResult'), hits = [];
    $$('.fac').forEach(function (b) {
      var f = byId(b.dataset.id), old = b.querySelector('.fac-hit'); if (old) old.remove();
      var match = !q || b.dataset.s.indexOf(q) >= 0;
      b.classList.toggle('dim', !!q && !match); b.classList.toggle('hit', !!q && match);
      if (q && match) {
        hits.push(f);
        var mj = f.majors.filter(function (m) { return m.toLowerCase().indexOf(q) >= 0; })[0];
        if (mj) { var n = document.createElement('span'); n.className = 'fac-hit'; n.textContent = '↳ ' + mj; b.appendChild(n); }
      }
    });
    if (!q) { res.innerHTML = ''; return; }
    res.innerHTML = hits.length
      ? '<b>' + hits.length + '</b> bidang cocok untuk "' + esc(q) + '"<button type="button" data-act="clearsearch">Hapus</button>'
      : 'Tidak ada bidang yang cocok untuk "<b>' + esc(q) + '</b>". Coba kata lain, mis. "teknik" atau "psikologi".<button type="button" data-act="clearsearch">Tampilkan semua</button>';
    if (hits.length && hits.every(function (f) { return f.id !== S.sel; })) selectFac(hits[0].id);
  }
 
  // ============================================================
  // KUIS
  // ============================================================
  var qz = { i: -1, score: {} };
  function renderQuiz() {
    var el = $('#quiz'), total = QUIZ.length;
    if (qz.i === -1) {
      el.innerHTML = '<div class="q-intro"><div class="big">🎯</div><h3>Temukan Jurusanmu</h3><p>Jawab ' + total + ' pertanyaan singkat, kami kasih rekomendasi bidang yang cocok buat kamu.</p><button class="btn" data-act="qstart">Mulai Kuis</button></div>';
      return;
    }
    if (qz.i >= total) {
      var ranked = FAC.map(function (f) { return { f: f, s: qz.score[f.id] || 0 }; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 3);
      el.innerHTML = '<div class="q-step">Hasil kuismu</div><div class="q-res-head">Ini 3 bidang yang paling nyambung sama jawabanmu. Tap untuk lihat detailnya.</div>' +
        '<div class="q-res">' + ranked.map(function (r, i) {
          return '<button class="q-card" style="--c:' + r.f.color + '" data-act="jump" data-id="' + r.f.id + '"><div class="q-rank">#' + (i + 1) + ' COCOK</div><div class="q-icon">' + r.f.icon + '</div><div class="q-name">' + esc(r.f.name) + '</div><div class="q-sub">' + r.s + ' dari ' + total + ' jawaban nyambung</div></button>';
        }).join('') + '</div><button class="btn ghost" data-act="qstart">↻ Ulangi Kuis</button>';
      return;
    }
    var q = QUIZ[qz.i];
    el.innerHTML = '<div class="q-dots">' + QUIZ.map(function (_, i) { return '<i class="' + (i <= qz.i ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
      '<div class="q-step">Pertanyaan ' + (qz.i + 1) + ' / ' + total + '</div><div class="q-q">' + esc(q.q) + '</div>' +
      '<div class="q-opts">' + q.o.map(function (o, i) { return '<button class="q-opt" data-act="qpick" data-i="' + i + '">' + esc(o.t) + '</button>'; }).join('') + '</div>';
  }
 
  // ============================================================
  // RUNDOWN, ALUMNI
  // ============================================================
  function renderTimeline() {
    $('#timeline').innerHTML = RUNDOWN.map(function (r) {
      return '<div class="tl-item"><div class="tl-time">' + esc(r.t) + '</div><div class="tl-title">' + esc(r.title) + '</div><div class="tl-d">' + esc(r.d) + '</div></div>';
    }).join('');
  }
  var SIL = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="8" r="4.2"/><path d="M3.5 21c.6-4.6 4-7 8.5-7s7.9 2.4 8.5 7z"/></svg>';
  function renderAlumni() {
    var list = [];
    BOOTHS.forEach(function (b) { (b.people || []).forEach(function (p) { p = person(p); if (p.name) list.push({ p: p, b: b }); }); });
    $('#kakakTag').textContent = list.length ? list.length + ' kakak berjaga di booth' : 'Segera diumumkan';
    if (!list.length) {
      var colors = ['#1DB954', '#3B82F6', '#7C6CF0', '#F97316', '#EC4899', '#EAB308'];
      $('#alumni').innerHTML = colors.map(function (c) { return '<div class="al soon" style="--c:' + c + '"><div class="al-ph">' + SIL + '</div><div class="al-n">Segera diumumkan</div><div class="al-s">Kakak alumni</div></div>'; }).join('');
      return;
    }
    $('#alumni').innerHTML = list.map(function (x) {
      var p = x.p, c = boothColor(x.b), has = !!p.photo, sub = [p.major, p.campus].filter(Boolean).join(' · ') || p.role || '';
      return '<div class="al" style="--c:' + c + '"><div class="al-ph' + (has ? ' has' : '') + '"' + (has ? ' data-act="photo" data-src="' + esc(p.photo) + '" data-cap="' + esc(p.name + (sub ? ' · ' + sub : '')) + '"' : '') + '>' +
        '<span>' + esc(p.name.trim().charAt(0).toUpperCase()) + '</span>' + (has ? '<img src="' + esc(p.photo) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.remove()">' : '') + '</div>' +
        '<div class="al-n">' + esc(p.name) + '</div>' + (sub ? '<div class="al-s">' + esc(sub) + '</div>' : '') +
        '<button class="al-b" data-act="booth" data-id="' + esc(x.b.id) + '" data-top="1">📍 ' + esc(x.b.id) + '</button></div>';
    }).join('');
  }
 
  // ============================================================
  // CONFESSION WALL
  // ============================================================
  var WALL_KEY = 'expoWallDemo', CD_KEY = 'expoWallLast';
  var wall = { items: [], limit: SB.pageSize, busy: false, demo: !(SB.url && SB.key) };
  var NOTE_COLORS = ['#fde68a', '#bbf7d0', '#fbcfe8', '#bfdbfe', '#ddd6fe', '#fed7aa'];
  function sbFetch(path, opts) {
    opts = opts || {};
    var base = SB.url.replace(/\/+$/, '').replace(/\/rest\/v1$/, '');
    return fetch(base + '/rest/v1/' + path, {
      method: opts.method || 'GET',
      headers: Object.assign({ apikey: SB.key, Authorization: 'Bearer ' + SB.key, 'Content-Type': 'application/json' }, opts.headers || {}),
      body: opts.body
    }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.status === 204 ? null : r.json().catch(function () { return null; }); });
  }
  function demoGet() { try { return JSON.parse(localStorage.getItem(WALL_KEY)) || []; } catch (e) { return []; } }
  function demoSet(a) { try { localStorage.setItem(WALL_KEY, JSON.stringify(a)); } catch (e) {} }
  function ago(iso) {
    var t = new Date(iso).getTime(); if (isNaN(t)) return '';
    var s = Math.max(0, (Date.now() - t) / 1000);
    if (s < 60) return 'baru saja'; if (s < 3600) return Math.floor(s / 60) + ' menit lalu';
    if (s < 86400) return Math.floor(s / 3600) + ' jam lalu'; if (s < 604800) return Math.floor(s / 86400) + ' hari lalu';
    return new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  }
  function hash(str) { var h = 0; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0; return Math.abs(h); }
  function renderWall() {
    var el = $('#wallList'), more = $('#wMore');
    if (!wall.items.length) { el.innerHTML = '<div class="wempty">Belum ada pesan. Jadilah yang pertama menulis di wall ✨</div>'; more.hidden = true; return; }
    el.innerHTML = wall.items.map(function (c) {
      var h = hash(String(c.id) + c.name);
      return '<div class="note" style="--n:' + NOTE_COLORS[h % NOTE_COLORS.length] + ';--r:' + ((((h >> 3) % 5) - 2) * 0.9) + 'deg"><div class="note-msg">' + esc(c.message) + '</div><div class="note-by"><span>— ' + esc(c.name) + '</span><span>' + esc(ago(c.created_at)) + '</span></div></div>';
    }).join('');
    more.hidden = wall.items.length < wall.limit;
  }
  function loadWall() {
      if (wall.busy) return Promise.resolve();
      wall.busy = true;
      var p = wall.demo ? Promise.resolve(demoGet().slice(0, wall.limit)) : sbFetch(SB.table + '?select=id,name,message,created_at&order=created_at.desc&limit=' + wall.limit);
      return p.then(function (rows) { wall.items = rows || []; renderWall(); })
        .catch(function () { say('Wall gagal dimuat, coba lagi nanti', 'error'); })
        .then(function () { wall.busy = false; });
    }
    function submitWall(e) {
      e.preventDefault();
      var nameEl = $('#wName'), msgEl = $('#wMsg'), btn = $('#wBtn');
      if ($('#wHp').value) return;
      var name = nameEl.value.trim().slice(0, SB.maxName), message = msgEl.value.trim().slice(0, SB.maxMsg);
      if (!name || !message) { say('Isi nama dan pesan dulu ya', 'error'); return; }
      var last = 0; try { last = +localStorage.getItem(CD_KEY) || 0; } catch (er) {}
      var wait = Math.ceil(SB.cooldownSec - (Date.now() - last) / 1000);
      if (wait > 0) { say('Tunggu ' + wait + ' detik sebelum kirim lagi', 'error'); return; }
      btn.disabled = true; btn.textContent = 'Mengirim…';
      function done(ok) {
        btn.disabled = false; btn.textContent = 'Kirim ke Wall ✉️';
        if (ok) { try { localStorage.setItem(CD_KEY, String(Date.now())); } catch (er) {} msgEl.value = ''; $('#wCount').textContent = '0 / ' + SB.maxMsg; say('💌 Pesanmu sudah masuk wall!', 'success'); }
        else say('Gagal mengirim, coba lagi ya', 'error');
      }
      if (wall.demo) {
        var a = demoGet(); a.unshift({ id: 'd' + Date.now(), name: name, message: message, created_at: new Date().toISOString() });
        demoSet(a.slice(0, 100)); wall.items = a.slice(0, wall.limit); renderWall(); done(true);
      } else {
        sbFetch(SB.table, { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ name: name, message: message }) })
          .then(function () { done(true); wall.busy = false; return loadWall(); }).catch(function () { done(false); });
      }
    }
  function initWall() {
    $('#wDemo').hidden = !wall.demo;
    $('#wCount').textContent = '0 / ' + SB.maxMsg;
    $('#wName').maxLength = SB.maxName; $('#wMsg').maxLength = SB.maxMsg;
    $('#wallForm').addEventListener('submit', submitWall);
    $('#wMsg').addEventListener('input', function () { $('#wCount').textContent = this.value.length + ' / ' + SB.maxMsg; });
    $('#wMore').addEventListener('click', function () { wall.limit += SB.pageSize; loadWall(); });
    loadWall();
    setInterval(function () { if (!wall.demo && !document.hidden) loadWall(); }, 30000);
  }
 
  // ============================================================
  // KEPANITIAAN
  // ============================================================
  function committeeCount() {
    var n = COM.po && COM.po.name ? 1 : 0;
    n += (COM.core || []).filter(function (c) { return person(c).name; }).length;
    COM.divisions.forEach(function (d) { if (person(d.head).name) n++; n += (d.members || []).filter(function (m) { return person(m).name; }).length; });
    return n;
  }
  function photoBox(p, color, cap) {
    var ini = esc((p.name || '').trim().charAt(0).toUpperCase()), has = !!(p.photo && p.name);
    return '<div class="cm-ph' + (has ? ' has' : '') + '" style="--c:' + color + '"' + (has ? ' data-act="photo" data-src="' + esc(p.photo) + '" data-cap="' + esc(cap) + '"' : '') + '>' +
      (p.name ? '<span>' + ini + '</span>' : SIL) + (has ? '<img src="' + esc(p.photo) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.remove()">' : '') + '</div>';
  }
  function personCard(raw, color, role, lead) {
    var p = person(raw), r = p.role || role;
    if (!p.name) return '<div class="cm-person soon" style="--c:' + color + '">' + photoBox({}, color, '') + '<div class="cm-pn">Segera diumumkan</div><div class="cm-pr">' + esc(r) + '</div></div>';
    return '<div class="cm-person' + (lead ? ' lead' : '') + '" style="--c:' + color + '">' + (lead ? '<span class="cm-badge">Koordinator</span>' : '') + photoBox(p, color, p.name + ' · ' + r) +
      '<div class="cm-pn">' + esc(p.name) + '</div><div class="cm-pr">' + esc(r) + '</div></div>';
  }
  function renderCommittee() {
    $('#panTag').textContent = '1 PO · ' + COM.divisions.length + ' divisi · ' + committeeCount() + ' orang';
    var po = person(COM.po), G = '#1DB954';
    var poHtml = '<div class="cm-po" style="--c:' + G + '">' + photoBox(po, G, (po.name || '') + ' · Project Officer') +
      '<div><div class="cm-role">' + esc(COM.po.role || 'Project Officer') + '</div><div class="cm-po-name' + (po.name ? '' : ' soon') + '">' + (po.name ? esc(po.name) : 'Segera diumumkan') + '</div>' +
      '<div class="cm-po-quote' + (COM.po.quote ? '' : ' soon') + '">' + (COM.po.quote ? esc(COM.po.quote) : 'Foto dan sambutan Project Officer akan tampil di sini.') + '</div></div></div>';
    var core = (COM.core || []).length ? '<div class="cm-core">' + COM.core.map(function (c) { return personCard(c, G, person(c).role || 'Inti'); }).join('') + '</div>' : '';
    var filter = '<div class="cm-filter"><button class="cm-chip on" data-act="cmfilter" data-i="-1">Semua divisi</button>' +
      COM.divisions.map(function (d, i) { return '<button class="cm-chip" style="--c:' + d.color + '" data-act="cmfilter" data-i="' + i + '">' + d.icon + ' ' + esc(d.name) + '</button>'; }).join('') + '</div>';
    var divs = COM.divisions.map(function (d, i) {
      var mem = d.members || [], filled = mem.filter(function (m) { return person(m).name; }).length + (person(d.head).name ? 1 : 0);
      var cards = personCard(d.head, d.color, 'Koordinator', true) + (mem.length ? mem.map(function (m) { return personCard(m, d.color, 'Anggota'); }).join('') : [0, 1, 2].map(function () { return personCard('', d.color, 'Anggota'); }).join(''));
      return '<section class="cm-div" data-div="' + i + '" style="--c:' + d.color + '"><div class="cm-div-head"><span class="cm-div-ic">' + d.icon + '</span><div><div class="cm-div-n">Divisi ' + pad(i + 1) + ' · ' + (filled ? filled + ' orang' : 'segera diumumkan') + '</div>' +
        '<div class="cm-div-name">' + esc(d.name) + '</div><div class="cm-div-d">' + esc(d.desc) + '</div></div></div><div class="cm-people">' + cards + '</div></section>';
    }).join('');
    $('#committee').innerHTML = '<div class="rv">' + poHtml + core + filter + '</div><div class="cm-divs rv">' + divs + '</div>';
  }
 
  // ============================================================
  // AKSI UMUM
  // ============================================================
  function ask() { if (CFG.askUrl) window.open(CFG.askUrl, '_blank', 'noopener'); else say('💬 Kontak panitia segera diumumkan!'); }
  function share() {
    var favs = getFavs().map(byId).filter(Boolean).map(function (f) { return f.name; });
    var text = CFG.shareText + (favs.length ? '\nAku tertarik: ' + favs.join(', ') + '.' : '');
    var url = location.href.split('#')[0] + (S.booth ? '#' + S.booth.toLowerCase() : '');
    if (navigator.share) navigator.share({ title: CFG.shareTitle, text: text, url: url }).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(text + '\n' + url).then(function () { say('🔗 Teks & link disalin!'); }, function () { say('Gagal menyalin, salin link dari address bar ya'); });
    else say('Salin link dari address bar ya');
  }
  function openPhoto(src, cap) { $('#lbImg').src = src; $('#lbCap').textContent = cap || ''; $('#lightbox').classList.add('open'); }
  function closePhoto() { $('#lightbox').classList.remove('open'); }
 
  // ---------- satu pintu untuk semua klik ----------
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act],[data-go]');
    if (!b) { if (e.target.closest('#lightbox')) closePhoto(); return; }
    var a = b.dataset.act || b.dataset.go, id = b.dataset.id;
    switch (a) {
      case 'booth': if (b.dataset.top) goTop(); selectBooth(id); break;
      case 'exit': exitBooth(); break;
      case 'navb': navBooth(+b.dataset.d); break;
      case 'tour': if (b.dataset.act && S.tour) stopTour(); else if (S.tour && b.dataset.go) { goTop(); } else startTour(); break;
      case 'gohero': goTop(); break;
      case 'share': share(); break;
      case 'ask': ask(); break;
      case 'quiz': scrollToEl('kuis'); break;
      case 'filter': S.filter = b.dataset.f; renderBoothFilter(); renderTiles(); break;
      case 'fac': selectFac(id, true); break;
      case 'fav': toggleFav(id); break;
      case 'jump': selectFac(id); scrollToEl('jurusan'); break;
      case 'clearsearch': var i = $('#facSearch'); i.value = ''; i.focus(); filterFac(''); break;
      case 'qstart': qz.i = 0; qz.score = {}; renderQuiz(); break;
      case 'qpick': var o = QUIZ[qz.i] && QUIZ[qz.i].o[+b.dataset.i]; if (o) { o.s.forEach(function (x) { qz.score[x] = (qz.score[x] || 0) + 1; }); qz.i++; renderQuiz(); } break;
      case 'cmfilter':
        var k = +b.dataset.i; $$('.cm-chip').forEach(function (c) { c.classList.toggle('on', c === b); });
        $$('.cm-div').forEach(function (d) { d.hidden = k >= 0 && +d.dataset.div !== k; }); break;
      case 'photo': openPhoto(b.dataset.src, b.dataset.cap); break;
    }
  });
  $('#boothSeg').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setBoothView(b.dataset.v); });
  $('#ctrls').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || !ctl) return;
    if (b.dataset.k === 'in') ctl.zoom(0.8); else if (b.dataset.k === 'out') ctl.zoom(1.25); else exitBooth();
  });
  $('#facSearch').addEventListener('input', function () { filterFac(this.value); });
  $('#facSearch').addEventListener('keydown', function (e) { if (e.key === 'Enter') { var h = $('.fac.hit'); if (h) selectFac(h.dataset.id, true); } });
  document.addEventListener('keydown', function (e) {
    if (/INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'Escape') { closePhoto(); if (S.booth) exitBooth(); }
    else if (S.booth && window.scrollY < window.innerHeight * 0.5) {
      if (e.key === 'ArrowRight') navBooth(1); else if (e.key === 'ArrowLeft') navBooth(-1);
    }
  });
 
  // ---------- navigasi atas ----------
  var nav = $('#nav'), links = $('#navLinks'), burger = $('#navBurger');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('open'); burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) { links.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });
  $('.lb-x').addEventListener('click', closePhoto);
 
  function setupReveal() {
    var els = $$('.rv');
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
    // penanda menu aktif
    var map = {}; $$('.nav-links a').forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting && map[en.target.id]) { $$('.nav-links a').forEach(function (a) { a.classList.remove('on'); }); map[en.target.id].classList.add('on'); } });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) so.observe(s); });
  }
 
  // ============================================================
    // JALANKAN
    // ============================================================
    renderHero(); renderRail(); renderInfo();
    renderBoothFilter(); renderTiles(); renderMap2d(); setBoothView('cards');
    renderFacGrid(); selectFac(S.sel); renderPlaylist();
    renderQuiz(); renderTimeline(); renderAlumni(); renderCommittee(); initWall();
    $('#footLinks').innerHTML = (CFG.socials || []).filter(function (s) { return s.url; }).map(function (s) { return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + ' · ' + esc(s.handle) + '</a>'; }).join('');
    init3d();
    renderDock();
    setupReveal();
    initHeroParticles();
    tick(); setInterval(tick, 1000);
 
  // link langsung ke booth, mis. webkalian/#b3 (cocok untuk QR code per booth)
  function fromHash() {
    var m = /^#(b\d+)$/i.exec(location.hash);
    if (m) { var b = boothById(m[1].toUpperCase()); if (b) { selectBooth(b.id); return true; } }
    return false;
  }
  if (!fromHash()) syncUI();
  window.addEventListener('hashchange', function () { if (!fromHash() && !location.hash && S.booth) exitBooth(); });
})();
 