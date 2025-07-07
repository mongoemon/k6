import http from 'k6/http';
import { sleep, check } from 'k6';
// @ts-ignore
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
// @ts-ignore
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Low traffic: 10 VUs for 30 seconds
    { duration: '1m', target: 50 },  // Medium traffic: ramp up to 50 VUs for 1 minute
    { duration: '30s', target: 10 }, // High traffic: ramp up to 100 VUs for 30 seconds
    { duration: '1m', target: 0 },   // Ramp down to 0 VUs for 1 minute
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% of requests should be below 500ms
    'http_req_failed': ['rate<0.01'],    // http errors should be less than 1%
  },
};

export default function () {
  const res = http.get('https://test.k6.io');
  check(res, {
    'is status 200': (r) => r.status === 200,
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
