console.log(window.AndroidControl)
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

// 2. Ambil data real-time dari Firebase
// Menggunakan referensi 'config' sesuai database Bapak
database.ref('config').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        configUjian = data;
        localStorage.setItem('cbt_sman23_final', JSON.stringify(data));
        console.log("Konfigurasi ujian diperbarui dari server.");
    } else {
        console.error("Gagal mengambil data: Path 'config' kosong di Firebase.");
    }
}, (error) => {
    console.error("Firebase Error: ", error);
});

// 3. FUNGSI MASUK UJIAN (Login)
function verifikasiMasuk() {
    const pinInput = document.getElementById('input-pin').value;
    
    // Pastikan data config sudah terambil dari Firebase
    if (!configUjian) {
        alert("Menghubungkan ke server... Pastikan internet aktif.");
        return;
    }

    // Validasi PIN Masuk
    if (pinInput === configUjian.pin) {
        document.getElementById('login-area').style.display = 'none';
        document.getElementById('exam-container').style.display = 'block';
        
        // Memasukkan URL soal ke dalam Iframe
        const examFrame = document.getElementById('exam-frame');
        if (examFrame) {
            examFrame.src = configUjian.url;
        }
        
        console.log("Akses diberikan. Selamat mengerjakan.");
    } else {
        alert("Password Masuk Salah!");
    }
}

// 4. FUNGSI KELUAR APLIKASI (Keluar dari Mode Kunci Android)
function verifikasiKeluar() {
    // Validasi data config
    if (!configUjian) {
        alert("Data konfigurasi tidak ditemukan. Cek koneksi.");
        return;
    }

    const passKeluar = prompt("Masukkan Password Keluar:");
    
    // Jika user menekan 'Batal' atau mengosongkan input
    if (passKeluar === null || passKeluar === "") return;

    // Cek kecocokan password keluar (pout)
    if (passKeluar === configUjian.pout) {
        
        // CEK: Apakah terdeteksi jembatan ke Android Java?
        if (typeof window.AndroidControl !== 'undefined' && window.AndroidControl.keluarAplikasi) {
            console.log("Mengirim perintah keluar ke Android...");
            window.AndroidControl.keluarAplikasi();
        } else {
            // Jika dibuka lewat browser Chrome/Laptop biasa
            alert("Ujian Selesai. (Mode Browser)");
            location.reload(); 
        }
        
    } else {
        alert("Password Keluar Salah! Hubungi pengawas.");
    }
}

