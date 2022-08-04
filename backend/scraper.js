// import axios from "axios";
// import cheerio from "cheerio";
// import express from "express";
// const PORT = 8080;

// // Init app
// const app = express();

// // Scraping part
// const websiteUrl = `https://flytestore.com`;
// const storePath = `/collections/store`;
// const page = `/?page=1`;
// const fullUrl = websiteUrl + storePath + page;

// axios(fullUrl).then((response) => {
//   const html = response.data;
//   const $ = cheerio.load(html, {
//     xml: {
//       normalizeWhitespace: true,
//     },
//   });
//   const listingList = [];
//   $(".card", html).each(function () {
//     const title = $(this).find(".card__name").text();
//     const price = $(this)
//       .find(".card__price")
//       .text()
//       .replace(/[^a-zA-Z0-9 ]\s+/g, "");
//     const link = $(this).find("a").attr("href");
//     const img = $(this).find("img").attr("src");
//     listingList.push({
//       title,
//       price,
//       link: `${websiteUrl}${link}`,
//       img: `${img.substring(2)}`,
//     });
//   });
//   console.log("listingList", listingList);
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port: ${PORT}`);
// });
