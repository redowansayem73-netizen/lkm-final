const fetch = require('node-fetch');

async function login() {
  const data = new URLSearchParams();
  data.append('email', 'admin@lakembamobileking.com.au');
  data.append('password', 'Admin123!');
  data.append('redirect', 'false');

  try {
    const res = await fetch('http://localhost:3002/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data
    });
    
    const text = await res.text();
    console.log("STATUS:", res.status);
    console.log("BODY:", text);
  } catch(e) {
    console.log("FETCH ERROR:", e);
  }
}

login();
