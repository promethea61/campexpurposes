// ============================================================
// KOPITAISAN CAMPUS EXPO — DATA
// Cukup edit file ini untuk mengubah isi website.
// (Bentuknya sama persis dengan data di campus_expo.js lama kamu.)
// ============================================================
window.EXPO = (function () {
 
  // ---------- 1. Info acara ----------
  var CONFIG = {
    badge: 'Kopitaisan Campus Expo',
    titleTop: 'Meet the',
    titleMid: 'people',
    titleBottom: 'behind it.',
    desc: 'Ngobrol langsung sama kakak alumni yang sudah kuliah. Tanya apa aja soal jurusan, kampus, dan kehidupan perkuliahan. Tidak perlu daftar, langsung datang aja.',
 
    // Tanggal & jam acara untuk hitung mundur. Format: 'TAHUN-BULAN-TANGGALTJAM:MENIT:DETIK+07:00'
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
 
    askUrl: '',   // link WhatsApp/DM untuk tanya panitia, contoh: 'https://wa.me/62812xxxx'. Kosong = muncul pemberitahuan.
    shareTitle: 'Kopitaisan Campus Expo',
    shareText: 'Yuk ikut Kopitaisan Campus Expo, ngobrol langsung sama kakak alumni soal jurusan & kuliah!',
 
    // Link media sosial di bagian bawah (kosongkan url untuk menyembunyikan)
    socials: [
      { label: 'Instagram', handle: '@promethea61', url: 'https://www.instagram.com/promethea61/' },
      { label: 'TikTok', handle: '@promethea.61', url: 'https://www.tiktok.com/@promethea.61' }
    ]
  };
 
  // ---------- 2. Susunan acara. t = jam ('08.00') atau 'TBA' ----------
  var RUNDOWN = [
    { t: 'TBA', title: 'Opening', d: 'Pembukaan dan pengenalan acara.' },
    { t: 'TBA', title: 'Ngobrol per Bidang', d: 'Pilih bidang yang kamu minati, tanya langsung ke kakaknya.' },
    { t: 'TBA', title: 'Sharing Session', d: 'Cerita seru dan tips masuk kuliah dari kakak alumni.' },
    { t: 'TBA', title: 'Tanya Jawab Bebas', d: 'Tanya apa pun soal jurusan, kampus, dan kehidupan kuliah.' },
    { t: 'TBA', title: 'Closing & Foto Bareng', d: 'Penutupan dan dokumentasi bersama.' }
  ];
 
  // ---------- 3. Bidang / rumpun ilmu ----------
  var FACULTIES = [
    { id: '01', name: 'Kedokteran & Kesehatan', en: 'Health Sciences', icon: '✳', color: '#1DB954',
      desc: 'Menekuni dunia kesehatan, pelayanan medis, serta berbagai jenjang yang membantu meningkatkan kualitas hidup manusia.',
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
 
  // ---------- 4. Kuis "Temukan Jurusanmu" (s = id bidang yang dapat +1 poin) ----------
  var QUIZ = [
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
 
  // ---------- 5. Confession Wall (Supabase) ----------
  // Isi 2 nilai ini dari Supabase: Project Settings > API. Pakai "anon public" key (BUKAN service_role!).
  // Kalau masih kosong, wall jalan dalam MODE DEMO (pesan hanya tersimpan di browser sendiri).
  var SUPABASE = {
    url: '',   // contoh: 'https://xxxx.supabase.co'  (boleh berakhiran /rest/v1/, nanti dirapikan otomatis)
    key: '',   // contoh: 'sb_publishable_xxxxx'
    table: 'confessions',
    pageSize: 12,
    cooldownSec: 30,
    maxName: 30,
    maxMsg: 280
  };
 
  // ---------- 6. Kepanitiaan ----------
  // Tiap orang boleh teks ('Nama') ATAU objek { name, photo, role }. Foto: 'panitia/rani.jpg' (rasio 4:5).
  var COMMITTEE = {
    po: { name: '', role: 'Project Officer', photo: '', quote: '' },
    core: [],   // opsional, mis. [{ name: 'Sari', role: 'Sekretaris', photo: '' }]
    divisions: [
      { name: 'Acara', icon: '🎤', color: '#1DB954', desc: 'Menyusun rundown dan memastikan acara berjalan mulus dari opening sampai closing.', head: '', members: [] },
      { name: 'Humas & Sponsor', icon: '🤝', color: '#3B82F6', desc: 'Menghubungi pembicara, kampus, dan pihak yang mendukung acara.', head: '', members: [] },
      { name: 'Publikasi & Dokumentasi', icon: '📸', color: '#EC4899', desc: 'Poster, konten media sosial, serta foto dan video acara.', head: '', members: [] },
      { name: 'Perlengkapan & Dekorasi', icon: '🛠️', color: '#F97316', desc: 'Menata booth, panggung, dan semua kebutuhan perlengkapan.', head: '', members: [] },
      { name: 'Konsumsi', icon: '☕', color: '#EAB308', desc: 'Menyiapkan makanan dan minuman untuk panitia, kakak, dan peserta.', head: '', members: [] },
      { name: 'Keamanan & Kesehatan', icon: '🛡️', color: '#14B8A6', desc: 'Menjaga ketertiban, alur pengunjung, dan kenyamanan semua orang.', head: '', members: [] }
    ]
  };
 
  // ---------- 7. Booth (15 tenda berbentuk U) ----------
  // Urutan: B1–B5 lengan kiri (jauh → dekat), B6–B10 baris bawah (kiri → kanan), B11–B15 lengan kanan (dekat → jauh).
  // faculties = id bidang dari FACULTIES, atau kosong untuk booth umum (isi note + topics + color).
  // people: [{ name:'Rani', photo:'kakak/rani.jpg', major:'Informatika', campus:'ITS' }, 'Budi']
  var ASK_DEFAULT = ['Mata kuliah yang dipelajari', 'Prospek kerja', 'Biaya & kehidupan kuliah', 'Tips masuk jurusan', 'Suka duka kuliah'];
  var BOOTHS = [
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
    { id: 'B15', name: 'Booth Foto Bareng', faculties: [], color: '#7C6CF0', note: 'Spot foto dan dokumentasi bersama kakak alumni.', topics: ['Foto bareng', 'Spot foto', 'Dokumentasi'], people: [] }
  ];
 
  return { CONFIG: CONFIG, RUNDOWN: RUNDOWN, FACULTIES: FACULTIES, QUIZ: QUIZ, SUPABASE: SUPABASE, COMMITTEE: COMMITTEE, ASK_DEFAULT: ASK_DEFAULT, BOOTHS: BOOTHS };
})();
 