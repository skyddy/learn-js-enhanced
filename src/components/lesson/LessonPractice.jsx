import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { CodeEditor } from '@/components/editor/CodeEditor';

export function LessonPractice({ 
  lesson, 
  hasCompletedPractice, 
  onRun, 
  onOutput,
  onNext,
  onPrevious,
  isFirstLesson
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Practice</h3>
        {hasCompletedPractice && (
          <div className="flex items-center gap-2 text-emerald-500">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">Completed</span>
          </div>
        )}
      </div>

      <CodeEditor
        initialCode={lesson.code}
        solution={lesson.solution}
        tests={lesson.tests}
        onRun={onRun}
        onOutput={onOutput}
      />

      {lesson.tests && lesson.tests.length > 0 && (
        <Card className="p-6 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <h4 className="text-lg font-semibold mb-4">Tests to Pass</h4>
          <ul className="space-y-2">
            {lesson.tests.map((test, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-zinc-400">•</span>
                <span className="text-sm text-muted-foreground">{test.name}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {(onNext || onPrevious) && (
        <div className="flex justify-between mt-8">
          {onPrevious && !isFirstLesson ? (
            <Button
              onClick={onPrevious}
              variant="outline"
              className="group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Previous Lesson
            </Button>
          ) : <div />}

          {onNext && (
            <Button
              onClick={onNext}
              disabled={!hasCompletedPractice}
              className="group"
            >
              Next Lesson
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}