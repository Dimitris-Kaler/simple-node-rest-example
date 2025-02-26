# simple-node-rest-example
This project is a simple RESTful API built using only Node.js’s built-in modules (without any external frameworks like Express). It demonstrates the basics of creating an HTTP server, handling different types of HTTP requests (GET and POST), and managing URL path parameters, query strings, and JSON request bodies.

## Project Overview
SimpleNodeRESTExample is a basic project that illustrates how to build a RESTful API using only the core modules of Node.js. The project includes endpoints that:

- Return a welcome message on the root path.
- Handle path parameters (e.g., /greet/John).
- Process query parameters (e.g., /greeting?name=John&age=30).
- Accept JSON in the request body (via a POST request to /greet).
This example is ideal for beginners who want to understand how to create a server and manage HTTP requests without relying on external libraries.


## Project Setup and Creation
Follow these steps to create the project from scratch:

### 1. Initialize the Project:

- Open your terminal and create a new project folder.
- Navigate to the folder and run:
```
npm init
```

This command creates a package.json file. Accept the default values or customize them as needed.

### 2. Install Dependencies:

- For this project, you only need <b>nodemon</b> (for development) to auto-restart your server when file changes occur:
```
npm install nodemon --save-dev
```
This installs nodemon as a development dependency.


### 3. Project Files:

- Create your server file (e.g., server.js).
- Write your server code (provided in the next section) to define routes and handle HTTP requests using Node.js’s built-in modules.

### 4. Add Scripts to package.json:

- Modify the scripts section to add commands for starting your application:
```
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```
- <b>start:</b> Runs the application using Node.js.
- <b>dev:</b> Runs the application using nodemon, which automatically restarts the server during development.


## Installation and Running the Application


### How to Download and Set Up

#### 1. Clone or Download the Repository:

- Clone the repository (if hosted on GitHub) using:
```
git clone https://github.com/yourusername/simple-node-rest-example.git
```

- Or download the ZIP file and extract it to your local machine.


#### 2.Install Dependencies:

- Navigate to the project folder and install the required packages by running:
```
npm install
```
This command installs the necessary dependencies as specified in `package.json`.


### How to Run the Application
- Development Mode:

    - Start the server with automatic restarts by running:
    ```
    npm run dev
    ```
    - This uses nodemon to watch for file changes and restart the server automatically.

- Production Mode:

    - To run the application normally without automatic restarts, execute:
    ```
    npm start
    ```
    - The server will start on the specified port (2005) and will be accessible at http://localhost:2005.



## Package Configuration (package.json)
Your `package.json` file outlines the project’s metadata, dependencies, and scripts. Here’s an example:

```
{
  "name": "server",
  "version": "1.0.0",
  "description": "A RESTful API using only Node.js built-in modules",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "nodemon": "^3.1.9"
  }
}
```
### Key Sections
- name, version, description, author, license: Basic project information.
- <b>scripts:</b>
    - <b>test:</b> A placeholder command for running tests.
    - <b>start:</b> Command to run the server using Node.js.
    - <b>dev:</b> Command to run the server with nodemon for development.
- <b>dependencies:</b>
    - <b>nodemon:</b> A development tool to automatically restart the server when file changes are detected.


## Server Code Explanation (server.js)
Below is the complete code for the Node-only RESTful API, along with explanations for each section:

```
const http = require('http');
const url = require('url');

const PORT = 2005;

const server = http.createServer((req, res) => {

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Set the response header to JSON format
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
```

### Detailed Code Breakdown

#### 1. Importing Modules
```
const http = require('http');
const url = require('url');
```

- Explanation:
    - The http module is used the HTTP Server.
    - The url module helps parse the URL, making it easier to extract the pathname and query parameters


#### 2. Setting the Port    
```
const PORT = 2005;

```
- Explanation:
    - Defines the port on which the server will listen for incoming requests.


