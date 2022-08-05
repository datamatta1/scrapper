import axios from "axios";
import { load } from "cheerio";
import express, { response } from "express";
const PORT = 9009;

// Init app
const app = express();

const shopifyProducts = async (producUrl) => {
  await axios.get(`${producUrl}/products.json`).then(function (response) {
    console.log(response.data);
  });
};

const amazonProduct = async (productUrl) => {
  await axios(productUrl).then((response) => {
    const html = response.data;
    const $ = load(html);
    const scrapedProduct = [];

    $("#a-page", html).each(function () {
      const title = $(this).find("#productTitle").text().trim();
      const price = Number(
        $(this)
          .find(".a-offscreen")
          .first()
          .text()
          .replace(/[^0-9\.-]+/g, "")
      );
      const options = $(this).find(".po-color").text().trim();
      const image = $(this).find("#imgTagWrapperId > img").attr("src");
      scrapedProduct.push({
        title,
        price,
        options,
        image,
      });
    });
    console.log("scrapedAmazonProduct", scrapedProduct);
  });
};

const ebayProduct = async (producUrl) => {
  await axios(producUrl).then((response) => {
    const html = response.data;
    const $ = load(html);
    const scrapedProduct = [];

    $("#LeftSummaryPanel", html).each(function () {
      const title = $(this).find(".x-item-title").text().trim();
      const price = $(this).find("#prcIsum").attr("content");
      scrapedProduct.push({
        title,
        price,
      });
    });
    console.log("scrapedEbayProduct", scrapedProduct);
  });
};

// TODO: finish up
const costcoProduct = async (producUrl) => {
  await axios(producUrl).then((response) => {
    const html = response.data;
    const $ = load(html);
    const scrapedProduct = [];

    $(".product-page-container", html).each(function () {
      const title = $(this).find("h1.product-name").text();
      const singlePrice = Number(
        $(this)
          .find(".product-price-amount")
          .text()
          .replace(/[^0-9\.-]+/g, "")
      );
      const yourPrice = Number(
        $(this)
          .find(".you-pay-value")
          .first()
          .text()
          .replace(/[^0-9\.-]+/g, "")
      );
      const itemId = Number(
        $(this).find(".product-code > .notranslate").text()
      );

      scrapedProduct.push({
        itemId,
        title,
        price: singlePrice !== 0 ? singlePrice : yourPrice,
        options: null,
      });
    });
    console.log("scrapedCostcoProduct", scrapedProduct);
  });
};

// ebayProduct(
//   "https://www.ebay.co.uk/itm/283652964073?_trkparms=%26rpp_cid%3D5d8cce9aa937f33a775e44ce%26rpp_icid%3D5d8cce9aa937f33a775e44cd&_trkparms=pageci%3Ad7211af3-14cf-11ed-abb0-66c1e5429cf0%7Cparentrq%3A6e88e5d21820aa72145f9561fffd0184%7Ciid%3A1"
// );

// ebayProduct(
//   "https://www.ebay.co.uk/itm/350809863327?_trkparms=%26rpp_cid%3D5d8cce9aa937f33a775e44ce%26rpp_icid%3D5d8cce9aa937f33a775e44cd&_trkparms=pageci%3Ad7211af3-14cf-11ed-abb0-66c1e5429cf0%7Cparentrq%3A6e88e5d21820aa72145f9561fffd0184%7Ciid%3A1"
// );

// ebayProduct(
//   "https://www.ebay.co.uk/itm/403787630396?_trkparms=pageci%3Ad7211af3-14cf-11ed-abb0-66c1e5429cf0%7Cparentrq%3A6e88e5d21820aa72145f9561fffd0184%7Ciid%3A1"
// );

// ebayProduct(
//   "https://www.ebay.co.uk/itm/353854415715?_trkparms=amclksrc%3DITM%26aid%3D1110006%26algo%3DHOMESPLICE.SIM%26ao%3D1%26asc%3D240680%26meid%3Dbb2f2af885c648f8b2f80ac9a2f4c905%26pid%3D101195%26rk%3D1%26rkt%3D12%26sd%3D403787630396%26itm%3D353854415715%26pmt%3D1%26noa%3D0%26pg%3D2047675%26algv%3DSimplAMLv9PairwiseWebMskuAspectsV202110NoVariantSeedKnnRecallV1%26brand%3DXM&_trksid=p2047675.c101195.m1851&amdata=cksum%3A353854415715bb2f2af885c648f8b2f80ac9a2f4c905%7Cenc%3AAQAHAAABIK6kjqEQMYM5Aq%252BOhcaIlwco9wYktoCXAP3D6Fo7POUdlJK1eqFqv5Y7huO6nLq7hjqYjs5sEMudJpf20WlRkR4XKhu2pPLPZy7IhsGtMaosK5wpLZkI4%252FHfnmP%252BWTjj420Mz%252BZCOU53RqM5gANLRDbNsanlrYB4M%252F%252BEMdqnanYhOcudmeSb0SbqXwXnUfwQr%252F19tDxRstWBjnOBdxCsS7gUgn63vLOmWaoqWs%252BYNJ7OeGXg55j%252F5VZEMhlO%252BVsfGTy6Aloyjj8FoednT4gC5ZEz%252FkzP5MsblpoH1S4ZBQcsu1yezJTfL%252B4%252FLbNet4SMgCrPjcRhWMIcC9wNu6gmLXyxrrycXenreDNwg6iJHtU%252BAjrjA1SwVZflbVjzvlRfMA%253D%253D%7Campid%3APL_CLK%7Cclp%3A2047675"
// );

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
