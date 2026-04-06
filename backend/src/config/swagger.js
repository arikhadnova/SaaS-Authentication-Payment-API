const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SaaS Auth & Payment API',
      version: '1.0.0',
      description: 'API documentation for SaaS Authentication and Payment System',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://saas-authentication-payment-api-production.up.railway.app'
          : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' 
          ? 'Production server' 
          : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;