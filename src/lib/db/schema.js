/**
 * @typedef {Object} Chapter
 * @property {string} id - Unique identifier for the chapter
 * @property {string} title - Chapter title
 * @property {string} description - Chapter description
 * @property {string[]} lessons - Array of lesson IDs
 */

/**
 * @typedef {Object} Lesson
 * @property {string} id - Unique identifier for the lesson
 * @property {string} title - Lesson title
 * @property {string} description - Lesson description
 * @property {string} content - Markdown content
 * @property {CodeContent} code - Initial code for practice
 * @property {CodeContent} solution - Solution code
 * @property {Test[]} [tests] - Optional array of tests
 */

/**
 * @typedef {Object} CodeContent
 * @property {string} html - HTML code
 * @property {string} css - CSS code
 * @property {string} js - JavaScript code
 */

/**
 * @typedef {Object} Test
 * @property {string} name - Test name/description
 * @property {string} test - Test code to execute
 */

/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier
 * @property {string} email - User's email
 * @property {string} name - User's name
 * @property {string} password - Hashed password
 * @property {'user' | 'admin' | 'instructor'} role - User role
 * @property {string} createdAt - ISO date string
 */

export default {};