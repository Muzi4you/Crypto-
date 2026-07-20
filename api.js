// Ambil elemen dari halaman
const elements = {
  totalMarketCap: document.getElementById('totalMarketCap'),
  volume24h: document.getElementById('volume24h'),
  btcDominance: document.getElementById('btcDominance'),
  fearGreed: document.getElementById('fearGreed'),
  coinList: document.getElementById('coinList'),
  searchInput: document.getElementById('searchInput')
};

// Format angka ke bentuk Dolar AS
function formatNumber(num) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
}

// Format angka desimal untuk harga koin
function formatPrice(num) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: (num < 1) ? 6 : 2
  }).format(num);
}

// 🌐 Ambil DATA UTAMA PASAR (Total Kap, Volume, Dominasi BTC)
async function fetchGlobalData() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/global');
    if (!res.ok) throw new Error('Gagal ambil data global');
    
    const data = await res.json();
    const g = data.data;

    elements.totalMarketCap.textContent = formatNumber(g.total_market_cap.usd);
    elements.volume24h.textContent = formatNumber(g.total_volume.usd);
    elements.btcDominance.textContent = g.market_cap_percentage.btc.toFixed(1) + '%';
    elements.fearGreed.textContent = 'Segera Hadir'; // Nanti ditambah
  } catch (err) {
    console.error('Error Global:', err);
    elements.totalMarketCap.textContent = 'Gagal Memuat';
    elements.volume24h.textContent = 'Gagal Memuat';
  }
}

// 🪙 Ambil DAFTAR KOIN (20 teratas + Grafik Mini)
async function fetchCoins() {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h`);
    if (!res.ok) throw new Error('Gagal ambil daftar koin');
    
    const coins = await res.json();
    renderCoins(coins); // Panggil fungsi tampilkan di script.js atau di bawah
  } catch (err) {
    console.error('Error Koin:', err);
    elements.coinList.innerHTML = `
      <div class="col-span-full text-center py-12 text-red-400">
        <p><i class="fa fa-exclamation-triangle mr-2"></i>Data tidak dapat dimuat.</p>
      </div>
    `;
  }
}

// 🖨️ Tampilkan Kartu Koin
export function renderCoins(coins) {
  elements.coinList.innerHTML = '';

  coins.forEach(coin => {
    const naik = coin.price_change_percentage_24h >= 0;
    const warna = naik ? 'text-green-400' : 'text-red-400';
    const ikon = naik ? 'fa-arrow-up' : 'fa-arrow-down';

    const kartu = document.createElement('div');
    kartu.className = 'stat-card flex flex-col gap-4';
    kartu.innerHTML = `
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <img src="${coin.image}" alt="${coin.name}" class="w-10 h-10 rounded-full">
          <div>
            <h3 class="font-bold">${coin.name}</h3>
            <p class="text-sm text-slate-400">${coin.symbol.toUpperCase()}</p>
          </div>
        </div>
        <button class="text-slate-400 hover:text-yellow-400"><i class="fa fa-star-o"></i></button>
      </div>
      <div>
        <p class="text-xl font-semibold mb-1">${formatPrice(coin.current_price)}</p>
        <p class="${warna} flex items-center gap-1">
          <i class="fa ${ikon}"></i> 
          ${Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}% (24j)
        </p>
      </div>
      <div class="h-16 w-full">
        <canvas id="spark-${coin.id}" class="w-full h-full"></canvas>
      </div>
      <div class="flex justify-between text-sm text-slate-400 mt-auto">
        <span>Cap: $${(coin.market_cap / 1000000000).toFixed(2)}B</span>
        <button class="text-primary hover:underline" onclick="lihatDetail('${coin.id}')">Detail →</button>
      </div>
    `;
    elements.coinList.appendChild(kartu);
  });
}
