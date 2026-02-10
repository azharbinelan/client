function startExam() {
    // MENGAMBIL DENGAN KUNCI YANG SAMA: cbt_sman23_final
    const raw = localStorage.getItem('cbt_sman23_final');
    if(!raw) return alert("Error: Data Admin tidak ditemukan di browser ini!");
    
    const config = JSON.parse(raw);
    const inputPass = document.getElementById('user-pin').value;

    if(inputPass === config.pin) {
        document.getElementById('login-zone').style.display = 'none';
        document.getElementById('exam-zone').style.display = 'flex';
        document.getElementById('frame-soal').src = config.url;
        if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
    } else {
        alert("Password Salah! Silakan cek kembali di Menu Admin.");
    }
}

function keluar() {
    const config = JSON.parse(localStorage.getItem('cbt_sman23_final'));
    const p = prompt("Masukkan Password Keluar:");
    if(p === config.pout) {
        if (document.exitFullscreen) document.exitFullscreen();
        location.reload();
    } else if(p !== null) { alert("Password Salah!"); }
}
document.addEventListener('contextmenu', e => e.preventDefault());