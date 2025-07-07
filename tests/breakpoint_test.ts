import http from 'k6/http';
import { sleep, check } from 'k6';
import { Options } from 'k6/options';
// @ts-ignore
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
// @ts-ignore
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options: Options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 VUs
    { duration: '2m', target: 200 },  // Ramp up to 200 VUs
    { duration: '2m', target: 300 },  // Ramp up to 300 VUs
    { duration: '2m', target: 400 },  // Ramp up to 400 VUs
    { duration: '2m', target: 500 },  // Ramp up to 500 VUs (and beyond capacity)
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // Expect this to break during the test
    'http_req_failed': ['rate<0.05'],    // Expect this to increase as system breaks
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
    'reports/breakpoint_test_results.json': JSON.stringify(data), // JSON results
    'reports/breakpoint_test_report.html': htmlReport(data), // HTML report
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };
}