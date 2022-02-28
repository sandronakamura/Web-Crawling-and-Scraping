const express = require("express");
const puppeteer = require("puppeteer");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const app = express();
let data;
app.get("/", async (request, response) => {
  function run() {
    return new Promise(async (resolve, reject) => {
      try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const fakeUserAgent =
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36";

        await page.evaluateOnNewDocument((fakeUserAgent) => {
          window.open = (...args) => {
            let newPage = open(...args);
            Object.defineProperty(newPage.navigator, "userAgent", {
              get: () => fakeUserAgent,
            });
            return newPage;
          };
          window.open.toString = () => "function open() { [native code] }";
        }, fakeUserAgent);

        await page.setUserAgent(fakeUserAgent);

        await page.goto(
          "https://www.magazineluiza.com.br/celulares-e-smartphones/l/te/"
        );
        await sleep(5000);
        await page.screenshot({ path: "example.png" });
        let urls = await page.evaluate(() => {
          let results = [];
          let results2 = [];
          let itens = document.querySelectorAll(
            "[data-css-1ve3vkk][data-css-1bia0lo]"
          );
          let precos = document.querySelectorAll("[data-css-lz0zr]");

          var i;
          for (i = 0; i < itens.length; i++) {
            if (precos[i] != undefined && itens[i] != undefined) {
              results.push({
                text: itens[i].innerText,
                price: precos[i].innerText,
              });
            }
          }

          //   itens.forEach((item) => {
          //     results.push({
          //       url: item.getAttribute("href"),
          //       text: item.innerText,
          //     });
          //   });

          //   precos.forEach((item) => {
          //     results2.push({
          //       text: item.innerText,
          //     });
          //   });
          //   console.log(results.length);
          //   console.log(results2.length);

          return results;
        });
        browser.close();
        return resolve(urls);
      } catch (e) {
        return reject(e);
      }
    });
  }
  data = await run().then().catch(console.error);
  //data = JSON.stringify(data);
  response.send({
    data,
  });
});

app.listen(3002, () => console.log("Servidor online!"));
