document.getElementById('searchForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevents standard submission of the form

  const keywordInput = document.getElementById('keyword');
  const keyword = keywordInput.value.trim(); // Get keyword from input and remove unnecessary whitespace

  if (!keyword) {
    // If the keyword is empty, display an error message and return
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clears previous results
    
    const noKeywordMessage = document.createElement('p'); // Creates a paragraph element '<p>'
    noKeywordMessage.textContent = 'Please enter a search keyword.'; // Creates a paragraph element '<p>'
    resultsContainer.appendChild(noKeywordMessage); // Adds this element to be rendered in the user interface
    
    return;
  }

  try { // Makes an HTTP request to the specified URL, passing the keyword as a query parameter, waits for the request response and stores in the variable the information obtained
    const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    const data = await response.json(); // Get response data in JSON format
    
    displayResults(data, keyword); // Display results on the page

    const keywordMessage = document.getElementById('keywordMessage'); // If there are results, remove the message 'Please enter a search keyword.'
    if (keywordMessage) {
      keywordMessage.remove(); 
    }
  } catch (error) {
    console.error('Error scraping Amazon:', error); // If an error occurs, display an error message in the console
    document.getElementById('results').innerHTML = 'Failed to scrape Amazon. Please try again later.'; // If an error occurs, display an error message on the page
  }
});

function displayResults(data, keyword) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ''; // Clear previous results
  
   // Check if there are results and then render the paragraph that indicates the results
  if (data.length !== 0) {
    const resultsParagraph = document.createElement('h3');
    resultsParagraph.textContent = 'Scraping results:';
    resultsContainer.appendChild(resultsParagraph);

    const splitBar = document.createElement('hr');
    resultsContainer.appendChild(splitBar)
  }
  
   // If there are no results, display a message indicating so
  if (data.length === 0) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = `No results found for "${keyword}"`;
    resultsContainer.appendChild(noResultsMessage);
    
    return;
  }
  
  // Iterates over the data and creates elements for each product
  data.forEach(product => {
    const productElement = document.createElement('div'); // Create the div that encompasses the product as a whole
    productElement.classList.add('product');
    
    const img = document.createElement('img');
    img.src = product.imageUrl;
    productElement.appendChild(img);
    
    const details = document.createElement('div'); // Create the div that encompasses the product details
    details.classList.add('product-details');
    
    const title = document.createElement('h3');
    title.textContent = product.title;
    details.appendChild(title);
    
    const rating = document.createElement('p');
    // Replace words and punctuation to conform to English language writing standards
    rating.textContent = `Rating: ${product.rating.replace('de', 'of').replace('estrelas', 'stars').replace(',','.')}`;
    details.appendChild(rating);
    
    const numReviews = document.createElement('p');
    let formattedReviews = product.numReviews;
    if (!isNaN(parseInt(product.numReviews))) { // Check whether it is a valid number and, if so, format it to conform to English language writing standards
      formattedReviews = Number(product.numReviews).toLocaleString('en', {minimumFractionDigits: 0});
    }
    numReviews.textContent = `Reviews: ${formattedReviews}`;
    details.appendChild(numReviews);
    
    const imgURLTopic = document.createElement('p');
    imgURLTopic.textContent = 'Image URL:';
    details.appendChild(imgURLTopic);
    
    const imgURLLink = document.createElement('a');
    imgURLLink.href = product.imageUrl; // Make the link clickable
    imgURLLink.textContent = product.imageUrl;
    imgURLLink.target = "_blank"; // When clicking on the link, another tab is created to access the content (so the user doesn't lose the baseline of what they were doing)
    details.appendChild(imgURLLink);
    
    productElement.appendChild(details);
    
    resultsContainer.appendChild(productElement);
  });
}
