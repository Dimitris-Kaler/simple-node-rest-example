# simple-node-rest-example
This project is a simple RESTful API built using only Node.js’s built-in modules (without any external frameworks like Express). It demonstrates the basics of creating an HTTP server, handling different types of HTTP requests (GET and POST), and managing URL path parameters, query strings, and JSON request bodies.
The project includes tests for the server's endpoints, which allow you to verify if the routes behave as expected.

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
```bash
npm init
```

This command creates a `package.json` file. Accept the default values or customize them as needed.

### 2. Install Dependencies:

- For this project, you only `nodemon` (for development) to auto-restart your server when file changes occur:

```bash
npm install nodemon --save-dev
```
This installs `nodemon` as a development dependency.

- In addition to the main server application,you'll need some testing tools.For this example,we'll use `axios` to make HTTP requests and assert to check the server's responses.

```bash
npm install axios
```

### 3. Project Files:

- Create your server file (e.g., server.js).
- Write your server code (provided in the next section) to define routes and handle HTTP requests using Node.js’s built-in modules.
- Create you test file(e.g.,test.js)
- Write your tests to verify if your services behave as expected.

### 4. Add Scripts to package.json:

- Modify the scripts section to add commands for starting your application:
```json
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

```bash
git clone https://github.com/yourusername/simple-node-rest-example.git
```

- Or download the ZIP file and extract it to your local machine.


#### 2.Install Dependencies:

- Navigate to the project folder and install the required packages by running:

```bash
npm install
```
This command installs the necessary dependencies as specified in `package.json`.


### How to Run the Application
- Development Mode:

    - Start the server with automatic restarts by running:

    ```bash
    npm run dev
    ```
    - This uses nodemon to watch for file changes and restart the server automatically.

- Production Mode:

    - To run the application normally without automatic restarts, execute:

    ```bash
    npm start
    ```
    - The server will start on the specified port (2005) and will be accessible at `http://localhost:2005`.



## Package Configuration (package.json)
Your `package.json` file outlines the project’s metadata, dependencies, and scripts. Here’s an example:

```json
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

```javascript
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

```javascript
const http = require('http');
const url = require('url');
```

- Explanation:
    - The http module is used the HTTP Server.
    - The url module helps parse the URL, making it easier to extract the pathname and query parameters


#### 2. Setting the Port    

```javascript
const PORT = 2005;

```
- Explanation:
    - Defines the port on which the server will listen for incoming requests.


#### 3. Creating the Server

```javascript
const server = http.createServer((req, res) => { ... });
```

- **Explanation:**
    - Creates an HTTP server that listens for requests and sends responses.

#### 4.  Parsing the URL

```javascript
const parsedUrl = url.parse(req.url, true);
const pathname = parsedUrl.pathname;
const query = parsedUrl.query;
```
- **Explanation:**
    - Parses the incoming request URL.
    - Separates the pathname (e.g., /greet/John) and query parameters (e.g., ?name=John&age=30).

##### 5. Setting the Response Header

```javascript
res.setHeader('Content-Type', 'application/json');
```
- **Explanation:**
    - Ensures that all responses are sent in JSON format.  

#### 6. Handling Endpoints

- <b>Root Endpoint </b>(GET /):

```javascript
if (req.method === 'GET' && pathname === '/') {
  res.writeHead(200);
  res.end(JSON.stringify({ msg: "Hello World!!!" }));
}
```

- **Explanation:**
     - Responds with a JSON message when the root URL is requested via GET.

- <b>Path Parameter Endpoint</b> (GET /greet/:name):

```javascript
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
- **Explanation:**
    - Extracts the name from the URL and responds with a personalized greeting.
    - Validates that the name parameter is provided; otherwise, returns an error.

- <b>Query Parameter Endpoint</b> (GET /greeting):

```javascript
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
- **Explanation:**
    - Retrieves the name and age from the query string and responds with a message.
    - Validates that both query parameters are provided.
- <b>POST Endpoint with JSON Body</b> (POST /greet):

