import http from 'k6/http'
import { check, sleep } from 'k6'

const BASE_URL = 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '30s', target: 100},
    { duration: '40s', target: 500 },
    { duration: '10s', target: 0 },
  ],

  ext: {
    loadimpact: {
      name: 'bookings GET load test'
    }
  }
  
}

// Setup function runs once before the test
export function setup() {
  // Login to get authentication token
  const loginPayload = JSON.stringify({
    hostEmail: 'dommaina@example.com',
    hostPasswordHash: 'password123'
  });

  const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'has token': (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return body.token && body.token.length > 0;
      } catch (error) {
        return false;
      }
    },
  });

  // Extract and return token
  try {
    const loginBody = JSON.parse(loginRes.body as string);
    return { token: loginBody.token };
  } catch (error) {
    console.error('Failed to parse login response:', error);
    throw new Error('Authentication setup failed');
  }
}

export default function (data: any) {
  const token = data && data.token ? data.token : '';

  if (!token) {
    console.error('No authentication token available');
    return;
  }

  const res = http.get(`${BASE_URL}/auth/bookings`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'has data array': (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return Array.isArray(body.data);
      } catch (error) {
        return false; 
      }
    },
  });

  sleep(2);
  
}
