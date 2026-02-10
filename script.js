const API_URL = "https://script.google.com/macros/s/AKfycbwRFbWalfPUExSBzyI_aXNGcBOkD6S-i7UYWtQ2-nLYPDHhJcNLpkcDCrp76tEEOuqAkA/exec"; 
let configUjian = null;

// 1. Ambil data dari Cloud saat halaman dibuka
window.onload = async function() {
    try {
        const response = await fetch(API_URL);
        configUjian = await response.json();
        if (configUjian) {
            localStorage.setItem('cbt_sman23_final', JSON.stringify(configUjian));
            console.log("Data Ujian Tersinkronisasi.");
        }
    } catch (err) {
        // Jika offline, pakai data terakhir
        const cached = localStorage.getItem('cbt_sman23_final');
        if (cached) configUjian = JSON.parse(cached);
    }
};

// 2. Fungsi Verifikasi Password Masuk
function verifikasiMasuk() {
    const pinInput = document.getElementById('input-pin').value;

    if (!configUjian) {
        alert("Data ujian belum dimuat. Periksa internet Anda!");
        return;
    }

    if (pinInput === configUjian.pin) {
        document.getElementById('login-area').style.display = 'none';
        document.getElementById('exam-container').style.display = 'block';
        document.getElementById('exam-frame').src = configUjian.url;
    } else {
        alert("Password Masuk Salah!");
    }
}

// 3. Fungsi Verifikasi Password Keluar
function verifikasiKeluar() {
    const passKeluar = prompt("Masukkan Password Keluar:");
    
    if (passKeluar === configUjian.pout) {
        location.reload(); // Reset halaman
    } else if (passKeluar !== null) {
        alert("Password Keluar Salah!");
    }
}
