import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function DetailsTab({ lesson, onUpdate }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={lesson.title}
          onChange={(e) => onUpdate('title', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={lesson.description}
          onChange={(e) => onUpdate('description', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
}