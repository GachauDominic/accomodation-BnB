"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: "ts-jest",
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.test.json"
        }
    },
    testEnvironment: "node",
    verbose: true,
    //   collectCoverage: true,
    //   coverageDirectory: 'coverage',
    //   collectCoverageFrom: [`<rootDir>/src/**/*.ts`]
    testTimeout: 30000,
};
exports.default = config;
//# sourceMappingURL=jest.config.js.map