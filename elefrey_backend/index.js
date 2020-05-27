const app = require('./app');
require('dotenv').config();

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`corriendo express` + `${process.env.IP_HOST || 'localhost'}:${process.env.PORT || '3701'}`);
});

server.setTimeout(12000000);