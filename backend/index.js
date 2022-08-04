import axios from "axios";
import cheerio from "cheerio";
import express, { response } from "express";
const PORT = 9009;

// Init app
const app = express();

const shopifyProducts = async (producUrl) => {
  await axios.get(`${producUrl}/products.json`).then(function (response) {
    console.log(response.data);
  });
};

console.log('shopifyProducts("")', shopifyProducts("https://flytestore.com/"));

const amazonProduct = async (productUrl) => {
  await axios(productUrl).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const scrapedProduct = [];
    $(".card", html).each(function () {
      const title = $(this).find(".card__name").text();
      const price = $(this)
        .find(".card__price")
        .text()
        .replace(/[^a-zA-Z0-9 ]\s+/g, "");
      const link = $(this).find("a").attr("href");
      const img = $(this).find("img").attr("src");
      scrapedProduct.push({
        title,
        price,
        link: `${websiteUrl}${link}`,
        img: `${img.substring(2)}`,
      });
    });
  });
};

// shopifyProducts("https://flytestore.com/");

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
