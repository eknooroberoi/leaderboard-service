module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true, // Enable coverage reporting
    collectCoverageFrom: ['src/**/*.ts'], // Limit coverage analysis to files in the src folder
};