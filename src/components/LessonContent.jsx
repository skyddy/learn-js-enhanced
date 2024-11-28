import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useAdminStore } from '@/lib/store';
import { LessonHeader } from './lesson/LessonHeader';
import { LessonMarkdown } from './lesson/LessonMarkdown';
import { LessonPractice } from './lesson/LessonPractice';

export function LessonContent({ lesson, onNext, onPrevious, isFirstLesson }) {
  const [output, setOutput] = useState('');
  const [hasCompletedPractice, setHasCompletedPractice] = useState(false);
  const { markLessonComplete, isLessonComplete } = useAdminStore();

  useEffect(() => {
    setOutput('');
    setHasCompletedPractice(isLessonComplete(lesson.id));
  }, [lesson.id, isLessonComplete]);

  const handleRun = async (code, allTestsPassed) => {
    console.log('Running code and tests...');
    
    try {
      // Only mark lesson as complete if all tests passed
      if (allTestsPassed && !hasCompletedPractice) {
        setHasCompletedPractice(true);
        markLessonComplete(lesson.id);
      }
    } catch (error) {
      console.error('Error running code:', error);
    }
  };

  return (
    <div className="space-y-8">
      <LessonHeader lesson={lesson} />
      
      <Card className="p-6 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <LessonMarkdown content={lesson.content} />
      </Card>

      <LessonPractice
        lesson={lesson}
        hasCompletedPractice={hasCompletedPractice}
        onRun={handleRun}
        onOutput={setOutput}
        onNext={onNext}
        onPrevious={onPrevious}
        isFirstLesson={isFirstLesson}
      />
    </div>
  );
}