import {generateSummaryReport} from 'k6-html-reporter';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..', '..');

const options = {
        jsonFile: path.join(projectRoot, 'reports', 'results.json'),
        output: path.join(projectRoot, 'reports', 'results_html.html'),
    };

generateSummaryReport(options);