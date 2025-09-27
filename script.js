// Cek autentikasi NIM
let currentNIM = localStorage.getItem("currentNIM");
if (!currentNIM) {
  alert("Silakan login dengan NIM terlebih dahulu!");
  window.location.href = "auth.html";
}

// Fungsi vote
function vote(candidate) {
  let votedNIMs = JSON.parse(localStorage.getItem('votedNIMs')) || [];

  if (votedNIMs.includes(currentNIM)) {
    alert("Anda sudah memilih, tidak bisa memilih lagi!");
    return;
  }

  // Ambil data hasil voting
  let results = JSON.parse(localStorage.getItem("results")) || { calon1:0, calon2:0 };
  results[candidate]++;
  localStorage.setItem("results", JSON.stringify(results));

  // Tandai NIM sudah vote
  votedNIMs.push(currentNIM);
  localStorage.setItem('votedNIMs', JSON.stringify(votedNIMs));

  alert("Terima kasih, suara anda sudah direkam!");

  // Disable semua tombol
  document.querySelectorAll(".vote-button").forEach(btn => btn.disabled = true);
}
