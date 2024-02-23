document.getElementById('searchForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  const keyword = document.getElementById('keyword').value; // Obtenha a palavra-chave do input

  try {
    const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    const data = await response.json(); // Obtenha os dados da resposta como JSON
    
    // Exiba os resultados na página
    displayResults(data);
  } catch (error) {
    console.error('Error scraping Amazon:', error);
    // Se ocorrer um erro, exiba uma mensagem de erro na página
    document.getElementById('results').innerHTML = 'Failed to scrape Amazon. Please try again later.';
  }
});

function displayResults(data) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ''; // Limpa os resultados anteriores
  
  if (data.length === 0) {
    resultsContainer.innerHTML = 'No results found';
    return;
  }
  
  data.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('product');
    
    const img = document.createElement('img');
    img.src = product.imageUrl;
    
    const title = document.createElement('h2');
    title.textContent = product.title;
    
    const rating = document.createElement('p');
    rating.textContent = `Rating: ${product.rating}`;
    
    const numReviews = document.createElement('p');
    numReviews.textContent = `Number of Reviews: ${product.numReviews}`;
    
    productElement.appendChild(img);
    productElement.appendChild(title);
    productElement.appendChild(rating);
    productElement.appendChild(numReviews);
    
    resultsContainer.appendChild(productElement);
  });
}
