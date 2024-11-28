import { useAdminStore } from '@/lib/store';
import { toast } from 'sonner';

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

export function useLessonManagement(chapterId) {
  const { addLesson, updateLesson, deleteLesson } = useAdminStore();

  const handleAddLesson = async (data) => {
    try {
      const serializableData = ensureSerializable(data);
      await addLesson(chapterId, serializableData);
      toast.success('Lesson added successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add lesson';
      toast.error(message);
      throw error;
    }
  };

  const handleUpdateLesson = async (lessonId, updates) => {
    try {
      const serializableUpdates = ensureSerializable(updates);
      await updateLesson(chapterId, lessonId, serializableUpdates);
      toast.success('Lesson updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update lesson';
      toast.error(message);
      throw error;
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      await deleteLesson(chapterId, lessonId);
      toast.success('Lesson deleted successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete lesson';
      toast.error(message);
      throw error;
    }
  };

  return {
    handleAddLesson,
    handleUpdateLesson,
    handleDeleteLesson,
  };
}