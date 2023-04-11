const express = require("express");
const app = express();
const axios = require("axios");
const dotenv = require('dotenv')
const cheerio = require("cheerio");
require('dotenv').config()
const PORT = 3000;

//HTTP Request

const url = "https://coinmarketcap.com/";
axios(url).then((response) => {
  const html_data = response.data;
  const $ = cheerio.load(html_data);
  
  const selectedElem =
  "#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div:nth-child(1) > div.h7vnx2-1.bFzXgL > table > tbody > tr";
  const keys = [
    "No.",
    "Coin",
    "Price",
    "24h",
    "7d",
    "Marketcap",
    "Volume",
    "CirculatingSupply",
  ];
  
  const coinArray = [];
  
  $(selectedElem).each((parentIndex, parentElem) => {
    let keyIndex = 0;
    const coinDetails = {};
    if (parentIndex <= 9) {
      $(parentElem)
        .children()
        .each((childId, childElem) => {
          const value = $(childElem).text();
          if (value) {
            coinDetails[keys[keyIndex]] = value;
            keyIndex++;
          }
        });
      coinArray.push(coinDetails);
    }
  });
  
  app.get("/api/crypto", async (req, res) => {
    try {
      return res.status(200).json({
        result: coinArray,
      });
    } catch (err) {
      return res.status(500).json({
        err: err.toString(),
      });
    }
  });

  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});
