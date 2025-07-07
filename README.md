# k6 Performance Testing Project

## Overview

This project contains performance tests written using k6. It's designed to help you assess the performance and reliability of your applications under various load conditions.

## Types of Performance Tests

This project includes scripts for various types of performance tests, each designed to answer different questions about your application's behavior under load. Understanding the goal and key metrics for each test type is crucial for effective analysis.

### 1. Load Test
*   **Main Goal:** To verify system performance under normal and anticipated peak concurrent user load.
*   **What it is:** Simulates a realistic, expected number of concurrent users interacting with the application.
*   **Key Metrics to Observe:**
    *   `http_req_duration` (especially p(90), p(95)): To ensure response times meet SLAs under expected load.
    *   `http_req_failed`: To confirm no errors occur under normal load.
    *   `checks`: To ensure all functional validations pass.
    *   `iterations` / `http_reqs`: To measure throughput (requests/iterations per second).

### 2. Endurance Test (Soak Test)
*   **Main Goal:** To identify performance degradation, memory leaks, and resource exhaustion over an extended period of sustained load.
*   **What it is:** Sustains a moderate, constant load over a long duration (e.g., hours or days).
*   **Key Metrics to Observe:**
    *   Trends in `http_req_duration`: Look for gradual increases over time.
    *   Trends in `http_req_failed`: Look for increasing error rates.
    *   Resource utilization (CPU, Memory, Disk I/O, Network I/O): Monitor externally for leaks or exhaustion.
    *   `vus`: To ensure the test maintains the desired load without dropping VUs.

### 3. Peak Test (Spike Test)
*   **Main Goal:** To assess system behavior and recovery from sudden, large increases in user load.
*   **What it is:** Subjects the system to sudden, intense bursts of traffic for short periods, followed by a return to normal load.
*   **Key Metrics to Observe:**
    *   `http_req_duration` (during and immediately after the spike): How quickly does the system respond during and recover from the surge?
    *   `http_req_failed`: Expect a temporary increase during the spike, but it should recover quickly.
    *   `vus`: Observe how quickly k6 can ramp up and down VUs.
    *   Recovery time: How long does it take for metrics to return to baseline after the spike?

### 4. Stress Test
*   **Main Goal:** To determine the system's breaking point and how it behaves under extreme, unsustainable load.
*   **What it is:** Gradually increases the load beyond the system's expected capacity until performance significantly degrades or the system fails.
*   **Key Metrics to Observe:**
    *   `http_req_failed`: When does the error rate become unacceptable or the system starts returning errors?
    *   `http_req_duration`: When do response times become unacceptably high?
    *   `vus`: The number of virtual users at which the system breaks.
    *   Resource utilization: Identify which resources (CPU, memory, database connections) become bottlenecks.

### 5. Breakpoint / Capacity Test
*   **Main Goal:** To find the maximum number of users or transactions a system can handle while still meeting predefined performance criteria (e.g., response time SLAs).
*   **What it is:** Similar to a stress test, but the focus is on identifying the *limit* before failure, rather than just observing failure.
*   **Key Metrics to Observe:**
    *   `vus`: The exact number of virtual users at which performance thresholds are consistently breached.
    *   `http_req_duration` and `http_req_failed`: To identify the point where these metrics cross acceptable limits.
    *   `iterations` (throughput): To see the maximum throughput the system can sustain.

### 6. Scalability / Step Test
*   **Main Goal:** To understand how the system scales with increasing user load and to identify scaling limits or bottlenecks at different load levels.
*   **What it is:** Gradually increases the load in predefined steps, often with pauses between steps, to observe performance at each increment.
*   **Key Metrics to Observe:**
    *   `http_req_duration` and `http_req_failed`: Analyze trends across each step. Do response times remain stable or degrade linearly/exponentially?
    *   Resource utilization: How do resources respond to each step increase?
    *   `iterations` (throughput): Does throughput increase proportionally with VUs, or does it plateau?

### 7. Smoke Performance Test
*   **Main Goal:** To quickly verify that the test environment and the application's basic functionality are working and performing as expected before running more extensive tests.
*   **What it is:** A very light load test (e.g., 1 virtual user, a few iterations) targeting critical paths.
*   **Key Metrics to Observe:**
    *   `http_req_duration`: Should be very low and consistent.
    *   `http_req_failed`: Must be 0%.
    *   `checks`: Must be 100%.

