// --- Firebase SDK sudah di-include di HTML ---
// Firebase imports via <script> sudah di HTML

// Ambil modul Firestore
const db = firebase.firestore();

// Fungsi untuk login peserta
function masukPeserta() {
  const nim = prompt("Masukkan NIM Anda (10 digit, diawali 22/23/24/25):");
  if (!nim) return;

  if (!/^2[2-5]\d{8}$/.test(nim)) {
    alert("Format NIM salah!");
    return;
  }

  localStorage.setItem("nimSementara", nim);
  window.location.href = "voting.html";
}

// Fungsi login admin
function masukAdmin() {
  const key = prompt("Masukkan Admin Key:");
  if (key === "adminTRE2025") {
    localStorage.setItem("aksesAdmin", "true");
    window.location.href = "admin.html";
  } else {
    alert("Admin Key salah.");
  }
}

// Fungsi vote
async function vote(kandidat) {
  const nim = localStorage.getItem("nimSementara");
  if (!nim) {
    alert("Anda hanya diperkenankan memilih satu kali.");
    return;
  }

  try {
    const existing = await db.collection("votes")
      .where("nim", "==", nim)
      .get();

    if (!existing.empty) {
      alert("NIM ini sudah digunakan.");
      return;
    }

    await db.collection("votes").add({
      nim: nim,
      kandidat: kandidat,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    localStorage.removeItem("nimSementara");
    alert("Terima kasih telah memilih.");
    window.location.href = "index.html";

  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan, coba lagi.");
  }
}

// Fungsi tampilkan jumlah suara (admin)
async function tampilkanHasil() {
  try {
    const snapshot = await db.collection("votes").get();
    const total = snapshot.size;

    const elTotal = document.getElementById("total-suara");
    if (elTotal) elTotal.textContent = total;

  } catch (err) {
    console.error(err);
  }
}

// Fungsi reset voting
async function reset() {
  if (!confirm("Yakin ingin mereset semua data?")) return;

  try {
    const snapshot = await db.collection("votes").get();
    const batch = db.batch();

    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    alert("Data berhasil direset.");
    tampilkanHasil();

  } catch (err) {
    console.error(err);
    alert("Gagal mereset data.");
  }
}

// Fungsi buka halaman hasil akhir
function bukaHasil() {
  localStorage.setItem("aksesAdmin", "true");
  window.location.href = "hasil.html";
}

// Fungsi tampilkan tanggal hari ini
function tampilkanTanggalHariIni() {
  const el = document.getElementById("tanggal-pemilihan");
  if (!el) return;

  const now = new Date();
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const tanggal = now.toLocaleDateString('id-ID', options);

  el.textContent = `Tanggal : ${tanggal}`;
}

// Fungsi tampilkan kandidat terpilih (hasil.html)
async function tampilkanKandidatTerpilih() {
  try {
    const snapshot = await db.collection("votes").get();
    const votes = snapshot.docs.map(doc => doc.data());

    const jumlah1 = votes.filter(v => v.kandidat === 1).length;
    const jumlah2 = votes.filter(v => v.kandidat === 2).length;

    let kandidat;
    if (jumlah1 > jumlah2) kandidat = 1;
    else if (jumlah2 > jumlah1) kandidat = 2;
    else kandidat = null;

    const dataKandidat = {
      1: {
        nama: "Difa Dwinur Pastika",
        foto: "kandidat1.png",
        visi: "Mewujudkan HMPS TRE yang solid, aktif, dan bermanfaat bagi anggota maupun lingkungan sekitar.",
        misi: [
          "Mengkoordinasi semua angkatan terutama 24 dan 25 untuk ikut serta dalam kegiatan HMPS TRE atau Prodi.",
          "Membawa nama baik HMPS TRE agar lebih dikenal aktif dan berdampak positif di dalam maupun di luar kampus.",
          "Mengoptimalkan program kerja agar lebih terarah dan bermanfaat."
        ]
      },
      2: {
        nama: "Purwo Setyawan",
        foto: "kandidat2.png",
        visi: "Mewujudkan HMPS Teknologi Rekayasa Elektromedis yang unggul dan inovatif.",
        misi: [
          <li><strong>Organisasi & Kepemimpinan</strong><br>
          <p>Membentuk budaya organisasi yang solid, profesional, dan berintegritas tinggi.</p>
          </li>
          <li><strong>Inovasi & Kreativitas</strong><br>
          <p>Mengembangkan kegiatan yang mendukung kreativitas mahasiswa dalam menciptakan karya inovatif di bidang elektromedis.</p>
          </li>
          <li><strong>Mengoptimalkan Digitalisasi Organisasi</strong><br>
          <p>Memanfaatkan teknologi digital untuk transparansi, publikasi, serta efisiensi kegiatan HMPS, sehingga lebih modern, efektif, dan dekat dengan mahasiswa.</p>
          </li>
        ]
      }
    };

    if (kandidat === null) {
      document.getElementById("ucapan-selamat").textContent = "Hasil seri. Belum ada pemenang.";
      document.getElementById("kandidat-terpilih").style.display = "none";
      return;
    }

    const terpilih = dataKandidat[kandidat];

    document.getElementById("ucapan-selamat").textContent = `Selamat kepada ${terpilih.nama} sebagai Ketua Terpilih!`;
    document.getElementById("foto-kandidat").src = terpilih.foto;
    document.getElementById("nama-kandidat").textContent = terpilih.nama;
    document.getElementById("visi-kandidat").textContent = terpilih.visi;

    const ul = document.getElementById("misi-kandidat");
    ul.innerHTML = "";
    terpilih.misi.forEach(m => {
      const li = document.createElement("li");
      li.textContent = m;
      ul.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    alert("Gagal menampilkan hasil.");
  }
}

// --- Event listener universal untuk semua halaman ---
window.addEventListener("DOMContentLoaded", () => {
  tampilkanTanggalHariIni();

  const btn1 = document.getElementById("vote1");
  const btn2 = document.getElementById("vote2");

  if (btn1) btn1.addEventListener("click", () => vote(1));
  if (btn2) btn2.addEventListener("click", () => vote(2));

  if (window.location.href.includes("admin.html")) {
    tampilkanHasil();
    setInterval(tampilkanHasil, 3000);
  }

  if (window.location.href.includes("hasil.html")) {
    tampilkanKandidatTerpilih();
  }
});
