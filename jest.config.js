module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  // globalSetup: "<rootDir>/tests/globalSetup.ts",
  globalTeardown: "./tests/helpers/globalTeardown.ts",
}
