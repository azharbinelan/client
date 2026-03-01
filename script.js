/**
 * SMAN 23 BATAM - EXAMBRO 
 * JavaScript Logic for Firebase & Web Control
 */

// 1. KONFIGURASI FIREBASE
const firebaseConfig = {
    databaseURL: "https://belajar-cbt-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Inisialisasi Firebase jika belum ada
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();
let configUjian = null;

// 2. AMBIL DATA DARI FIREBASE (Realtime Sync)
// Mengambil data dari node 'config' di Realtime Database
database.ref('config').on('value', (snapshot) => {
    configUjian = snapshot.val();
    console.log("Firebase Data Loaded:", configUjian);
}, (error) => {
    console.error("Firebase Error:", error);
});

// 3. FUNGSI MASUK (LOGIN)
function verifikasiMasuk() {
    const pinInput = document.getElementById('input-pin').value;
    
    // Validasi apakah data sudah ditarik dari Firebase
    if (!configUjian) {
        alert("Sedang menghubungkan ke server... Pastikan internet Anda aktif.");
        return;
    }

    // Cek PIN (mengambil field 'pin' dari Firebase)
    if (pinInput === configUjian.pin) {
        // Efek transisi tampilan
        document.getElementById('login-area').style.display = 'none';
        document.getElementById('bubble-container').style.display = 'none';
        
        // Munculkan Frame Ujian
        const examCont = document.getElementById('exam-container');
        examCont.style.display = 'flex'; 
        
        // Load URL Ujian (mengambil field 'url' dari Firebase)
        const examFrame = document.getElementById('exam-frame');
        if (examFrame) {
            examFrame.src = configUjian.url;
        }
    } else {
        alert("PIN MASUK SALAH!");
        document.getElementById('input-pin').value = '';
    }
}

// 4. FUNGSI KELUAR (EXIT)
function verifikasiKeluar() {
    const passKeluar = document.getElementById('input-pass-keluar').value;

    if (!configUjian) return;

    // Cek PIN Keluar (mengambil field 'pout' dari Firebase)
    if (passKeluar === configUjian.pout) {
        // Sinkronisasi dengan Java (Interface AndroidControl)
        if (typeof window.AndroidControl !== 'undefined' && window.AndroidControl.keluarAplikasi) {
            window.AndroidControl.keluarAplikasi(); 
        } else {
            // Jika dijalankan di browser biasa (Laptop/PC)
            alert("Sesi Ujian Berakhir.");
            location.reload(); 
        }
    } else {
        alert("PIN KELUAR SALAH!");
        document.getElementById('input-pass-keluar').value = '';
    }
}

// 5. FUNGSI NAVIGASI & MODAL
function refreshSoal() {
    const frame = document.getElementById('exam-frame');
    if (frame && frame.src !== "" && frame.src !== "about:blank") {
        const currentSrc = frame.src;
        frame.src = "about:blank"; // Reset sementara untuk force refresh
        setTimeout(() => { 
            frame.src = currentSrc; 
        }, 150);
    }
}

function bukaModalKeluar() { 
    const modal = document.getElementById('modal-exit');
    if (modal) {
        modal.style.display = 'flex'; 
        document.getElementById('input-pass-keluar').focus();
    }
}

function tutupModalKeluar() { 
    const modal = document.getElementById('modal-exit');
    if (modal) {
        modal.style.display = 'none'; 
        document.getElementById('input-pass-keluar').value = '';
    }
}

// Tambahan: Tekan Enter untuk Masuk
document.getElementById('input-pin').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        verifikasiMasuk();
    }
});
