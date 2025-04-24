// test.ts
import http from 'k6/http';
import { sleep } from 'k6';
import { Options } from 'k6/options';

export const options: Options = {
  vus: 10,
  duration: '10s',
};

export default function () {
  http.get('https://test.k6.io');
  sleep(1);
}
