const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
let data;
app.get("/", async (request, response) => {
  function run() {
    return new Promise(async (resolve, reject) => {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setUserAgent(
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
        );
        await page.goto(
          "https://www.casasbahia.com.br/c/telefones-e-celulares/smartphones/iphone/?filtro=c38_c326_c3267"
        );
        await page.screenshot({ path: "example.png" });
        let urls = await page.evaluate(() => {
          let results = [];
          let results2 = [];
          let itens = document.querySelectorAll("div a.sc-5b0743c3-1.bTwTvi");
          let precos = document.querySelectorAll("span.sc-47246d2e-7.eToubG");

          var i;
          for (i = 0; i < itens.length; i++) {
            if (
              precos[i] != undefined &&
              itens[i] != undefined &&
              itens[i] != undefined
            ) {
              results.push({
                url: itens[i].getAttribute("href"),
                text: itens[i].innerText,
                price: precos[i].innerText,
              });
            }
          }

          itens.forEach((item) => {
            results.push({
              url: item.getAttribute("href"),
              text: item.innerText,
            });
          });

          precos.forEach((item) => {
            results2.push({
              text: item.innerText,
            });
          });
          console.log(results.length);
          console.log(results2.length);

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

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto("https://www.magazineluiza.com.br/");
//   //await page.screenshot({ path: "example.png" });

//   await browser.close();
// })();
