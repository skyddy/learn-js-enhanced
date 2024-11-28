import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TestResults({ results, isRunning }) {
  if (isRunning) {
    return (
      <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div>
          <span className="text-zinc-400">Running tests...</span>
        </div>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
        <div className="text-zinc-400">Run your code to see test results</div>
      </div>
    );
  }

  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  const allPassed = passedTests === totalTests;

  return (
    <div className="space-y-4 p-4 bg-zinc-950 rounded-lg border border-zinc-800">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-400">
          Tests ({passedTests} / {totalTests})
        </h3>
        {allPassed && (
          <span className="text-sm text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            All tests passed!
          </span>
        )}
      </div>

      <div className="space-y-2">
        {results.map((result, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-2 p-2 rounded",
              result.passed ? "bg-emerald-950/20" : "bg-red-950/20"
            )}
          >
            {result.passed ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 space-y-1">
              <p className={cn(
                "text-sm",
                result.passed ? "text-emerald-300" : "text-red-300"
              )}>
                {result.name}
              </p>
              {!result.passed && result.error && (
                <p className="text-xs text-red-400 whitespace-pre-wrap">{result.error}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}