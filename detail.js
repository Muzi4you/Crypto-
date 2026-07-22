// ======================================
// DETAIL.JS
// Crypto Live Market
// ======================================

const coinId = new URLSearchParams(window.location.search).get("id");

const $ = (id) => document.getElementById(id);

let chart;

// ===============================
// FORMAT MONEY
// ===============================

function money(value) {

    return new Intl.NumberFormat("en-US", {

        style: "currency",

        currency: "USD",

        minimumFractionDigits: value < 1 ? 6 : 2,

        maximumFractionDigits: value < 1 ? 6 : 2

    }).format(value);

}

// ===============================
// LOAD COIN DETAIL
// ===============================

async function loadCoin(days = 7) {

    if (!coinId) {

        alert("Coin ID tidak ditemukan");

        window.location.href = "index.html";

        return;

    }

    try {

        const detail = await fetch(

            `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`

        ).then(res => {

            if (!res.ok) throw new Error("Coin Detail Error");

            return res.json();

        });

        $("coinName").textContent = detail.name;

        $("coinSymbol").textContent = detail.symbol.toUpperCase();

        $("coinImage").src = detail.image.large;

        $("currentPrice").textContent = money(

            detail.market_data.current_price.usd

        );

        const change =

            detail.market_data.price_change_percentage_24h;

        $("priceChange24h").textContent =

            `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

        $("priceChange24h").style.color =

            change >= 0 ? "#16c784" : "#ea3943";

        $("marketCap").textContent =

            money(detail.market_data.market_cap.usd);

        $("volume24h").textContent =

            money(detail.market_data.total_volume.usd);

        $("high24h").textContent =

            money(detail.market_data.high_24h.usd);

        $("low24h").textContent =

            money(detail.market_data.low_24h.usd);

        $("description").textContent =

            (detail.description.en || "Tidak ada deskripsi")

            .replace(/<[^>]+>/g, "")

            .slice(0, 800);

        const market = await fetch(

            `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`

        ).then(res => res.json());

        drawChart(market.prices);

    }

    catch (err) {

        console.error(err);

        alert("Gagal memuat data Coin.");

    }

}
// ===============================
// TRADINGVIEW CHART
// ===============================

function drawChart(prices) {

    const container = $("priceChart");

    if (!container) return;

    container.innerHTML = "";

    chart = LightweightCharts.createChart(container, {

        width: container.clientWidth,

        height: 380,

        layout: {

            background: {

                color: "#0B1020"

            },

            textColor: "#B8C1CC"

        },

        grid: {

            vertLines: {

                color: "#1E293B"

            },

            horzLines: {

                color: "#1E293B"

            }

        },

        rightPriceScale: {

            borderColor: "#334155"

        },

        timeScale: {

            borderColor: "#334155",

            timeVisible: true,

            secondsVisible: false

        }

    });

    const series = chart.addAreaSeries({

        lineColor: "#16C784",

        topColor: "rgba(22,199,132,.45)",

        bottomColor: "rgba(22,199,132,.05)",

        lineWidth: 2

    });

    series.setData(

        prices.map(item => ({

            time: Math.floor(item[0] / 1000),

            value: item[1]

        }))

    );

    chart.timeScale().fitContent();

    window.addEventListener("resize", () => {

        chart.applyOptions({

            width: container.clientWidth

        });

    });

}

// ===============================
// TIMEFRAME
// ===============================

window.changeTimeframe = function(days){

    loadCoin(days);

};

// ===============================
// START
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    loadCoin(7);

});
