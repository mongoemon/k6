import {generateSummaryReport} from 'k6-html-reporter';

const options = {
        jsonFile: results.json,
        output: results_html.html,
    };

generateSummaryReport(options);