```javascript
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
- **Explanation:**
    - Collects data from the request body, parses it as JSON, and responds based on the provided name and age.
    - Includes error handling for invalid JSON or missing parameters.
- <b>Fallback for Undefined Routes:</b>

```javascript
else {
  res.writeHead(404);
  res.end(JSON.stringify({ error: "Route not found" }));
}
```
- **Explanation:**
    - Returns a 404 error if the request does not match any defined endpoint.

#### 7. Starting the Server

```javascript
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```
- **Explanation:**
    - The server listens on the specified port.
    - Logs a message to the console indicating that the server is running.




## Test Code Explanation
To test the API endpoints, we can use `axios` to send HTTP requests to the server, and `assert` to check if the server's response matches our expectations.

Here’s the full test code for the server:

```javascript
const axios = require('axios');
const assert = require("assert");
const { spawn } = require('child_process');


const BASE_URL = 'http://localhost:2005';
let serverProcess;

async function startServer() {
    return new Promise((resolve, reject) => {
        console.log("Starting the server..");
        serverProcess = spawn('node', ['server.js'], { stdio: 'ignore' })
        setTimeout(() => resolve(), 1000);
    })
}

    async function stopServer() {
        console.log("Stopping the server ..");
        serverProcess.kill();
    }

    async function testGetRoot() {
        try {
            const res = await axios.get(BASE_URL + "/")
            assert.strictEqual(res.status, 200)
            assert.strictEqual(res.data.msg, 'Hello World!!!');
            console.log('✅ Test GET "/" passed.');
        } catch (error) {
            console.error('❌ Test GET "/" failed:', error.message);
        }
    }

    async function testPathParamGreeting() {
        try {
            const res = await axios.get(`${BASE_URL}/greet/John`);
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.data.msg, 'Hello John!');
            console.log('✅ Test GET "/greet/:name" passed.');
        } catch (error) {
            console.error('❌ Test GET "/greet/:name" failed:', error.message);
        }
    }


    async function testQueryParamGreeting() {
        try {
            const res = await axios.get(`${BASE_URL}/greeting`, { params: { name: 'Alice', age: 25 } });
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.data.msg, 'Hello my name is Alice and im 25 years old.');
            console.log('✅ Test GET "/greeting?name=Alice&age=25" passed.');
        } catch (error) {
            console.error('❌ Test GET "/greeting?name=Alice&age=25" failed:', error.message);
        }
    }

    async function testPostGreet() {
        try {
            const res = await axios.post(`${BASE_URL}/greet`, { name: 'Bob', age: 30 });
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.data.msg, 'Hello my name is Bob and im 30 years old.');
            console.log('✅ Test POST "/greet" passed.');
        } catch (error) {
            console.error('❌ Test POST "/greet" failed:', error.message);
        }
    }


    async function test404() {
        try {
            await axios.get(`${BASE_URL}/unknown`);
        } catch (error) {
            assert.strictEqual(error.response.status, 404);
            console.log('✅ Test 404 for unknown route passed.');
        }
    }

    async function runTests() {
        console.log("Running tests..\n");

        try {
            await startServer();

            // Determine which tests to run based on command-line arguments
            const testsToRun = process.argv.slice(2);

            if (testsToRun.length === 0 || testsToRun.includes("testGetRoot")) {
                await testGetRoot();
            }
            if (testsToRun.length === 0 || testsToRun.includes('testPathParamGreeting')) {
                await testPathParamGreeting();
            }

            if (testsToRun.length === 0 || testsToRun.includes('testQueryParamGreeting')) {
                await testQueryParamGreeting();
            }

            if (testsToRun.length === 0 || testsToRun.includes('testPostGreet')) {
                await testPostGreet();
            }

            if (testsToRun.length === 0 || testsToRun.includes('test404')) {
                await test404();
            }


        } catch (error) {
            console.error('❌ Test failed:', error.message);
        } finally {
            await stopServer();
        }
    }
    

runTests()

