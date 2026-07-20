import { Config } from 'jest'

const config: Config = {
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

testTimeout: 3000,

}
export default config