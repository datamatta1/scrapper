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

const amazonProduct = async (productUrl) => {
  await axios(productUrl).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const scrapedProduct = [];
    $("#centerCol", html).each(function () {
      const title = $(this).find("#productTitle").text().trim();
      let price = $(this).find(".priceToPay").text().trim().split("£", 2)[1];
      scrapedProduct.push({
        title,
        price,
      });
      console.log("scrapedProduct", scrapedProduct);
    });
  });
};
// amazonProduct(
//   "https://www.amazon.co.uk/LYCANDER-Charger-adaptive-charging-technology/dp/B07VYF37W1/ref=sr_1_3?crid=3DFXXATFM9K4M&keywords=charger&qid=1659636392&sprefix=charger%2Caps%2C107&sr=8-3"
// );

// amazonProduct(
//   "https://www.amazon.co.uk/Apple-EarPods-3-5mm-Headphone-Plug/dp/B06XDLJL26/ref=sr_1_10?_encoding=UTF8&brr=1&content-id=amzn1.sym.d191d14d-5ea3-4792-ae6c-e1de8a1c8780&pd_rd_r=1be29083-7b14-476e-be88-8ca9a508137e&pd_rd_w=ObrAu&pd_rd_wg=1ZPUj&pf_rd_p=d191d14d-5ea3-4792-ae6c-e1de8a1c8780&pf_rd_r=6YZCX3HFZN5EK65FD9JD&qid=1659640026&rd=1&s=electronics&sr=1-10"
// );

// amazonProduct(
//   "https://www.amazon.co.uk/runnerequipment-electroplating-creative-film%EF%BC%8CCustom-Playst-ation/dp/B0991WSK8M/ref=sr_1_10?_encoding=UTF8&brr=1&content-id=amzn1.sym.d191d14d-5ea3-4792-ae6c-e1de8a1c8780&pd_rd_r=e665b655-7ffb-4516-b6ce-fe995de99cc1&pd_rd_w=ak7i8&pd_rd_wg=OwPDz&pf_rd_p=d191d14d-5ea3-4792-ae6c-e1de8a1c8780&pf_rd_r=0TD029FC22SDZC8JSYV2&qid=1659639054&rd=1&s=videogames&sr=1-10"
// );

// shopifyProducts("https://flytestore.com/");

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
