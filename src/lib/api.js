import axios from 'axios';
import { toast } from 'sonner';

const API_URL = 'http://localhost:3001/api';

/**
 * Ensures data is serializable by handling circular references and symbols
 * @template T
 * @param {T} data - Data to serialize
 * @returns {T} Serialized data
 */
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

/**
 * Checks if the API server is healthy
 * @returns {Promise<boolean>} True if the API is healthy
 */
export async function checkApiHealth() {
  try {
    const response = await axios.get(`${API_URL}/health`, {
      timeout: 5000 // 5 second timeout
    });
    return response.status === 200 && response.data.status === 'healthy';
  } catch (error) {
    console.error('API Health Check Failed:', error);
    if (axios.isAxiosError(error)) {
      const message = error.code === 'ECONNREFUSED' 
        ? 'Cannot connect to the API server. Make sure it is running.'
        : error.code === 'ECONNABORTED'
        ? 'Connection timeout. Server might be starting up...'
        : `API Error: ${error.message}`;
      toast.error(message);
    }
    return false;
  }
}

export async function getChapters() {
  try {
    const response = await axios.get(`${API_URL}/chapters`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch chapters');
    }
    throw error;
  }
}

export async function createChapter(data) {
  try {
    const response = await axios.post(`${API_URL}/chapters`, ensureSerializable(data));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to create chapter');
    }
    throw error;
  }
}

export async function updateChapter(id, data) {
  try {
    const response = await axios.put(
      `${API_URL}/chapters/${id}`,
      ensureSerializable(data)
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to update chapter');
    }
    throw error;
  }
}

export async function deleteChapter(id) {
  try {
    await axios.delete(`${API_URL}/chapters/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to delete chapter');
    }
    throw error;
  }
}

export async function createLesson(chapterId, data) {
  try {
    const response = await axios.post(
      `${API_URL}/chapters/${chapterId}/lessons`,
      ensureSerializable(data)
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to create lesson');
    }
    throw error;
  }
}

export async function updateLesson(chapterId, lessonId, data) {
  try {
    const response = await axios.put(
      `${API_URL}/chapters/${chapterId}/lessons/${lessonId}`,
      ensureSerializable(data)
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to update lesson');
    }
    throw error;
  }
}

export async function deleteLesson(chapterId, lessonId) {
  try {
    await axios.delete(`${API_URL}/chapters/${chapterId}/lessons/${lessonId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to delete lesson');
    }
    throw error;
  }
}

export async function register(data) {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
    throw error;
  }
}

export async function login(data) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
    throw error;
  }
}

export async function updateProfile(id, data) {
  try {
    const response = await axios.put(`${API_URL}/auth/profile/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
    throw error;
  }
}

export async function changePassword(id, data) {
  try {
    const response = await axios.put(`${API_URL}/auth/change-password/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to change password');
    }
    throw error;
  }
}