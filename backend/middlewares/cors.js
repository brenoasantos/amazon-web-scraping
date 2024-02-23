const cors = require('cors');

// Middleware para configurar o CORS
const configureCors = () => {
  return cors();
};

module.exports = configureCors;
