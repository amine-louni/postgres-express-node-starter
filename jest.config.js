module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  coveragePathIgnorePatterns: [
    "node_modules",
    "dist",
    "src/_common",
    "src/app/index.ts",
  ],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
};
