import {generateSummaryReport} from 'k6-html-reporter';

const options = {
        jsonFile: '../reports/results.json',
        output: '../reports/results_html.html',
    };

generateSummaryReport(options);