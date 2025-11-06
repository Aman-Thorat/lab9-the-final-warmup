/**
 * @fileoverview Type definitions for the Todo application.
 * @module types
 */

/**
 * @typedef {Object} Todo
 * @property {number} id - Unique identifier for the todo
 * @property {string} text - The text content of the todo
 * @property {boolean} completed - Whether the todo is completed
 * @property {string} createdAt - ISO 8601 timestamp of creation
 *
 * @example
 * {
 *   id: 1,
 *   text: 'Buy groceries',
 *   completed: false,
 *   createdAt: '2024-01-15T10:30:00.000Z'
 * }
 */

/**
 * @typedef {Object} TodoEventDetail
 * @property {number} id - The ID of the todo involved in the event
 *
 * @example
 * // Event detail for toggle-todo event
 * { id: 1 }
 */

/**
 * @typedef {Object} UpdateTodoEventDetail
 * @property {number} id - The ID of the todo to update
 * @property {string} text - The new text for the todo
 *
 * @example
 * { id: 1, text: 'Updated todo text' }
 */

/**
 * @typedef {Object} AddTodoEventDetail
 * @property {string} text - The text for the new todo
 *
 * @example
 * { text: 'New todo item' }
 */