import { useState } from 'react';
import { useChapterManagement } from '@/hooks/useChapterManagement';
import { useLessonManagement } from '@/hooks/useLessonManagement';
import { ChapterList } from './ChapterList';
import { LessonList } from './LessonList';
import { LessonEditor } from './LessonEditor';
import { NewChapterDialog } from './NewChapterDialog';
import { NewLessonDialog } from './NewLessonDialog';

export function AdminDashboard() {
  const {
    chapters,
    handleAddChapter,
    handleMoveChapter,
    handleDeleteChapter,
    handleUpdateChapter,
  } = useChapterManagement();

  const [selectedChapter, setSelectedChapter] = useState(chapters[0]?.id || '');
  const [selectedLesson, setSelectedLesson] = useState(chapters[0]?.lessons[0]?.id || '');
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);

  const currentChapter = chapters.find((c) => c.id === selectedChapter);
  const currentLesson = currentChapter?.lessons.find(
    (l) => l.id === selectedLesson
  );

  const {
    handleAddLesson,
    handleUpdateLesson,
    handleDeleteLesson,
  } = useLessonManagement(selectedChapter);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your course content and structure
          </p>
        </div>
        <NewChapterDialog onAddChapter={handleAddChapter} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ChapterList
          chapters={chapters}
          selectedChapter={selectedChapter}
          onSelectChapter={setSelectedChapter}
          onMoveChapter={handleMoveChapter}
          onDeleteChapter={handleDeleteChapter}
          onUpdateChapter={handleUpdateChapter}
        />

        {currentChapter && (
          <LessonList
            chapter={currentChapter}
            selectedLesson={selectedLesson}
            onSelectLesson={setSelectedLesson}
            onDeleteLesson={handleDeleteLesson}
            onAddLesson={() => setIsLessonDialogOpen(true)}
          />
        )}

        {currentLesson && (
          <LessonEditor
            lesson={currentLesson}
            onUpdateLesson={handleUpdateLesson}
          />
        )}

        {currentChapter && (
          <NewLessonDialog
            open={isLessonDialogOpen}
            onOpenChange={setIsLessonDialogOpen}
            onAddLesson={handleAddLesson}
            chapterTitle={currentChapter.title}
          />
        )}
      </div>
    </div>
  );
}