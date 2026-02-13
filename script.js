/**
 * EXAMBRO SMAN 23 BATAM - Logic Script
 * Developer: Azhar, S.Pd.
 */

// 1. KONFIGURASI FIREBASE
const firebaseConfig = {
    databaseURL: "https://belajar-cbt-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Inisialisasi Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();
let configUjian = null;

// Debugging Jembatan Android
console.log("Status AndroidControl:", typeof window.AndroidControl !== 'undefined' ? "AKTIF" : "TIDAK TERDETEKSI");

// 2. AMBIL DATA REAL-TIME (Firebase Listener)
database.ref('config').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        configUjian = data;
        localStorage.setItem('cbt_sman23_final', JSON.stringify(data));
        console.log("Konfigurasi diperbarui dari Firebase.");

        // FITUR AUTO-UPDATE: Jika sedang ujian dan URL di Firebase berubah, otomatis refresh iframe
        const examFrame = document.getElementById('exam-frame');
        const examContainer = document.getElementById('exam-container');
        
        if (examContainer.style.display === 'flex' && examFrame.src !== data.url) {
            console.log("Mendeteksi perubahan soal, memuat ulang...");
            examFrame.src = data.url;
        }
    } else {
        console.error("Data 'config' tidak ditemukan di database.");
    }
}, (error) => {
    console.error("Firebase Error: ", error);
});

// 3. FUNGSI MASUK UJIAN (Login)
function verifikasiMasuk() {
    const pinInput = document.getElementById('input-pin').value;
    
    if (!configUjian) {
        alert("Gagal terhubung ke server. Periksa koneksi internet.");
        return;
    }

    if (pinInput === configUjian.pin) {
        // Tampilkan Area Ujian
        document.getElementById('login-area').style.display = 'none';
        document.getElementById('exam-container').style.display = 'flex';
        
        // Load URL Soal ke Iframe
        const examFrame = document.getElementById('exam-frame');
        if (examFrame) {
            examFrame.src = configUjian.url;
        }
        
        console.log("Akses diberikan. Selamat mengerjakan.");
    } else {
        alert("PIN Masuk Salah!");
    }
}

// 4. FUNGSI REFRESH SOAL
function refreshSoal() {
    const examFrame = document.getElementById('exam-frame');
    if (examFrame && configUjian) {
        const currentUrl = configUjian.url;
        examFrame.src = ""; // Reset sejenak
        setTimeout(() => {
            examFrame.src = currentUrl;
        }, 100);
        console.log("Iframe direfresh manual.");
    }
}

// 5. FUNGSI KELUAR APLIKASI (Validasi Password Keluar)
function verifikasiKeluar() {
    const inputPassElemen = document.getElementById('input-pass-keluar');
    const passKeluar = inputPassElemen.value;

    if (!configUjian) {
        alert("Data konfigurasi hilang. Muat ulang aplikasi.");
        return;
    }

    if (passKeluar === "") {
        alert("Masukkan password pengawas!");
        return;
    }

    // Cek kecocokan password keluar (pout)
    if (passKeluar === configUjian.pout) {
        console.log("Password benar. Menutup aplikasi...");
        
        // Kirim perintah ke Java (Android Studio)
        if (typeof window.AndroidControl !== 'undefined' && window.AndroidControl.keluarAplikasi) {
            window.AndroidControl.keluarAplikasi();
        } else {
            // Jika dibuka di Chrome biasa
            alert("Aplikasi ditutup (Mode Browser).");
            location.reload();
        }
    } else {
        alert("Password Keluar Salah! Hubungi pengawas.");
        inputPassElemen.value = "";
    }
}

// 6. FUNGSI MODAL PENGONTROL
window.bukaModalKeluar = function() {
    document.getElementById('modal-exit').style.display = 'flex';
    document.getElementById('input-pass-keluar').focus();
};

window.tutupModalKeluar = function() {
    document.getElementById('modal-exit').style.display = 'none';
    document.getElementById('input-pass-keluar').value = '';
};
