import Editor from "@monaco-editor/react";

export function MonacoEditor({
  value,
  onChange,
  language = "javascript",
  height = "300px",
}) {
  return (
    <div className="border rounded-md overflow-hidden bg-zinc-950">
      <Editor
        height={height}
        defaultLanguage={language}
        theme="vs-dark"
        value={value}
        onChange={(value) => onChange(value || '')}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}