#### 3. Creating the Server
```
const server = http.createServer((req, res) => { ... });
```

- Explanation:
    - Creates an HTTP server that listens for requests and sends responses.

#### 4.  Parsing the URL
```
const parsedUrl = url.parse(req.url, true);
const pathname = parsedUrl.pathname;
const query = parsedUrl.query;
```
- Explanation:
    - Parses the incoming request URL.
    - Separates the pathname (e.g., /greet/John) and query parameters (e.g., ?name=John&age=30).
##### 5. Setting the Response Header
```
res.setHeader('Content-Type', 'application/json');
```
- Explanation:
    - Ensures that all responses are sent in JSON format.  

#### 6. Handling Endpoints

- <b>Root Endpoint </b>(GET /):

```
if (req.method === 'GET' && pathname === '/') {
  res.writeHead(200);
  res.end(JSON.stringify({ msg: "Hello World!!!" }));
}
```

- <b>Explanation:</b>
     - Responds with a JSON message when the root URL is requested via GET.

- <b>Path Parameter Endpoint</b> (GET /greet/:name):

```
else if (req.method === 'GET' && pathname.startsWith('/greet/')) {
  const parts = pathname.split('/');
  if (parts.length === 3 && parts[2]) {
    const name = decodeURIComponent(parts[2]);
    res.writeHead(200);
    res.end(JSON.stringify({ msg: `Hello ${name}!` }));
  } else {
    res.writeHead(400);
    res.end(JSON.stringify({ error: "Name parameter missing" }));
  }
}
```
- <b>Explanation:</b>
    - Extracts the name from the URL and responds with a personalized greeting.
    - Validates that the name parameter is provided; otherwise, returns an error.

- <b>Query Parameter Endpoint</b> (GET /greeting):

```
else if (req.method === 'GET' && pathname === '/greeting') {
  const { name, age } = query;
  if (name && age) {
    res.writeHead(200);
    res.end(JSON.stringify({ msg: `Hello my name is ${name} and im ${age} years old.` }));
  } else {
    res.writeHead(400);
    res.end(JSON.stringify({ error: "Name or age query parameter missing" }));
  }
}
```
- <b>Explanation:</b>
    - Retrieves the name and age from the query string and responds with a message.
    - Validates that both query parameters are provided.
- <b>POST Endpoint with JSON Body</b> (POST /greet):

```
else if (req.method === 'POST' && pathname === '/greet') {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
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
}

```
- <b>Explanation:</b>
    - Collects data from the request body, parses it as JSON, and responds based on the provided name and age.
    - Includes error handling for invalid JSON or missing parameters.
- <b>Fallback for Undefined Routes:</b>

```
else {
  res.writeHead(404);
  res.end(JSON.stringify({ error: "Route not found" }));
}
```
- Explanation:
    - Returns a 404 error if the request does not match any defined endpoint.

#### 7. Starting the Server
```
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```
- <b>Explanation:</b>
    - The server listens on the specified port.
    - Logs a message to the console indicating that the server is running.


## Summary
This documentation provides a comprehensive walkthrough of the `simple-node-rest-example` project:

- <b>Project Overview:</b> Introduces the RESTful API built using only Node.js core modules.

- <b>Project Setup and Creation:</b> Outlines how to initialize the project with npm init, install nodemon, and set up the project structure.

- <b>Installation and Running the Application:</b> Explains how to clone/download the repository, install dependencies with npm install, and run the server in both development and production modes.

- <b>Package Configuration:</b> Details the contents of the package.json file, including scripts and dependencies.

- <b>Server Code Explanation:</b> Breaks down each part of the server.js file, explaining how the HTTP server is created and how different endpoints are handled.

- <b>Detailed Code Breakdown:</b> Provides in-depth explanations of the code segments to help beginners understand the logic behind each endpoint and middleware operation.

This guide is intended to help beginners understand how to build and manage a Node.js project without any external frameworks. Happy coding!