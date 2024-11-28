import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Code2, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DetailsTab } from './tabs/DetailsTab';
import { ContentTab } from './tabs/ContentTab';
import { CodeTab } from './tabs/CodeTab';
import { toast } from 'sonner';
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

export function LessonEditor({ lesson, onUpdateLesson }) {
  const [localLesson, setLocalLesson] = useState(() => ensureSerializable(lesson));
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentTab, setCurrentTab] = useState('details');

  useEffect(() => {
    setLocalLesson(ensureSerializable(lesson));
    setHasChanges(false);
  }, [lesson]);

  const handleLocalUpdate = (field, value) => {
    try {
      const serializedValue = ensureSerializable(value);
      setLocalLesson(prev => ({
        ...prev,
        [field]: serializedValue
      }));
      setHasChanges(true);
    } catch (error) {
      console.error('Error updating local lesson:', error);
      toast.error('Failed to update: Invalid data format');
    }
  };

  const handleSave = async () => {
    if (!hasChanges || isSaving) return;

    setIsSaving(true);
    try {
      const updates = ensureSerializable({
        title: localLesson.title,
        description: localLesson.description,
        content: localLesson.content,
        code: localLesson.code,
        solution: localLesson.solution,
      });

      await onUpdateLesson(lesson.id, updates);
      setHasChanges(false);
      toast.success('Changes saved successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save changes';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Edit Lesson</span>
            </CardTitle>
            <CardDescription>
              Modify lesson content and settings
            </CardDescription>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 gap-4 p-1">
            <TabsTrigger 
              value="details" 
              className={cn(
                "flex items-center gap-2 transition-colors",
                "data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800",
                "data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50"
              )}
            >
              <FileText className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger 
              value="content"
              className={cn(
                "flex items-center gap-2 transition-colors",
                "data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800",
                "data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50"
              )}
            >
              <BookOpen className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger 
              value="code"
              className={cn(
                "flex items-center gap-2 transition-colors",
                "data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800",
                "data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50"
              )}
            >
              <Code2 className="h-4 w-4" />
              Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <DetailsTab lesson={localLesson} onUpdate={handleLocalUpdate} />
          </TabsContent>

          <TabsContent value="content">
            <ContentTab lesson={localLesson} onUpdate={handleLocalUpdate} />
          </TabsContent>

          <TabsContent value="code">
            <CodeTab lesson={localLesson} onUpdate={handleLocalUpdate} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}