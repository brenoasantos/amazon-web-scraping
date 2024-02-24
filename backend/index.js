const express = require('express');
const configureCors = require('./middlewares/cors'); // Importe a função de configuração do CORS
const scrapeAmazon = require('./scrape'); // Importe a função scrapeAmazon

const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS configuration middleware
app.use(configureCors());

// Define the route that will be accessed by the frontend
app.get('/api/scrape', async (req, res) => {
  const keyword = req.query.keyword; // Get the search keyword from the query parameter
  try {
    // Call the scrapeAmazon function with the keyword and wait for the results
    const products = await scrapeAmazon(keyword);
    // Send results back to the frontend as JSON response
    res.json(products);
  } catch (error) {
    // If an error occurs, send an error response with status 500
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => { // Starts the server on the defined port (3000)
  console.log(`Server is running on port ${PORT}`); // Notifies in the console that the server has been started
}); 
