import type { Config } from 'jest';

const config: Config = {
  preset: "ts-jest",
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json'
    }
  },
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
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": ["babel-jest", { configFile: './babel-jest.config.js' }],
  },
  transformIgnorePatterns: [
    "/node_modules/",
  ],
  testEnvironment: "jsdom", // Use "node" if not testing in a browser-like environment
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], 
};

export default config;
