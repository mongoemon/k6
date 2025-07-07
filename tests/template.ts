import http from 'k6/http';
import { sleep, check } from 'k6';
import { Options } from 'k6/options';
// @ts-ignore
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
// @ts-ignore
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options: Options = {
  vus: 1,
  duration: '10s',
};

export default function () {
  const res = http.get('https://test.k6.io');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}

export function handleSummary(data: any) {
  return {
    'reports/results.json': JSON.stringify(data), //the default data object
    'reports/results_html.html': htmlReport(data), // HTML report
    'stdout': textSummary(data, { indent: ' ', enableColors: true }), // Show the text summary to stdout for convenience
  };
}