import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Options } from 'k6/options';
// @ts-ignore
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
// @ts-ignore
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const options: Options = {
  stages: [
    { duration: '10s', target: 5 },   // Warm-up: 5 VUs for 10 seconds
    { duration: '30s', target: 20 },  // Load test: 20 VUs for 30 seconds
    { duration: '10s', target: 0 },   // Cool-down: ramp down to 0 VUs for 10 seconds
  ],
  thresholds: {
    'http_req_duration': ['p(95)<200'], // 95% of requests should be below 200ms
    'http_req_failed': ['rate<0.01'],    // http errors should be less than 1%
    'checks': ['rate>0.99'],             // 99% of checks should pass
  },
};

export default function () {
  group('Posts API', () => {
    // GET all posts
    group('GET /posts', () => {
      const res = http.get(`${BASE_URL}/posts`);
      check(res, {
        'status is 200': (r) => r.status === 200,
        'response body is array': (r) => Array.isArray((r.json() as any)),
        'response contains at least 100 posts': (r) => (r.json() as any).length >= 100,
      });
      sleep(1);
    });

    // GET a single post
    group('GET /posts/{id}', () => {
      const postId = Math.floor(Math.random() * 100) + 1; // Random post ID between 1 and 100
      const res = http.get(`${BASE_URL}/posts/${postId}`);
      check(res, {
        'status is 200': (r) => r.status === 200,
        'response body has id': (r) => (r.json() as any).hasOwnProperty('id'),
        'response id matches request id': (r) => (r.json() as any).id === postId,
      });
      sleep(1);
    });

    // POST a new post
    group('POST /posts', () => {
      const payload = JSON.stringify({
        title: 'foo',
        body: 'bar',
        userId: 1,
      });
      const params = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const res = http.post(`${BASE_URL}/posts`, payload, params);
      check(res, {
        'status is 201': (r) => r.status === 201,
        'response body has id': (r) => (r.json() as any).hasOwnProperty('id'),
        'response title is foo': (r) => (r.json() as any).title === 'foo',
      });
      sleep(1);
    });

    // PUT (update) a post
    group('PUT /posts/{id}', () => {
      const postId = 1; // Update a specific post
      const payload = JSON.stringify({
        id: postId,
        title: 'foo updated',
        body: 'bar updated',
        userId: 1,
      });
      const params = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const res = http.put(`${BASE_URL}/posts/${postId}`, payload, params);
      check(res, {
        'status is 200': (r) => r.status === 200,
        'response title is foo updated': (r) => (r.json() as any).title === 'foo updated',
      });
      sleep(1);
    });

    // DELETE a post
    group('DELETE /posts/{id}', () => {
      const postId = 1; // Delete a specific post
      const res = http.del(`${BASE_URL}/posts/${postId}`);
      check(res, {
        'status is 200': (r) => r.status === 200,
      });
      sleep(1);
    });
  });
}

export function handleSummary(data: any) {
  return {
    'reports/results.json': JSON.stringify(data), //the default data object
    'reports/results_html.html': htmlReport(data), // HTML report
    'stdout': textSummary(data, { indent: ' ', enableColors: true }), // Show the text summary to stdout for convenience
  };
}