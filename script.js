// --- Login index.html ---
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

function masukAdmin() {
  const key = prompt("Masukkan Admin Key:");
  if (key === "adminTRE2025") {
    window.location.href = "admin.html";
  } else {
    alert("Admin Key salah.");
  }
}

// --- Voting ---
async function vote(kandidat) {
  const nim = localStorage.getItem("nimSementara");
  if (!nim) {
    alert("NIM tidak ditemukan.");
    return;
  }

  try {
    const { data: existing, error: selError } = await supabase
      .from("votes")
      .select("*")
      .eq("nim", nim);

    if (selError) throw selError;

    if (existing.length > 0) {
      alert("NIM ini sudah digunakan.");
      return;
    }

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

// --- Tampilkan hasil admin ---
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

// --- Reset data admin ---
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

// --- Setup listeners setelah DOM siap ---
window.addEventListener("DOMContentLoaded", () => {
  // Index.html
  const btnPeserta = document.getElementById("btnPeserta");
  const btnAdmin = document.getElementById("btnAdmin");
  if (btnPeserta) btnPeserta.addEventListener("click", masukPeserta);
  if (btnAdmin) btnAdmin.addEventListener("click", masukAdmin);

  // Voting.html
  const vote1 = document.getElementById("vote1");
  const vote2 = document.getElementById("vote2");
  if (vote1) vote1.addEventListener("click", () => vote(1));
  if (vote2) vote2.addEventListener("click", () => vote(2));

  // Admin.html
  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) resetBtn.addEventListener("click", reset);

  // Auto update hasil di admin.html
  if (window.location.href.includes("admin.html")) {
    tampilkanHasil();
    setInterval(tampilkanHasil, 3000);
  }
});
