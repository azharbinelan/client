// 1. Konfigurasi Firebase
const firebaseConfig = {
    databaseURL: "https://belajar-cbt-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Inisialisasi Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();
let configUjian = null;

// Cek status jembatan Android di Konsol (untuk Debugging)
console.log("Status AndroidControl:", window.AndroidControl);

// 2. Ambil data real-time dari Firebase
database.ref('config').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        configUjian = data;
        localStorage.setItem('cbt_sman23_final', JSON.stringify(data));
        console.log("Konfigurasi ujian diperbarui.");
    } else {
        console.error("Path 'config' kosong di Firebase.");
    }
}, (error) => {
    console.error("Firebase Error: ", error);
});

// 3. FUNGSI MASUK UJIAN
function verifikasiMasuk() {
    const pinInput = document.getElementById('input-pin').value;
    
    if (!configUjian) {
        alert("Menghubungkan ke server... Pastikan internet aktif.");
        return;
    }

    if (pinInput === configUjian.pin) {
        document.getElementById('login-area').style.display = 'none';
        document.getElementById('exam-container').style.display = 'block';
        
        const examFrame = document.getElementById('exam-frame');
        if (examFrame) {
            examFrame.src = configUjian.url;
        }
        
        console.log("Login Berhasil.");
    } else {
        alert("Password Masuk Salah!");
    }
}

// 4. FUNGSI KELUAR APLIKASI (Sinkron dengan Modal HTML)
function verifikasiKeluar() {
    // Ambil nilai dari input modal password keluar
    const inputPassElemen = document.getElementById('input-pass-keluar');
    const passKeluar = inputPassElemen.value;

    if (!configUjian) {
        alert("Data konfigurasi tidak ditemukan.");
        return;
    }

    if (passKeluar === "") {
        alert("Masukkan password terlebih dahulu.");
        return;
    }

    // Validasi Password Keluar
    if (passKeluar === configUjian.pout) {
        
        // Panggil Jembatan Android Studio
        if (typeof window.AndroidControl !== 'undefined' && window.AndroidControl.keluarAplikasi) {
            console.log("Perintah keluar dikirim ke Android.");
            window.AndroidControl.keluarAplikasi();
        } else {
            // Mode Browser Biasa
            alert("Ujian Selesai. Aplikasi akan dimuat ulang.");
            location.reload(); 
        }
        
    } else {
        alert("Password Keluar Salah!");
        inputPassElemen.value = ""; // Bersihkan kolom jika salah
    }
}

// Fungsi bantu untuk modal (tambahkan jika belum ada di HTML)
window.bukaModalKeluar = function() {
    document.getElementById('modal-exit').style.display = 'flex';
    document.getElementById('input-pass-keluar').focus();
};

window.tutupModalKeluar = function() {
    document.getElementById('modal-exit').style.display = 'none';
    document.getElementById('input-pass-keluar').value = '';
};
