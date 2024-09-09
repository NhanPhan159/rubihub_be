const configs = {
  PORT: process.env.PORT || 3000,
  SWAGGER_API_SPEC: '/api-docs',
  STORAGE: {
    CONNECTION_STRING:
      process.env.STORAGE_CONNECTION_STRING || 'mongodb://localhost:27017',
  },
  SWAGGER_ENABLED: [true, 'true'].includes(
    process.env.SWAGGER_ENABLED || false,
  ),
};

export default configs;
