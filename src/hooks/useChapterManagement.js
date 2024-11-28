import { useAdminStore } from '@/lib/store';
import { toast } from 'sonner';

export function useChapterManagement() {
  const {
    chapters,
    setChapters,
    addChapter,
    updateChapter,
    deleteChapter,
  } = useAdminStore();

  const handleAddChapter = (data) => {
    const id = `chapter-${Date.now()}`;
    addChapter({
      id,
      ...data,
      lessons: [],
    });
    toast.success('Chapter added successfully');
  };

  const handleMoveChapter = (chapterId, direction) => {
    const currentIndex = chapters.findIndex((c) => c.id === chapterId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === chapters.length - 1)
    )
      return;

    const newChapters = [...chapters];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newChapters[currentIndex], newChapters[targetIndex]] = [
      newChapters[targetIndex],
      newChapters[currentIndex],
    ];
    setChapters(newChapters);
    toast.success('Chapter order updated');
  };

  const handleUpdateChapter = (id, title) => {
    updateChapter(id, { title });
  };

  const handleDeleteChapter = (id) => {
    deleteChapter(id);
    toast.success('Chapter deleted');
  };

  return {
    chapters,
    handleAddChapter,
    handleMoveChapter,
    handleUpdateChapter,
    handleDeleteChapter,
  };
}