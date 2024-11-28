import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { Highlight, themes } from 'prism-react-renderer';

export function LessonMarkdown({ content }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(id);
      toast.success('Code copied to clipboard');
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    }).catch(() => {
      toast.error('Failed to copy code');
    });
  };

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({children, ...props}) => (
            <h1 className="text-2xl font-bold mb-4" {...props}>{children}</h1>
          ),
          h2: ({children, ...props}) => (
            <h2 className="text-xl font-bold mt-6 mb-3" {...props}>{children}</h2>
          ),
          h3: ({children, ...props}) => (
            <h3 className="text-lg font-bold mt-5 mb-2" {...props}>{children}</h3>
          ),
          p: ({children}) => {
            // Check if the children is a code block
            if (React.Children.toArray(children).some(
              child => React.isValidElement(child) && child.type === 'code' && !child.props.inline
            )) {
              // If it contains a code block, render without p wrapper
              return <>{children}</>;
            }
            // Otherwise render as normal paragraph
            return <div className="mb-4">{children}</div>;
          },
          ul: ({children, ...props}) => (
            <ul className="list-disc pl-6 mb-4" {...props}>{children}</ul>
          ),
          ol: ({children, ...props}) => (
            <ol className="list-decimal pl-6 mb-4" {...props}>{children}</ol>
          ),
          li: ({children}) => {
            // Check if the children contains a code block
            if (React.Children.toArray(children).some(
              child => React.isValidElement(child) && child.type === 'code' && !child.props.inline
            )) {
              // If it contains a code block, render without wrapping div
              return <li className="mb-1">{children}</li>;
            }
            // Otherwise wrap content in a div
            return <li className="mb-1"><div>{children}</div></li>;
          },
          code: ({node, inline, className, children, ...props}) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : 'javascript';
            const codeString = String(children).replace(/\n$/, '');
            const id = `code-${Math.random().toString(36).substr(2, 9)}`;
            
            if (inline) {
              return (
                <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-sm" {...props}>
                  {children}
                </code>
              );
            }

            return (
              <div className="not-prose relative group my-6">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "absolute right-4 top-4",
                    "bg-zinc-800 hover:bg-zinc-700",
                    "border-zinc-700 hover:border-zinc-600",
                    "text-zinc-100 hover:text-white",
                    "transition-all duration-200"
                  )}
                  onClick={() => handleCopyCode(codeString, id)}
                >
                  {copiedId === id ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
                <Highlight
                  theme={themes.nightOwl}
                  code={codeString}
                  language={language}
                >
                  {({className, style, tokens, getLineProps, getTokenProps}) => (
                    <pre className={cn(
                      className,
                      "rounded-lg overflow-x-auto",
                      "border border-zinc-800",
                      "p-4"
                    )} style={style}>
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({line})}>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({token})} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              </div>
            );
          },
          pre: ({children}) => <>{children}</>,
          strong: ({children, ...props}) => (
            <strong className="font-bold" {...props}>{children}</strong>
          ),
          em: ({children, ...props}) => (
            <em className="italic" {...props}>{children}</em>
          ),
          blockquote: ({children, ...props}) => (
            <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 my-4 italic" {...props}>
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}