module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverageFrom: ['src/**'],
    roots: ['./src'],
    silent: false,
    verbose: true,
    coverageReporters: ['text'],
    coverageThreshold: {
        global: {
            lines: 85
        }
    }
};