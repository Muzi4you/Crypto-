// ===== ELEMEN UTAMA =====
const searchInput = document.getElementById('searchInput');
const tabButtons = document.querySelectorAll('.btn-tab');
const toggleDarkBtn = document.getElementById('toggleDark');

// ===== VARIABEL PENYIMPANAN =====
let allCoins = [];      // Simpan semua data koin
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || []; // Simpan favorit di penyimpanan HP

// ===== FUNGSI PENCARIAN =====
function setupSearch() {
  searchInput.addEventListener('input', (e) => {
    const kataKunci = e.target.value.toLowerCase();
    const terfilter = allCoins.filter(koin => 
      koin.name.toLowerCase().includes(kataKunci) || 
      koin.symbol.toLowerCase().includes(kataKunci)
    );
    tampilkanKoin(terfilter);
  });
}

// ===== SISTEM TAB =====
function setupTabs() {
  tabButtons.forEach(tombol => {
    tombol.addEventListener('click', () => {
      // Ubah gaya tombol aktif
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tombol.classList.add('active');

      const jenisTab = tombol.dataset.tab;
      let dataTampil = [...allCoins];

      switch(jenisTab) {
        case 'gainers':
          dataTampil = allCoins.filter(k => k.price_change_percentage_24h > 0);
          break;
        case 'losers':
          dataTampil = allCoins.filter(k => k.price_change_percentage_24h < 0);
          break;
        case 'trending':
          dataTampil = allCoins.slice(0, 10); // 10 teratas dianggap tren
          break;
        case 'watchlist':
          dataTampil = allCoins.filter(k => watchlist.includes(k.id));
          break;
        default: // 'all'
          dataTampil = [...allCoins];
      }

      tampilkanKoin(dataTampil);
    });
  });
}

// ===== TOMBOL FAVORIT / WATCHLIST =====
function toggleFavorit(idKoin) {
  const indeks = watchlist.indexOf(idKoin);
  if (indeks > -1) {
    watchlist.splice(indeks, 1); // Hapus jika sudah ada
  } else {
    watchlist.push(idKoin); // Tambah jika belum ada
  }
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
}

// ===== TAMPILKAN DAFTAR KOIN (DIPERBARUI DARI API.JS) =====
function tampilkanKoin(daftarKoin) {
  const el = document.getElementById('coinList');
  el.innerHTML = '';

  if (daftarKoin.length === 0) {
    el.innerHTML = `<p class="col-span-full text-center text-slate-400 py-10">Tidak ada koin ditemukan</p>`;
    return;
  }

  daftarKoin.forEach(k => {
    const naik = k.price_change_percentage_24h >= 0;
    const warna = naik ? 'text-green-400' : 'text-red-400';
    const bintangAktif = watchlist.includes(k.id) ? 'text-yellow-400' : 'text-slate-400';

    el.innerHTML += `
      <div class="stat-card">
        <div class="flex justify-between items-center mb-3">
          <div class="flex items-center gap-3">
            <img src="${k.image}" class="w-10 h-10 rounded-full">
            <div>
              <h3 class="font-bold">${k.name}</h3>
              <p class="text-slate-400 text-sm">${k.symbol.toUpperCase()}</p>
            </div>
          </div>
          <button onclick="toggleFavorit('${k.id}'); this.classList.toggle('text-yellow-400')" 
                  class="${bintangAktif} hover:text-yellow-300">
            <i class="fa fa-star"></i>
          </button>
        </div>
        <p class="text-xl font-semibold">${formatUang(k.current_price)}</p>
        <p class="${warna} flex items-center gap-1 mt-1">
          <i class="fa ${naik ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
          ${Math.abs(k.price_change_percentage_24h || 0).toFixed(2)}% (24j)
        </p>
        <div class="mt-3 text-sm text-slate-400">
          <p>Cap: ${formatUang(k.market_cap)}</p>
        </div>
        <button onclick="window.location.href='detail.html?id=${k.id}'" 
                class="w-full mt-4 bg-primary/10 hover:bg-primary/20 text-primary py-2 rounded-lg transition-colors">
          Lihat Detail →
        </button>
      </div>
    `;
  });
}

// ===== TOMBOL MODE GELAP / TERANG =====
function setupDarkMode() {
  toggleDarkBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const ikon = toggleDarkBtn.querySelector('i');
    if (document.documentElement.classList.contains('dark')) {
      ikon.classList.replace('fa-moon-o', 'fa-sun-o');
    } else {
      ikon.classList.replace('fa-sun-o', 'fa-moon-o');
    }
  });
}

// ===== FUNGSI FORMAT UANG (AGAR BISA DIPAKAI DI SINI DAN API.JS) =====
function formatUang(angka) {
  return '$' + angka.toLocaleString('en-US', {maximumFractionDigits: 2});
}

// ===== OVERRIDE FUNGSI DI API.JS AGAR DATA DISIMPAN =====
async function ambilKoin() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&sparkline=true');
    allCoins = await res.json(); // Simpan ke variabel global
    tampilkanKoin(allCoins);
  } catch(e) {
    document.getElementById('coinList').innerHTML = '<p class="text-red-400 col-span-full">Gagal memuat data</p>';
    console.error(e);
  }
}

// ===== JALANKAN SEMUA SAAT HALAMAN SIAP =====
document.addEventListener('DOMContentLoaded', () => {
  setupSearch();     // Aktifkan Cari
  setupTabs();       // Aktifkan Tab
  setupDarkMode();   // Aktifkan Mode Gelap/Terang
  ambilDataGlobal(); // Dari api.js
  ambilKoin();       // Ambil & Tampil Koin

  // Perbarui otomatis tiap 60 detik
  setInterval(() => {
    ambilDataGlobal();
    ambilKoin();
  }, 60000);
});
