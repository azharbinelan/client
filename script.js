// 1. Konfigurasi Firebase
const firebaseConfig = {
    databaseURL: "https://belajar-cbt-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();
let configUjian = null;

// 2. Ambil Data dari Firebase
database.ref('config').on('value', (snapshot) => {
    configUjian = snapshot.val();
    console.log("Data Firebase Terkoneksi");
});

// 3. Fungsi Login
function verifikasiMasuk() {
    const pinInput = document.getElementById('input-pin').value;
    
    if (!configUjian) {
        alert("Aplikasi sedang mengambil data... Tunggu 2 detik dan coba lagi.");
        return;
    }

    if (pinInput === configUjian.pin) {
        document.getElementById('login-area').style.display = 'none';
        document.getElementById('exam-container').style.display = 'flex';
        document.getElementById('exam-frame').src = configUjian.url;
    } else {
        alert("PIN SALAH!");
    }
}

// 4. Fungsi Refresh
function refreshSoal() {
    const frame = document.getElementById('exam-frame');
    if (frame.src) {
        const currentSrc = frame.src;
        frame.src = ""; 
        setTimeout(() => { frame.src = currentSrc; }, 100);
    }
}

// 5. Fungsi Keluar
function verifikasiKeluar() {
    const passKeluar = document.getElementById('input-pass-keluar').value;

    if (passKeluar === configUjian.pout) {
        if (typeof window.AndroidControl !== 'undefined' && window.AndroidControl.keluarAplikasi) {
            window.AndroidControl.keluarAplikasi();
        } else {
            location.reload(); 
        }
    } else {
        alert("Password Keluar Salah!");
    }
}

// Modal Control
function bukaModalKeluar() { document.getElementById('modal-exit').style.display = 'flex'; document.getElementById('input-pass-keluar').focus(); }
function tutupModalKeluar() { document.getElementById('modal-exit').style.display = 'none'; document.getElementById('input-pass-keluar').value = ''; }
