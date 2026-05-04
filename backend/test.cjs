const http = require('http');

const data = JSON.stringify({
  query: 'query { shop(input: "blue suit") { product } }'
});

const req = http.request('http://localhost:5000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let chunks = [];
  res.on('data', d => chunks.push(d));
  res.on('end', () => console.log('Response:', Buffer.concat(chunks).toString()));
});
req.on('error', e => console.error('Error:', e));
req.write(data);
req.end();
