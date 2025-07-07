import http from 'k6/http';
import { sleep, check } from 'k6';
import { Options } from 'k6/options';
// @ts-ignore
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
// @ts-ignore
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options: Options = {
  stages: [
    { duration: '5m', target: 20 },   // Ramp up to 20 VUs over 5 minutes
    { duration: '4h', target: 20 },   // Stay at 20 VUs for 4 hours (endurance)
    { duration: '5m', target: 0 },   // Ramp down to 0 VUs over 5 minutes
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% of requests should be below 500ms
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
    'reports/endurance_test_results.json': JSON.stringify(data), // JSON results for endurance test
    'reports/endurance_test_report.html': htmlReport(data), // HTML report for endurance test
    'stdout': textSummary(data, { indent: ' ', enableColors: true }), // Show the text summary to stdout
  };
}