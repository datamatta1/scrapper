import axios from "axios";
import { load } from "cheerio";
import express from "express";
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
    const itemOptionsList = [];

    $("#CenterPanelInternal", html).each(function () {
      const title = $(this).find(".x-item-title").text().trim();
      const price = $(this).find("#prcIsum").attr("content");
      $(".vi-vpqp-pills", html).each(function () {
        const itemOptionText = $(this).find(".vi-vpqp-text").first().text();
        const itemOptionPrice = Number(
          $(this)
            .find(".vi-vpqp-price")
            .text()
            .replace(/[^0-9\.-]+/g, "")
        );
        itemOptionsList.push({
          itemOptionText,
          itemOptionPrice,
        });
      });
      $("#viTabs", html).each(function () {
        const itemId = Number($(this).find("#descItemNumber").text());
        scrapedProduct.push({
          title,
          price,
          itemId,
          itemOptionsList,
        });
      });
    });
    console.log("scrapedEbayProduct", JSON.stringify(scrapedProduct, null, 4));
  });
};

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

const zooPlusProduct = (producUrl) => {
  axios.get(producUrl).then((response) => {
    const html = response.data;
    const $ = load(html);
    const scrapedProduct = [];
    const itemOptionsList = [];
    $(".FixedGrid_grid__cFmBX", html).each(function () {
      const title = $(this).find(".z-h1").text();
      $(".product__offer", html).each(function () {
        const itemId = Number(
          $(this).find(".Variant_variantDescription__YbooU > div").text()
        );
        const itemOptionText = $(this)
          .find(".Variant_variantDescription__YbooU > span")
          .text();
        const itemOptionPrice = Number(
          $(this)
            .find(".z-price__amount")
            .text()
            .replace(/[^0-9\.-]+/g, "")
        );
        itemOptionsList.push({
          itemId,
          itemOptionText,
          itemOptionPrice,
        });
      });

      scrapedProduct.push({
        price: null,
        title,
        itemOptionsList,
      });
    });
    console.log(
      "scrapedZooPlusProduct",
      JSON.stringify(scrapedProduct, null, 4)
    );
  });
};

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
