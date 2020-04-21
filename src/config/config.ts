export const env = {
    API_URI_PREFIX: '/api',
    JWT_SECRET: 'e18a33b0-9866-4867-800a-d6ffcd8f1cbd',
    TOKEN_LIFETIME: 1,
    MONGODB_CONNECTION: 'mongodb://localhost/prescription-validator-api'
};

export const httpCodes = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    EXPIRED_TOKEN: 406,
    EXPECTATION_FAILED: 417,
  };
