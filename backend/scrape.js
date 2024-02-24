const axios = require('axios'); // Import Axios
const cheerio = require('cheerio'); // Import Cheerio

async function scrapeAmazon(keyword) { // Creates the scraping function
  try {
    const response = await axios.get(`https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      } // Define a valid user-agent (Fix 503 error)
    });

    const $ = cheerio.load(response.data); // Use Cheerio to load the HTML content

    const products = []; // Creates an empty list that will be used to store the obtained products

    $('.s-result-item[data-asin]').each((index, element) => {
      const title = $(element).find('.a-size-base-plus.a-color-base.a-text-normal').text().trim(); // Find the product title
      if (title !== '') { // Check that the title is not empty
        const ratingElement = $(element).find('.a-icon-star-small .a-icon-alt'); // Find the product rating eleement by the classname
        const rating = ratingElement.length > 0 ? ratingElement.text() : 'N/A';
        const numReviewsElement = $(element).find('.a-size-base.s-underline-text');
        let numReviews = numReviewsElement.length > 0 ? numReviewsElement.text() : 'N/A';
        numReviews = numReviews.split('').filter(char => !isNaN(parseInt(char))).join(''); // Remove all non-numeric characters
        const imageUrl = $(element).find('.s-image').attr('src');

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
    throw new Error(`Failed to scrape Amazon: ${error.message}`);
  }
}

module.exports = scrapeAmazon;
