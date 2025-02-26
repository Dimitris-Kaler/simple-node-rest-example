const http = require('http');
const url = require('url');

const PORT = 2005;

const server = http.createServer((req, res) => {

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;


  res.setHeader('Content-Type', 'application/json');

  // Root endpoint: GET "/"
  if (req.method === 'GET' && pathname === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({ msg: "Hello World!!!" }));

  // Endpoint with path parameter: GET "/greet/:name"
  } else if (req.method === 'GET' && pathname.startsWith('/greet/')) {
    
    // Split the path into parts to extract the 'name' parameter.
    const parts = pathname.split('/');
    if (parts.length === 3 && parts[2]) {
      const name = decodeURIComponent(parts[2]);
      res.writeHead(200);
      res.end(JSON.stringify({ msg: `Hello ${name}!` }));
    } else {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "Name parameter missing" }));
    }

  // Endpoint with query parameters: GET "/greeting?name=John&age=30"
  } else if (req.method === 'GET' && pathname === '/greeting') {
    const { name, age } = query;
    if (name && age) {
      res.writeHead(200);
      res.end(JSON.stringify({ msg: `Hello my name is ${name} and im ${age} years old.` }));
    } else {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "Name or age query parameter missing" }));
    }

  // Endpoint with body parameters: POST "/greet"
  } else if (req.method === 'POST' && pathname === '/greet') {
    let body = '';
    // Collect data chunks from the request body.
    req.on('data', chunk => {
      body += chunk.toString();
    });
    // Once all data is received, parse the JSON.
    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(body);
        const { name, age } = parsedBody;
        if (name && age) {
          res.writeHead(200);
          res.end(JSON.stringify({ msg: `Hello my name is ${name} and im ${age} years old.` }));
        } else {
          res.writeHead(400);
          res.end(JSON.stringify({ error: "Name or age missing in request body" }));
        }
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Invalid JSON in request body" }));
      }
    });

  // Handle any undefined routes with a 404 response.
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

