import type { Config } from 'jest';

const config: Config = {
  preset: "ts-jest",
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleDirectories: [
    "node_modules",
    __dirname,
  ],
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node"
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",  // Using ts-jest for TypeScript files
    "^.+\\.(js|jsx)$": ["babel-jest", { configFile: './babel-jest.config.js' }],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@mantine|@tabler|@hello-pangea)/)" // Transforming specific packages if needed
  ],
  testEnvironment: "jsdom", // Use "node" if not testing in a browser-like environment
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], 
};

export default config;
