// Simpan hasil voting di localStorage (sementara, ga pake database dulu)
let hasVoted = localStorage.getItem("hasVoted") || false;

function vote(candidate) {
  if (hasVoted) {
    alert("Kamu sudah memilih, tidak bisa memilih lagi!");
    return;
  }

  // Ambil data hasil voting
  let results = JSON.parse(localStorage.getItem("results")) || {
    calon1: 0,
    calon2: 0
  };

  // Tambah suara
  results[candidate]++;
  
  // Simpan kembali ke localStorage
  localStorage.setItem("results", JSON.stringify(results));
  localStorage.setItem("hasVoted", true);

  alert("Terima kasih, suara kamu sudah direkam!");
  showResults();
}

function showResults() {
  let results = JSON.parse(localStorage.getItem("results")) || {
    calon1: 0,
    calon2: 0
  };

  document.getElementById("results").innerHTML = `
    <h2>Hasil Sementara:</h2>
    <p>Calon 1: ${results.calon1} suara</p>
    <p>Calon 2: ${results.calon2} suara</p>
  `;
}

// Tampilkan hasil pas pertama kali halaman dibuka
showResults();
