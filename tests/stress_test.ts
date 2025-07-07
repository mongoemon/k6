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
    { duration: '5m', target: 200 },  // Ramp up to 200 VUs (stress)
    { duration: '2m', target: 300 },  // Ramp up to 300 VUs (beyond capacity)
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<1000'], // Allow higher response times during stress
    'http_req_failed': ['rate<0.10'],    // Allow up to 10% errors during stress
    'checks': ['rate>0.80'],             // Allow up to 20% check failures during stress
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
    'reports/stress_test_results.json': JSON.stringify(data), // JSON results for stress test
    'reports/stress_test_report.html': htmlReport(data), // HTML report for stress test
    'stdout': textSummary(data, { indent: ' ', enableColors: true }), // Show the text summary to stdout
  };
}