import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function LessonList({
  chapter,
  selectedLesson,
  onSelectLesson,
  onDeleteLesson,
  onAddLesson,
}) {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Lessons</CardTitle>
        <Button size="icon" onClick={onAddLesson}>
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {chapter.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={cn(
                "flex items-center justify-between p-2 rounded-md",
                selectedLesson === lesson.id
                  ? "bg-secondary"
                  : "hover:bg-secondary/50",
                "cursor-pointer"
              )}
              onClick={() => onSelectLesson(lesson.id)}
            >
              <span>{lesson.title}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteLesson(lesson.id);
                  toast.success('Lesson deleted');
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}