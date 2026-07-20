const coinList = document.getElementById("coinList");
const search = document.getElementById("search");

const marketCap = document.getElementById("marketCap");
const volume = document.getElementById("volume");
const btcdom = document.getElementById("btcdom");

let allCoins = [];

async function loadMarket() {

  try {

    // Global Market
    const globalRes = await fetch("https://api.coingecko.com/api/v3/global");

    if (!globalRes.ok) {
      throw new Error("Global API Error : " + globalRes.status);
    }

    const global = await globalRes.json();

    marketCap.textContent =
      "$" +
      (global.data.total_market_cap.usd / 1000000000000).toFixed(2) +
      "T";

    volume.textContent =
      "$" +
      (global.data.total_volume.usd / 1000000000).toFixed(2) +
      "B";

    btcdom.textContent =
      global.data.market_cap_percentage.btc.toFixed(1) + "%";

    // Coin Market
    const marketRes = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false"
    );

    if (!marketRes.ok) {
      throw new Error("Market API Error : " + marketRes.status);
    }

    allCoins = await marketRes.json();

    renderCoins(allCoins);

  } catch (err) {

    console.error(err);

    coinList.innerHTML = `
      <div style="padding:30px;text-align:center;">
        <h2>❌ Gagal Memuat Data</h2>
        <p>${err.message}</p>
      </div>
    `;

  }

}

function renderCoins(data) {

  coinList.innerHTML = "";

  data.forEach((coin) => {

    coinList.innerHTML += `
      <div class="coin">

        <div class="left">

          <img src="${coin.image}" alt="${coin.name}">

          <div>

            <div class="name">${coin.name}</div>

            <div class="symbol">${coin.symbol.toUpperCase()}</div>

          </div>

        </div>

        <div class="right">

          <div class="price">
            $${coin.current_price.toLocaleString()}
          </div>

          <div class="${coin.price_change_percentage_24h >= 0 ? "green" : "red"}">
            ${coin.price_change_percentage_24h.toFixed(2)}%
          </div>

          <div class="small">
            Market Cap :
            $${(coin.market_cap / 1000000000).toFixed(2)}B
          </div>

          <div class="small">
            Volume :
            $${(coin.total_volume / 1000000000).toFixed(2)}B
          </div>

        </div>

      </div>
    `;

  });

}

search.addEventListener("input", () => {

  const key = search.value.toLowerCase();

  const result = allCoins.filter((coin) =>
    coin.name.toLowerCase().includes(key) ||
    coin.symbol.toLowerCase().includes(key)
  );

  renderCoins(result);

});

loadMarket();

setInterval(loadMarket, 30000);