```
### Detailed Code Breakdown

```javascript
const axios = require('axios');
const assert = require("assert");
const { spawn } = require('child_process');
```
- **Explanation:**
- `axios`: This is a promise-based HTTP client used to make requests to your API endpoints.
- `assert`: A built-in Node.js module used for making assertions. It's used to check if the API's response matches expected values.
- `spawn`: A method from the child_process module. It's used to start the server in a separate process to test it, without affecting the current Node.js process.



```javascript
const BASE_URL = 'http://localhost:2005';
let serverProcess;
```
- **Explanation:**
- `BASE_URL`: The base URL where your server will be running. In this case, it’s set to `http://localhost:2005`, where your server listens.
- `serverProcess`: A variable to store the process object for the server. This will allow us to start and stop the server as needed for testing.


```javascript
async function startServer() {
    return new Promise((resolve, reject) => {
        console.log("Starting the server..");
        serverProcess = spawn('node', ['server.js'], { stdio: 'ignore' });
        setTimeout(() => resolve(), 1000);
    });
}
```
- **Explanation:**
- `startServer()`: This is an asynchronous function that starts the server by spawning a child process with `node server.js`.
- `stdio: 'ignore'`: This suppresses output from the server process in the terminal.
- `setTimeout(() => resolve(), 1000)`: This gives the server 1 second to start before resolving the promise, ensuring the server is up and running before the tests are executed.


```javascript
async function stopServer() {
    console.log("Stopping the server ..");
    serverProcess.kill();
}
```
- **Explanation:**
- `stopServer()`: This function kills the server process after the tests are done to clean up and stop the server.

```javascript
async function testGetRoot() {
    try {
        const res = await axios.get(BASE_URL + "/");
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.data.msg, 'Hello World!!!');
        console.log('✅ Test GET "/" passed.');
    } catch (error) {
        console.error('❌ Test GET "/" failed:', error.message);
    }
}
```
- **Explanation:**
- `testGetRoot()`: This function sends a `GET` request to the root endpoint (`/`).
- `assert.strictEqual(res.status, 200)`: It checks if the response status is `200 OK`, meaning the server processed the request successfully.
- `assert.strictEqual(res.data.msg, 'Hello World!!!')`: It verifies that the response body contains the expected message: `Hello World!!!`.
- If the test passes, it logs a success message; otherwise, it logs an error.

```javascript
async function testPathParamGreeting() {
    try {
        const res = await axios.get(`${BASE_URL}/greet/John`);
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.data.msg, 'Hello John!');
        console.log('✅ Test GET "/greet/:name" passed.');
    } catch (error) {
        console.error('❌ Test GET "/greet/:name" failed:', error.message);
    }
}
```
- **Explanation:**
- `testPathParamGreeting()`: This function sends a GET request to the `/greet/John` endpoint, where John is a path parameter.
- `assert.strictEqual(res.status, 200)`: Verifies the status code is `200 OK`.
- `assert.strictEqual(res.data.msg, 'Hello John!')`: Verifies the response message correctly greets John.
- If the test passes, it logs a success message; otherwise, it logs an error.

```javascript
async function testQueryParamGreeting() {
    try {
        const res = await axios.get(`${BASE_URL}/greeting`, { params: { name: 'Alice', age: 25 } });
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.data.msg, 'Hello my name is Alice and im 25 years old.');
        console.log('✅ Test GET "/greeting?name=Alice&age=25" passed.');
    } catch (error) {
        console.error('❌ Test GET "/greeting?name=Alice&age=25" failed:', error.message);
    }
}
```
- **Explanation:**
- `testQueryParamGreeting()`: This function sends a `GET` request to the `/greeting` endpoint with query parameters (name=Alice&age=25).
- `assert.strictEqual(res.status, 200)`: Verifies the status code is `200 OK`.
- `assert.strictEqual(res.data.msg, 'Hello my name is Alice and im 25 years old.')`: Verifies the message in the response matches the query parameters.
- If the test passes, it logs a success message; otherwise, it logs an error.

