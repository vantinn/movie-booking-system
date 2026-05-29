import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents() {
    },
    baseUrl: "http://localhost:3001",
    supportFile: false,
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});

