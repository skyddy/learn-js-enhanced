import { Label } from '@/components/ui/label';
import { MonacoEditor } from '@/components/editor/MonacoEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

function ensureSerializable(data) {
  const seen = new WeakSet();
  return JSON.parse(JSON.stringify(data, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    if (typeof value === 'symbol') {
      return value.toString();
    }
    return value;
  }));
}

export function CodeTab({ lesson, onUpdate }) {
  const updateCode = (language, value) => {
    const updatedCode = {
      ...lesson.code,
      [language]: value
    };
    onUpdate('code', JSON.stringify(ensureSerializable(updatedCode)));
  };

  const updateSolution = (language, value) => {
    const updatedSolution = {
      ...lesson.solution,
      [language]: value
    };
    onUpdate('solution', JSON.stringify(ensureSerializable(updatedSolution)));
  };

  const tabStyles = cn(
    "transition-colors",
    "data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800",
    "data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50"
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label>Practice Code</Label>
        <Tabs defaultValue="html" className="w-full">
          <TabsList className="grid grid-cols-3 gap-4 p-1">
            <TabsTrigger value="html" className={tabStyles}>HTML</TabsTrigger>
            <TabsTrigger value="css" className={tabStyles}>CSS</TabsTrigger>
            <TabsTrigger value="js" className={tabStyles}>JavaScript</TabsTrigger>
          </TabsList>
          <TabsContent value="html">
            <MonacoEditor
              value={lesson.code.html}
              onChange={(value) => updateCode('html', value)}
              language="html"
            />
          </TabsContent>
          <TabsContent value="css">
            <MonacoEditor
              value={lesson.code.css}
              onChange={(value) => updateCode('css', value)}
              language="css"
            />
          </TabsContent>
          <TabsContent value="js">
            <MonacoEditor
              value={lesson.code.js}
              onChange={(value) => updateCode('js', value)}
              language="javascript"
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-4">
        <Label>Solution Code</Label>
        <Tabs defaultValue="html" className="w-full">
          <TabsList className="grid grid-cols-3 gap-4 p-1">
            <TabsTrigger value="html" className={tabStyles}>HTML</TabsTrigger>
            <TabsTrigger value="css" className={tabStyles}>CSS</TabsTrigger>
            <TabsTrigger value="js" className={tabStyles}>JavaScript</TabsTrigger>
          </TabsList>
          <TabsContent value="html">
            <MonacoEditor
              value={lesson.solution.html}
              onChange={(value) => updateSolution('html', value)}
              language="html"
            />
          </TabsContent>
          <TabsContent value="css">
            <MonacoEditor
              value={lesson.solution.css}
              onChange={(value) => updateSolution('css', value)}
              language="css"
            />
          </TabsContent>
          <TabsContent value="js">
            <MonacoEditor
              value={lesson.solution.js}
              onChange={(value) => updateSolution('js', value)}
              language="javascript"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}