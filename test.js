import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10, // virtual users
  duration: '30s', // test duration
};

export default function () {
  http.get('https://test.k6.io');
  sleep(1); // wait 1 second between requests
}