```javascript
async function testPostGreet() {
    try {
        const res = await axios.post(`${BASE_URL}/greet`, { name: 'Bob', age: 30 });
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.data.msg, 'Hello my name is Bob and im 30 years old.');
        console.log('✅ Test POST "/greet" passed.');
    } catch (error) {
        console.error('❌ Test POST "/greet" failed:', error.message);
    }
}
```
- **Explanation:**
- `testPostGreet()`: This function sends a `POST` request to the `/greet` endpoint with a JSON body containing name and age.
- `assert.strictEqual(res.status, 200)`: Verifies the status code is `200 OK`.
- `assert.strictEqual(res.data.msg, 'Hello my name is Bob and im 30 years old.')`: Verifies the message in the response matches the provided name and age in the request body.
- If the test passes, it logs a success message; otherwise, it logs an error.

```javascript
async function test404() {
    try {
        await axios.get(`${BASE_URL}/unknown`);
    } catch (error) {
        assert.strictEqual(error.response.status, 404);
        console.log('✅ Test 404 for unknown route passed.');
    }
}
```
- **Explanation:**
- `test404()`: This function sends a `GET` request to a non-existent endpoint (`/unknown`).
- `assert.strictEqual(error.response.status, 404)`: It expects a `404 Not Found` error since the route doesn't exist.
- If the test passes, it logs a success message; otherwise, it logs an error.

```javascript
async function runTests() {
    console.log("Running tests..\n");

    try {
        await startServer();

        // Determine which tests to run based on command-line arguments
        const testsToRun = process.argv.slice(2);

        if (testsToRun.length === 0 || testsToRun.includes("testGetRoot")) {
            await testGetRoot();
        }
        if (testsToRun.length === 0 || testsToRun.includes('testPathParamGreeting')) {
            await testPathParamGreeting();
        }

        if (testsToRun.length === 0 || testsToRun.includes('testQueryParamGreeting')) {
            await testQueryParamGreeting();
        }

        if (testsToRun.length === 0 || testsToRun.includes('testPostGreet')) {
            await testPostGreet();
        }

        if (testsToRun.length === 0 || testsToRun.includes('test404')) {
            await test404();
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await stopServer();
    }
}
```
- **Explanation:**
- `runTests()`: This function orchestrates running all the individual tests.
- It first starts the server using startServer().
- It checks command-line arguments (`process.argv.slice(2)`) to determine which specific tests to run. If no arguments are provided, it runs all tests by default.
After all tests are executed, it stops the server using `stopServer()`.
```javascript
runTests();
```
- **Explanation:**
- This line calls the `runTests()` function to begin executing the tests when the script is run.







## Summary
This documentation provides a comprehensive walkthrough of the `simple-node-rest-example` project:

- **Project Overview:** Introduces the RESTful API built using only `Node.js` core modules.

- **Project Setup and Creation:** Outlines how to initialize the project with npm init, install nodemon, and set up the project structure.

- **Installation and Running the Application:** Explains how to clone/download the repository, install dependencies with npm install, and run the server in both development and production modes.

- **Package Configuration:** Details the contents of the `package.json` file, including scripts and dependencies.

- **Server Code Explanation:** Breaks down each part of the `server.js` file, explaining how the HTTP server is created and how different endpoints are handled.

- **Detailed Code Breakdown:** Provides in-depth explanations of the code segments to help beginners understand the logic behind each endpoint and middleware operation.

- **Test Code Explanation:** Explains how to test the API endpoints to ensure they work as expected. It covers the use of axios for sending HTTP requests and assert for validating the responses. This section walks through the process of writing tests for each route, from GET requests to POST requests, and how to verify the returned status codes and response messages. Detailed explanations of test case setup, assertions, and the flow of automated tests will help beginners understand how to ensure their API functions correctly under different conditions.

This guide is intended to help beginners understand how to build and manage a Node.js project without any external frameworks while also introducing the basic concepts of testing to ensure the correctness of the API.

