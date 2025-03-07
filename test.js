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