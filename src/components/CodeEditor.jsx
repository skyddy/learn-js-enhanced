import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { EditorTabs } from './editor/EditorTabs';
import { Preview } from './editor/Preview';
import { ConsoleOutput } from './editor/ConsoleOutput';
import { ActionButtons } from './editor/ActionButtons';
import { TestResults } from './editor/TestResults';
import { usePreview } from './editor/usePreview';
import { runTests } from '@/lib/testRunner';

export function CodeEditor({ initialCode, solution, tests, onRun, onOutput }) {
  const [code, setCode] = useState(initialCode);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [previewContent, setPreviewContent] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const previewRef = useRef(null);
  const [activeTab, setActiveTab] = useState('html');
  const { createPreviewContent } = usePreview();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .monaco-editor .suggest-widget {
        z-index: 100000 !important;
      }
      .monaco-editor .monaco-hover {
        z-index: 100000 !important;
      }
      .monaco-editor .parameter-hints-widget {
        z-index: 100000 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const updateCode = (language, value) => {
    setCode(prev => ({
      ...prev,
      [language]: value || ''
    }));
  };

  const clearOutput = () => {
    setConsoleOutput('');
    setTestResults([]);
    onOutput('');
  };

  const handleRun = async () => {
    try {
      clearOutput();
      const content = createPreviewContent(code);
      setPreviewContent(content);

      let allTestsPassed = false;

      // Run tests if available
      if (tests && tests.length > 0) {
        setIsRunningTests(true);
        const results = await runTests(code.js, tests);
        setTestResults(results);
        
        allTestsPassed = results.every(r => r.passed);
        if (allTestsPassed) {
          toast.success('All tests passed!');
        } else {
          toast.error('Some tests failed. Keep trying!');
        }
      }

      onRun(code, allTestsPassed);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const output = `Error: ${errorMessage}`;
      setConsoleOutput(output);
      onOutput(output);
      toast.error(output);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    clearOutput();
    setPreviewContent('');
    toast.info('Code reset to initial state');
  };

  const handleShowSolution = () => {
    setCode(solution);
    clearOutput();
    setPreviewContent('');
    toast.info('Solution loaded');
  };

  useEffect(() => {
    setCode(initialCode);
    clearOutput();
    setPreviewContent('');
  }, [initialCode]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'console' && typeof event.data.output === 'string') {
        const newOutput = event.data.output + '\n';
        setConsoleOutput(prev => prev + newOutput);
        onOutput(prev => prev + newOutput);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onOutput]);

  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="space-y-4">
          <EditorTabs
            code={code}
            onCodeChange={updateCode}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <ActionButtons
            onReset={handleReset}
            onShowSolution={handleShowSolution}
            onRun={handleRun}
          />
        </div>

        <div className="space-y-4">
          <Preview ref={previewRef} content={previewContent} />
          <ConsoleOutput output={consoleOutput} />
          <TestResults results={testResults} isRunning={isRunningTests} />
        </div>
      </div>
    </div>
  );
}