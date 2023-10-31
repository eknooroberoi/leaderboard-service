import swaggerJSDoc from 'swagger-jsdoc';

// Setup swagger
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Leaderboard Service API',
        version: '1.0.0',
        description: 'API for the Leaderboard Service',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec };
