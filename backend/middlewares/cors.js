const cors = require('cors');

// Middleware to configure CORS
const configureCors = () => {
  return cors();
};

module.exports = configureCors;
