import axios from "axios";
import { load } from "cheerio";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const PORT = 9009;

// Init supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SERVICE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

    $(`#a-page`, html).each(function () {
      const title = $(this).find(`#productTitle`).text().trim();
      const price = Number(
        $(this)
          .find(`.a-offscreen`)
          .first()
          .text()
          .replace(/[^0-9\.-]+/g, "")
      );
      const options = $(this).find(`.po-color`).text().trim();
      const image = $(this).find(`#imgTagWrapperId > img`).attr(`src`);
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

    $(`#CenterPanelInternal`, html).each(function () {
      const title = $(this).find(`.x-item-title`).text().trim();
      const price = $(this).find(`#prcIsum`).attr(`content`);
      $(".vi-vpqp-pills", html).each(function () {
        const itemOptionText = $(this).find(`.vi-vpqp-text`).first().text();
        const itemOptionPrice = Number(
          $(this)
            .find(`.vi-vpqp-price`)
            .text()
            .replace(/[^0-9\.-]+/g, "")
        );
        itemOptionsList.push({
          itemOptionText,
          itemOptionPrice,
        });
      });
      $(`#viTabs`, html).each(function () {
        const itemId = Number($(this).find(`#descItemNumber`).text());
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

    $(`.product-page-container`, html).each(function () {
      const title = $(this).find(`h1.product-name`).text();
      const singlePrice = Number(
        $(this)
          .find(`.product-price-amount`)
          .text()
          .replace(/[^0-9\.-]+/g, "")
      );
      const yourPrice = Number(
        $(this)
          .find(`.you-pay-value`)
          .first()
          .text()
          .replace(/[^0-9\.-]+/g, "")
      );
      const itemId = Number(
        $(this).find(`.product-code > .notranslate`).text()
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
    $(`.FixedGrid_grid__cFmBX`, html).each(function () {
      const title = $(this).find(`.z-h1`).text();
      $(`.product__offer`, html).each(function () {
        const itemId = Number(
          $(this).find(`.Variant_variantDescription__YbooU > div`).text()
        );
        const itemOptionText = $(this)
          .find(`.Variant_variantDescription__YbooU > span`)
          .text();
        const itemOptionPrice = Number(
          $(this)
            .find(`.z-price__amount`)
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

const online4BabyProduct = (producUrl) => {
  axios(producUrl).then((response) => {
    const html = response.data;
    const $ = load(html);
    const scrapedProduct = [];
    const itemOptionsList = [];

    $(`div[data-page-id="product"]`, html).each(function () {
      const title = $(this)
        .find(`.text-darkblue.font-bold.text-lg.pb-2`)
        .text();
      const price = Number(
        $(this)
          .find(`.price`)
          .text()
          .replace(/[^0-9\.-]+/g, "")
      );
      const itemId = $(this)
        .find(`.text-xs.text-darkblue.mb-3.item-main-id`)
        .text();
      const options = null;

      scrapedProduct.push({
        title,
        price,
        itemId,
        options,
      });
    });
    console.log("scrapedBabyProduct", scrapedProduct);
  });
};

const vonhausProduct = (producUrl) => {
  axios(producUrl).then((response) => {
    const html = response.data;
    const $ = load(html);
    const scrapedProduct = [];
    const itemOptionsList = [];

    $(`#maincontent`, html).each(function () {
      const title = $(this).find(`.page-title`).text().trim();
      const price = Number(
        $(this)
          .find(`span[class="price"]`)
          .first()
          .text()
          .replace(/[^0-9\.-]+/g, "")
      );
      // .replace(/[^0-9\.-]+/g, "")

      const itemId = Number(
        $(this).find(`.product-specs__value`).last().text()
      );
      const options = null;

      scrapedProduct.push({
        title,
        price,
        itemId,
        options,
      });
    });
    console.log("scrapedVonhausProduct", scrapedProduct);
  });
};

const activityToysProduct = (producUrl) => {
  axios(producUrl).then((response) => {
    const html = response.data;
    const $ = load(html);
    const scrapedProduct = [];
    const itemOptionsList = [];

    $(`#site_torso`, html).each(function () {
      const title = $(this).find(`#prodpage_title > h1 > span`).text().trim();
      const price = Number(
        $(this)
          .find(`span[class="price"]`)
          .first()
          .text()
          .replace(/[^0-9\.-]+/g, "")
      );

      const itemId = Number(
        $(this).find(`table.spec-table > tbody > tr > td`).last().text()
      );
      const options = null;

      scrapedProduct.push({
        title,
        price,
        itemId,
        options,
      });
    });
    console.log("scrapedActivityProduct", scrapedProduct);
  });
};

const dunelmProduct = (producUrl) => {
  axios(producUrl).then((response) => {
    const html = response.data;
    const $ = load(html);
    const scrapedProduct = [];
    const itemOptionsList = [];

    $(`#main-content`, html).each(function () {
      const title = $(this)
        .find(`h1[data-testid="product-title"]`)
        .text()
        .trim();
      const price = Number(
        $(this)
          .find(`h2[data-testid="product-price-now"]`)
          .first()
          .text()
          .replace(/[^0-9\.-]+/g, "")
      );

      const itemId = Number(
        $(this).find(`table.spec-table > tbody > tr > td`).last().text()
      );
      $(`option[value]`).each(function () {
        const itemOptionText = $(this).text().split("-")[0].trim();
        const itemOptionPrice = Number(
          $(this)
            .text()
            .split("-")[1]
            .replace(/[^0-9\.-]+/g, "")
            .trim()
        );
        if (itemOptionPrice != 0)
          itemOptionsList.push({
            itemOptionText,
            itemOptionPrice,
          });
      });

      scrapedProduct.push({
        title,
        price: price != NaN ? price : "",
        itemId,
        itemOptionsList,
      });
    });
    console.log(
      "scrapedDunelmProduct",
      JSON.stringify(scrapedProduct, null, 6)
    );
  });
};

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
