// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  writeBatch
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA0H-gl3PIQ8J0kU1o_XUrXz-QKanSYX-w",
  authDomain: "evoting-hmpstre.firebaseapp.com",
  projectId: "evoting-hmpstre",
  storageBucket: "evoting-hmpstre.appspot.com",
  messagingSenderId: "448620443069",
  appId: "1:448620443069:web:0a364096ac7f6a2de4ced4",
  measurementId: "G-3PPK662F6X"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Validasi NIM: harus 10 digit dan diawali 22–25
function validasiNIM(nim) {
  return /^(22|23|24|25)\d{8}$/.test(nim);
}

// Fungsi login sebagai peserta
window.masukPeserta = async function () {
  const nim = prompt("Masukkan NIM Anda:");
  if (!nim || !validasiNIM(nim)) {
    alert("NIM tidak valid.");
    return;
  }

  const nimRef = doc(db, "votes", nim);
  const docSnap = await getDoc(nimRef);
  if (docSnap.exists()) {
    alert("NIM ini sudah digunakan untuk voting.");
  } else {
    localStorage.setItem("nimSementara", nim);
    window.location.href = "voting.html";
  }
};

// Fungsi login sebagai admin
window.masukAdmin = function () {
  const key = prompt("Masukkan Admin Key:");
  if (key === "adminTRE2025") {
    window.location.href = "admin.html";
  } else {
    alert("Admin Key salah.");
  }
};

// Fungsi vote
window.vote = async function (kandidat) {
  const nim = localStorage.getItem("nimSementara");
  if (!nim) {
    alert("NIM tidak ditemukan.");
    return;
  }

  const nimRef = doc(db, "votes", nim);
  const docSnap = await getDoc(nimRef);
  if (docSnap.exists()) {
    alert("NIM sudah digunakan.");
    return;
  }

  await setDoc(nimRef, { kandidat });
  localStorage.removeItem("nimSementara");
  alert("Terima kasih telah melakukan voting.");
  window.location.href = "index.html";
};

// Fungsi tampilkan hasil di admin.html
window.tampilkanHasil = async function () {
  const snapshot = await getDocs(collection(db, "votes"));
  let suara1 = 0, suara2 = 0;

  snapshot.forEach(doc => {
    const { kandidat } = doc.data();
    if (kandidat === 1) suara1++;
    if (kandidat === 2) suara2++;
  });

  document.getElementById("suara1").textContent = suara1;
  document.getElementById("suara2").textContent = suara2;
};

// Fungsi reset semua data voting
window.reset = async function () {
  if (!confirm("Yakin ingin mereset semua data?")) return;

  const snapshot = await getDocs(collection(db, "votes"));
  const batch = writeBatch(db);

  snapshot.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  alert("Data berhasil direset.");
  window.tampilkanHasil();
};
