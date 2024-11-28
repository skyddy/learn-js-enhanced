// Course type definitions converted to JSDoc comments
/**
 * @typedef {Object} TestCase
 * @property {string} name
 * @property {string} test
 */

/**
 * @typedef {Object} Lesson
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} content
 * @property {Object} code
 * @property {string} code.html
 * @property {string} code.css
 * @property {string} code.js
 * @property {Object} solution
 * @property {string} solution.html
 * @property {string} solution.css
 * @property {string} solution.js
 * @property {TestCase[]} tests
 */

/**
 * @typedef {Object} Chapter
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {Lesson[]} lessons
 */

// Export empty object to maintain module structure
export default {};