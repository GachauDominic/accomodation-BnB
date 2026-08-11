import http from 'k6/http';
import {check, sleep} from 'k6';

export const options= {
  vus: 1,
  iterations: 1,
  durations: '15s'
}

export default function () {
  const port = '3000'
  const url = `http://localhost:${port}/auth/loginhost`
  const payload = JSON.stringify({
    hostEmail: 'dommaina@example.com',
    hostPasswordHash: 'dompassword123'
  })

  const params = {
    headers: {
      'Content-Type': 'application/json',
    }
  }
  
  const res = http.post(url, payload, params)

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has token': (r) => { 
      try {
        const body =  JSON.parse(r.body as string)
        return typeof body.token === 'string'
      } catch (error) {
        return false
      }
    }
  });

  sleep(1);
}

// import http from 'k6/http';
// import { check, sleep } from 'k6';

// export const options = {
//   vus: 3, // Key for Smoke test. Keep it at 2, 3, max 5 VUs
//   duration: '1m', // This can be shorter or just a few iterations
// };

// export default () => {
//   const urlRes = http.get('https://quickpizza.grafana.com');
//   check(urlRes, { 'status returned 200': (r) => r.status == 200 })
//   sleep(1);
//   // MORE STEPS
//   // Here you can have more steps or complex script
//   // Step1
//   // Step2
//   // etc.
// };