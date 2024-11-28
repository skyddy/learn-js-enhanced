import { forwardRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

export const Preview = forwardRef(
  ({ className, content }, ref) => {
    const handleError = useCallback((error) => {
      console.error('Preview error:', error);
      if (error.message === 'Script error.') {
        console.warn('Note: Script error might be due to CORS policy');
      }
    }, []);

    useEffect(() => {
      if (content && ref && 'current' in ref && ref.current) {
        try {
          ref.current.srcdoc = content;
        } catch (error) {
          console.error('Failed to update preview:', error);
        }
      }
    }, [content, ref]);

    useEffect(() => {
      const handleWindowError = (event) => {
        handleError(event);
      };
      
      window.addEventListener('error', handleWindowError);
      return () => window.removeEventListener('error', handleWindowError);
    }, [handleError]);

    return (
      <div className={cn(
        "rounded-lg overflow-hidden bg-zinc-950 h-[300px]",
        "border border-zinc-800",
        className
      )}>
        {content ? (
          <iframe
            ref={ref}
            title="Preview"
            className="w-full h-full bg-white"
            sandbox="allow-scripts allow-same-origin allow-modals"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            Click Run to see the preview
          </div>
        )}
      </div>
    );
  }
);

Preview.displayName = 'Preview';