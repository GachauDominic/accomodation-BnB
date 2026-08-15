import http from 'k6/http'
import { check, sleep} from 'k6'

export const options = {
  vus: 1,
  iterations: 3,
  duration: '15s'
}

export default function () {
  const port = '3000'
  
  // Step 1: Login to get authentication token
  const loginUrl = `http://localhost:${port}/auth/loginhost`;
  const loginPayload = JSON.stringify({
    hostEmail: 'dommaina@example.com',
    hostPasswordHash: 'dompassword123'
  })
  
  const loginParams = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  
  const loginRes = http.post(loginUrl, loginPayload, loginParams)
  
  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login response has token': (r) => {
      try {
        const body = JSON.parse(r.body as string)
        return typeof body.token === 'string'
      } catch {
        return false
      }
    }
  });
  
  // Extract token from login response
  let token = '';
  try {
    const body = JSON.parse(loginRes.body as string)
    token = body.token
  } catch {
    // If login fails, the booking request will fail with 401
  }
  
  sleep(1)
  
  // Step 2: Create booking with authenticated token
  const bookingUrl = `http://localhost:${port}/auth/booking/create`;
  const bookingPayload = JSON.stringify({
    "bookingRoomNumber": "1A",
    "bookingGuestId": "9ce1e5ad-d3ab-4465-8e90-bbc67bcea8b7",
    "checkinDate": "2026-07-16",
    "checkoutDate": "2026-07-18",
    "guestCount": 1,
    "totalAmount": "4500.00",
    "bookingStatus": "assigned"
  })
  
  const bookingParams = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Add the authentication token
    }
  }

  const res = http.post(bookingUrl, bookingPayload, bookingParams)

  check(res, {
    'status is 201': (r)=> r.status === 201,
    'response has a message': (r)=> {
      try {
        const body = JSON.parse(r.body as string)
        return typeof body.message !== undefined;
      } catch {
        return false
      }
    }
  });

  sleep(2)
}