import http from 'k6/http';
import { sleep, check } from 'k6';
import { Options } from 'k6/options';
// @ts-ignore
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
// @ts-ignore
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options: Options = {
  stages: [
    { duration: '2m', target: 50 },   // Normal load
    { duration: '1m', target: 50 },   // Introduce chaos (high error rate expected)
    { duration: '2m', target: 50 },   // Observe recovery
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // General response time
    'http_req_failed': ['rate<0.10'],    // Allow up to 10% errors during chaos and recovery
    'checks': ['rate>0.90'],
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
    'reports/chaos_test_results.json': JSON.stringify(data), // JSON results
    'reports/chaos_test_report.html': htmlReport(data), // HTML report
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };
}