
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
    window.location.href = "admin.html";
  } else {
    alert("Admin Key salah.");
  }
}

// Fungsi vote
async function vote(kandidat) {
  const nim = localStorage.getItem("nimSementara");
  if (!nim) {
    alert("NIM tidak ditemukan.");
    return;
  }

  try {
    // cek NIM sudah vote belum
    const { data: existing, error: selError } = await supabase
      .from("votes")
      .select("*")
      .eq("nim", nim);

    if (selError) throw selError;

    if (existing.length > 0) {
      alert("NIM ini sudah digunakan.");
      return;
    }

    // insert vote
    const { error: insertError } = await supabase
      .from("votes")
      .insert([{ nim: nim, kandidat: kandidat }]);

    if (insertError) throw insertError;

    localStorage.removeItem("nimSementara");
    alert("Terima kasih telah memilih.");
    window.location.href = "index.html";

  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan, coba lagi.");
  }
}

// Fungsi tampilkan hasil admin
async function tampilkanHasil() {
  try {
    const { data: votes, error } = await supabase.from("votes").select("*");
    if (error) throw error;

    const suara1 = votes.filter(v => v.kandidat === 1).length;
    const suara2 = votes.filter(v => v.kandidat === 2).length;

    const el1 = document.getElementById("suara1");
    const el2 = document.getElementById("suara2");

    if (el1) el1.textContent = suara1;
    if (el2) el2.textContent = suara2;

  } catch (err) {
    console.error(err);
  }
}

// Reset semua data voting (admin only)
async function reset() {
  if (!confirm("Yakin ingin mereset semua data?")) return;

  try {
    const { error } = await supabase.from("votes").delete().neq("id", 0);
    if (error) throw error;

    alert("Data berhasil direset.");
    tampilkanHasil();
  } catch (err) {
    console.error(err);
    alert("Gagal mereset data.");
  }
}

// --- LIVE UPDATE untuk admin ---
if (window.location.href.includes("admin.html")) {
  tampilkanHasil();          // tampilkan awal
  setInterval(tampilkanHasil, 3000); // update tiap 3 detik
}

// --- Tambahkan listener tombol voting di voting.html ---
window.addEventListener("DOMContentLoaded", () => {
  const btn1 = document.getElementById("vote1");
  const btn2 = document.getElementById("vote2");

  if (btn1) btn1.addEventListener("click", () => vote(1));
  if (btn2) btn2.addEventListener("click", () => vote(2));
});
