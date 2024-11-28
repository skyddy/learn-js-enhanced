import { useCallback } from 'react';

export function usePreview() {
  const createPreviewContent = useCallback((code) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            /* Reset default styles */
            *, *::before, *::after {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            
            body {
              padding: 16px;
              font-family: system-ui, -apple-system, sans-serif;
              line-height: 1.5;
              color: #333;
            }
            
            /* Custom styles */
            ${code.css}
          </style>
        </head>
        <body>
          ${code.html}
          <script>
            // Error handler for uncaught errors
            window.onerror = function(msg, url, line, col, error) {
              console.error(error || msg);
              return false;
            };

            // Error handler for unhandled promise rejections
            window.onunhandledrejection = function(event) {
              console.error(event.reason);
            };

            // Set up console interceptor
            (function() {
              const originalConsole = window.console;
              
              function stringify(arg) {
                if (arg === undefined) return 'undefined';
                if (arg === null) return 'null';
                if (arg instanceof Error) return \`\${arg.name}: \${arg.message}\`;
                if (typeof arg === 'object') {
                  try {
                    return JSON.stringify(arg, null, 2);
                  } catch (e) {
                    return String(arg);
                  }
                }
                return String(arg);
              }

              window.console = {
                log: (...args) => {
                  const output = args.map(stringify).join(' ');
                  window.parent.postMessage({ type: 'console', output }, '*');
                  originalConsole.log.apply(originalConsole, args);
                },
                error: (...args) => {
                  const output = args.map(arg => stringify(arg)).join(' ');
                  window.parent.postMessage({ type: 'console', output: 'Error: ' + output }, '*');
                  originalConsole.error.apply(originalConsole, args);
                },
                warn: (...args) => {
                  const output = args.map(stringify).join(' ');
                  window.parent.postMessage({ type: 'console', output: 'Warning: ' + output }, '*');
                  originalConsole.warn.apply(originalConsole, args);
                },
                info: (...args) => {
                  const output = args.map(stringify).join(' ');
                  window.parent.postMessage({ type: 'console', output: 'Info: ' + output }, '*');
                  originalConsole.info.apply(originalConsole, args);
                }
              };
            })();

            // Execute user code in a try-catch block
            try {
              // Create a new Function to avoid global scope pollution
              (new Function(${JSON.stringify(code.js)}))();
            } catch (error) {
              console.error(error);
            }
          </script>
        </body>
      </html>
    `;
  }, []);

  return { createPreviewContent };
}