import { useAdminStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ArrowRight, GraduationCap, Code2, Brain, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';

export function LessonsHub({ onStartLesson }) {
  const { chapters, isLessonComplete } = useAdminStore();

  // Calculate overall progress
  const totalLessons = chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0);
  const completedLessons = chapters.reduce((acc, chapter) => 
    acc + chapter.lessons.filter(lesson => isLessonComplete(lesson.id)).length, 0
  );
  const progressPercentage = (completedLessons / totalLessons) * 100;

  // Function to check if a lesson is accessible
  const isLessonAccessible = (chapterIndex, lessonIndex) => {
    // First lesson of first chapter is always accessible
    if (chapterIndex === 0 && lessonIndex === 0) return true;

    // Get previous lesson
    let prevLesson;
    if (lessonIndex === 0) {
      // First lesson of chapter - check last lesson of previous chapter
      const prevChapter = chapters[chapterIndex - 1];
      if (!prevChapter) return false;
      prevLesson = prevChapter.lessons[prevChapter.lessons.length - 1];
    } else {
      // Check previous lesson in same chapter
      prevLesson = chapters[chapterIndex].lessons[lessonIndex - 1];
    }

    return isLessonComplete(prevLesson.id);
  };

  // Function to get the next available lesson
  const getNextAvailableLesson = () => {
    for (let i = 0; i < chapters.length; i++) {
      for (let j = 0; j < chapters[i].lessons.length; j++) {
        if (isLessonAccessible(i, j) && !isLessonComplete(chapters[i].lessons[j].id)) {
          return {
            chapterId: chapters[i].id,
            lessonId: chapters[i].lessons[j].id
          };
        }
      }
    }
    return null;
  };

  const nextLesson = getNextAvailableLesson();

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-block p-2 bg-emerald-50 dark:bg-emerald-950 rounded-full mb-4">
          <GraduationCap className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Your Learning Journey</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Master JavaScript through interactive lessons and hands-on practice
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Overall Progress</h3>
              <p className="text-sm text-muted-foreground">
                {completedLessons} of {totalLessons} lessons completed
              </p>
            </div>
            {nextLesson && (
              <Button onClick={() => onStartLesson(nextLesson.chapterId, nextLesson.lessonId)}>
                Continue Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </Card>

      {/* Course Chapters */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Course Chapters</h2>
        <div className="grid gap-6">
          {chapters.map((chapter, chapterIndex) => {
            const chapterProgress = chapter.lessons.filter(
              lesson => isLessonComplete(lesson.id)
            ).length / chapter.lessons.length * 100;

            return (
              <Card key={chapter.id} className={cn(
                "transition-all duration-200",
                "border-l-4",
                chapterIndex === 0 && "border-l-emerald-500",
                chapterIndex === 1 && "border-l-blue-500",
                chapterIndex === 2 && "border-l-purple-500",
                chapterIndex === 3 && "border-l-orange-500",
                chapterIndex === 4 && "border-l-pink-500"
              )}>
                <CardHeader className="pb-4">
                  <CardTitle>{chapter.title}</CardTitle>
                  <CardDescription>{chapter.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{chapter.lessons.length} lessons</span>
                        <span>{Math.round(chapterProgress)}% complete</span>
                      </div>
                      <Progress value={chapterProgress} className="h-1" />
                    </div>
                    <div className="grid gap-2">
                      {chapter.lessons.map((lesson, lessonIndex) => {
                        const isAccessible = isLessonAccessible(chapterIndex, lessonIndex);
                        const isComplete = isLessonComplete(lesson.id);

                        return (
                          <div
                            key={lesson.id}
                            className={cn(
                              "flex items-center justify-between p-2 rounded-md",
                              isAccessible ? "hover:bg-secondary/50 cursor-pointer" : "opacity-50",
                              isComplete && "text-emerald-500"
                            )}
                            onClick={() => isAccessible && onStartLesson(chapter.id, lesson.id)}
                          >
                            <div className="flex items-center gap-2">
                              {isComplete ? (
                                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                              ) : (
                                isAccessible ? (
                                  <div className="h-4 w-4 rounded-full border-2 border-current flex-shrink-0" />
                                ) : (
                                  <Lock className="h-4 w-4 flex-shrink-0" />
                                )
                              )}
                              <span className="text-sm">{lesson.title}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}