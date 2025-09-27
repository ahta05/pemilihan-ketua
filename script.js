// Fungsi untuk login sebagai peserta
function masukPeserta() {
  const nim = prompt("Masukkan NIM Anda:");
  if (!nim) return;
  const sudahVote = JSON.parse(localStorage.getItem("nimVoted")) || [];
  if (sudahVote.includes(nim)) {
    alert("NIM ini sudah digunakan untuk voting.");
  } else {
    localStorage.setItem("nimSementara", nim);
    window.location.href = "voting.html";
  }
}

// Fungsi untuk login sebagai admin
function masukAdmin() {
  const key = prompt("Masukkan Admin Key:");
  if (key === "adminTRE2025") {
    window.location.href = "admin.html";
  } else {
    alert("Admin Key salah.");
  }
}

// Fungsi untuk melakukan vote
function vote(kandidat) {
  const nim = localStorage.getItem("nimSementara");
  if (!nim) {
    alert("NIM tidak ditemukan.");
    return;
  }

  const suara1 = parseInt(localStorage.getItem("suara1") || "0");
  const suara2 = parseInt(localStorage.getItem("suara2") || "0");

  if (kandidat === 1) {
    localStorage.setItem("suara1", suara1 + 1);
  } else if (kandidat === 2) {
    localStorage.setItem("suara2", suara2 + 1);
  }

  const voted = JSON.parse(localStorage.getItem("nimVoted")) || [];
  voted.push(nim);
  localStorage.setItem("nimVoted", JSON.stringify(voted));
  localStorage.removeItem("nimSementara");

  alert("Terima kasih telah melakukan voting.");
  window.location.href = "index.html";
}

// Fungsi untuk menampilkan hasil voting di admin.html
function tampilkanHasil() {
  document.getElementById("suara1").textContent = localStorage.getItem("suara1") || "0";
  document.getElementById("suara2").textContent = localStorage.getItem("suara2") || "0";
}

// Fungsi untuk mereset semua data voting
function reset() {
  if (confirm("Yakin ingin mereset semua data?")) {
    localStorage.removeItem("suara1");
    localStorage.removeItem("suara2");
    localStorage.removeItem("nimVoted");
    alert("Data berhasil direset.");
    tampilkanHasil();
  }
}
