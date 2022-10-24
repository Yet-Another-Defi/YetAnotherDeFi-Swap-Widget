const remixNode = require('@remix-run/node');

remixNode.installGlobals();
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleDirectories: ['node_modules'],
  roots: ['<rootDir>/app'],
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/app/$1',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@remix-run/web-fetch|@remix-run/web-blob|@remix-run/web-stream|@remix-run/web-form-data|@remix-run/web-file)/)',
  ],
};
