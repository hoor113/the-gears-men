import express from 'express';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';

// Import express

export function setupSwagger(app: express.Application) {
  // Sửa kiểu dữ liệu từ Express thành express.Application
  const storage = getMetadataArgsStorage();
  const spec = routingControllersToSpec(
    storage,
    {
      routePrefix: '/api',
    },
    {
      info: {
        title: 'API Documentation',
        description: 'This is the API documentation for the project',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  );

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));
  console.log('📖 Swagger documentation available at /api/docs');
}
