module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true, // Enable coverage reporting
    collectCoverageFrom: ['src/**/*.ts'], // Limit coverage analysis to files in the src folder
    // Only include .ts files in test runs
    testMatch: ['**/*.test.ts'],
    // Ignore build files, index.ts files and node_modules
    // Also ignore model(DTO/DAO) files
    coveragePathIgnorePatterns: ['/node_modules/', '/build/', '.*index\\.ts', '/src/models/', 'app.ts', 'swagger-config.ts'],
};