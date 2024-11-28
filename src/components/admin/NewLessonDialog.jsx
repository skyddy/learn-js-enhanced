import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DetailsTab } from './tabs/DetailsTab';
import { ContentTab } from './tabs/ContentTab';
import { CodeTab } from './tabs/CodeTab';
import { useState } from 'react';

export function NewLessonDialog({
  open,
  onOpenChange,
  onAddLesson,
  chapterTitle,
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    code: '',
    solution: '',
  });

  const handleSubmit = () => {
    onAddLesson(formData);
    setFormData({
      title: '',
      description: '',
      content: '',
      code: '',
      solution: '',
    });
    onOpenChange(false);
  };

  const handleUpdate = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-8 pt-6 pb-4">
          <DialogTitle>Add New Lesson</DialogTitle>
          <DialogDescription>
            Create a new lesson for {chapterTitle}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="px-8 py-4 space-y-8">
            <DetailsTab
              lesson={formData}
              onUpdate={handleUpdate}
            />
            <ContentTab
              lesson={formData}
              onUpdate={handleUpdate}
            />
            <CodeTab
              lesson={formData}
              onUpdate={handleUpdate}
            />
          </div>
        </ScrollArea>

        <DialogFooter className="p-8 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Lesson</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}