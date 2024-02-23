const scrapeAmazon = require('./scrape');

async function testScraping() {
  try {
    const keyword = 'retirador de cravo'; // Termo de pesquisa para testar
    const products = await scrapeAmazon(keyword);
    console.log(products);
  } catch (error) {
    console.error(error);
  }
}

testScraping();
