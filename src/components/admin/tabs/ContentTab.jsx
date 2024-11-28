import { Label } from '@/components/ui/label';
import { MonacoEditor } from '@/components/editor/MonacoEditor';

export function ContentTab({ lesson, onUpdate }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Lesson Content (Markdown)</Label>
        <MonacoEditor
          value={lesson.content}
          onChange={(value) => onUpdate('content', value)}
          language="markdown"
          height="500px"
        />
      </div>
    </div>
  );
}