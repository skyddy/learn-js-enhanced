import { Router } from 'express';
import { promises as fs } from 'fs';
import { config } from '../config.js';
import { writeFileInChunks } from '../utils/fileSystem.js';
import crypto from 'crypto';

const router = Router();

// Helper function to hash passwords
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Helper function to generate a unique ID
function generateId() {
  return crypto.randomBytes(16).toString('hex');
}

// Get users or initialize if not exists
async function getUsers() {
  try {
    const data = await fs.readFile(config.usersFile, 'utf-8');
    return JSON.parse(data).users;
  } catch (error) {
    // If file doesn't exist, create it with empty users array
    await writeFileInChunks(config.usersFile, { users: [] });
    return [];
  }
}

// Register new user
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const users = await getUsers();
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // First user gets admin role, others get user role
    const role = users.length === 0 ? 'admin' : 'user';

    const newUser = {
      id: generateId(),
      email,
      name,
      role,
      password: hashPassword(password),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeFileInChunks(config.usersFile, { users });

    // Don't send password back
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = await getUsers();
    const user = users.find(u => u.email === email);

    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Don't send password back
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const users = await getUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email !== users[userIndex].email && 
        users.some(u => u.email === email && u.id !== id)) {
      return res.status(400).json({ error: 'Email already taken' });
    }

    users[userIndex] = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      email: email || users[userIndex].email,
    };

    await writeFileInChunks(config.usersFile, { users });

    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// Change password
router.put('/change-password/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new passwords are required' });
    }

    const users = await getUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (users[userIndex].password !== hashPassword(currentPassword)) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    users[userIndex].password = hashPassword(newPassword);
    await writeFileInChunks(config.usersFile, { users });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Update user role (admin only)
router.put('/role/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, adminId } = req.body;

    if (!['user', 'admin', 'instructor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const users = await getUsers();
    
    // Verify that the requester is an admin
    const admin = users.find(u => u.id === adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can change roles' });
    }

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users[userIndex].role = role;
    await writeFileInChunks(config.usersFile, { users });

    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

export default router;