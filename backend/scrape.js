const axios = require('axios'); // Import Axios to fetch the contents
const cheerio = require('cheerio'); // Import Cheerio to parse the fetched HTML content

async function scrapeAmazon(keyword) { // Create the scraping function
  try {
    // Search the Amazon search page for results related to the keyword provided by the user
    const response = await axios.get(`https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`, { // Await is used to wait for the request response, which will be stored in the response variable
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      } // Define a valid user-agent (Fix 503 error)
    });

    const $ = cheerio.load(response.data); // Use Cheerio to load the HTML content

    const products = []; // Create an empty list that will be used to store the obtained products

    $('.s-result-item[data-asin]').each((index, element) => {
      const title = $(element).find('.a-size-base-plus.a-color-base.a-text-normal').text().trim(); // Find the product title
      if (title !== '') { // Check that the title is not empty
        const ratingElement = $(element).find('.a-icon-star-small .a-icon-alt'); // Find the product rating element by the classname
         // Check if there is an element with class ratingElement. If it does not exist, it sets rating to 'Not yet rated'. This deals with the lack of product review on the page.
        const rating = ratingElement.length > 0 ? ratingElement.text() : 'Not yet rated';
        const numReviewsElement = $(element).find('.a-size-base.s-underline-text');
        let numReviews = numReviewsElement.text();
        numReviews = numReviews.split('').filter(char => !isNaN(parseInt(char))).join(''); // Remove all non-numeric characters (Clear the data)
        if (numReviews === '') { // Check if the number of reviews returns an empty string, this means no product reviews have been done
            numReviews = 'Not yet reviewed';
        }
        const imageUrl = $(element).find('.s-image').attr('src'); // Find the product image url by the classname and atribute

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

module.exports = scrapeAmazon; // Export 'scrapeAmazon' function to the router
