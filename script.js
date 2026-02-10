const API_URL = "https://script.google.com/macros/s/AKfycbwRFbWalfPUExSBzyI_aXNGcBOkD6S-i7UYWtQ2-nLYPDHhJcNLpkcDCrp76tEEOuqAkA/exec"; // Harus sama dengan link di Admin

window.onload = async function() {
    const statusBox = document.createElement('div');
    statusBox.innerText = "Menghubungkan ke server...";
    document.body.appendChild(statusBox);

    try {
        const response = await fetch(API_URL);
        const config = await response.json();
        
        if (config.url) {
            // Simpan ke local sebagai cadangan offline
            localStorage.setItem('cbt_sman23_final', JSON.stringify(config));
            statusBox.remove();
            mulaiUjian(config);
        } else {
            throw new Error("Data kosong");
        }
    } catch (err) {
        const cached = localStorage.getItem('cbt_sman23_final');
        if (cached) {
            statusBox.remove();
            mulaiUjian(JSON.parse(cached));
        } else {
            statusBox.innerText = "Error: Data Admin tidak ditemukan di Cloud!";
        }
    }
};

function mulaiUjian(config) {
    // Di sini Bapak bisa arahkan ke halaman login ujian atau tampilkan WebView
    console.log("Sistem Siap. URL Ujian: " + config.url);
}
