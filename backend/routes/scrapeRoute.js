const express = require('express');
const scrapeAmazon = require('../scrape.js'); // Importe a função de raspagem

const router = express.Router();

router.get('/scrape', async (req, res, next) => {
  const keyword = req.query.keyword;
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword parameter is required' });
  }

  try {
    const products = await scrapeAmazon(keyword); // Use a função de raspagem
    res.json(products);
  } catch (error) {
    next(error);
  }
});

module.exports = router;