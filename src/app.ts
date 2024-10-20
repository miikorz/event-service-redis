import express from 'express';
import bodyParser from 'body-parser';
import eventRoutes from './api/routes/eventRoutes';
import { middleware as openApiMiddleware } from 'express-openapi-validator';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { SERVER_STATUS } from './api/apiConstants';

const app = express();

app.use(bodyParser.json());

// Load OpenAPI specification
const openapiSpec = YAML.load(path.join(__dirname, './api/openapi.yaml'));

// Serve Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

// OpenAPI Validator Middleware
app.use(
  openApiMiddleware({
    apiSpec: path.join(__dirname, './api/openapi.yaml'),
    validateRequests: true,
    validateResponses: true,
  })
);

// Routes
app.use('/', eventRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      code: SERVER_STATUS.INTERNAL_SERVER_ERROR,
    },
    data: null
  });
});

export default app;
