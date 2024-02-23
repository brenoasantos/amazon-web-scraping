const express = require('express');
const configureCors = require('./middlewares/cors'); // Importe a função de configuração do CORS
const scrapeAmazon = require('./scrape'); // Importe a função scrapeAmazon

const app = express();
const PORT = process.env.PORT || 3000;

// Use o middleware de configuração do CORS
app.use(configureCors());

// Defina uma rota que será acessada pelo frontend
app.get('/api/scrape', async (req, res) => {
  const keyword = req.query.keyword; // Obtenha a palavra-chave de pesquisa do parâmetro de consulta
  try {
    // Chame a função scrapeAmazon com a palavra-chave e aguarde os resultados
    const products = await scrapeAmazon(keyword);
    // Envie os resultados de volta para o frontend como resposta JSON
    res.json(products);
  } catch (error) {
    // Se ocorrer um erro, envie uma resposta de erro com o status 500
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