### 8. Chaos / Failover Test
*   **Main Goal:** To verify the system's resilience and ability to withstand and recover from unexpected failures or disruptions.
*   **What it is:** Intentionally introduces faults (e.g., network latency, service outages, resource exhaustion) while the system is under load.
*   **Key Metrics to Observe:**
    *   `http_req_failed` and `http_req_duration`: Observe behavior during and after the fault injection. How quickly do they recover?
    *   Recovery time: How long does it take for the system to return to a stable state after the fault?
    *   `checks`: To ensure data integrity and functional correctness are maintained.
    *   External monitoring: Crucial for observing system health and component failures.

## Setup and Running Tests

Follow these steps to set up the project, run tests, and generate HTML reports:

1.  **Install Prerequisites:**
    *   **Node.js:** Download and install Node.js from [nodejs.org](https://nodejs.org/).
    *   **k6:** Install k6 using your preferred method. For example, on Windows using Chocolatey:
        ```bash
        choco install k6
        ```
        For other operating systems, refer to the official k6 installation guide: [k6.io/docs/getting-started/installation/](https://k6.io/docs/getting-started/installation/)

2.  **Install Project Dependencies:**
    Navigate to the project directory and install the required Node.js packages, including `k6-html-reporter` and TypeScript type definitions:

    ```bash
    npm install
    ```

## How to Run Tests

k6 natively executes JavaScript files. While you write your tests in TypeScript (`.ts` files) for better maintainability and type safety, these files are always transpiled (converted) into JavaScript (`.js` files) before k6 can run them. The HTML reports are generated from the results of these JavaScript executions.

### Starting a New Test Script

To start writing a new k6 test script, you can use the provided template files:

*   **JavaScript Template:** `tests/template.js`
*   **TypeScript Template:** `tests/template.ts`

These templates include the basic structure for a k6 test, along with the `handleSummary` function for automatic JSON and HTML report generation. Simply copy the desired template and start customizing it for your specific testing needs.

### Running Plain JavaScript Files

k6 can directly execute plain JavaScript files without any compilation step. For example, to run `tests/testjs.js`:

```bash
k6 run tests/testjs.js
```

With the `handleSummary` function now configured in `tests/testjs.js`, running this test will automatically generate the HTML report.

### Recommended: Compile and Run from `dist`

First, compile your TypeScript test files to JavaScript using the `tsconfig.json` configuration:

```bash
npx tsc
```
This command will compile all `.ts` files in `tests/` and `scripts/` and output the compiled JavaScript files to the `dist/` directory, mirroring the source folder structure.

Then, run the tests from the `dist` directory:

```bash
k6 run dist/tests/test.js
```
Or for the traffic test:
```bash
k6 run dist/tests/traffic_test.js
```
Or for the API test:
```bash
k6 run dist/tests/api_test.js
```

### For Quick Testing: Run Single `.ts` File with `ts-node`

For quick development and testing of individual TypeScript files without a full project compilation, you can use `ts-node` to transpile the file on the fly and pipe its output to k6. This requires `ts-node` to be installed (`npm install --save-dev ts-node`).

```bash
k6 run <(npx ts-node tests/test.ts)
```
Or for the traffic test:
```bash
k6 run <(npx ts-node tests/traffic_test.ts)
```
Or for the API test:
```bash
k6 run <(npx ts-node tests/api_test.ts)
```

*(Note: When using `ts-node` directly, the `handleSummary` function will still generate the `reports/results.json` and `reports/results_html.html` files as configured in your test scripts.)*

## How to View Reports

After a test run, you can find the generated HTML report at `reports/results_html.html`. Simply open this file in your web browser to view a detailed summary of your k6 test results.

## Understanding k6 Metrics in HTML Reports

The HTML reports generated by `k6-html-reporter` provide a comprehensive overview of your test run's performance. Here are some key metrics you'll find and what they indicate:

*   **`http_req_duration` (HTTP Request Duration):**
    *   **What it is:** The total time taken for an HTTP request, from the moment the request is sent until the response body is fully received. This includes DNS lookup, TCP connection, TLS handshake, request sending, and response receiving.
    *   **What numbers indicate:** Lower values are better. You'll typically see average, median, 90th percentile (p(90)), and 95th percentile (p(95)) values. Percentiles are crucial as they show the experience of a certain percentage of users (e.g., p(95) means 95% of requests completed within that time).
    *   **Consideration:** A good `http_req_duration` depends heavily on your application's requirements. For web applications, anything consistently above 500ms for p(95) might indicate a performance bottleneck. For APIs, this could be even lower (e.g., <200ms).

*   **`http_req_waiting` (Time to First Byte - TTFB):**
    *   **What it is:** The time spent waiting for the first byte of the response from the server after the request has been sent. This is a crucial indicator of server-side processing time.
    *   **What numbers indicate:** Lower values are better. High `http_req_waiting` often points to slow backend processing, database queries, or application logic.
    *   **Consideration:** If `http_req_duration` is high but `http_req_waiting` is also high, the bottleneck is likely on the server side.

*   **`http_req_connecting` (TCP Connecting Time):**
    *   **What it is:** The time spent establishing a TCP connection to the server.
    *   **What numbers indicate:** Lower values are better.
    *   **Consideration:** High values can indicate network latency, server overload preventing new connections, or issues with the server's network stack.

*   **`http_req_tls_handshaking` (TLS Handshaking Time):**
    *   **What it is:** The time spent performing the TLS (SSL) handshake with the server. This only applies to HTTPS requests.
    *   **What numbers indicate:** Lower values are better.
    *   **Consideration:** High values might suggest issues with TLS certificate validation, server-side TLS configuration, or network latency affecting the handshake process.

*   **`http_req_sending` (Request Sending Time):**
    *   **What it is:** The time spent sending the HTTP request to the server.
    *   **What numbers indicate:** Lower values are better.
    *   **Consideration:** Typically very low. High values could indicate a very large request body or network bandwidth issues on the client side.

*   **`http_req_receiving` (Response Receiving Time):**
    *   **What it is:** The time spent receiving the HTTP response body from the server after the first byte has been received.
    *   **What numbers indicate:** Lower values are better.
    *   **Consideration:** High values might indicate a very large response body, slow network transfer, or issues with the client's ability to process the incoming data.

*   **`http_req_blocked` (Blocked Time):**
    *   **What it is:** The time spent blocked before the request could be sent. This includes DNS lookup, TCP connection, and TLS handshake. It's essentially the sum of `http_req_connecting`, `http_req_tls_handshaking`, and DNS lookup time.
    *   **What numbers indicate:** Lower values are better.
    *   **Consideration:** High values indicate delays in establishing the connection, often related to network or server-side connection handling.

*   **`iteration_duration` (Iteration Duration):**
    *   **What it is:** The total time taken to complete one full iteration of the `default` function (or the main test logic) for a single virtual user. This includes all HTTP requests, checks, sleeps, and any other logic within the iteration.
    *   **What numbers indicate:** Lower values are better. It represents the end-to-end response time for a user's journey through one cycle of your test script.
    *   **Consideration:** This is a critical metric for understanding the user experience. If `iteration_duration` is high, it means users are waiting longer to complete their tasks. Analyze the individual `http_req_duration` and `sleep` times within the iteration to pinpoint bottlenecks.

*   **`http_req_failed` (HTTP Request Failed Rate):**
    *   **What it is:** The percentage of HTTP requests that resulted in an error (e.g., non-2xx status codes, network errors).
    *   **What numbers indicate:** Lower values are better. Ideally, this should be 0% or very close to it.
    *   **Consideration:** Any value above 0% indicates issues. A high failure rate points to instability, server errors, or incorrect test logic. Thresholds are often set to ensure this remains below a very small percentage (e.g., `rate<0.01` for less than 1% failures).

*   **`checks` (Check Success Rate):**
    *   **What it is:** The percentage of `check()` assertions that passed during the test run. Checks are used to validate responses (e.g., checking if a status code is 200, or if a response body contains expected data).
    *   **What numbers indicate:** Higher values are better. Ideally, this should be 100%.
    *   **Consideration:** A low check success rate means your application is not behaving as expected under load, or your test assertions are failing. This can indicate functional bugs, data corruption, or unexpected responses.

*   **`vus` (Virtual Users):**
    *   **What it is:** The number of active virtual users (VUs) at any given point during the test. This metric shows how many concurrent users are interacting with your system.
    *   **What numbers indicate:** This will fluctuate based on your test's `stages` configuration. It helps visualize the load profile applied to your system.
    *   **Consideration:** Observe if your system's performance metrics (like `http_req_duration`) degrade as `vus` increases. This helps identify the system's breaking point or capacity limits.

*   **`iterations` (Total Iterations):**
    *   **What it is:** The total number of times the `default` function (or the main test logic) has been executed by all virtual users combined.
    *   **What numbers indicate:** Higher values generally mean more work was done by the test. It's a count of completed test scenarios.
    *   **Consideration:** Useful for understanding the overall throughput of your test. When combined with duration, it gives you iterations per second.

By understanding these key metrics, you can effectively analyze your k6 test results and identify areas for performance improvement in your application.

## Interpreting Results: What's Good, What's Bad?

Interpreting k6 test results involves comparing observed metrics against your defined performance requirements and expectations. While specific "good" or "bad" numbers vary greatly depending on the application, industry, and user expectations, here are some general guidelines:

*   **`http_req_duration` (and its sub-metrics like `http_req_waiting`, `http_req_connecting`):**
    *   **Good:** Consistently low values, especially for percentiles (p(90), p(95), p(99)). For web applications, p(95) under 500ms is often a good target. For APIs, this might be under 100-200ms. The `http_req_waiting` component should ideally be the dominant part of `http_req_duration` if the server is doing significant work, but it shouldn't be excessively high.
    *   **Bad/Unexpected:**
        *   **High `http_req_duration`:** Indicates slow response times. This is a primary indicator of performance issues.
        *   **High `http_req_waiting`:** Suggests server-side bottlenecks (e.g., slow database queries, inefficient application logic, CPU/memory exhaustion).
        *   **High `http_req_connecting` or `http_req_tls_handshaking`:** Points to network latency, server connection limits, or issues with TLS setup. This can be particularly problematic if it increases with load.
        *   **High `http_req_sending` or `http_req_receiving`:** Could indicate very large request/response bodies or network bandwidth saturation.
        *   **Increasing values with increasing VUs:** If these metrics worsen as the number of virtual users (`vus`) increases, it's a clear sign that your system is struggling under load.

*   **`http_req_failed` (HTTP Request Failed Rate):**
    *   **Good:** 0% or very close to 0% (e.g., <0.01%).
    *   **Bad/Unexpected:** Any value significantly above 0%. This indicates errors (e.g., 5xx server errors, network timeouts) that directly impact user experience and system reliability. Even a small percentage can be critical.

*   **`checks` (Check Success Rate):**
    *   **Good:** 100% or very close to 100% (e.g., >99%).
    *   **Bad/Unexpected:** Anything less than 100%. This means your application is not returning the expected data or behaving as intended. This can uncover functional bugs that only appear under load.

*   **`vus` (Virtual Users):**
    *   **Good:** The `vus` graph should closely follow your defined `stages` in the test script, indicating that k6 is able to maintain the desired load.
    *   **Bad/Unexpected:** If the actual `vus` count deviates significantly from the target, it might mean k6 itself is struggling (less common) or, more likely, your system under test is rejecting connections or failing to respond, preventing k6 from spinning up new VUs.

*   **`iterations` (Total Iterations) and `iteration_duration`:**
    *   **Good:** `iteration_duration` should remain stable or within acceptable limits as `vus` increases. The total `iterations` should increase proportionally with the test duration and `vus`.
    *   **Bad/Unexpected:**
        *   **Increasing `iteration_duration`:** Indicates that the end-to-end user journey is slowing down under load.
        *   **Decreasing `iterations` (or throughput) while `vus` is stable/increasing:** This is a critical sign that your system is becoming saturated and cannot process more requests, leading to a decrease in overall work done.

**General Considerations for Unexpected Results:**

*   **Spikes:** Sudden, sharp increases in duration metrics or failure rates often point to specific events like garbage collection, database contention, or resource exhaustion.
*   **Plateaus:** If a metric (like `http_req_duration`) hits a plateau and doesn't improve even if resources are available, it might indicate a bottleneck in a specific component or a hard limit in the system's architecture.
*   **Correlation:** Always look for correlations between metrics. For example, if `http_req_duration` increases, check if `http_req_waiting` is also increasing (server-side issue) or if `http_req_connecting` is increasing (network/connection issue).

By carefully analyzing these metrics and their trends, especially in relation to the applied load (`vus`), you can pinpoint performance bottlenecks and ensure your application meets its performance requirements.

