"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var k6_html_reporter_1 = require("k6-html-reporter");
var path_1 = require("path");
var projectRoot = path_1.default.resolve(__dirname, '..');
var options = {
    jsonFile: path_1.default.join(projectRoot, 'reports', 'results.json'),
    output: path_1.default.join(projectRoot, 'reports', 'results_html.html'),
};
(0, k6_html_reporter_1.generateSummaryReport)(options);
