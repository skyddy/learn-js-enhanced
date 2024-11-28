export function ConsoleOutput({ output }) {
  return (
    <div className="rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800">
      <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-400">Console</h3>
      </div>
      <div className="p-4 font-mono text-sm h-[140px] overflow-auto">
        <pre className="whitespace-pre-wrap text-zinc-300">
          {output || 'Console output will appear here...'}
        </pre>
      </div>
    </div>
  );
}