/**
 * @class StorageService
 * @description A service for managing browser localStorage with automatic JSON serialization.
 * Provides a simple API for saving, loading, and managing data in localStorage.
 *
 * @example
 * const storage = new StorageService('myapp-');
 * storage.save('user', { name: 'John', age: 30 });
 * const user = storage.load('user');
 */
export class StorageService {
  /**
   * Creates a new StorageService instance.
   *
   * @constructor
   * @param {string} [prefix='todo-'] - Prefix for all localStorage keys
   * @param {Storage} [storage=localStorage] - Storage object to use (default: localStorage)
   */
  constructor(prefix = 'todo-', storage = localStorage) {
    /**
     * @private
     * @type {string}
     */
    this.prefix = prefix;

    /**
     * @private
     * @type {Storage}
     */
    this.storage = storage;
  }

  /**
   * Save data to localStorage with automatic JSON serialization.
   *
   * @param {string} key - The key to store the data under
   * @param {*} data - The data to store (will be JSON serialized)
   * @returns {void}
   *
   * @example
   * storage.save('todos', [{ id: 1, text: 'Buy milk' }]);
   * storage.save('count', 42);
   */
  save(key, data) {
    try {
      this.storage.setItem(this.prefix + key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
    }
  }

  /**
   * Load data from localStorage with automatic JSON deserialization.
   *
   * @param {string} key - The key to retrieve data from
   * @param {*} [defaultValue=null] - Default value if key doesn't exist
   * @returns {*} The stored data or default value
   *
   * @example
   * const todos = storage.load('todos', []);
   * const count = storage.load('count', 0);
   */
  load(key, defaultValue = null) {
    try {
      const item = this.storage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Remove an item from localStorage.
   *
   * @param {string} key - The key to remove
   * @returns {void}
   *
   * @example
   * storage.remove('todos');
   */
  remove(key) {
    try {
      this.storage.removeItem(this.prefix + key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  }

  /**
   * Clear all items with this service's prefix from localStorage.
   *
   * @returns {void}
   *
   * @example
   * storage.clear(); // Removes all 'todo-*' items
   */
  clear() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => this.storage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}