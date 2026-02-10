const API_URL = "https://script.google.com/macros/s/AKfycbwRFbWalfPUExSBzyI_aXNGcBOkD6S-i7UYWtQ2-nLYPDHhJcNLpkcDCrp76tEEOuqAkA/exec"; // Samakan dengan link di Admin

window.onload = async function() {
    try {
        // Ambil data terbaru dari Cloud
        const response = await fetch(API_URL);
        const config = await response.json();
        
        if (config.url) {
            localStorage.setItem('cbt_sman23_final', JSON.stringify(config));
            console.log("Data Cloud sinkron.");
            tampilkanCBT(config);
        }
    } catch (err) {
        // Jika internet gangguan, gunakan data terakhir yang tersimpan
        const cached = localStorage.getItem('cbt_sman23_final');
        if (cached) {
            tampilkanCBT(JSON.parse(cached));
        } else {
            alert("Error: Data Admin tidak ditemukan di browser ini!");
        }
    }
};

function tampilkanCBT(config) {
    // Logika untuk menampilkan WebView atau link ujian Bapak
    console.log("Membuka Ujian: " + config.url);
}
