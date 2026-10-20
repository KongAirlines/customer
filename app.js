const express = require('express');
const YAML = require('yamljs');
const path = require('path');
const openapiValidator = require('express-openapi-validator');

const demoAccount = require('./demoAccount');
const app = express();
app.use(express.json());

// Operational health is intentionally available to the runtime platform,
// but it is not part of the client-facing OpenAPI contract or Gateway routes.
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'OK' });
});

// Load your OpenAPI spec file
const openApiSpecPath = path.join(__dirname, 'openapi.yaml');
const openApiDocument = YAML.load(openApiSpecPath);

app.use(
  openapiValidator.middleware({
    apiSpec: openApiDocument,
    validateRequests: true, // (default)
    validateResponses: true, // false by default
    // ACE authorizes the Portal application; Gateway overwrites the account header.
    validateSecurity: false,
  }),
);

app.use((req, res, next) => {

  if (req.path === '/health') {
    return next();
  }

  const account = demoAccount(req.headers['x-kongair-account-id']);
  if (!account) return res.status(401).end();
  req.account = account;
  next();
});

// Every application sees a fictional customer belonging only to its demo account.
app.get('/customer', (req, res) => {
  const { id, username } = req.account;
  res.json({
    id,
    username,
    name: 'KongAir Demo Passenger',
    information: {
      address: '1 Example Avenue',
      phone_number: '555-0100',
      email: `${username}@example.com`,
      frequent_flier_number: username,
      payment_methods: [],
    },
  });
});

// Error handler
app.use((err, req, res, next) => {
  // If it's the health check path, provide a clear response
  if (req.path === '/health') {
    return res.status(503).json({ status: 'unhealthy' });
  }

  // format error for other paths
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

module.exports = app;
