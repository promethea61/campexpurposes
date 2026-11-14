// ============================================================
// PROMETHEA — CAMPUS EXPO SECTION (v2)
// Tab "Campus Expo" + tombol sidebar + banner di Home.
// EDIT DATA DI BAGIAN 1 SAJA (EXPO_CONFIG, RUNDOWN, COMMITTEE, BOOTHS, FACULTIES, QUIZ).
// Link langsung ke tab ini: tambahkan #expo di akhir URL web kalian
// (contoh: https://webkalian.vercel.app/#expo) -> cocok buat bio Instagram.
// ============================================================
(function () {
  'use strict';
  const SCRIPT_BASE = (document.currentScript && document.currentScript.src || '').replace(/[^\/]*$/, '');

  // ============================================================
  // 1. DATA YANG BISA KAMU EDIT
  // ============================================================
  const EXPO_CONFIG = {
    badge: 'Kopitaisan Campus Expo',
    titleTop: 'Meet the',
    titleMid: 'people',
    titleBottom: 'behind it.',
    desc: 'Ngobrol langsung sama kakak kelas yang sudah kuliah — tanya apa aja soal jurusan, kampus, dan kehidupan perkuliahan. Tidak perlu daftar, langsung datang aja.',

    // Tanggal & jam acara untuk COUNTDOWN. Format: 'TAHUN-BULAN-TANGGALTJAM:MENIT:DETIK+07:00'
    // Contoh: '2026-12-20T08:00:00+07:00'. Kosongkan = tampil "Segera diumumkan".
    date: '',

    stats: [
      { n: '01', l: 'Project Officer' },
      { n: '06', l: 'Divisi' },
      { n: '21', l: 'Kakak Angkatan' }
    ],

    info: [
      { icon: '📅', l: 'Tanggal', v: 'Segera diumumkan' },
      { icon: '📍', l: 'Lokasi', v: 'Segera diumumkan' },
      { icon: '🚶', l: 'Masuk', v: 'Langsung datang, tanpa daftar' }
    ],

    askUrl: '',      // link WhatsApp/DM untuk tanya panitia, contoh: 'https://wa.me/62812xxxx'. Kosong = toast.
    shareTitle: 'Kopitaisan Campus Expo',
    shareText: 'Yuk ikut Kopitaisan Campus Expo — ngobrol langsung sama kakak kelas soal jurusan & kuliah!'
  };

  // Susunan acara. t = waktu (isi jam kalau sudah pasti, mis. '08.00'), boleh 'TBA'.
  const RUNDOWN = [
    { t: 'TBA', title: 'Opening', d: 'Pembukaan dan pengenalan acara.' },
    { t: 'TBA', title: 'Ngobrol per Bidang', d: 'Pilih bidang yang kamu minati, tanya langsung ke kakaknya.' },
    { t: 'TBA', title: 'Sharing Session', d: 'Cerita seru dan tips masuk kuliah dari kakak angkatan.' },
    { t: 'TBA', title: 'Tanya Jawab Bebas', d: 'Tanya apa pun soal jurusan, kampus, dan kehidupan kuliah.' },
    { t: 'TBA', title: 'Closing & Foto Bareng', d: 'Penutupan dan dokumentasi bersama.' }
  ];

  const FACULTIES = [
    { id: '01', name: 'Kedokteran & Kesehatan', en: 'Health Sciences', icon: '✳', color: '#1DB954',
      desc: 'Tentukan dunia kesehatan, pelayanan medis, serta berbagai jenjang yang membantu meningkatkan kualitas hidup manusia.',
      majors: ['Kedokteran', 'Keperawatan', 'Farmasi', 'Gizi', 'Kesehatan Masyarakat'] },
    { id: '02', name: 'Teknik', en: 'Engineering', icon: '⚡', color: '#3B82F6',
      desc: 'Belajar merancang dan membangun solusi nyata, dari bangunan, mesin, sampai sistem energi.',
      majors: ['Teknik Sipil', 'Teknik Mesin', 'Teknik Elektro', 'Teknik Industri', 'Arsitektur'] },
    { id: '03', name: 'Komputer & Teknologi', en: 'Technology & Digital', icon: '⌘', color: '#7C6CF0',
      desc: 'Dunia pemrograman, data, keamanan siber, dan teknologi digital yang makin dibutuhkan.',
      majors: ['Informatika', 'Sistem Informasi', 'Data Science', 'Keamanan Siber'] },
    { id: '04', name: 'Ekonomi & Bisnis', en: 'Economics & Business', icon: '◆', color: '#F97316',
      desc: 'Memahami uang, pasar, dan cara mengelola bisnis dari skala kecil sampai perusahaan besar.',
      majors: ['Manajemen', 'Akuntansi', 'Ekonomi Pembangunan', 'Bisnis Digital'] },
    { id: '05', name: 'Sains & Matematika', en: 'Natural Sciences', icon: '✦', color: '#14B8A6',
      desc: 'Mempelajari hukum alam, angka, dan eksperimen di balik banyak penemuan.',
      majors: ['Matematika', 'Fisika', 'Kimia', 'Biologi', 'Statistika'] },
    { id: '06', name: 'Pendidikan', en: 'Education', icon: '✚', color: '#EAB308',
      desc: 'Menyiapkan calon pendidik yang tahu cara mengajar, membimbing, dan menginspirasi.',
      majors: ['PGSD', 'Pendidikan Bahasa', 'Pendidikan Matematika', 'Bimbingan Konseling'] },
    { id: '07', name: 'Sosial & Humaniora', en: 'Social Sciences', icon: '◎', color: '#A855F7',
      desc: 'Memahami manusia, masyarakat, budaya, dan komunikasi di sekitar kita.',
      majors: ['Psikologi', 'Ilmu Komunikasi', 'Sosiologi', 'Sastra', 'Hubungan Internasional'] },
    { id: '08', name: 'Hukum', en: 'Law', icon: '⚖', color: '#EC4899',
      desc: 'Belajar aturan, keadilan, dan cara membela hak orang lain lewat jalur hukum.',
      majors: ['Ilmu Hukum', 'Hukum Bisnis', 'Hukum Internasional'] },
    { id: '09', name: 'Seni & Desain', en: 'Arts & Design', icon: '✎', color: '#F43F5E',
      desc: 'Wadah kreativitas: desain, visual, musik, dan karya yang bercerita.',
      majors: ['DKV', 'Desain Produk', 'Seni Musik', 'Film & Animasi'] },
    { id: '10', name: 'Pertanian & Lingkungan', en: 'Agriculture & Environment', icon: '❀', color: '#84CC16',
      desc: 'Menjaga pangan, alam, dan keberlanjutan bumi untuk masa depan.',
      majors: ['Agroteknologi', 'Kehutanan', 'Teknik Lingkungan', 'Perikanan'] }
  ];

  // Kuis "Temukan Jurusanmu". s = id bidang yang dapat +1 poin kalau opsi dipilih.
  const QUIZ = [
    { q: 'Weekend paling ideal buat kamu?', o: [
      { t: 'Ngoprek gadget atau bikin project sendiri', s: ['03', '02'] },
      { t: 'Nongkrong dan jadi tempat curhat teman', s: ['07', '06', '01'] },
      { t: 'Bikin konten, gambar, atau musik', s: ['09', '07'] },
      { t: 'Eksplor alam atau eksperimen di dapur', s: ['05', '10'] } ] },
    { q: 'Pelajaran yang paling kamu tunggu?', o: [
      { t: 'Matematika & Fisika', s: ['05', '02', '03'] },
      { t: 'Ekonomi & Sosiologi', s: ['04', '07', '08'] },
      { t: 'Biologi & Kimia', s: ['01', '05', '10'] },
      { t: 'Bahasa, Seni & Budaya', s: ['09', '06', '07'] } ] },
    { q: 'Di kerja kelompok, kamu biasanya…', o: [
      { t: 'Yang nyusun strategi dan hitung-hitungan', s: ['04', '02'] },
      { t: 'Yang menjelaskan materi ke teman', s: ['06', '01'] },
      { t: 'Yang paling vokal saat diskusi dan debat', s: ['08', '07'] },
      { t: 'Yang bikin tampilan presentasinya', s: ['09', '03'] } ] },
    { q: 'Kerjaan impianmu nanti…', o: [
      { t: 'Menolong orang secara langsung', s: ['01', '06'] },
      { t: 'Membangun sesuatu yang benar-benar dipakai orang', s: ['02', '03', '10'] },
      { t: 'Memimpin bisnis atau organisasi', s: ['04', '08'] },
      { t: 'Menciptakan karya dan ide baru', s: ['09', '05'] } ] },
    { q: 'Masalah mana yang paling bikin kamu gemas?', o: [
      { t: 'Layanan kesehatan yang belum merata', s: ['01'] },
      { t: 'Aplikasi dan sistem yang ribet', s: ['03', '02'] },
      { t: 'Ketidakadilan dan aturan yang tidak jelas', s: ['08', '07'] },
      { t: 'Kerusakan lingkungan dan krisis pangan', s: ['10', '05'] } ] }
  ];


  // ---------- Supabase (Confession Wall) ----------
  // Isi 2 nilai ini dari Supabase: Project Settings > API. Pakai "anon public" key (BUKAN service_role!).
  // Tabel & aturan keamanan: jalankan file supabase_setup.sql di SQL Editor Supabase.
  // Kalau masih kosong, wall jalan dalam MODE DEMO (pesan hanya tersimpan di browser sendiri).
  const SUPABASE = {
    url: 'https://pamblvfygoeqksxfcefx.supabase.co/rest/v1/',   // contoh: 'https://pamblvfygoeqksxfcefx.supabase.co/rest/v1/'
    key: 'vA9Im8QxW26kyhdi5Q0aUg_9pNuksqs',   // contoh: 'sb_publishable_vA9Im8QxW26kyhdi5Q0aUg_9pNuksqs'
    table: 'confessions',
    pageSize: 12,
    cooldownSec: 30,   // jeda antar kiriman per pengunjung (anti-spam ringan)
    maxName: 30,
    maxMsg: 280
  };

  // Struktur kepanitiaan. Tiap orang boleh berupa teks ('Nama') ATAU objek { name, photo, role }.
  //   photo = alamat foto, mis. 'panitia/rani.jpg' (disarankan rasio 4:5, wajah di bagian atas).
  //   Foto kosong / tidak ketemu -> otomatis tampil inisial. Nama kosong -> tampil kartu "Segera diumumkan".
  // Contoh isi divisi:
  //   head: { name: 'Rani', photo: 'panitia/rani.jpg' },
  //   members: [ { name: 'Budi', photo: 'panitia/budi.jpg', role: 'Sie Rundown' }, 'Citra', 'Dewi' ]
  const COMMITTEE = {
    po: { name: '', role: 'Project Officer', photo: '', quote: '' },   // quote opsional, mis. 'Semoga acara ini bermanfaat!'
    core: [],   // opsional, mis. [{ name: '', role: 'Sekretaris', photo: '' }, { name: '', role: 'Bendahara', photo: '' }]
    divisions: [
      { name: 'Acara', icon: '🎤', color: '#1DB954', desc: 'Menyusun rundown dan memastikan acara berjalan mulus dari opening sampai closing.', head: '', members: [] },
      { name: 'Humas & Sponsor', icon: '🤝', color: '#3B82F6', desc: 'Menghubungi pembicara, kampus, dan pihak yang mendukung acara.', head: '', members: [] },
      { name: 'Publikasi & Dokumentasi', icon: '📸', color: '#EC4899', desc: 'Poster, konten media sosial, serta foto dan video acara.', head: '', members: [] },
      { name: 'Perlengkapan & Dekorasi', icon: '🛠️', color: '#F97316', desc: 'Menata booth, panggung, dan semua kebutuhan perlengkapan.', head: '', members: [] },
      { name: 'Konsumsi', icon: '☕', color: '#EAB308', desc: 'Menyiapkan makanan dan minuman untuk panitia, kakak, dan peserta.', head: '', members: [] },
      { name: 'Keamanan & Kesehatan', icon: '🛡️', color: '#14B8A6', desc: 'Menjaga ketertiban, alur pengunjung, dan kenyamanan semua orang.', head: '', members: [] }
    ]
  };

  // Kakak yang berjaga (people) boleh teks ('Nama') atau objek { name, photo, major, campus }, mis.
  //   people: [{ name: 'Rani', photo: 'kakak/rani.jpg', major: 'Informatika', campus: 'ITS' }, 'Budi']
  // topics (opsional) = daftar hal yang bisa ditanyakan di booth umum.
  // Denah booth berbentuk U (15 booth). Tiap booth memegang bidang (id dari FACULTIES) ATAU booth umum (faculties kosong + note).
  // Urutan: B1–B5 lengan kiri (jauh → dekat), B6–B10 baris bawah (kiri → kanan), B11–B15 lengan kanan (dekat → jauh).
  // Ganti name/faculties/note sesuai pembagian booth kalian; kakak yang bertugas diisi di people.
  // color boleh diisi untuk booth umum (kalau kosong dipakai warna bidang pertama).
  const ASK_DEFAULT = ['Mata kuliah yang dipelajari', 'Prospek kerja', 'Biaya & kehidupan kuliah', 'Tips masuk jurusan', 'Suka duka kuliah'];
  const BOOTHS = [
    { id: 'B1', name: 'Booth Kedokteran & Kesehatan', faculties: ['01'], people: [] },
    { id: 'B2', name: 'Booth Teknik', faculties: ['02'], people: [] },
    { id: 'B3', name: 'Booth Komputer & Teknologi', faculties: ['03'], people: [] },
    { id: 'B4', name: 'Booth Ekonomi & Bisnis', faculties: ['04'], people: [] },
    { id: 'B5', name: 'Booth Sains & Matematika', faculties: ['05'], people: [] },
    { id: 'B6', name: 'Booth Pendidikan', faculties: ['06'], people: [] },
    { id: 'B7', name: 'Booth Sosial & Humaniora', faculties: ['07'], people: [] },
    { id: 'B8', name: 'Booth Hukum', faculties: ['08'], people: [] },
    { id: 'B9', name: 'Booth Seni & Desain', faculties: ['09'], people: [] },
    { id: 'B10', name: 'Booth Pertanian & Lingkungan', faculties: ['10'], people: [] },
    { id: 'B11', name: 'Booth Jalur Masuk Kuliah', faculties: [], color: '#1DB954', note: 'Tanya soal SNBP, SNBT, mandiri, dan tips menyiapkan berkas.', topics: ['SNBP', 'SNBT', 'Jalur mandiri', 'Berkas & portofolio'], people: [] },
    { id: 'B12', name: 'Booth Beasiswa', faculties: [], color: '#EAB308', note: 'Info beasiswa dan cara mendaftarnya.', topics: ['Beasiswa pemerintah', 'Beasiswa kampus', 'Syarat & berkas', 'Tips seleksi'], people: [] },
    { id: 'B13', name: 'Booth Kehidupan Kampus', faculties: [], color: '#EC4899', note: 'Organisasi, UKM, dan suasana kuliah sehari-hari.', topics: ['Organisasi', 'UKM', 'Kegiatan kampus', 'Hari-hari kuliah'], people: [] },
    { id: 'B14', name: 'Booth Kos & Biaya', faculties: [], color: '#F97316', note: 'Tips cari kos, biaya hidup, dan mengatur uang saku.', topics: ['Cari kos', 'Biaya hidup', 'Atur uang saku', 'Transportasi'], people: [] },
    { id: 'B15', name: 'Booth Foto Bareng', faculties: [], color: '#7C6CF0', note: 'Spot foto dan dokumentasi bersama kakak angkatan.', topics: ['Foto bareng', 'Spot foto', 'Dokumentasi'], people: [] }
  ];


  // ============================================================
  // 2. CSS
  // ============================================================
  const css = document.createElement('style');
  css.textContent = `
    #tab-expo{padding:0 32px 56px}
    #tab-expo *{box-sizing:border-box}
    .ex-reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}
    .ex-reveal.in{opacity:1;transform:none}

    /* banner di Home */
    .ex-banner{display:flex;align-items:center;gap:12px;margin:0 32px 18px;padding:12px 16px;border-radius:12px;cursor:pointer;
      background:linear-gradient(90deg,rgba(29,185,84,.16),rgba(124,108,240,.16),rgba(236,72,153,.14));
      border:1px solid rgba(255,255,255,.1);transition:transform .15s,border-color .15s;font-family:inherit;color:var(--text);width:calc(100% - 64px);text-align:left}
    .ex-banner:hover{transform:translateY(-2px);border-color:var(--green)}
    .ex-banner-ic{font-size:22px}
    .ex-banner-t{flex:1;min-width:0}
    .ex-banner-t b{display:block;font-size:14px}
    .ex-banner-t span{font-size:12px;color:var(--text-2)}
    .ex-banner-go{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:1px;color:var(--green);text-transform:uppercase;white-space:nowrap}

    /* hero */
    .ex-hero{position:relative;border-radius:18px;overflow:hidden;padding:46px 40px;margin-bottom:18px;
      background:radial-gradient(circle at 85% 20%,rgba(124,108,240,.3),transparent 45%),
                 radial-gradient(circle at 10% 90%,rgba(29,185,84,.24),transparent 45%),#0f0f12;
      border:1px solid rgba(255,255,255,.07);display:grid;grid-template-columns:1.3fr 1fr;gap:32px;align-items:center}
    .ex-hero::before,.ex-hero::after{content:'';position:absolute;border-radius:50%;filter:blur(60px);opacity:.35;pointer-events:none;animation:exOrb 9s ease-in-out infinite}
    .ex-hero::before{width:220px;height:220px;background:#EC4899;top:-70px;left:35%}
    .ex-hero::after{width:200px;height:200px;background:#3B82F6;bottom:-80px;right:10%;animation-delay:-4s}
    @keyframes exOrb{0%,100%{transform:translate(0,0)}50%{transform:translate(24px,18px)}}
    .ex-hero>*{position:relative;z-index:1}
    .ex-badge{display:inline-flex;align-items:center;gap:8px;font-family:'Space Mono',monospace;font-size:11px;
      letter-spacing:1.5px;text-transform:uppercase;color:var(--green);margin-bottom:18px}
    .ex-badge::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--green);animation:exPulse 1.8s ease-in-out infinite}
    @keyframes exPulse{0%,100%{opacity:1}50%{opacity:.3}}
    .ex-title{font-size:clamp(38px,5.5vw,72px);font-weight:700;line-height:.98;letter-spacing:-2px;margin-bottom:18px}
    .ex-title .mid{background:linear-gradient(90deg,#1DB954,#7C6CF0,#EC4899,#1DB954);background-size:200% 100%;
      -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:exShine 6s linear infinite}
    @keyframes exShine{to{background-position:200% 0}}
    .ex-desc{color:var(--text-2);font-size:14px;line-height:1.7;max-width:460px;margin-bottom:22px}
    .ex-hero-btns{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:26px}
    .ex-btn{padding:13px 22px;border:none;border-radius:10px;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;
      background:var(--c,var(--green));color:#000;transition:all .15s}
    .ex-btn:hover{transform:scale(1.03);filter:brightness(1.1)}
    .ex-btn.ghost{background:transparent;color:var(--text);border:1.5px solid rgba(255,255,255,.35)}
    .ex-btn.ghost:hover{background:rgba(255,255,255,.08)}
    .ex-btn.full{width:100%}
    .ex-stats{display:flex;gap:28px;flex-wrap:wrap}
    .ex-stat-n{font-family:'Space Mono',monospace;font-size:26px;font-weight:700;color:#fff}
    .ex-stat-l{font-size:10px;letter-spacing:1.2px;text-transform:uppercase;color:var(--text-3);margin-top:2px}
    .ex-card-wrap{display:flex;justify-content:center;position:relative}
    .ex-polaroid{background:#e9e9ec;padding:12px 12px 16px;border-radius:6px;width:min(250px,100%);transform:rotate(4deg);
      box-shadow:0 30px 60px rgba(0,0,0,.6);transition:transform .3s;position:relative}
    .ex-polaroid:hover{transform:rotate(0) scale(1.03)}
    .ex-polaroid-img{aspect-ratio:1;border-radius:3px;background:linear-gradient(135deg,#0a4a3a,#0e2a2a);display:flex;align-items:center;justify-content:center;font-size:64px;overflow:hidden}
    .ex-polaroid-img img{width:100%;height:100%;object-fit:cover}
    .ex-polaroid-cap{color:#111;font-size:12px;font-weight:700;text-align:center;margin-top:12px}
    .ex-sticker{position:absolute;top:-14px;left:-18px;background:#EAB308;color:#000;font-size:11px;font-weight:700;padding:6px 12px;border-radius:20px;
      transform:rotate(-10deg);box-shadow:0 8px 18px rgba(0,0,0,.4);animation:exWob 3s ease-in-out infinite}
    @keyframes exWob{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(-4deg)}}

    /* countdown */
    .ex-count{border:1px solid #2a2a2a;background:var(--bg-el);border-radius:16px;padding:18px 22px;margin-bottom:18px;
      display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}
    .ex-count-lbl{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-3)}
    .ex-count-lbl b{display:block;color:var(--text);font-family:'DM Sans',sans-serif;font-size:18px;letter-spacing:0;text-transform:none;margin-top:4px}
    .ex-count-boxes{display:flex;gap:10px}
    .ex-cbox{background:var(--bg-card);border:1px solid #2c2c2c;border-radius:12px;min-width:68px;padding:10px 8px;text-align:center}
    .ex-cbox-n{font-family:'Space Mono',monospace;font-size:26px;font-weight:700;color:var(--green)}
    .ex-cbox-l{font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:var(--text-3);margin-top:2px}
    .ex-count-tba{font-family:'Space Mono',monospace;font-size:13px;color:var(--green);display:flex;align-items:center;gap:8px}
    .ex-count-tba::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--green);animation:exPulse 1.4s ease-in-out infinite}
    .ex-count.tba .ex-count-boxes{display:none}
    .ex-count:not(.tba) .ex-count-tba{display:none}

    /* marquee */
    .ex-marquee{overflow:hidden;border-top:1px solid #222;border-bottom:1px solid #222;padding:12px 0;margin-bottom:30px;
      -webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
    .ex-marquee-track{display:flex;gap:28px;width:max-content;animation:exScroll 40s linear infinite}
    .ex-marquee:hover .ex-marquee-track{animation-play-state:paused}
    .ex-marquee-track span{font-family:'Space Mono',monospace;font-size:13px;color:var(--text-2);white-space:nowrap}
    .ex-marquee-track span::before{content:'✦';margin-right:28px;color:var(--green)}
    @keyframes exScroll{to{transform:translateX(-50%)}}

    /* info */
    .ex-info{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;margin-bottom:36px}
    .ex-info-item{background:var(--bg-card);border:1px solid #2a2a2a;border-radius:12px;padding:14px 16px;display:flex;gap:12px;align-items:center}
    .ex-info-ic{font-size:22px}
    .ex-info-l{font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--text-3)}
    .ex-info-v{font-size:14px;font-weight:600;margin-top:2px}

    /* section heads */
    .ex-sec{margin-bottom:40px}
    .ex-sec-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:16px;gap:10px;flex-wrap:wrap}
    .ex-sec-title{font-size:22px;font-weight:700}
    .ex-sec-tag{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:1.5px;color:var(--text-3);text-transform:uppercase}

    /* quiz */
    .ex-quiz{position:relative;overflow:hidden;border-radius:18px;padding:28px;border:1px solid rgba(124,108,240,.3);
      background:linear-gradient(135deg,rgba(124,108,240,.16),rgba(29,185,84,.1)),var(--bg-el)}
    .ex-quiz-dots{display:flex;gap:6px;margin-bottom:18px}
    .ex-quiz-dots i{flex:1;height:4px;border-radius:2px;background:#333}
    .ex-quiz-dots i.on{background:var(--green)}
    .ex-quiz-step{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:1.5px;color:var(--text-3);text-transform:uppercase;margin-bottom:8px}
    .ex-quiz-q{font-size:22px;font-weight:700;margin-bottom:18px;line-height:1.3}
    .ex-quiz-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .ex-opt{background:var(--bg-card);border:1px solid #333;border-radius:12px;padding:14px 16px;text-align:left;cursor:pointer;
      font-family:inherit;font-size:14px;color:var(--text);transition:all .15s;line-height:1.4}
    .ex-opt:hover{border-color:var(--green);transform:translateY(-2px);background:#242424}
    .ex-quiz-intro{text-align:center;padding:10px 0}
    .ex-quiz-intro .big{font-size:44px;margin-bottom:8px}
    .ex-quiz-intro h3{font-size:22px;margin-bottom:6px}
    .ex-quiz-intro p{color:var(--text-2);font-size:14px;margin-bottom:18px}
    .ex-res-head{font-size:13px;color:var(--text-2);margin-bottom:14px}
    .ex-res{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:18px}
    .ex-res-card{background:var(--bg-card);border:1px solid #333;border-radius:12px;padding:16px;cursor:pointer;text-align:left;font-family:inherit;color:var(--text);transition:all .15s;border-top:3px solid var(--c)}
    .ex-res-card:hover{transform:translateY(-3px);border-color:var(--c)}
    .ex-res-rank{font-family:'Space Mono',monospace;font-size:11px;color:var(--c);letter-spacing:1px}
    .ex-res-icon{font-size:30px;color:var(--c);margin:8px 0}
    .ex-res-name{font-size:15px;font-weight:700;margin-bottom:4px}
    .ex-res-sub{font-size:11px;color:var(--text-3)}

    /* forum */
    .ex-search{width:100%;padding:13px 16px;border-radius:10px;border:1px solid #333;background:var(--bg-card);color:var(--text);font-family:inherit;font-size:14px;outline:none;margin-bottom:14px}
    .ex-search:focus{border-color:var(--green)}
    .ex-layout{display:grid;grid-template-columns:1.25fr 1fr;gap:20px;align-items:start}
    .ex-forum{background:var(--bg-el);border:1px solid #2a2a2a;border-radius:16px;padding:20px}
    .ex-area{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:1.5px;color:var(--text-3);text-transform:uppercase;margin:4px 0 10px;display:flex;align-items:center;gap:10px}
    .ex-area::after{content:'';flex:1;height:1px;background:#2a2a2a}
    .ex-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:18px}
    .ex-fac{background:var(--bg-card);border:1px solid #2c2c2c;border-radius:10px;padding:12px 10px;cursor:pointer;
      transition:all .2s;text-align:left;font-family:inherit;color:var(--text);min-height:92px;display:flex;flex-direction:column;justify-content:space-between}
    .ex-fac:hover{transform:translateY(-3px);border-color:var(--c)}
    .ex-fac.active{border-color:var(--c);background:color-mix(in srgb,var(--c) 14%,#1e1e1e);box-shadow:0 0 0 1px var(--c)}
    /* pencarian: kotak yang tidak cocok tetap TERLIHAT (hanya diredupkan sedikit), yang cocok disorot */
    .ex-fac.dim{opacity:.5;filter:grayscale(.7)}
    .ex-fac.hit{border-color:var(--c);box-shadow:0 0 0 1px var(--c),0 8px 22px color-mix(in srgb,var(--c) 22%,transparent)}
    .ex-fac-hit{font-size:9.5px;color:var(--c);margin-top:4px;line-height:1.3;font-weight:600}
    .ex-sresult{font-size:12px;color:var(--text-3);margin:-4px 0 12px;min-height:16px}
    .ex-sresult b{color:var(--text-2)}
    .ex-sresult button{background:none;border:none;color:var(--green);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;margin-left:6px;text-decoration:underline}
    .ex-fac-top{display:flex;justify-content:space-between;align-items:center}
    .ex-fac-n{font-family:'Space Mono',monospace;font-size:18px;font-weight:700;color:var(--c)}
    .ex-fac-heart{font-size:13px;color:var(--c);opacity:0;transition:opacity .2s}
    .ex-fac.fav .ex-fac-heart{opacity:1}
    .ex-fac-name{font-size:10.5px;color:var(--text-2);line-height:1.3;margin-top:8px}
    .ex-pl{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding-top:14px;border-top:1px dashed #2f2f2f}
    .ex-pl-lbl{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:1px;color:var(--green);text-transform:uppercase}
    .ex-pl-empty{font-size:12px;color:var(--text-3)}
    .ex-pl-chip{font-size:11px;padding:4px 10px;border-radius:20px;border:1px solid var(--c);color:var(--text);background:color-mix(in srgb,var(--c) 14%,#1a1a1a);cursor:pointer;font-family:inherit}
    .ex-pl-share{margin-left:auto;font-size:11px;padding:5px 12px;border-radius:20px;border:1px solid #444;background:transparent;color:var(--text-2);cursor:pointer;font-family:inherit}
    .ex-pl-share:hover{color:var(--text);border-color:var(--green)}
    .ex-detail{background:var(--bg-el);border:1px solid #2a2a2a;border-radius:16px;padding:24px;position:sticky;top:76px}
    .ex-detail-top{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:1.5px;color:var(--text-3);text-transform:uppercase;margin-bottom:18px}
    .ex-detail-icon{font-size:56px;line-height:1;margin-bottom:12px;color:var(--c)}
    .ex-detail h3{font-size:22px;font-weight:700;margin-bottom:4px}
    .ex-detail-en{font-size:12px;color:var(--text-3);margin-bottom:14px}
    .ex-detail p{font-size:13.5px;line-height:1.7;color:var(--text-2);margin-bottom:16px}
    .ex-sub{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:1.5px;color:var(--text-3);text-transform:uppercase;margin-bottom:8px}
    .ex-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px}
    .ex-chip{font-size:11px;padding:4px 10px;border-radius:20px;border:1px solid #333;color:var(--text-2);background:#1a1a1a}
    .ex-chip.who{border-color:var(--c);color:var(--text)}
    .ex-soon{font-size:12px;color:var(--text-3);margin-bottom:18px}
    .ex-detail-btns{display:flex;flex-direction:column;gap:8px}
    .ex-fav-btn{background:transparent;color:var(--text);border:1.5px solid var(--c)}
    .ex-fav-btn.on{background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c)}

    /* timeline */
    .ex-tl{position:relative;padding-left:26px}
    .ex-tl::before{content:'';position:absolute;left:7px;top:6px;bottom:6px;width:2px;background:linear-gradient(var(--green),#7C6CF0,#EC4899)}
    .ex-tl-item{position:relative;background:var(--bg-card);border:1px solid #2a2a2a;border-radius:12px;padding:14px 16px;margin-bottom:12px}
    .ex-tl-item::before{content:'';position:absolute;left:-26px;top:20px;width:16px;height:16px;border-radius:50%;background:#0d0d0d;border:3px solid var(--green)}
    .ex-tl-time{font-family:'Space Mono',monospace;font-size:11px;color:var(--green);letter-spacing:1px;margin-bottom:4px}
    .ex-tl-title{font-size:15px;font-weight:700;margin-bottom:2px}
    .ex-tl-d{font-size:13px;color:var(--text-2);line-height:1.5}

    /* cta */
    .ex-cta{text-align:center;background:linear-gradient(135deg,rgba(29,185,84,.18),rgba(124,108,240,.14));
      border:1px solid rgba(29,185,84,.28);border-radius:18px;padding:38px 20px}
    .ex-cta h3{font-size:24px;margin-bottom:8px}
    .ex-cta p{color:var(--text-2);font-size:14px;margin-bottom:20px}
    .ex-cta-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}


    /* booth map */
    .ex-map{background:var(--bg-el);border:1px solid #2a2a2a;border-radius:16px;padding:22px}
    .ex-map-grid{display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:repeat(5,minmax(74px,1fr));gap:8px;margin-bottom:14px}
    .ex-booth{background:var(--bg-card);border:1px solid #333;border-radius:10px;padding:8px;cursor:pointer;color:var(--text);font-family:inherit;
      display:flex;flex-direction:column;justify-content:space-between;text-align:left;transition:all .2s;border-top:3px solid var(--c)}
    .ex-booth:hover{transform:translateY(-3px);border-color:var(--c)}
    .ex-booth.active{background:color-mix(in srgb,var(--c) 16%,#1e1e1e);box-shadow:0 0 0 1px var(--c)}
    .ex-booth-id{font-family:'Space Mono',monospace;font-size:15px;font-weight:700;color:var(--c)}
    .ex-booth-n{font-size:10px;color:var(--text-2);line-height:1.3}
    .ex-map-center{grid-column:2/7;grid-row:1/5;border:2px dashed #333;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;
      text-align:center;color:var(--text-3);font-family:'Space Mono',monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;padding:8px;gap:4px}
    .ex-map-center b{font-size:20px;letter-spacing:0}
    .ex-map-door{display:flex;justify-content:center;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:1.5px;color:var(--text-3);text-transform:uppercase;margin-bottom:16px}
    .ex-booth-info{border-top:1px dashed #2f2f2f;padding-top:16px}
    .ex-booth-info h3{font-size:18px;margin-bottom:6px;color:var(--c)}
    .ex-booth-info p{font-size:13px;color:var(--text-2);margin-bottom:10px}

    .ex-viewtabs{display:flex;gap:6px;margin-bottom:14px}
    .ex-vt{padding:8px 16px;border-radius:20px;border:1px solid #333;background:var(--bg-card);color:var(--text-2);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s}
    .ex-vt:hover{color:var(--text);border-color:#555}
    .ex-vt.on{background:var(--text);color:#000;border-color:var(--text)}
    .ex3-slot:empty{aspect-ratio:16/9;min-height:300px;max-height:560px;border-radius:14px;background:#1a1a1a}
    .ex-map #ex3d{margin-bottom:16px}
    .ex-map #ex2d[hidden],.ex-map #ex3d[hidden]{display:none}
    /* isi booth (panel di 3D + kartu info di bawah denah) */
    .bp-top{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 14px 0}
    .bp-id{font-family:'Space Mono',monospace;font-weight:700;font-size:12px;background:var(--c);color:#000;padding:4px 11px;border-radius:20px}
    .bp-cnt{font-family:'Space Mono',monospace;font-size:10px;color:var(--text-3);letter-spacing:1px}
    .bp-x{margin-left:auto;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);color:#fff;border-radius:20px;padding:5px 11px;font-size:11px;font-weight:700;font-family:inherit;cursor:pointer}
    .bp-x:hover{background:rgba(255,255,255,.18)}
    .bp-name{font-size:18px;font-weight:700;line-height:1.25;margin:12px 14px 2px;color:#fff}
    .bp-inline .bp-name{margin:0 0 4px;color:var(--c)}
    .bp-sec{padding:0 14px;margin-top:16px}
    .bp-inline .bp-sec{padding:0}
    .bp-lbl{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:1.5px;color:var(--text-3);text-transform:uppercase;margin-bottom:8px}
    .bp-fac{border:1px solid #2c2c2c;border-left:3px solid var(--fc);border-radius:10px;padding:10px 12px;margin-bottom:8px;background:rgba(255,255,255,.035)}
    .bp-fac-h{display:flex;align-items:center;gap:8px;font-weight:700;font-size:13px;margin-bottom:8px}
    .bp-fac-h i{font-style:normal;color:var(--fc);font-size:16px}
    .bp-fac-h button{margin-left:auto;background:none;border:none;color:var(--fc);font-size:11px;font-weight:700;cursor:pointer;font-family:inherit}
    .bp-note{font-size:12.5px;color:var(--text-2);line-height:1.65}
    .bp-chips{display:flex;flex-wrap:wrap;gap:6px}
    .bp-chips span{font-size:11px;padding:4px 10px;border-radius:20px;border:1px solid #3a3a3a;color:var(--text-2);background:rgba(255,255,255,.04)}
    .bp-chips.ask span{border-color:color-mix(in srgb,var(--c) 55%,transparent);color:var(--text)}
    .bp-person{display:flex;gap:10px;align-items:center;padding:8px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid #2a2a2a;margin-bottom:6px}
    .bp-av{position:relative;width:44px;height:44px;border-radius:50%;overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;background:linear-gradient(135deg,var(--c),#111)}
    .bp-av img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 20%}
    .bp-av.has{cursor:zoom-in}
    .bp-pn{font-size:13px;font-weight:700;line-height:1.3}
    .bp-ps{font-size:11px;color:var(--text-3);margin-top:1px}
    .bp-person.soon{border-style:dashed;background:transparent;color:var(--text-3);font-size:12px}
    .bp-person.soon .bp-av{background:#1f1f1f;color:#555}
    .bp-nav{display:flex;gap:8px;padding:14px;margin-top:6px;position:sticky;bottom:0;background:linear-gradient(rgba(14,15,17,0),rgba(14,15,17,.96) 35%)}
    .bp-nav button{flex:1;padding:9px;border-radius:10px;border:1px solid #3a3a3a;background:rgba(255,255,255,.06);color:#fff;font-family:inherit;font-size:12px;font-weight:700;cursor:pointer}
    .bp-nav button:hover{border-color:var(--c);background:color-mix(in srgb,var(--c) 18%,transparent)}
    @media(min-width:701px){.ex-map.m3d .ex-booth-info{display:none}}
    .ex-map-hint{font-size:12px;color:var(--text-3);margin:-4px 0 14px}
    .ex-map.m3d .ex-map-hint{display:block}
    .ex-map:not(.m3d) .ex-map-hint{display:none}

    /* committee v2 */
    .cm-po{position:relative;display:grid;grid-template-columns:200px 1fr;gap:28px;align-items:center;padding:26px;margin-bottom:22px;border-radius:20px;overflow:hidden;
      background:radial-gradient(circle at 90% 10%,rgba(29,185,84,.22),transparent 50%),radial-gradient(circle at 0% 100%,rgba(124,108,240,.18),transparent 50%),#101113;
      border:1px solid rgba(29,185,84,.3)}
    .cm-po::after{content:'PO';position:absolute;right:18px;bottom:-34px;font-family:'Space Mono',monospace;font-size:150px;font-weight:700;color:rgba(255,255,255,.035);line-height:1;pointer-events:none}
    .cm-ph{position:relative;aspect-ratio:4/5;border-radius:16px;overflow:hidden;background:linear-gradient(160deg,var(--c,#1DB954),#0b0c0e 85%);display:flex;align-items:center;justify-content:center;
      font-size:44px;font-weight:700;color:rgba(255,255,255,.92);box-shadow:0 18px 40px rgba(0,0,0,.45)}
    .cm-ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 20%;transition:transform .5s}
    .cm-ph.has{cursor:zoom-in}
    .cm-ph.has:hover img{transform:scale(1.06)}
    .cm-ph svg{width:46%;height:auto;opacity:.45}
    .cm-ph::after{content:'';position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12);pointer-events:none}
    .cm-role{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--c,var(--green))}
    .cm-po-name{font-size:clamp(26px,4vw,40px);font-weight:700;letter-spacing:-1px;line-height:1.05;margin:8px 0 12px}
    .cm-po-name.soon{color:var(--text-3)}
    .cm-po-quote{font-size:14px;line-height:1.7;color:var(--text-2);max-width:480px;border-left:3px solid var(--green);padding-left:14px}
    .cm-po-quote.soon{border-left-color:#333;color:var(--text-3)}
    .cm-core{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px;margin-bottom:22px}
    .cm-filter{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px}
    .cm-chip{padding:8px 14px;border-radius:20px;border:1px solid #333;background:var(--bg-card);color:var(--text-2);font-family:inherit;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;display:inline-flex;gap:6px;align-items:center}
    .cm-chip:hover{color:var(--text);border-color:var(--c,#555)}
    .cm-chip.on{background:var(--c,var(--text));border-color:var(--c,var(--text));color:#000}
    .cm-divs{display:grid;gap:18px}
    .cm-div{background:var(--bg-el);border:1px solid #2a2a2a;border-radius:18px;padding:22px;position:relative;overflow:hidden}
    .cm-div::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--c)}
    .cm-div[hidden]{display:none}
    .cm-div-head{display:flex;gap:14px;align-items:flex-start;margin-bottom:20px}
    .cm-div-ic{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;background:color-mix(in srgb,var(--c) 18%,#161616);border:1px solid color-mix(in srgb,var(--c) 40%,transparent)}
    .cm-div-n{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:1.5px;color:var(--c);text-transform:uppercase}
    .cm-div-name{font-size:19px;font-weight:700;margin:3px 0 4px}
    .cm-div-d{font-size:13px;color:var(--text-2);line-height:1.6;max-width:620px}
    .cm-people{display:grid;grid-template-columns:repeat(auto-fill,minmax(138px,1fr));gap:14px}
    .cm-person{background:var(--bg-card);border:1px solid #2c2c2c;border-radius:14px;padding:8px 8px 12px;transition:transform .2s,border-color .2s,background .2s;position:relative}
    .cm-person:hover{transform:translateY(-4px);border-color:var(--c);background:var(--bg-hl)}
    .cm-person .cm-ph{border-radius:10px;font-size:30px;box-shadow:none;margin-bottom:10px}
    .cm-pn{font-size:13.5px;font-weight:700;line-height:1.3;padding:0 4px}
    .cm-pr{font-size:11px;color:var(--text-3);margin-top:2px;padding:0 4px}
    .cm-person.lead{border-color:var(--c);background:color-mix(in srgb,var(--c) 10%,#1e1e1e)}
    .cm-person.lead .cm-pr{color:var(--c);font-weight:700}
    .cm-badge{position:absolute;top:14px;left:14px;z-index:2;font-family:'Space Mono',monospace;font-size:9px;letter-spacing:1px;text-transform:uppercase;font-weight:700;background:var(--c);color:#000;padding:3px 8px;border-radius:20px}
    .cm-person.soon{background:transparent;border-style:dashed}
    .cm-person.soon:hover{transform:none;background:transparent;border-color:#2c2c2c}
    .cm-person.soon .cm-ph{background:linear-gradient(110deg,#1d1d1d 30%,#2a2a2a 50%,#1d1d1d 70%);background-size:200% 100%;animation:exSk 1.8s linear infinite;box-shadow:none}
    .cm-person.soon .cm-pn{color:var(--text-3);font-weight:600}

    /* confession wall */
    .ex-wall-form{background:var(--bg-el);border:1px solid #2a2a2a;border-radius:16px;padding:20px;margin-bottom:18px;display:grid;gap:10px}
    .ex-wall-form input,.ex-wall-form textarea{width:100%;padding:12px 14px;border-radius:10px;border:1px solid #333;background:var(--bg-card);color:var(--text);font-family:inherit;font-size:14px;outline:none}
    .ex-wall-form textarea{min-height:92px;resize:vertical}
    .ex-wall-form input:focus,.ex-wall-form textarea:focus{border-color:var(--green)}
    .ex-wall-row{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
    .ex-wall-count{font-family:'Space Mono',monospace;font-size:11px;color:var(--text-3)}
    .ex-wall-hp{position:absolute!important;left:-9999px!important;opacity:0!important;height:0!important;width:0!important}
    .ex-wall-note{font-size:12px;color:var(--text-3)}
    .ex-wall-demo{font-size:12px;color:#EAB308;background:rgba(234,179,8,.1);border:1px solid rgba(234,179,8,.3);border-radius:10px;padding:8px 12px}
    .ex-wall{columns:3 240px;column-gap:14px}
    .ex-note{break-inside:avoid;margin-bottom:14px;padding:16px;border-radius:6px 6px 14px 6px;color:#16161a;background:var(--n);
      box-shadow:0 10px 24px rgba(0,0,0,.35);transform:rotate(var(--r));transition:transform .2s;animation:exPop .4s ease both}
    .ex-note:hover{transform:rotate(0) scale(1.02)}
    @keyframes exPop{from{opacity:0;transform:scale(.9) rotate(var(--r))}}
    .ex-note-msg{font-size:14px;line-height:1.55;white-space:pre-wrap;word-break:break-word;margin-bottom:12px}
    .ex-note-by{display:flex;justify-content:space-between;gap:8px;font-size:11px;font-weight:700}
    .ex-note-by span:last-child{font-weight:500;opacity:.65;white-space:nowrap}
    .ex-wall-empty{text-align:center;color:var(--text-3);padding:28px 0;font-size:13px}
    .ex-wall-more{display:block;margin:6px auto 0}
    .ex-wall-more[hidden]{display:none}

    @media(max-width:900px){
      .ex-hero{grid-template-columns:1fr;padding:30px 20px}
      .ex-layout{grid-template-columns:1fr}
      .ex-detail{position:static}
      .ex-grid{grid-template-columns:repeat(3,1fr)}
      .ex-quiz-opts{grid-template-columns:1fr}
      .ex-sticker{left:0}
      .cm-po{grid-template-columns:150px 1fr;gap:18px;padding:18px}
    }
    @media(max-width:560px){
      .cm-po{grid-template-columns:1fr;text-align:left}.cm-po .cm-ph{max-width:200px}.cm-people{grid-template-columns:repeat(2,1fr)}.cm-div{padding:16px}
      .ex-map{padding:12px}.ex-map-grid{gap:6px;grid-template-rows:repeat(2,minmax(84px,1fr))}
      .ex-booth{padding:6px}.ex-booth-n{display:none}.ex-booth-id{font-size:12px}.ex-map-grid{grid-template-rows:repeat(5,minmax(52px,1fr))}.ex-map-center b{font-size:15px}.ex-map-center{font-size:9px}
    }
    @media(max-width:768px){
      #tab-expo{padding:0 16px 32px}
      .ex-banner{margin:0 16px 14px;width:calc(100% - 32px)}
      .ex-banner-go{display:none}
      .ex-quiz{padding:20px 16px}
      .ex-quiz-q{font-size:18px}
      .ex-cbox{min-width:58px}
    }
    @media(prefers-reduced-motion:reduce){
      #tab-expo *,.ex-banner{animation:none!important;transition:none!important}
      .ex-reveal{opacity:1;transform:none}
    }
  `;
  document.head.appendChild(css);

  // ============================================================
  // 3. HELPER
  // ============================================================
  const FAV_KEY = 'expoFavs';
  const state = { sel: FACULTIES[0].id };
  const qz = { i: 0, score: {} };

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function say(m) { if (typeof toast === 'function') toast(m); }
  function byId(id) { return FACULTIES.find(x => x.id === id); }
  function boothColor(b) { const f = byId(b.faculties[0]); return b.color || (f ? f.color : '#1DB954'); }
  function getFavs() { try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch (e) { return []; } }
  function setFavs(a) { try { localStorage.setItem(FAV_KEY, JSON.stringify(a)); } catch (e) {} }
  function pad(n) { return String(n).padStart(2, '0'); }
  function pageUrl() { return location.href.split('#')[0] + '#expo'; }

  // ============================================================
  // 4. BUILD HTML
  // ============================================================
  function buildHTML() {
    const c = EXPO_CONFIG;
    const half = Math.ceil(FACULTIES.length / 2);
    const allMajors = [];
    FACULTIES.forEach(f => f.majors.forEach(m => { if (allMajors.indexOf(m) < 0) allMajors.push(m); }));
    const marquee = allMajors.map(m => `<span>${esc(m)}</span>`).join('');

    const cell = f => `<button class="ex-fac" data-act="fac" data-id="${f.id}" style="--c:${f.color}"
        data-s="${esc((f.name + ' ' + f.en + ' ' + f.majors.join(' ')).toLowerCase())}">
        <span class="ex-fac-top"><span class="ex-fac-n">${f.id}</span><span class="ex-fac-heart">♥</span></span>
        <span class="ex-fac-name">${esc(f.name)}</span></button>`;

    return `
      <div class="ex-hero ex-reveal">
        <div>
          <div class="ex-badge">${esc(c.badge)}</div>
          <div class="ex-title">${esc(c.titleTop)}<br><span class="mid">${esc(c.titleMid)}</span><br>${esc(c.titleBottom)}</div>
          <p class="ex-desc">${esc(c.desc)}</p>
          <div class="ex-hero-btns">
            <button class="ex-btn" data-act="goquiz">🎯 Temukan Jurusanmu</button>
            <button class="ex-btn ghost" data-act="gobooth">🗺️ Lihat Denah Booth</button>
          </div>
          <div class="ex-stats">${c.stats.map(s => `<div><div class="ex-stat-n">${esc(s.n)}</div><div class="ex-stat-l">${esc(s.l)}</div></div>`).join('')}</div>
        </div>
        <div class="ex-card-wrap">
          <div class="ex-polaroid">
            <div class="ex-sticker">Tanya apa aja ✨</div>
            <div class="ex-polaroid-img"><img src="logoprome.jpeg" alt="" onerror="this.style.display='none';this.parentElement.textContent='🎓'"></div>
            <div class="ex-polaroid-cap">Campus Expo · Promethea</div>
          </div>
        </div>
      </div>

      <div class="ex-count ex-reveal" id="exCount">
        <div class="ex-count-lbl">Hitung mundur<b id="exCountTitle">Menuju Campus Expo</b></div>
        <div class="ex-count-boxes">
          <div class="ex-cbox"><div class="ex-cbox-n" data-u="d">00</div><div class="ex-cbox-l">Hari</div></div>
          <div class="ex-cbox"><div class="ex-cbox-n" data-u="h">00</div><div class="ex-cbox-l">Jam</div></div>
          <div class="ex-cbox"><div class="ex-cbox-n" data-u="m">00</div><div class="ex-cbox-l">Menit</div></div>
          <div class="ex-cbox"><div class="ex-cbox-n" data-u="s">00</div><div class="ex-cbox-l">Detik</div></div>
        </div>
        <div class="ex-count-tba">Tanggal segera diumumkan</div>
      </div>

      <div class="ex-marquee ex-reveal"><div class="ex-marquee-track">${marquee}${marquee}</div></div>

      <div class="ex-info ex-reveal">${c.info.map(i => `<div class="ex-info-item"><div class="ex-info-ic">${i.icon}</div><div><div class="ex-info-l">${esc(i.l)}</div><div class="ex-info-v">${esc(i.v)}</div></div></div>`).join('')}</div>

      <div class="ex-sec ex-reveal" id="exWallSec">
        <div class="ex-sec-head">
          <div class="ex-sec-title">Confession Wall 💌</div>
          <div class="ex-sec-tag">Tinggalkan pesan</div>
        </div>
        <form class="ex-wall-form" id="exWallForm" autocomplete="off">
          <input id="exWName" type="text" maxlength="${SUPABASE.maxName}" placeholder="Namamu (boleh nama panggilan)" required>
          <textarea id="exWMsg" maxlength="${SUPABASE.maxMsg}" placeholder="Tulis pesan, kesan, atau pertanyaan untuk kakak-kakak dan teman-teman Promethea…" required></textarea>
          <input class="ex-wall-hp" id="exWHp" type="text" tabindex="-1" aria-hidden="true" autocomplete="off">
          <div class="ex-wall-row">
            <span class="ex-wall-count" id="exWCount">0 / ${SUPABASE.maxMsg}</span>
            <button class="ex-btn" type="submit" id="exWBtn">Kirim ke Wall ✉️</button>
          </div>
          <div class="ex-wall-note">Pesan tampil untuk semua pengunjung. Jaga sopan santun ya, pesan yang tidak pantas akan dihapus panitia.</div>
          <div class="ex-wall-demo" id="exWDemo" hidden>Mode demo: Supabase belum dihubungkan, pesan hanya tersimpan di browser ini.</div>
        </form>
        <div class="ex-wall" id="exWall"></div>
        <button class="ex-btn ghost ex-wall-more" id="exWMore" data-act="wallmore" hidden>Muat lebih banyak</button>
      </div>

      <div class="ex-sec ex-reveal">
        <div class="ex-sec-head">
          <div class="ex-sec-title">Susunan Acara</div>
          <div class="ex-sec-tag">Rundown</div>
        </div>
        <div class="ex-tl">${RUNDOWN.map(r => `<div class="ex-tl-item"><div class="ex-tl-time">${esc(r.t)}</div><div class="ex-tl-title">${esc(r.title)}</div><div class="ex-tl-d">${esc(r.d)}</div></div>`).join('')}</div>
      </div>

      <div class="ex-sec ex-reveal" id="exQuizSec">
        <div class="ex-sec-head">
          <div class="ex-sec-title">Belum tahu mau ambil jurusan apa?</div>
          <div class="ex-sec-tag">Kuis · 5 pertanyaan</div>
        </div>
        <div class="ex-quiz" id="exQuiz"></div>
      </div>

      <div class="ex-sec ex-reveal" id="exForum">
        <div class="ex-sec-head">
          <div class="ex-sec-title">Eksplor Rumpun Ilmu</div>
          <div class="ex-sec-tag">Forum / ${FACULTIES.length} bidang</div>
        </div>
        <input class="ex-search" id="exSearch" type="search" placeholder="🔍 Cari bidang atau jurusan, mis. Informatika, Psikologi…" autocomplete="off">
        <div class="ex-sresult" id="exSResult"></div>
        <div class="ex-layout">
          <div class="ex-forum">
            <div class="ex-area">Area A</div>
            <div class="ex-grid">${FACULTIES.slice(0, half).map(cell).join('')}</div>
            <div class="ex-area">Area B</div>
            <div class="ex-grid" style="margin-bottom:18px">${FACULTIES.slice(half).map(cell).join('')}</div>
            <div class="ex-pl" id="exPlaylist"></div>
          </div>
          <div class="ex-detail" id="exDetail"></div>
        </div>
      </div>

      <div class="ex-sec ex-reveal" id="exBoothSec">
        <div class="ex-sec-head">
          <div class="ex-sec-title">Denah Booth</div>
          <div class="ex-sec-tag">Layout / ${BOOTHS.length} booth</div>
        </div>
        <div class="ex-map">
          <div class="ex-viewtabs">
            <button class="ex-vt on" data-act="view" data-v="3d" id="exVt3d">🧊 Tampilan 3D</button>
            <button class="ex-vt" data-act="view" data-v="2d" id="exVt2d">🗺️ Denah 2D</button>
          </div>
          <div class="ex-map-hint">Tap booth untuk masuk ke dalamnya — lihat jurusan dan kakak yang berjaga.</div>
          <div id="ex3d" class="ex3-slot"></div>
          <div id="ex2d" hidden>
          <div class="ex-map-grid">
            <div class="ex-map-center"><b>🎪</b>Area Tengah<br>Open Space</div>
            ${BOOTHS.map((b, i) => { const pos = i < 5 ? [1, i + 1] : (i < 10 ? [i - 3, 5] : [7, 5 - (i - 10)]); return `<button class="ex-booth" data-act="booth" data-id="${esc(b.id)}" style="--c:${boothColor(b)};grid-column:${pos[0]};grid-row:${pos[1]}"><span class="ex-booth-id">${esc(b.id)}</span><span class="ex-booth-n">${esc(b.name.replace(/^Booth\s+/i, ''))}</span></button>`; }).join('')}
          </div>
          <div class="ex-map-door">▲ Bagian depan ▲</div>
          </div>
          <div class="ex-booth-info" id="exBoothInfo"></div>
        </div>
      </div>

      <div class="ex-sec ex-reveal" id="exCommittee">
        <div class="ex-sec-head">
          <div class="ex-sec-title">Susunan Kepanitiaan</div>
          <div class="ex-sec-tag">1 PO · ${COMMITTEE.divisions.length} divisi · ${committeeCount()} orang</div>
        </div>
        ${buildCommittee()}
      </div>

      <div class="ex-cta ex-reveal">
        <h3>Siap tanya-tanya soal kuliah? 🎓</h3>
        <p>Tidak perlu daftar. Pilih bidang yang kamu minati, lalu datang dan ngobrol langsung sama kakaknya.</p>
        <div class="ex-cta-btns">
          <button class="ex-btn" data-act="gobooth">🗺️ Lihat Denah Booth</button>
          <button class="ex-btn ghost" data-act="ask">💬 Tanya Panitia</button>
          <button class="ex-btn ghost" data-act="share">↗ Ajak Teman</button>
        </div>
      </div>`;
  }

  // ============================================================
  // 5. RENDER DINAMIS
  // ============================================================
  function renderDetail() {
    const f = byId(state.sel);
    const d = document.getElementById('exDetail');
    if (!f || !d) return;
    const fav = getFavs().indexOf(f.id) >= 0;
    const where = BOOTHS.filter(b => b.faculties.indexOf(f.id) >= 0);
    d.style.setProperty('--c', f.color);
    d.innerHTML = `
      <div class="ex-detail-top">Bidang / ${f.id}</div>
      <div class="ex-detail-icon">${f.icon}</div>
      <h3>${esc(f.name)}</h3>
      <div class="ex-detail-en">${esc(f.en)}</div>
      <p>${esc(f.desc)}</p>
      <div class="ex-sub">Jurusan populer</div>
      <div class="ex-chips">${f.majors.map(m => `<span class="ex-chip">${esc(m)}</span>`).join('')}</div>
      <div class="ex-sub">Temukan di booth</div>
      ${where.length
        ? `<div class="ex-chips">${where.map(b => `<button class="ex-pl-chip" style="--c:${f.color}" data-act="gobooth" data-id="${esc(b.id)}">📍 ${esc(b.id)}</button>`).join('')}</div>`
        : `<div class="ex-soon">Booth bidang ini segera diumumkan 👀</div>`}
      <div class="ex-detail-btns">
        <button class="ex-btn ex-fav-btn full${fav ? ' on' : ''}" data-act="fav" data-id="${f.id}">${fav ? '♥ Tersimpan di Playlist' : '♡ Simpan ke Playlist Jurusanku'}</button>
        <button class="ex-btn full" data-act="gobooth" data-id="${where[0] ? esc(where[0].id) : ''}">Lihat di Denah Booth</button>
      </div>`;
  }

  function renderPlaylist() {
    const el = document.getElementById('exPlaylist');
    if (!el) return;
    const favs = getFavs().map(byId).filter(Boolean);
    el.innerHTML = `<span class="ex-pl-lbl">♥ Playlist Jurusanku</span>` +
      (favs.length
        ? favs.map(f => `<button class="ex-pl-chip" style="--c:${f.color}" data-act="fac" data-id="${f.id}">${esc(f.name)}</button>`).join('') +
          `<button class="ex-pl-share" data-act="share">Bagikan ↗</button>`
        : `<span class="ex-pl-empty">Tap ♡ di bidang yang kamu suka, nanti tersimpan di sini.</span>`);
    const set = getFavs();
    document.querySelectorAll('#tab-expo .ex-fac').forEach(b => b.classList.toggle('fav', set.indexOf(b.dataset.id) >= 0));
  }

  function selectFac(id, scroll) {
    if (!byId(id)) return;
    state.sel = id;
    document.querySelectorAll('#tab-expo .ex-fac').forEach(b => b.classList.toggle('active', b.dataset.id === id));
    renderDetail();
    if (scroll && window.innerWidth <= 900) {
      const d = document.getElementById('exDetail');
      if (d) d.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function toggleFav(id) {
    let favs = getFavs();
    const i = favs.indexOf(id);
    if (i >= 0) favs.splice(i, 1); else favs.push(id);
    setFavs(favs);
    renderPlaylist();
    renderDetail();
    const f = byId(id);
    say(i >= 0 ? '♡ ' + f.name + ' dihapus dari playlist' : '♥ ' + f.name + ' masuk Playlist Jurusanku');
  }

  function filterFac(q) {
    q = q.toLowerCase().trim();
    const res = document.getElementById('exSResult');
    const cells = document.querySelectorAll('#tab-expo .ex-fac');
    let hits = [];
    cells.forEach(b => {
      const f = byId(b.dataset.id);
      const old = b.querySelector('.ex-fac-hit'); if (old) old.remove();
      const match = !q || b.dataset.s.indexOf(q) >= 0;
      b.classList.toggle('dim', !!q && !match);
      b.classList.toggle('hit', !!q && match);
      if (q && match) {
        hits.push(f);
        // tampilkan jurusan yang cocok supaya jelas kenapa kotak ini muncul
        const mj = f.majors.filter(m => m.toLowerCase().indexOf(q) >= 0)[0];
        if (mj) { const n = document.createElement('span'); n.className = 'ex-fac-hit'; n.textContent = '↳ ' + mj; b.appendChild(n); }
      }
    });
    if (!res) return;
    if (!q) { res.innerHTML = ''; return; }
    res.innerHTML = hits.length
      ? `<b>${hits.length}</b> bidang cocok untuk "${esc(q)}"<button type="button" data-act="clearsearch">Hapus</button>`
      : `Tidak ada bidang yang cocok untuk "<b>${esc(q)}</b>". Coba kata lain, mis. "teknik" atau "psikologi".<button type="button" data-act="clearsearch">Tampilkan semua</button>`;
    if (hits.length && hits.every(f => f.id !== state.sel)) selectFac(hits[0].id);
  }
  function clearSearch() {
    const i = document.getElementById('exSearch');
    if (i) { i.value = ''; i.focus(); }
    filterFac('');
  }

  // ---------- Kuis ----------
  function renderQuiz() {
    const el = document.getElementById('exQuiz');
    if (!el) return;
    const total = QUIZ.length;

    if (qz.i === -1) { // intro
      el.innerHTML = `<div class="ex-quiz-intro">
        <div class="big">🎯</div><h3>Temukan Jurusanmu</h3>
        <p>Jawab ${total} pertanyaan singkat, kami kasih rekomendasi bidang yang cocok buat kamu.</p>
        <button class="ex-btn" data-act="start">Mulai Kuis</button></div>`;
      return;
    }

    if (qz.i >= total) { // hasil
      const ranked = FACULTIES.map(f => ({ f: f, s: qz.score[f.id] || 0 }))
        .sort((a, b) => b.s - a.s).slice(0, 3);
      el.innerHTML = `
        <div class="ex-quiz-step">Hasil kuismu</div>
        <div class="ex-res-head">Ini 3 bidang yang paling nyambung sama jawabanmu. Tap untuk lihat detailnya.</div>
        <div class="ex-res">${ranked.map((r, i) => `
          <button class="ex-res-card" style="--c:${r.f.color}" data-act="jump" data-id="${r.f.id}">
            <div class="ex-res-rank">#${i + 1} COCOK</div>
            <div class="ex-res-icon">${r.f.icon}</div>
            <div class="ex-res-name">${esc(r.f.name)}</div>
            <div class="ex-res-sub">${r.s} dari ${total} jawaban nyambung</div>
          </button>`).join('')}</div>
        <button class="ex-btn ghost" data-act="retry">↻ Ulangi Kuis</button>`;
      return;
    }

    const q = QUIZ[qz.i];
    el.innerHTML = `
      <div class="ex-quiz-dots">${QUIZ.map((_, i) => `<i class="${i <= qz.i ? 'on' : ''}"></i>`).join('')}</div>
      <div class="ex-quiz-step">Pertanyaan ${qz.i + 1} / ${total}</div>
      <div class="ex-quiz-q">${esc(q.q)}</div>
      <div class="ex-quiz-opts">${q.o.map((o, i) => `<button class="ex-opt" data-act="pick" data-i="${i}">${esc(o.t)}</button>`).join('')}</div>`;
  }

  function pick(i) {
    const o = QUIZ[qz.i] && QUIZ[qz.i].o[i];
    if (!o) return;
    o.s.forEach(id => { qz.score[id] = (qz.score[id] || 0) + 1; });
    qz.i++;
    renderQuiz();
  }

  // ---------- Countdown ----------
  function tick() {
    const box = document.getElementById('exCount');
    const bt = document.getElementById('exBannerTxt');
    const t = EXPO_CONFIG.date ? new Date(EXPO_CONFIG.date).getTime() : NaN;

    if (isNaN(t)) {
      if (box) box.classList.add('tba');
      if (bt) bt.textContent = 'Segera hadir — ngobrol langsung sama kakak kelas';
      return;
    }
    if (box) box.classList.remove('tba');
    const diff = Math.max(0, t - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff % 86400000 / 3600000);
    const m = Math.floor(diff % 3600000 / 60000);
    const s = Math.floor(diff % 60000 / 1000);
    if (box) {
      const set = (u, v) => { const n = box.querySelector('[data-u="' + u + '"]'); if (n) n.textContent = pad(v); };
      set('d', d); set('h', h); set('m', m); set('s', s);
      const ti = document.getElementById('exCountTitle');
      if (ti) ti.textContent = diff === 0 ? 'Hari-H! Yuk gabung' : 'Menuju Campus Expo';
    }
    if (bt) bt.textContent = diff === 0 ? 'Hari-H! Yuk gabung sekarang' : (d > 0 ? d + ' hari lagi' : 'Hari ini! ' + pad(h) + ':' + pad(m) + ':' + pad(s));
  }


  // ---------- Kepanitiaan v2 ----------
  const SIL = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="8" r="4.2"/><path d="M3.5 21c.6-4.6 4-7 8.5-7s7.9 2.4 8.5 7z"/></svg>';
  function person(p) { return typeof p === 'string' ? { name: p } : (p || {}); }
  function committeeCount() {
    let n = COMMITTEE.po && COMMITTEE.po.name ? 1 : 0;
    n += (COMMITTEE.core || []).filter(c => person(c).name).length;
    COMMITTEE.divisions.forEach(d => { if (person(d.head).name) n++; n += (d.members || []).filter(m => person(m).name).length; });
    return n;
  }
  function photoBox(p, color, cap) {
    const ini = esc((p.name || '').trim().charAt(0).toUpperCase());
    const has = !!(p.photo && p.name);
    return `<div class="cm-ph${has ? ' has' : ''}" style="--c:${color}"${has ? ` data-act="cmphoto" data-src="${esc(p.photo)}" data-cap="${esc(cap)}"` : ''}>
      ${p.name ? `<span>${ini}</span>` : SIL}${has ? `<img src="${esc(p.photo)}" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()">` : ''}</div>`;
  }
  function personCard(raw, color, role, lead) {
    const p = person(raw), r = p.role || role;
    if (!p.name) {
      return `<div class="cm-person soon" style="--c:${color}">${photoBox({}, color, '')}<div class="cm-pn">Segera diumumkan</div><div class="cm-pr">${esc(r)}</div></div>`;
    }
    return `<div class="cm-person${lead ? ' lead' : ''}" style="--c:${color}">${lead ? '<span class="cm-badge">Koordinator</span>' : ''}
      ${photoBox(p, color, p.name + ' · ' + r)}<div class="cm-pn">${esc(p.name)}</div><div class="cm-pr">${esc(r)}</div></div>`;
  }
  function buildCommittee() {
    const po = person(COMMITTEE.po), G = '#1DB954';
    const poHtml = `<div class="cm-po" style="--c:${G}">
      ${photoBox(po, G, (po.name || '') + ' · Project Officer')}
      <div><div class="cm-role">${esc(COMMITTEE.po.role || 'Project Officer')}</div>
        <div class="cm-po-name${po.name ? '' : ' soon'}">${po.name ? esc(po.name) : 'Segera diumumkan'}</div>
        <div class="cm-po-quote${COMMITTEE.po.quote ? '' : ' soon'}">${COMMITTEE.po.quote ? esc(COMMITTEE.po.quote) : 'Foto dan sambutan Project Officer akan tampil di sini.'}</div></div></div>`;
    const core = (COMMITTEE.core || []).length
      ? `<div class="cm-core">${COMMITTEE.core.map(c => personCard(c, G, person(c).role || 'Inti')).join('')}</div>` : '';
    const filter = `<div class="cm-filter"><button class="cm-chip on" data-act="cmfilter" data-i="-1">Semua divisi</button>` +
      COMMITTEE.divisions.map((d, i) => `<button class="cm-chip" style="--c:${d.color}" data-act="cmfilter" data-i="${i}">${d.icon} ${esc(d.name)}</button>`).join('') + `</div>`;
    const divs = COMMITTEE.divisions.map((d, i) => {
      const mem = d.members || [], filled = mem.filter(m => person(m).name).length + (person(d.head).name ? 1 : 0);
      const cards = personCard(d.head, d.color, 'Koordinator', true) +
        (mem.length ? mem.map(m => personCard(m, d.color, 'Anggota')).join('') : [0, 1, 2].map(() => personCard('', d.color, 'Anggota')).join(''));
      return `<section class="cm-div" data-div="${i}" style="--c:${d.color}">
        <div class="cm-div-head"><span class="cm-div-ic">${d.icon}</span><div>
          <div class="cm-div-n">Divisi ${pad(i + 1)} · ${filled ? filled + ' orang' : 'segera diumumkan'}</div>
          <div class="cm-div-name">${esc(d.name)}</div><div class="cm-div-d">${esc(d.desc)}</div></div></div>
        <div class="cm-people">${cards}</div></section>`;
    }).join('');
    return `<div class="cm-wrap">${poHtml}${core}${filter}<div class="cm-divs" id="cmDivs">${divs}</div></div>`;
  }
  function cmFilter(i, btn) {
    document.querySelectorAll('#tab-expo .cm-chip').forEach(c => c.classList.toggle('on', c === btn));
    document.querySelectorAll('#tab-expo .cm-div').forEach(d => { d.hidden = i >= 0 && +d.dataset.div !== i; });
  }
  function cmPhoto(src, cap) {
    if (typeof openLb !== 'function') return;
    try { lbImages = [{ src: src, cap: cap }]; openLb(0); } catch (e) {}
  }

  // ---------- Denah 3D (lazy-load booth3d.js) ----------
  const v3 = { ctl: null, tried: false, loading: false };
  function boothData() {
    return BOOTHS.map(b => ({ id: b.id, name: b.name, color: boothColor(b) }));
  }
  function show2D(msg) {
    const a = document.getElementById('ex3d'), b = document.getElementById('ex2d');
    if (a) a.hidden = true; if (b) b.hidden = false;
    const mp = document.querySelector('#tab-expo .ex-map'); if (mp) mp.classList.remove('m3d');
    const t3 = document.getElementById('exVt3d'), t2 = document.getElementById('exVt2d');
    if (t3) t3.classList.remove('on'); if (t2) t2.classList.add('on');
    if (msg) say(msg);
  }
  function show3D() {
    const a = document.getElementById('ex3d'), b = document.getElementById('ex2d');
    if (a) a.hidden = false; if (b) b.hidden = true;
    const mp = document.querySelector('#tab-expo .ex-map'); if (mp) mp.classList.add('m3d');
    const t3 = document.getElementById('exVt3d'), t2 = document.getElementById('exVt2d');
    if (t3) t3.classList.add('on'); if (t2) t2.classList.remove('on');
    if (v3.ctl) { v3.ctl.resize(); return; }
    if (v3.loading) return;
    v3.loading = true;
    const start = () => {
      try {
        v3.ctl = window.Expo3D.init({ container: document.getElementById('ex3d'), booths: boothData(), active: null, onSelect: id => selectBooth(id, true) });
      } catch (e) { show2D('3D tidak didukung di perangkat ini, ditampilkan denah 2D'); }
      v3.loading = false;
    };
    if (window.Expo3D) return start();
    const sc = document.createElement('script');
    sc.src = SCRIPT_BASE + 'booth3d.js';
    sc.onload = start;
    sc.onerror = () => { v3.loading = false; show2D('File booth3d.js tidak ditemukan, ditampilkan denah 2D'); };
    document.head.appendChild(sc);
  }
  function setupBooth3D() {
    // Perangkat lemah → mulai dari 2D. Selain itu muat 3D saat bagian ini mendekati layar.
    const weak = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) || (navigator.deviceMemory && navigator.deviceMemory <= 2);
    if (weak) { show2D(); return; }
    const sec = document.getElementById('exBoothSec');
    if (!sec) return;
    if (!('IntersectionObserver' in window)) { show3D(); return; }
    const io = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) { io.disconnect(); if (document.getElementById('ex2d').hidden) show3D(); }
    }, { root: document.getElementById('mainContent'), rootMargin: '300px' });
    io.observe(sec);
  }

  // ---------- Booth ----------
  function boothPeople(b, color) {
    const list = (b.people || []).map(person).filter(p => p.name);
    if (!list.length) return `<div class="bp-person soon"><div class="bp-av">?</div><div>Segera diumumkan 👀</div></div>`;
    return list.map(p => {
      const has = !!p.photo, sub = [p.major, p.campus].filter(Boolean).join(' · ') || p.role || '';
      return `<div class="bp-person"><div class="bp-av${has ? ' has' : ''}" style="--c:${color}"${has ? ` data-act="cmphoto" data-src="${esc(p.photo)}" data-cap="${esc(p.name + (sub ? ' · ' + sub : ''))}"` : ''}>
        <span>${esc(p.name.trim().charAt(0).toUpperCase())}</span>${has ? `<img src="${esc(p.photo)}" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()">` : ''}</div>
        <div><div class="bp-pn">${esc(p.name)}</div>${sub ? `<div class="bp-ps">${esc(sub)}</div>` : ''}</div></div>`;
    }).join('');
  }
  function boothBody(b) {
    const color = boothColor(b), facs = b.faculties.map(byId).filter(Boolean);
    const topics = b.topics || (facs.length ? ASK_DEFAULT : []);
    const jur = facs.length
      ? `<div class="bp-sec"><div class="bp-lbl">Jurusan yang bisa ditanyakan</div>${facs.map(f => `
          <div class="bp-fac" style="--fc:${f.color}"><div class="bp-fac-h"><i>${esc(f.icon)}</i>${esc(f.name)}<button data-act="jump" data-id="${f.id}">Lihat bidang ›</button></div>
          <div class="bp-chips">${f.majors.map(m => `<span>${esc(m)}</span>`).join('')}</div></div>`).join('')}</div>`
      : `<div class="bp-sec"><div class="bp-lbl">Tentang booth ini</div><div class="bp-note">${esc(b.note || 'Booth umum. Detail segera diumumkan.')}</div></div>`;
    const ask = topics.length ? `<div class="bp-sec"><div class="bp-lbl">Bisa kamu tanyakan</div><div class="bp-chips ask">${topics.map(t => `<span>${esc(t)}</span>`).join('')}</div></div>` : '';
    return jur + `<div class="bp-sec"><div class="bp-lbl">Kakak yang berjaga</div>${boothPeople(b, color)}</div>` + ask;
  }
  function boothPanel(b) {
    const idx = BOOTHS.findIndex(x => x.id === b.id);
    return `<div class="bp-top"><span class="bp-id">${esc(b.id)}</span><span class="bp-cnt">${idx + 1} / ${BOOTHS.length}</span>
        <button class="bp-x" data-act="exitbooth">↩ Keluar booth</button></div>
      <div class="bp-name">${esc(b.name.replace(/^Booth\s+/i, ''))}</div>${boothBody(b)}
      <div class="bp-nav"><button data-act="boothnav" data-d="-1">‹ Booth sebelumnya</button><button data-act="boothnav" data-d="1">Booth berikutnya ›</button></div>`;
  }
  function selectBooth(id, from3d) {
    const b = BOOTHS.find(x => x.id === id) || BOOTHS[0];
    state.booth = b.id;
    if (v3.ctl && !from3d) v3.ctl.setActive(b.id);
    if (v3.ctl) v3.ctl.setPanel(boothPanel(b), boothColor(b));
    const info = document.getElementById('exBoothInfo');
    if (!info) return;
    document.querySelectorAll('#tab-expo .ex-booth').forEach(el => el.classList.toggle('active', el.dataset.id === b.id));
    info.style.setProperty('--c', boothColor(b));
    info.innerHTML = `<div class="bp-inline"><div class="bp-name">${esc(b.id)} · ${esc(b.name)}</div>${boothBody(b)}</div>`;
    if (from3d && window.innerWidth <= 700) info.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function boothNav(d) {
    const i = BOOTHS.findIndex(x => x.id === state.booth);
    selectBooth(BOOTHS[(i + d + BOOTHS.length) % BOOTHS.length].id);
  }
  function exitBooth() {
    if (v3.ctl) v3.ctl.reset();
    document.querySelectorAll('#tab-expo .ex-booth').forEach(el => el.classList.remove('active'));
  }

  // ---------- Confession Wall ----------
  const WALL_KEY = 'expoWallDemo', CD_KEY = 'expoWallLast';
  const wall = { items: [], limit: SUPABASE.pageSize, busy: false, demo: !(SUPABASE.url && SUPABASE.key) };
  const NOTE_COLORS = ['#fde68a', '#bbf7d0', '#fbcfe8', '#bfdbfe', '#ddd6fe', '#fed7aa'];

  function sbFetch(path, opts) {
    opts = opts || {};
    return fetch(SUPABASE.url.replace(/\/$/, '') + '/rest/v1/' + path, {
      method: opts.method || 'GET',
      headers: Object.assign({ apikey: SUPABASE.key, Authorization: 'Bearer ' + SUPABASE.key, 'Content-Type': 'application/json' }, opts.headers || {}),
      body: opts.body
    }).then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.status === 204 ? null : r.json().catch(() => null);
    });
  }
  function demoGet() { try { return JSON.parse(localStorage.getItem(WALL_KEY)) || []; } catch (e) { return []; } }
  function demoSet(a) { try { localStorage.setItem(WALL_KEY, JSON.stringify(a)); } catch (e) {} }

  function ago(iso) {
    const t = new Date(iso).getTime();
    if (isNaN(t)) return '';
    const s = Math.max(0, (Date.now() - t) / 1000);
    if (s < 60) return 'baru saja';
    if (s < 3600) return Math.floor(s / 60) + ' menit lalu';
    if (s < 86400) return Math.floor(s / 3600) + ' jam lalu';
    if (s < 604800) return Math.floor(s / 86400) + ' hari lalu';
    return new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  }
  function hash(str) { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0; return Math.abs(h); }

  function renderWall() {
    const el = document.getElementById('exWall'), more = document.getElementById('exWMore');
    if (!el) return;
    if (!wall.items.length) {
      el.innerHTML = `<div class="ex-wall-empty" style="column-span:all">Belum ada pesan. Jadilah yang pertama menulis di wall ✨</div>`;
      if (more) more.hidden = true;
      return;
    }
    el.innerHTML = wall.items.map(c => {
      const h = hash(String(c.id) + c.name);
      return `<div class="ex-note" style="--n:${NOTE_COLORS[h % NOTE_COLORS.length]};--r:${(((h >> 3) % 5) - 2) * 0.9}deg">
        <div class="ex-note-msg">${esc(c.message)}</div>
        <div class="ex-note-by"><span>— ${esc(c.name)}</span><span>${esc(ago(c.created_at))}</span></div></div>`;
    }).join('');
    if (more) more.hidden = wall.items.length < wall.limit;
  }

  function loadWall() {
    if (wall.busy) return Promise.resolve();
    wall.busy = true;
    let p;
    if (wall.demo) {
      p = Promise.resolve(demoGet().slice(0, wall.limit));
    } else {
      p = sbFetch(SUPABASE.table + '?select=id,name,message,created_at&order=created_at.desc&limit=' + wall.limit);
    }
    return p.then(rows => { wall.items = rows || []; renderWall(); })
      .catch(() => { say('Wall gagal dimuat, coba lagi nanti'); })
      .then(() => { wall.busy = false; });
  }

  function submitWall(e) {
    e.preventDefault();
    const nameEl = document.getElementById('exWName'), msgEl = document.getElementById('exWMsg'), btn = document.getElementById('exWBtn');
    if (document.getElementById('exWHp').value) return; // bot
    const name = nameEl.value.trim().slice(0, SUPABASE.maxName), message = msgEl.value.trim().slice(0, SUPABASE.maxMsg);
    if (!name || !message) { say('Isi nama dan pesan dulu ya'); return; }
    let last = 0; try { last = +localStorage.getItem(CD_KEY) || 0; } catch (er) {}
    const wait = Math.ceil(SUPABASE.cooldownSec - (Date.now() - last) / 1000);
    if (wait > 0) { say('Tunggu ' + wait + ' detik sebelum kirim lagi'); return; }
    btn.disabled = true; btn.textContent = 'Mengirim…';
    const done = ok => {
      btn.disabled = false; btn.textContent = 'Kirim ke Wall ✉️';
      if (ok) {
        try { localStorage.setItem(CD_KEY, String(Date.now())); } catch (er) {}
        msgEl.value = ''; document.getElementById('exWCount').textContent = '0 / ' + SUPABASE.maxMsg;
        say('💌 Pesanmu sudah masuk wall!');
      } else say('Gagal mengirim, coba lagi ya');
    };
    if (wall.demo) {
      const a = demoGet();
      a.unshift({ id: 'd' + Date.now(), name: name, message: message, created_at: new Date().toISOString() });
      demoSet(a.slice(0, 100));
      wall.items = a.slice(0, wall.limit); renderWall(); done(true);
    } else {
      sbFetch(SUPABASE.table, { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ name: name, message: message }) })
        .then(() => { done(true); wall.busy = false; return loadWall(); })
        .catch(() => done(false));
    }
  }

  function initWall() {
    const demo = document.getElementById('exWDemo');
    if (demo) demo.hidden = !wall.demo;
    const form = document.getElementById('exWallForm');
    if (form) form.addEventListener('submit', submitWall);
    const msg = document.getElementById('exWMsg');
    if (msg) msg.addEventListener('input', () => { document.getElementById('exWCount').textContent = msg.value.length + ' / ' + SUPABASE.maxMsg; });
    loadWall();
    // segarkan otomatis tiap 30 detik selama tab Expo terbuka
    setInterval(() => {
      const t = document.getElementById('tab-expo');
      if (!wall.demo && t && t.classList.contains('active') && !document.hidden) loadWall();
    }, 30000);
  }

  // ---------- Aksi ----------
  function ask() {
    if (EXPO_CONFIG.askUrl) window.open(EXPO_CONFIG.askUrl, '_blank', 'noopener');
    else say('💬 Kontak panitia segera diumumkan!');
  }
  function share() {
    const favs = getFavs().map(byId).filter(Boolean).map(f => f.name);
    const text = EXPO_CONFIG.shareText + (favs.length ? '\nAku tertarik: ' + favs.join(', ') + '.' : '');
    const url = pageUrl();
    if (navigator.share) {
      navigator.share({ title: EXPO_CONFIG.shareTitle, text: text, url: url }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text + '\n' + url).then(() => say('🔗 Teks & link disalin!'), () => say('Gagal menyalin, salin link dari address bar ya'));
    } else {
      say('Salin link dari address bar ya');
    }
  }
  function scrollToEl(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function bind(r) {
    r.addEventListener('click', function (e) {
      const b = e.target.closest('[data-act]');
      if (!b || !r.contains(b)) return;
      const a = b.dataset.act, id = b.dataset.id;
      if (a === 'fac') selectFac(id, true);
      else if (a === 'fav') toggleFav(id);
      else if (a === 'pick') pick(+b.dataset.i);
      else if (a === 'start') { qz.i = 0; qz.score = {}; renderQuiz(); }
      else if (a === 'retry') { qz.i = 0; qz.score = {}; renderQuiz(); }
      else if (a === 'jump') { selectFac(id); scrollToEl('exForum'); }
      else if (a === 'goquiz') scrollToEl('exQuizSec');
      else if (a === 'gobooth') { if (id) selectBooth(id); scrollToEl('exBoothSec'); }
      else if (a === 'clearsearch') clearSearch();
      else if (a === 'exitbooth') exitBooth();
      else if (a === 'boothnav') boothNav(+b.dataset.d);
      else if (a === 'cmfilter') cmFilter(+b.dataset.i, b);
      else if (a === 'cmphoto') cmPhoto(b.dataset.src, b.dataset.cap);
      else if (a === 'ask') ask();
      else if (a === 'share') share();
      else if (a === 'booth') selectBooth(id);
      else if (a === 'view') { if (b.dataset.v === '3d') show3D(); else show2D(); }
      else if (a === 'wallmore') { wall.limit += SUPABASE.pageSize; loadWall(); }
    });
    r.addEventListener('input', function (e) {
      if (e.target.id === 'exSearch') filterFac(e.target.value);
    });
    r.addEventListener('keydown', function (e) {
      if (e.target.id === 'exSearch' && e.key === 'Enter') { const h = r.querySelector('.ex-fac.hit'); if (h) selectFac(h.dataset.id, true); }
    });
  }

  function openExpo() {
    if (typeof showPage === 'function') showPage('home');
    if (typeof switchTab === 'function') switchTab('expo');
    // Langsung geser ke isi Campus Expo (bukan ke paling atas), supaya link dari bio IG tidak terasa "nyasar".
    const m = document.getElementById('mainContent');
    const bar = document.querySelector('#page-home .tabs');
    if (m && bar) {
      const top = bar.getBoundingClientRect().top - m.getBoundingClientRect().top + m.scrollTop - 76;
      m.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  }

  function setupReveal(root) {
    const els = root.querySelectorAll('.ex-reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { root: document.getElementById('mainContent'), threshold: 0.08 });
    els.forEach(el => io.observe(el));
  }

  // ============================================================
  // 6. INJECT KE HALAMAN
  // ============================================================
  function inject() {
    if (document.getElementById('tab-expo')) return;
    const tabsBar = document.querySelector('.tabs');
    const ref = document.getElementById('tab-members') || document.querySelector('#page-home .tab-content:last-of-type');
    if (!tabsBar || !ref) return false;

    // tombol tab
    const btn = document.createElement('button');
    btn.className = 'tab';
    btn.id = 'tabBtn-expo';
    btn.textContent = '🎓 Campus Expo';
    btn.onclick = () => switchTab('expo');
    tabsBar.appendChild(btn);

    // banner di atas tab (biar pengunjung langsung lihat)
    const banner = document.createElement('button');
    banner.className = 'ex-banner';
    banner.id = 'exBanner';
    banner.innerHTML = `<span class="ex-banner-ic">🎓</span>
      <span class="ex-banner-t"><b>${esc(EXPO_CONFIG.badge)}</b><span id="exBannerTxt">Segera hadir</span></span>
      <span class="ex-banner-go">Lihat →</span>`;
    banner.onclick = openExpo;
    tabsBar.parentNode.insertBefore(banner, tabsBar);

    // isi tab
    const content = document.createElement('div');
    content.className = 'tab-content content-sec';
    content.id = 'tab-expo';
    content.innerHTML = buildHTML();
    ref.parentNode.insertBefore(content, ref.nextSibling);

    // tombol sidebar
    const nav = document.querySelectorAll('.sidebar nav')[1];
    if (nav && !document.getElementById('nav-expo')) {
      const n = document.createElement('button');
      n.className = 'nav-item';
      n.id = 'nav-expo';
      n.innerHTML = '<span class="nav-icon">🎓</span><span>Campus Expo</span>';
      n.onclick = openExpo;
      nav.appendChild(n);
    }

    bind(content);
    state.sel = FACULTIES[0].id;
    qz.i = -1;
    renderQuiz();
    selectFac(state.sel);
    renderPlaylist();
    selectBooth(BOOTHS[0].id);
    setupBooth3D();
    initWall();
    setupReveal(content);
    tick();
    setInterval(tick, 1000);

    // link langsung: webkalian/#expo
    if (location.hash === '#expo') openExpo();
    window.addEventListener('hashchange', function () { if (location.hash === '#expo') openExpo(); });
    return true;
  }

  function start() {
    let tries = 0;
    const t = setInterval(() => {
      if (inject() !== false || ++tries > 30) clearInterval(t);
    }, 200);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  console.log('[Campus Expo v2] Loaded ✓');
})();
