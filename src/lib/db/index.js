import { promises as fs } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'src/lib/db/data');
const CHAPTERS_FILE = join(DATA_DIR, 'chapters.json');
const LESSONS_DIR = join(DATA_DIR, 'lessons');

export async function getChapters() {
  try {
    const data = await fs.readFile(CHAPTERS_FILE, 'utf-8');
    const { chapters } = JSON.parse(data);

    // Load lessons for each chapter
    const chaptersWithLessons = await Promise.all(
      chapters.map(async (chapter) => {
        const lessons = await Promise.all(
          chapter.lessons.map((lessonId) =>
            getLessonById(lessonId)
          )
        );
        return { ...chapter, lessons };
      })
    );

    return chaptersWithLessons;
  } catch (error) {
    console.error('Error reading chapters:', error);
    return [];
  }
}

export async function getLessonById(id) {
  try {
    const data = await fs.readFile(join(LESSONS_DIR, `${id}.json`), 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading lesson ${id}:`, error);
    return null;
  }
}

export async function createChapter(chapter) {
  try {
    const data = await fs.readFile(CHAPTERS_FILE, 'utf-8');
    const { chapters } = JSON.parse(data);
    
    const newChapter = { ...chapter, lessons: [] };
    chapters.push(newChapter);
    
    await fs.writeFile(CHAPTERS_FILE, JSON.stringify({ chapters }, null, 2));
    return newChapter;
  } catch (error) {
    console.error('Error creating chapter:', error);
    throw error;
  }
}

export async function createLesson(chapterId, lesson) {
  try {
    const lessonId = `lesson-${Date.now()}`;
    const newLesson = { id: lessonId, ...lesson };
    
    // Save lesson file
    await fs.writeFile(
      join(LESSONS_DIR, `${lessonId}.json`),
      JSON.stringify(newLesson, null, 2)
    );
    
    // Update chapter's lessons array
    const data = await fs.readFile(CHAPTERS_FILE, 'utf-8');
    const { chapters } = JSON.parse(data);
    const chapterIndex = chapters.findIndex((c) => c.id === chapterId);
    
    if (chapterIndex === -1) throw new Error('Chapter not found');
    
    chapters[chapterIndex].lessons.push(lessonId);
    await fs.writeFile(CHAPTERS_FILE, JSON.stringify({ chapters }, null, 2));
    
    return newLesson;
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw error;
  }
}

export async function updateLesson(id, updates) {
  try {
    const lesson = await getLessonById(id);
    if (!lesson) throw new Error('Lesson not found');
    
    const updatedLesson = { ...lesson, ...updates };
    await fs.writeFile(
      join(LESSONS_DIR, `${id}.json`),
      JSON.stringify(updatedLesson, null, 2)
    );
    
    return updatedLesson;
  } catch (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }
}

export async function deleteLesson(chapterId, lessonId) {
  try {
    // Delete lesson file
    await fs.unlink(join(LESSONS_DIR, `${lessonId}.json`));
    
    // Update chapter's lessons array
    const data = await fs.readFile(CHAPTERS_FILE, 'utf-8');
    const { chapters } = JSON.parse(data);
    const chapterIndex = chapters.findIndex((c) => c.id === chapterId);
    
    if (chapterIndex === -1) throw new Error('Chapter not found');
    
    chapters[chapterIndex].lessons = chapters[chapterIndex].lessons.filter(
      (id) => id !== lessonId
    );
    
    await fs.writeFile(CHAPTERS_FILE, JSON.stringify({ chapters }, null, 2));
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
}

export async function deleteChapter(id) {
  try {
    const data = await fs.readFile(CHAPTERS_FILE, 'utf-8');
    const { chapters } = JSON.parse(data);
    
    const chapter = chapters.find((c) => c.id === id);
    if (!chapter) throw new Error('Chapter not found');
    
    // Delete all lesson files for this chapter
    await Promise.all(
      chapter.lessons.map((lessonId) =>
        fs.unlink(join(LESSONS_DIR, `${lessonId}.json`))
      )
    );
    
    // Remove chapter from chapters.json
    const updatedChapters = chapters.filter((c) => c.id !== id);
    await fs.writeFile(
      CHAPTERS_FILE,
      JSON.stringify({ chapters: updatedChapters }, null, 2)
    );
  } catch (error) {
    console.error('Error deleting chapter:', error);
    throw error;
  }
}