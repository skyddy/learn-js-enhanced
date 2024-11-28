import { Router } from 'express';
import { promises as fs } from 'fs';
import { join } from 'path';
import { config } from '../config.js';
import { writeFileInChunks } from '../utils/fileSystem.js';

const router = Router({ mergeParams: true });

// Create a new lesson
router.post('/', async (req, res, next) => {
  try {
    const { chapterId } = req.params;
    const lesson = req.body;
    
    const data = await fs.readFile(config.chaptersFile, 'utf-8');
    const { chapters } = JSON.parse(data);
    
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    const lessonId = `lesson-${Date.now()}`;
    const newLesson = {
      id: lessonId,
      ...lesson,
      code: lesson.code || { html: '', css: '', js: '' },
      solution: lesson.solution || { html: '', css: '', js: '' }
    };
    
    await writeFileInChunks(
      join(config.lessonsDir, `${lessonId}.json`),
      newLesson
    );
    
    chapter.lessons.push(lessonId);
    await writeFileInChunks(config.chaptersFile, { chapters });
    
    res.status(201).json(newLesson);
  } catch (error) {
    next(error);
  }
});

// Update a lesson
router.put('/:lessonId', async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const updates = req.body;
    
    const lessonPath = join(config.lessonsDir, `${lessonId}.json`);
    
    try {
      const lessonData = await fs.readFile(lessonPath, 'utf-8');
      const lesson = JSON.parse(lessonData);
      
      if (updates.code && typeof updates.code === 'string') {
        updates.code = JSON.parse(updates.code);
      }
      if (updates.solution && typeof updates.solution === 'string') {
        updates.solution = JSON.parse(updates.solution);
      }
      
      const updatedLesson = { ...lesson, ...updates };
      await writeFileInChunks(lessonPath, updatedLesson);
      
      res.json(updatedLesson);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({ error: 'Lesson not found' });
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

// Delete a lesson
router.delete('/:lessonId', async (req, res, next) => {
  try {
    const { chapterId, lessonId } = req.params;
    
    const data = await fs.readFile(config.chaptersFile, 'utf-8');
    const { chapters } = JSON.parse(data);
    
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    chapter.lessons = chapter.lessons.filter(id => id !== lessonId);
    await writeFileInChunks(config.chaptersFile, { chapters });
    
    try {
      await fs.unlink(join(config.lessonsDir, `${lessonId}.json`));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;