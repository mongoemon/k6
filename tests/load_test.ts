import http from 'k6/http';
import { sleep, check } from 'k6';
import { Options } from 'k6/options';
// @ts-ignore
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
// @ts-ignore
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options: Options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp up to 50 VUs over 30 seconds
    { duration: '5m', target: 50 },   // Stay at 50 VUs for 5 minutes
    { duration: '30s', target: 0 },   // Ramp down to 0 VUs over 30 seconds
  ],
  thresholds: {
    'http_req_duration': ['p(95)<300'], // 95% of requests should be below 300ms
    'http_req_failed': ['rate<0.01'],    // http errors should be less than 1%
    'checks': ['rate>0.99'],             // 99% of checks should pass
  },
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
    'reports/load_test_results.json': JSON.stringify(data), // JSON results for load test
    'reports/load_test_report.html': htmlReport(data), // HTML report for load test
    'stdout': textSummary(data, { indent: ' ', enableColors: true }), // Show the text summary to stdout
  };
}