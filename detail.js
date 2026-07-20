// Ambil ID koin dari URL (contoh: detail.html?id=bitcoin)
const urlParams = new URLSearchParams(window.location.search);
const coinId = urlParams.get('id');

// Elemen DOM halaman detail
const detailElements = {
  coinName: document.getElementById('coinName'),
  coinSymbol: document.getElementById('coinSymbol'),
  coinImage: document.getElementById('coinImage'),
  currentPrice: document.getElementById('currentPrice'),
  priceChange24h: document.getElementById('priceChange24h'),
  marketCap: document.getElementById('marketCap'),
  volume24h: document.getElementById('volume24h'),
  high24h: document.getElementById('high24h'),
  low24h: document.getElementById('low24h'),
  description: document.getElementById('description'),
  chartContainer: document.getElementById('priceChart'),
  loading: document.getElementById('loading')
};

// Format angka
function formatNumber(num) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: (num < 1) ? 6 : 2
  }).format(num);
}

// 📡 Ambil DATA RINCIAN SATU KOIN
async function fetchCoinDetail() {
  if (!coinId) {
    alert('ID Koin tidak ditemukan!');
    window.location.href = 'index.html';
    return;
  }

  try {
    detailElements.loading.classList.remove('d-none');
    
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true`);
    
    if (!res.ok) throw new Error('Gagal memuat data koin');
    const data = await res.json();

    // Isi data ke halaman
    detailElements.coinName.textContent = data.name;
    detailElements.coinSymbol.textContent = data.symbol.toUpperCase();
    detailElements.coinImage.src = data.image.large;
    detailElements.currentPrice.textContent = formatNumber(data.market_data.current_price.usd);
    
    const change = data.market_data.price_change_percentage_24h;
    detailElements.priceChange24h.textContent = (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
    detailElements.priceChange24h.className = change >= 0 ? 'text-green-400' : 'text-red-400';
    
    detailElements.marketCap.textContent = formatNumber(data.market_data.market_cap.usd);
    detailElements.volume24h.textContent = formatNumber(data.market_data.total_volume.usd);
    detailElements.high24h.textContent = formatNumber(data.market_data.high_24h.usd);
    detailElements.low24h.textContent = formatNumber(data.market_data.low_24h.usd);
    
    // Deskripsi (bersihkan tag HTML jika ada)
    detailElements.description.innerHTML = data.description.en?.replace(/<[^>]*>/g, '') || 'Tidak ada deskripsi.';

    // Panggil buat gambar grafik (pakai chart.js)
    if (typeof drawDetailChart === "function") {
      drawDetailChart(data.market_data.sparkline_7d.price);
    }

  } catch (err) {
    console.error('Error Detail:', err);
    alert('Gagal memuat rincian, coba lagi nanti.');
  } finally {
    detailElements.loading.classList.add('d-none');
  }
}

// 🔄 Kembali ke halaman utama
function goBack() {
  window.location.href = 'index.html';
}

// Jalankan saat halaman siap
document.addEventListener('DOMContentLoaded', () => {
  fetchCoinDetail();
});
