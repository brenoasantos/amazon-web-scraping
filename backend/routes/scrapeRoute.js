const express = require('express'); // Import the Express module
const scrapeAmazon = require('../scrape.js'); // Import the scraping function

const router = express.Router();

router.get('/scrape', async (req, res, next) => { // Defines a GET route called '/scrape'
  const keyword = req.query.keyword; // Extracts the query parameter called 'keyword' from the request URL 
  if (!keyword) { // Verifies if the parameter is empty (if the user gave or not the keyword)
    return res.status(400).json({ error: 'Keyword parameter is required' }); // If the parameter is empty, the server will return the error
  }

  try {
    const products = await scrapeAmazon(keyword); // Calls the scrapeAmazon function and waits because the function will return a Promise
    res.json(products); // Sends the products to the client in JSON format
  } catch (error) { // If an error occurs, 'next(error)' is called to pass the error to the next middleware function
    next(error);
  }
});

module.exports = router; // Exports the 'router' object, so that it can be used in other files