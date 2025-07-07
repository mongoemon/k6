# k6 Performance Testing Project

## Overview

This project contains performance tests written using k6. It's designed to help you assess the performance and reliability of your applications under various load conditions.

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

