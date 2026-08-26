"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cypress_1 = require("cypress");
exports.default = (0, cypress_1.defineConfig)({
    allowCypressEnv: false,
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
//# sourceMappingURL=cypress.config.js.map