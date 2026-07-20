// Ambil elemen DOM
const el = {
  totalMarketCap: document.getElementById('totalMarketCap'),
  volume24h: document.getElementById('volume24h'),
  btcDominance: document.getElementById('btcDominance'),
  coinList: document.getElementById('coinList')
};

// Format Angka
function formatUang(angka) {
  return '$' + angka.toLocaleString('en-US', {maximumFractionDigits:0});
}

// === DATA UTAMA ===
async function ambilDataGlobal() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/global');
    const data = await res.json();
    el.totalMarketCap.innerText = formatUang(data.data.total_market_cap.usd);
    el.volume24h.innerText = formatUang(data.data.total_volume.usd);
    el.btcDominance.innerText = data.data.market_cap_percentage.btc.toFixed(1) + '%';
  } catch(e) {
    console.error('Err Global:', e);
  }
}

// === DAFTAR KOIN ===
async function ambilKoin() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&sparkline=true');
    const koin = await res.json();
    
    el.coinList.innerHTML = ''; // Hapus loading
    koin.forEach(k => {
      const naik = k.price_change_percentage_24h >= 0;
      const warna = naik ? 'text-green-400' : 'text-red-400';
      
      el.coinList.innerHTML += `
        <div class="stat-card">
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center gap-3">
              <img src="${k.image}" class="w-10 h-10 rounded-full">
              <div><h3 class="font-bold">${k.name}</h3><p class="text-slate-400 text-sm">${k.symbol.toUpperCase()}</p></div>
            </div>
          </div>
          <p class="text-xl font-semibold">${formatUang(k.current_price)}</p>
          <p class="${warna}">${naik ? '▲' : '▼'} ${Math.abs(k.price_change_percentage_24h || 0).toFixed(2)}%</p>
        </div>
      `;
    });
  } catch(e) {
    el.coinList.innerHTML = '<p class="text-red-400">Gagal memuat data</p>';
    console.error('Err Koin:', e);
  }
}

// === JALANKAN ===
document.addEventListener('DOMContentLoaded', () => {
  ambilDataGlobal();
  ambilKoin();
  setInterval(() => { ambilDataGlobal(); ambilKoin(); }, 60000);
});
