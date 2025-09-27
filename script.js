// Supabase sudah di-include di HTML sebelumnya
// const supabase = supabase.createClient(...);

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

  const { data: existing, error } = await supabase
    .from("votes")
    .select("*")
    .eq("nim", nim);

  if (error) {
    console.error(error);
    alert("Terjadi kesalahan, coba lagi.");
    return;
  }

  if (existing.length > 0) {
    alert("NIM ini sudah digunakan untuk voting.");
    return;
  }

  const { error: insertError } = await supabase
    .from("votes")
    .insert([{ nim: nim, kandidat: kandidat }]);

  if (insertError) {
    console.error(insertError);
    alert("Terjadi kesalahan saat submit vote.");
    return;
  }

  localStorage.removeItem("nimSementara");
  alert("Terima kasih telah melakukan voting.");
  window.location.href = "index.html";
}

// Fungsi tampilkan hasil admin
async function tampilkanHasil() {
  const { data: votes, error } = await supabase.from("votes").select("*");
  if (error) {
    console.error(error);
    return;
  }

  const suara1 = votes.filter(v => v.kandidat === 1).length;
  const suara2 = votes.filter(v => v.kandidat === 2).length;

  document.getElementById("suara1").textContent = suara1;
  document.getElementById("suara2").textContent = suara2;
}

// Reset semua data voting (admin only)
async function reset() {
  if (confirm("Yakin ingin mereset semua data?")) {
    const { error } = await supabase.from("votes").delete().neq("id", 0);
    if (error) {
      console.error(error);
      alert("Gagal mereset data.");
      return;
    }
    alert("Data berhasil direset.");
    tampilkanHasil();
  }
}

// --- LIVE UPDATE untuk admin ---
if (window.location.href.includes("admin.html")) {
  // Update tiap 3 detik
  setInterval(tampilkanHasil, 3000);
}
