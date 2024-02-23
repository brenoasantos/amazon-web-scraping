const axios = require('axios'); //import Axios
const cheerio = require('cheerio');//import Cheerio

async function scrapeAmazon(keyword) {
  try {
    const response = await axios.get(`https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0' // Define a valid user-agent (Fix 503 error)
      }
    });

    const $ = cheerio.load(response.data);

    const products = [];

    $('.s-result-item').each((index, element) => {
      const title = $(element).find('.a-size-base-plus.a-color-base.a-text-normal').text().trim(); //Find the product title
      if (title !== '') { // Check that the title is not empty
        const ratingElement = $(element).find('.a-icon-star-small'); //Find the product rating element by the classname
        const rating = ratingElement.length > 0 ? ratingElement.text() : 'N/A'; //Check if have any avaliation
        const numReviewsElement = $(element).find('.a-size-base.s-underline-text'); //Find the product number of reviews element by the classname
        const numReviews = numReviewsElement.length > 0 ? numReviewsElement.text() : 'N/A'; //Check if have any review
        const imageUrl = $(element).find('.s-image').attr('src'); //Find the product image url

        products.push({
          title,
          rating,
          numReviews,
          imageUrl
        });
      }
    });

    return products;
  } catch (error) {
    if (error.response && error.response.status === 503) {
      console.log('Service temporarily unavailable. Trying again in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds (Fix 503 error)
      return scrapeAmazon(keyword); // Try scraping again
    } else {
      throw new Error(`Failed to scrape Amazon: ${error.message}`);
      
    }
  }
}

module.exports = scrapeAmazon;
