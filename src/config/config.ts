export const env = {
    API_URI_PREFIX: '/api',
    JWT_SECRET: 'e18a33b0-9866-4867-800a-d6ffcd8f1cbd',
    TOKEN_LIFETIME: 1,
    MONGODB_CONNECTION: 'mongodb://localhost/prescription-validator-api',
    JWT_TEST_TOKEN: 'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjZmZiYTYzNjliZWYxNGM2MmU4YzNiZSIsImFwcCI6eyJpZCI6IjVjZmY5MzBlNWNkNjYxYjUwM2ZlOTJmOCIsIm5vbWJyZSI6Im1zRmFjdHVyYWNpb24ifSwib3JnYW5pemFjaW9uIjp7ImlkIjoiNTdlOTY3MGU1MmRmMzExMDU5YmM4OTY0Iiwibm9tYnJlIjoibXNGYWN0dXJhY2lvbiJ9LCJwZXJtaXNvcyI6WyJ0dXJub3M6KiIsIm1waToqIiwicnVwOnRpcG9QcmVzdGFjaW9uOjU5ZWUyZDliZjAwYzQxNTI0NmZkM2Q2YSIsInJ1cDp0aXBvUHJlc3RhY2lvbjo1OWVlMmQ5YmYwMGM0MTUyNDZmZDNkNjUiLCJydXA6dGlwb1ByZXN0YWNpb246NTllZTJkOWJmMDBjNDE1MjQ2ZmQzZDc3IiwicnVwOnRpcG9QcmVzdGFjaW9uOjU5NTEwNTFhYTc4NGY0ZTFhOGUyYWZlMSIsInJ1cDp0aXBvUHJlc3RhY2lvbjo1OThjYTgzNzVhZGM2OGUyYTBjMTIxODkiLCJydXA6dGlwb1ByZXN0YWNpb246NTdmNTA2OWQ2OWZlNzlhNTk4MGIwNzJmIiwicnVwOnRpcG9QcmVzdGFjaW9uOjU5OGNhODM3NWFkYzY4ZTJhMGMxMjFjYyIsInJ1cDp0aXBvUHJlc3RhY2lvbjo1YTcxYTliMzlmZDc1YmI1OGQ2NWE4M2MiLCJydXA6dGlwb1ByZXN0YWNpb246NWE5NmU4NzIxM2MyOGQ1MDEyOTJhOWViIiwibG9nOioiLCJ1c3VhcmlvczoqIiwibWF0cmljdWxhY2lvbmVzOioiLCJ0dXJub3NQcmVzdGFjaW9uZXM6KiJdLCJhY2NvdW50X2lkIjpudWxsLCJ0eXBlIjoiYXBwLXRva2VuIiwiaWF0IjoxNTYwMjYzMjY3fQ.cfa_b49450fKe4IwvNBKkCW9eGx3JXBKg8Mv54ONgxQ',
    ANDES_TEST_ENDPOINT: 'https://test.andes.gob.ar/api/core/mpi/pacientes/search'
};

export const httpCodes = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    EXPIRED_TOKEN: 406,
    EXPECTATION_FAILED: 417,
  };
