import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as api from './api';
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

export const useAdminStore = create()(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // Course state
      chapters: [],
      completedLessons: {},
      
      setChapters: (chapters) => set({ chapters: ensureSerializable(chapters) }),
      
      loadChapters: async () => {
        try {
          const chapters = await api.getChapters();
          set({ chapters: ensureSerializable(chapters) });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to load chapters';
          toast.error(message);
          throw error;
        }
      },
      
      addChapter: async (chapter) => {
        try {
          const newChapter = await api.createChapter(ensureSerializable(chapter));
          set((state) => ({ 
            chapters: ensureSerializable([...state.chapters, newChapter])
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to add chapter';
          toast.error(message);
          throw error;
        }
      },
      
      updateChapter: async (id, chapter) => {
        try {
          const updatedChapter = await api.updateChapter(id, ensureSerializable(chapter));
          set((state) => ({
            chapters: ensureSerializable(
              state.chapters.map((c) => c.id === id ? updatedChapter : c)
            ),
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update chapter';
          toast.error(message);
          throw error;
        }
      },
      
      deleteChapter: async (id) => {
        try {
          await api.deleteChapter(id);
          set((state) => ({
            chapters: ensureSerializable(
              state.chapters.filter((c) => c.id !== id)
            ),
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete chapter';
          toast.error(message);
          throw error;
        }
      },
      
      addLesson: async (chapterId, lesson) => {
        try {
          const newLesson = await api.createLesson(chapterId, ensureSerializable(lesson));
          set((state) => ({
            chapters: ensureSerializable(
              state.chapters.map((chapter) =>
                chapter.id === chapterId
                  ? { ...chapter, lessons: [...chapter.lessons, newLesson] }
                  : chapter
              )
            ),
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to add lesson';
          toast.error(message);
          throw error;
        }
      },
      
      updateLesson: async (chapterId, lessonId, updates) => {
        try {
          const updatedLesson = await api.updateLesson(
            chapterId,
            lessonId,
            ensureSerializable(updates)
          );
          
          set((state) => ({
            chapters: ensureSerializable(
              state.chapters.map((chapter) =>
                chapter.id === chapterId
                  ? {
                      ...chapter,
                      lessons: chapter.lessons.map((lesson) =>
                        lesson.id === lessonId ? updatedLesson : lesson
                      ),
                    }
                  : chapter
              )
            ),
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update lesson';
          toast.error(message);
          throw error;
        }
      },
      
      deleteLesson: async (chapterId, lessonId) => {
        try {
          await api.deleteLesson(chapterId, lessonId);
          set((state) => ({
            chapters: ensureSerializable(
              state.chapters.map((chapter) =>
                chapter.id === chapterId
                  ? {
                      ...chapter,
                      lessons: chapter.lessons.filter((lesson) => lesson.id !== lessonId),
                    }
                  : chapter
              )
            ),
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete lesson';
          toast.error(message);
          throw error;
        }
      },

      markLessonComplete: (lessonId) => {
        set((state) => ({
          completedLessons: {
            ...state.completedLessons,
            [lessonId]: true
          }
        }));
      },

      isLessonComplete: (lessonId) => {
        return get().completedLessons[lessonId] || false;
      },
    }),
    {
      name: 'course-storage',
      partialize: (state) => ({ 
        completedLessons: state.completedLessons,
        user: state.user
      }),
    }
  )
);