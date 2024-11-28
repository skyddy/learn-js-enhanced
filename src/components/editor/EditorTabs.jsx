import Editor, { loader } from "@monaco-editor/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

// Configure Monaco Editor loader
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
  }
});

const languageMap = {
  html: 'html',
  css: 'css',
  js: 'javascript'
};

export function EditorTabs({ code, onCodeChange, activeTab, onTabChange }) {
  useEffect(() => {
    // Ensure Monaco is properly initialized
    loader.init().then(monaco => {
      // Configure JavaScript language features
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });

      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: 'React',
        allowJs: true,
        typeRoots: ['node_modules/@types']
      });

      // Add DOM type definitions
      fetch('https://cdn.jsdelivr.net/npm/@types/web/index.d.ts').then(response => 
        response.text()
      ).then(types => {
        monaco.languages.typescript.javascriptDefaults.addExtraLib(
          types,
          'ts:web.d.ts'
        );
      });

      // Configure HTML language features
      monaco.languages.html.htmlDefaults.setOptions({
        format: {
          tabSize: 2,
          insertSpaces: true,
        },
        suggest: {
          html5: true,
        },
      });

      // Configure CSS language features
      monaco.languages.css.cssDefaults.setOptions({
        validate: true,
        lint: {
          compatibleVendorPrefixes: 'warning',
          vendorPrefix: 'warning',
          duplicateProperties: 'warning',
        },
        format: {
          tabSize: 2,
          insertSpaces: true,
        },
      });
    });
  }, []);

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    readOnly: false,
    automaticLayout: true,
    theme: 'vs-dark',
    padding: { top: 16, bottom: 16 },
    suggestOnTriggerCharacters: true,
    wordBasedSuggestions: 'currentDocument',
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true
    },
    acceptSuggestionOnCommitCharacter: true,
    tabCompletion: 'on',
    wordWrap: 'on',
    formatOnPaste: true,
    formatOnType: true,
    suggest: {
      showClasses: true,
      showFunctions: true,
      showVariables: true,
      showWords: true,
      showMethods: true,
      showProperties: true,
      showKeywords: true,
    },
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="bg-zinc-950 border-b border-zinc-800">
        <TabsList className="bg-transparent border-none h-10 w-full justify-start">
          {['html', 'css', 'js'].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className={cn(
                "px-6 h-full relative",
                "text-sm font-medium",
                "text-zinc-400 hover:text-zinc-100",
                "data-[state=active]:text-white",
                "data-[state=active]:bg-zinc-900",
                "rounded-none",
                "border-b-2 border-transparent",
                "data-[state=active]:border-emerald-500",
                "transition-colors",
                "mx-1 first:ml-0 last:mr-0"
              )}
            >
              {tab.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {['html', 'css', 'js'].map((tab) => (
        <TabsContent key={tab} value={tab} className="h-[400px] mt-0 bg-zinc-950 border-x border-b border-zinc-800 rounded-b-lg">
          <Editor
            height="100%"
            defaultLanguage={languageMap[tab]}
            theme="vs-dark"
            value={code[tab]}
            onChange={(value) => onCodeChange(tab, value || '')}
            options={editorOptions}
            beforeMount={(monaco) => {
              // Additional language-specific configuration can be added here
              if (tab === 'js') {
                monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
              }
            }}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}