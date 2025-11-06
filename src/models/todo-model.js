/**
 * @class TodoModel
 * @description Manages the todo list data and business logic.
 * Implements the Observer pattern for reactive updates.
 *
 * @example
 * const storage = new StorageService();
 * const model = new TodoModel(storage);
 * model.subscribe(() => console.log('Todos updated!'));
 * model.addTodo('Buy groceries');
 */
export class TodoModel {
  /**
   * Creates a new TodoModel instance.
   *
   * @constructor
   * @param {StorageService} storageService - The storage service for persistence
   */
  constructor(storageService) {
    /**
     * @private
     * @type {StorageService}
     */
    this.storage = storageService;

    /**
     * @type {Array<Todo>}
     * @description Array of all todo items
     */
    this.todos = this.storage.load('items', []);

    /**
     * @private
     * @type {Array<Function>}
     * @description List of subscriber callbacks
     */
    this.listeners = [];

    /**
     * @private
     * @type {number}
     * @description Next available ID for new todos
     */
    this.nextId = this.storage.load('nextId', 1);
  }

  /**
   * Subscribe to model changes.
   *
   * @param {Function} listener - Callback function to be called on changes
   * @returns {void}
   *
   * @example
   * model.subscribe(() => {
   *   console.log('Todos changed:', model.todos);
   * });
   */
  subscribe(listener) {
    this.listeners.push(listener);
  }

  /**
   * Notify all subscribers of changes.
   *
   * @private
   * @returns {void}
   */
  notify() {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Add a new todo item.
   *
   * @param {string} text - The text content of the todo
   * @returns {void}
   * @fires TodoModel#notify
   *
   * @example
   * model.addTodo('Buy groceries');
   * model.addTodo('  Clean room  '); // Whitespace is trimmed
   */
  addTodo(text) {
    if (!text || text.trim() === '') {
      return;
    }

    const todo = {
      id: this.nextId++,
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.todos.push(todo);
    this.save();
    this.notify();
  }

  /**
   * Toggle the completion status of a todo.
   *
   * @param {number} id - The ID of the todo to toggle
   * @returns {void}
   * @fires TodoModel#notify
   *
   * @example
   * model.toggleComplete(1);
   */
  toggleComplete(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.save();
      this.notify();
    }
  }

  /**
   * Delete a todo item.
   *
   * @param {number} id - The ID of the todo to delete
   * @returns {void}
   * @fires TodoModel#notify
   *
   * @example
   * model.deleteTodo(1);
   */
  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.save();
    this.notify();
  }

  /**
   * Update the text of an existing todo.
   *
   * @param {number} id - The ID of the todo to update
   * @param {string} newText - The new text content
   * @returns {void}
   * @fires TodoModel#notify
   *
   * @example
   * model.updateTodo(1, 'Updated todo text');
   */
  updateTodo(id, newText) {
    const todo = this.todos.find(t => t.id === id);
    if (todo && newText && newText.trim() !== '') {
      todo.text = newText.trim();
      this.save();
      this.notify();
    }
  }

  /**
   * Clear all completed todos.
   *
   * @returns {void}
   * @fires TodoModel#notify
   *
   * @example
   * model.clearCompleted();
   */
  clearCompleted() {
    this.todos = this.todos.filter(t => !t.completed);
    this.save();
    this.notify();
  }

  /**
   * Clear all todos.
   *
   * @returns {void}
   * @fires TodoModel#notify
   *
   * @example
   * model.clearAll();
   */
  clearAll() {
    this.todos = [];
    this.save();
    this.notify();
  }

  /**
   * Get count of active (incomplete) todos.
   *
   * @returns {number} The number of active todos
   *
   * @example
   * const count = model.activeCount;
   * console.log(`You have ${count} active tasks`);
   */
  get activeCount() {
    return this.todos.filter(t => !t.completed).length;
  }

  /**
   * Get count of completed todos.
   *
   * @returns {number} The number of completed todos
   *
   * @example
   * const count = model.completedCount;
   * console.log(`You completed ${count} tasks`);
   */
  get completedCount() {
    return this.todos.filter(t => t.completed).length;
  }

  /**
   * Save todos to storage.
   *
   * @private
   * @returns {void}
   */
  save() {
    this.storage.save('items', this.todos);
    this.storage.save('nextId', this.nextId);
  }
}

/**
 * @typedef {Object} Todo
 * @property {number} id - Unique identifier
 * @property {string} text - Todo text content
 * @property {boolean} completed - Completion status
 * @property {string} createdAt - ISO timestamp of creation
 */