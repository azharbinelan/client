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
  
  function verifikasiMasuk() {
      const pinInput = document.getElementById('input-pin').value;
      if (!configUjian) return alert("Menghubungkan ke server...");
  
      if (pinInput === configUjian.pin) {
          document.getElementById('login-area').style.display = 'none';
          document.getElementById('exam-container').style.display = 'block';
          document.getElementById('exam-frame').src = configUjian.url;
      } else {
          alert("Password Masuk Salah!");
      }
  }

function verifikasiKeluar() {
    const passKeluar = prompt("Masukkan Password Keluar:");
    
    // Cek apakah password yang diinput sesuai dengan configUjian.pout
    if (passKeluar === configUjian.pout) {
        
        // CEK: Apakah sedang dibuka lewat aplikasi Android Exambro?
        if (window.AndroidControl) {
            // Memanggil fungsi di Java Android untuk lepas kunci dan tutup
            window.AndroidControl.keluarAplikasi();
        } else {
            // Jika dibuka di browser laptop/Chrome biasa
            alert("Ujian Selesai. Anda akan diarahkan ke halaman awal.");
            window.location.href = "/"; // Atau ganti ke halaman lain
        }
        
    } else if (passKeluar !== null) {
        // Jika password salah dan bukan menekan tombol 'Cancel'
        alert("Password Keluar Salah! Silakan hubungi pengawas.");
    }
}
