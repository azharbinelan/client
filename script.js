const firebaseConfig = {
    databaseURL: "https://belajar-cbt-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
let configUjian = null;

// Ambil data real-time dari Firebase
database.ref('config').on('value', (snapshot) => {
    configUjian = snapshot.val();
    if (configUjian) {
        localStorage.setItem('cbt_sman23_final', JSON.stringify(configUjian));
        console.log("Data Client terupdate otomatis.");
    }
});

// FUNGSI MASUK UJIAN
function verifikasiMasuk() {
    const pinInput = document.getElementById('input-pin').value;
    
    if (!configUjian) {
        return alert("Sedang menghubungkan ke server Firebase...");
    }

    if (pinInput === configUjian.pin) {
        document.getElementById('login-area').style.display = 'none';
        document.getElementById('exam-container').style.display = 'block';
        document.getElementById('exam-frame').src = configUjian.url;
        
        // Opsional: Beritahu Android bahwa ujian sudah dimulai
        console.log("Login Berhasil, Memulai Ujian...");
    } else {
        alert("Password Masuk Salah!");
    }
}

// FUNGSI KELUAR APLIKASI (Disesuaikan dengan Android Java)
function verifikasiKeluar() {
    // Memastikan config sudah terload agar pout bisa dibaca
    if (!configUjian) return alert("Gagal memvalidasi. Cek koneksi internet.");

    const passKeluar = prompt("Masukkan Password Keluar:");
    
    if (passKeluar === configUjian.pout) {
        // CEK: Apakah dibuka lewat aplikasi Android (Exambro)
        if (window.AndroidControl) {
            // Memanggil fungsi di Java (MainActivity.java)
            window.AndroidControl.keluarAplikasi();
        } else {
            // Jika dibuka di browser laptop/Chrome biasa
            alert("Ujian Selesai. Kembali ke halaman login.");
            location.reload(); 
        }
    } else if (passKeluar !== null) {
        alert("Password Keluar Salah!");
    }
}
