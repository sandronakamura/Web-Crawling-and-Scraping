const cheerio = require("cheerio");
const request = require("request");

request(
  {
    method: "GET",
    url: "https://www.casasbahia.com.br/telefones-e-celulares/?filtro=c38&nid=201448",
  },
  (err, res, body) => {
    if (err) return console.error(err);

    let $ = cheerio.load(body);

    let title = $("title");

    console.log(title.text());
    //console.log($.html());
  }
);

// const $ = cheerio.load("https://www.instagram.com/rocketseat_oficial/");

// console.log($.html());
