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
    
    if (passKeluar === configUjian.pout) {
        // Cek apakah sedang dibuka di aplikasi Android (Exambro)
        if (window.AndroidControl) {
            // Memerintahkan Android untuk lepas kunci dan tutup aplikasi
            window.AndroidControl.keluarAplikasi();
        } else {
            // Jika dibuka di browser laptop/HP biasa, cukup refresh atau pindah halaman
            alert("Ujian Selesai");
            location.reload();
        }
    } else if (passKeluar !== null) {
        alert("Password Keluar Salah!");
    }
}
