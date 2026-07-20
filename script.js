const coinList = document.getElementById("coinList");
const search = document.getElementById("search");

let coins = [];

async function loadCoins() {

const res = await fetch(
"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false"
);

coins = await res.json();

renderCoins(coins);

}

function renderCoins(data){

coinList.innerHTML="";

data.forEach(coin=>{

coinList.innerHTML +=`

<div class="coin">

<div class="left">

<img src="${coin.image}">

<div>

<div class="name">${coin.name}</div>

<div class="symbol">${coin.symbol.toUpperCase()}</div>

</div>

</div>

<div class="right">

<div class="price">$${coin.current_price.toLocaleString()}</div>

<div class="${coin.price_change_percentage_24h>=0?'green':'red'}">

${coin.price_change_percentage_24h.toFixed(2)}%

</div>

</div>

</div>

`;

});

}

search.addEventListener("input",()=>{

const keyword=search.value.toLowerCase();

const result=coins.filter(c=>

c.name.toLowerCase().includes(keyword)||

c.symbol.toLowerCase().includes(keyword)

);

renderCoins(result);

});

loadCoins();

setInterval(loadCoins,30000);
