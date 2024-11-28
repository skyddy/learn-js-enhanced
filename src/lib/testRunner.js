import { toast } from 'sonner';

/**
 * Run tests for user code
 * @param {string} code - The user's code to test
 * @param {Array<{name: string, test: string}>} tests - Array of test cases
 * @returns {Promise<Array<{name: string, passed: boolean, error?: string}>>}
 */
export async function runTests(code, tests) {
  const results = [];
  
  try {
    // Create a worker script that will run our code
    const workerScript = `
      self.onmessage = function(e) {
        if (e.data.type === 'init') {
          try {
            // Create a mock document for DOM operations
            self.document = {
              getElementById: function() {
                return {
                  textContent: '',
                  innerHTML: ''
                };
              }
            };

            // Execute the user code
            ${code}

            // Export variables to global scope for testing
            self._testContext = {
              fullName,
              age,
              isStudent,
              DAYS_IN_WEEK,
              person
            };

            // Signal ready
            self.postMessage({ type: 'ready' });
          } catch (error) {
            self.postMessage({ 
              type: 'error', 
              error: error instanceof Error ? error.message : String(error)
            });
          }
        } else if (e.data.type === 'runTest') {
          try {
            const { fullName, age, isStudent, DAYS_IN_WEEK, person } = self._testContext;
            eval(e.data.test);
            self.postMessage({ type: 'testResult', passed: true });
          } catch (error) {
            self.postMessage({ 
              type: 'testResult', 
              passed: false, 
              error: error instanceof Error ? error.message : String(error)
            });
          }
        }
      };
    `;

    // Create a blob URL with the worker script
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const workerURL = URL.createObjectURL(blob);

    // Create and initialize the worker
    const worker = new Worker(workerURL);
    
    // Initialize the worker
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        worker.terminate();
        reject(new Error('Worker initialization timeout'));
      }, 5000);

      worker.onmessage = (e) => {
        if (e.data.type === 'ready') {
          clearTimeout(timeout);
          resolve();
        } else if (e.data.type === 'error') {
          clearTimeout(timeout);
          reject(new Error(e.data.error));
        }
      };

      worker.onerror = (error) => {
        clearTimeout(timeout);
        reject(error);
      };

      worker.postMessage({ type: 'init' });
    });

    // Run each test
    for (const test of tests) {
      try {
        const result = await new Promise((resolve) => {
          worker.onmessage = (e) => {
            if (e.data.type === 'testResult') {
              resolve({
                passed: e.data.passed,
                error: e.data.error
              });
            }
          };

          worker.postMessage({ 
            type: 'runTest', 
            test: test.test 
          });
        });

        results.push({
          name: test.name,
          passed: result.passed,
          error: result.error
        });
      } catch (error) {
        results.push({
          name: test.name,
          passed: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    // Cleanup
    worker.terminate();
    URL.revokeObjectURL(workerURL);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    results.push(...tests.map(test => ({
      name: test.name,
      passed: false,
      error: `Code error: ${errorMessage}`
    })));
  }

  // Show overall test results
  const passedCount = results.filter(r => r.passed).length;
  if (passedCount === results.length) {
    toast.success(`All ${passedCount} tests passed!`);
  } else {
    toast.error(`${passedCount} of ${results.length} tests passed`);
  }

  return results;
}