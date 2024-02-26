const cors = require('cors'); // Import CORS module

// Middleware to configure CORS
const configureCors = () => {
  return cors();
};

module.exports = configureCors; // Exports the 'configureCors' function, so that it can be used in other files (will be used in index.js)
