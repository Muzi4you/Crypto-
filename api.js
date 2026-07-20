// =========================
// CoinGecko API
// =========================

const API = {

BASE_URL: "https://api.coingecko.com/api/v3",

// =========================
// Global Market
// =========================

async getGlobal(){

try{

const response = await fetch(
`${this.BASE_URL}/global`
);

if(!response.ok) throw new Error("Global API Error");

return await response.json();

}catch(error){

console.error(error);

return null;

}

},

// =========================
// Top Coins
// =========================

async getMarkets(currency="usd",page=1,perPage=50){

try{

const response = await fetch(

`${this.BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`

);

if(!response.ok) throw new Error("Market API Error");

return await response.json();

}catch(error){

console.error(error);

return [];

}

},

// =========================
// Trending Coins
// =========================

async getTrending(){

try{

const response=await fetch(

`${this.BASE_URL}/search/trending`

);

if(!response.ok) throw new Error("Trending API Error");

return await response.json();

}catch(error){

console.error(error);

return [];

}

},

// =========================
// Coin Detail
// =========================

async getCoin(id){

try{

const response=await fetch(

`${this.BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false`

);

if(!response.ok) throw new Error("Coin Detail Error");

return await response.json();

}catch(error){

console.error(error);

return null;

}

},

// =========================
// Search Coin
// =========================

async search(keyword){

try{

const response=await fetch(

`${this.BASE_URL}/search?query=${keyword}`

);

if(!response.ok) throw new Error("Search Error");

return await response.json();

}catch(error){

console.error(error);

return [];

}

},

// =========================
// Gainers
// =========================

async getGainers(){

const data=await this.getMarkets();

return data

.filter(c=>c.price_change_percentage_24h>0)

.sort((a,b)=>

b.price_change_percentage_24h-

a.price_change_percentage_24h

);

},

// =========================
// Losers
// =========================

async getLosers(){

const data=await this.getMarkets();

return data

.filter(c=>c.price_change_percentage_24h<0)

.sort((a,b)=>

a.price_change_percentage_24h-

b.price_change_percentage_24h

);

},

// =========================
// Top Volume
// =========================

async getTopVolume(){

const data=await this.getMarkets();

return data.sort((a,b)=>

b.total_volume-

a.total_volume

);

},

// =========================
// Stable Coin
// =========================

async getStableCoins(){

const data=await this.getMarkets();

return data.filter(c=>

["usdt","usdc","dai","fdusd","tusd"].includes(

c.symbol.toLowerCase()

)

);

},

// =========================
// Meme Coin
// =========================

async getMemeCoins(){

const data=await this.getMarkets();

return data.filter(c=>

["doge","shib","pepe","floki","bonk"]

.includes(

c.symbol.toLowerCase()

)

);

}

};

// =========================
// Format Currency
// =========================

function money(value){

return new Intl.NumberFormat(

'en-US',

{

style:'currency',

currency:'USD',

maximumFractionDigits:2

}

).format(value);

}

// =========================
// Format Number
// =========================

function number(value){

return new Intl.NumberFormat(

'en-US'

).format(value);

}

// =========================
// Format Percent
// =========================

function percent(value){

return Number(value).toFixed(2)+"%";

}

console.log("CoinGecko API Loaded");
