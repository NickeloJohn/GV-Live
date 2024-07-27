const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'node-express-unleash API documentation',
    version,
    license: {
      name: 'MIT'
    },
  },
  servers: [
    {
        url: config.baseUrl,
    },
    {
        url: 'https://8b07ffb8-8e03-44f2-b6de-82535c7c784c.mock.pstmn.io'
    }
  ],
  schemes: [
    "https",
    "http"
  ],
  components: {
    securitySchemes: {
        bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: 'JWT'
        }
      }
  },
  security: [
    {
        bearerAuth: []
    }
  ]
};

module.exports = swaggerDef;