import { promises as fs } from 'fs';
import { config } from '../config.js';

export async function ensureDirectories() {
  try {
    console.log('Creating data directories...');
    await fs.mkdir(config.dataDir, { recursive: true });
    await fs.mkdir(config.lessonsDir, { recursive: true });
    
    try {
      await fs.access(config.chaptersFile);
      console.log('chapters.json already exists');
    } catch {
      console.log('Creating initial chapters.json');
      await fs.writeFile(config.chaptersFile, JSON.stringify({ chapters: [] }, null, 2));
    }
  } catch (error) {
    console.error('Error creating directories:', error);
    throw new Error(`Failed to create required directories: ${error.message}`);
  }
}

export async function writeFileInChunks(filePath, data) {
  const jsonData = JSON.stringify(data, null, 2);
  const buffer = Buffer.from(jsonData);
  
  const fileHandle = await fs.open(filePath, 'w');
  try {
    let position = 0;
    while (position < buffer.length) {
      const chunk = buffer.slice(position, position + config.chunkSize);
      await fileHandle.write(chunk, 0, chunk.length, position);
      position += chunk.length;
    }
  } finally {
    await fileHandle.close();
  }
}