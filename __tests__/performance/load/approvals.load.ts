import http from 'k6/http'
import { check, sleep } from 'k6'

const BASE_URL = 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],

  ext: {
    loadimpact: {
      name: 'approvals GET load test'
    }
  }
  
}

// Setup function runs once before the test
export function setup() {
  // Login to get authentication token
  // Using k6's __ENV to access environment variables or fallback to seeded test credentials
  const email = __ENV.MOCK_EMAIL || 'dommaina@example.com';
  const pass = __ENV.MOCK_PASS || 'password123';

  const loginPayload = JSON.stringify({
    hostEmail: email,
    hostPasswordHash: pass
  });

  const loginRes = http.post(`${BASE_URL}/auth/loginhost`, loginPayload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log(`Login response status: ${loginRes.status}`);

  if (loginRes.status !== 200) {
    console.error(`Login failed with status ${loginRes.status}: ${loginRes.body}`);
    throw new Error('Authentication failed during setup');
  }

  // Extract and return token
  try {
    const loginBody = JSON.parse(loginRes.body as string);
    if (!loginBody.token) {
      throw new Error('No token in login response');
    }
    return { token: loginBody.token };
  } catch (error: any) {
    console.error('Failed to parse login response:', error.message);
    throw new Error('Authentication setup failed');
  }
}

export default function (setupData: any) {
  // Access the token from setup data
  const token = setupData?.token;

  if (!token) {
    console.error('No token available from setup');
    check(false, { 'has valid token': false });
    return;
  }

  const res = http.get(`${BASE_URL}/auth/approvals`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'is JSON': (r) => {
      try {
        JSON.parse(r.body as string);
        return true;
      } catch {
        return false;
      }
    },
    'has data array': (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return Array.isArray(body.data);
      } catch {
        return false; 
      }
    },
  });

  sleep(2);
  
}
