// 1. KONFIGURASI FIREBASE
const firebaseConfig = {
    databaseURL: "https://belajar-cbt-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();
let configUjian = null;

// 2. AMBIL DATA DARI FIREBASE
database.ref('config').on('value', (snapshot) => {
    configUjian = snapshot.val();
    console.log("Data Firebase Terhubung.");
});

// 3. FUNGSI MASUK (LOGIN)
function verifikasiMasuk() {
    const pinInput = document.getElementById('input-pin').value;
    
    if (!configUjian) {
        alert("Menghubungkan ke server... Pastikan internet aktif.");
        return;
    }

    if (pinInput === configUjian.pin) {
        // Sembunyikan Login & Gelembung
        document.getElementById('login-area').style.display = 'none';
        document.getElementById('bubble-container').style.display = 'none';
        
        // Munculkan Area Ujian
        const examCont = document.getElementById('exam-container');
        examCont.style.display = 'flex'; 
        
        const examFrame = document.getElementById('exam-frame');
        if (examFrame) {
            examFrame.src = configUjian.url;
        }
    } else {
        alert("PIN MASUK SALAH!");
    }
}

// 4. FUNGSI KELUAR (CLOSE APP)
function verifikasiKeluar() {
    const passKeluar = document.getElementById('input-pass-keluar').value;

    if (passKeluar === configUjian.pout) {
        // CEK APAKAH BERJALAN DI ANDROID (SMAN 23 EXAMBRO)
        if (typeof window.AndroidControl !== 'undefined' && window.AndroidControl.keluarAplikasi) {
            window.AndroidControl.keluarAplikasi(); // Perintah tutup aplikasi ke Java
        } else {
            // Jika dibuka di browser laptop biasa
            alert("Berhasil Keluar.");
            location.reload(); 
        }
    } else {
        alert("PIN KELUAR SALAH!");
        document.getElementById('input-pass-keluar').value = '';
    }
}

// FUNGSI NAVIGASI & MODAL
function refreshSoal() {
    const frame = document.getElementById('exam-frame');
    if (frame.src) {
        const currentSrc = frame.src;
        frame.src = ""; 
        setTimeout(() => { frame.src = currentSrc; }, 100);
    }
}

function bukaModalKeluar() { 
    document.getElementById('modal-exit').style.display = 'flex'; 
    document.getElementById('input-pass-keluar').focus(); 
}

function tutupModalKeluar() { 
    document.getElementById('modal-exit').style.display = 'none'; 
    document.getElementById('input-pass-keluar').value = ''; 
}
