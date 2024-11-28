import { Router } from 'express';
import { promises as fs } from 'fs';
import { join } from 'path';
import { config } from '../config.js';
import { writeFileInChunks } from '../utils/fileSystem.js';

const router = Router();

// Get all chapters with lessons
router.get('/', async (req, res, next) => {
  try {
    console.log('Reading chapters from:', config.chaptersFile);
    const data = await fs.readFile(config.chaptersFile, 'utf-8');
    const { chapters } = JSON.parse(data);

    const chaptersWithLessons = await Promise.all(
      chapters.map(async (chapter) => {
        const lessons = await Promise.all(
          chapter.lessons.map(async (lessonId) => {
            try {
              const lessonPath = join(config.lessonsDir, `${lessonId}.json`);
              console.log('Reading lesson from:', lessonPath);
              const lessonData = await fs.readFile(lessonPath, 'utf-8');
              const lesson = JSON.parse(lessonData);
              
              if (typeof lesson.code === 'string') {
                lesson.code = {
                  html: '',
                  css: '',
                  js: lesson.code
                };
              }
              if (typeof lesson.solution === 'string') {
                lesson.solution = {
                  html: '',
                  css: '',
                  js: lesson.solution
                };
              }
              
              return lesson;
            } catch (error) {
              console.error(`Error reading lesson ${lessonId}:`, error);
              return null;
            }
          })
        );
        return { ...chapter, lessons: lessons.filter(Boolean) };
      })
    );

    res.json(chaptersWithLessons);
  } catch (error) {
    next(new Error(`Failed to fetch chapters: ${error.message}`));
  }
});

// Create a new chapter
router.post('/', async (req, res, next) => {
  try {
    const chapter = req.body;
    const data = await fs.readFile(config.chaptersFile, 'utf-8');
    const { chapters } = JSON.parse(data);
    
    const newChapter = { ...chapter, id: `chapter-${Date.now()}`, lessons: [] };
    chapters.push(newChapter);
    
    await writeFileInChunks(config.chaptersFile, { chapters });
    res.status(201).json(newChapter);
  } catch (error) {
    next(error);
  }
});

// Update a chapter
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const data = await fs.readFile(config.chaptersFile, 'utf-8');
    const { chapters } = JSON.parse(data);
    
    const index = chapters.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    chapters[index] = { ...chapters[index], ...updates };
    await writeFileInChunks(config.chaptersFile, { chapters });
    
    res.json(chapters[index]);
  } catch (error) {
    next(error);
  }
});

// Delete a chapter
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile(config.chaptersFile, 'utf-8');
    const { chapters } = JSON.parse(data);
    
    const chapter = chapters.find(c => c.id === id);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    await Promise.all(
      chapter.lessons.map(lessonId =>
        fs.unlink(join(config.lessonsDir, `${lessonId}.json`))
          .catch(error => console.error(`Error deleting lesson ${lessonId}:`, error))
      )
    );
    
    const updatedChapters = chapters.filter(c => c.id !== id);
    await writeFileInChunks(config.chaptersFile, { chapters: updatedChapters });
    
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;