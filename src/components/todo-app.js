import { LitElement, html, css } from 'lit';
import { TodoModel } from '../models/todo-model.js';
import { StorageService } from '../services/storage-service.js';
import './todo-form.js';
import './todo-list.js';

/**
 * @class TodoApp
 * @extends LitElement
 * @description Main application component that coordinates between Model and View components.
 * Manages the overall state and communication between todo-form and todo-list.
 *
 * @fires add-todo - When a new todo is added
 * @fires toggle-todo - When a todo completion status is toggled
 * @fires delete-todo - When a todo is deleted
 * @fires update-todo - When a todo is updated
 *
 * @example
 * <todo-app></todo-app>
 */
export class TodoApp extends LitElement {
  static properties = {
    /** @type {Array<Todo>} Array of todos */
    todos: { state: true },
    /** @type {'light' | 'dark'} Current theme */
    theme: { state: true }
  };

  static styles = css`
    /* 1. Host uses CSS variables defined in /styles.css */
    :host {
      display: block;
      /* Pass theme to child components if needed */
      --app-bg-color: var(--app-bg-color);
      --app-card-bg-color: var(--app-card-bg-color);
      --app-text-color-primary: var(--app-text-color-primary);
      --app-text-color-secondary: var(--app-text-color-secondary);
      --app-text-color-faint: var(--app-text-color-faint);
      --app-border-color: var(--app-border-color);
      --app-accent-color: var(--app-accent-color);
      --app-accent-color-hover: var(--app-accent-color-hover);
      --app-shadow-color: var(--app-shadow-color);
    }

    .app-container {
      background: var(--app-card-bg-color);
      border-radius: 16px;
      box-shadow: 0 10px 40px var(--app-shadow-color);
      padding: 32px;
      min-height: 400px;
      transition: background-color 0.3s ease;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    h1 {
      margin: 0;
      color: var(--app-text-color-primary);
      font-size: 32px;
      font-weight: 700;
    }

    .subtitle {
      color: var(--app-text-color-secondary);
      margin-bottom: 24px;
      font-size: 14px;
    }

    .stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: var(--app-bg-color);
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--app-accent-color);
    }

    .stat-label {
      font-size: 12px;
      color: var(--app-text-color-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .actions {
      display: flex;
      flex-wrap: wrap; /* UPDATED: Ensures buttons wrap */
      gap: 8px;
      margin-top: 20px;
    }

    /* UPDATED: Default button styles */
    button {
      flex-grow: 1; /* Allow buttons to grow */
      flex-basis: 130px; /* Base size, allows wrapping */
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      background-color: var(--app-border-color);
      color: var(--app-text-color-secondary);
    }

    /* UPDATED: Hover effect for all buttons except disabled ones */
    button:not(:disabled):hover {
      background-color: var(--app-accent-color-hover);
      color: white;
    }

    /* Specific button colors */
    .clear-completed {
      background: #ff9800;
      color: white;
    }

    .clear-completed:hover {
      background: #f57c00;
    }

    .clear-all {
      background: #f44336;
      color: white;
    }

    .clear-all:hover {
      background: #da190b;
    }

    /* NEW: Theme Toggle Button Style */
    .theme-toggle {
      background: var(--app-bg-color);
      color: var(--app-text-color-secondary);
      border: 1px solid var(--app-border-color);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      /* Override flex properties */
      flex-grow: 0;
      flex-basis: 40px;
    }

    .theme-toggle:hover {
      background: var(--app-accent-color);
      color: white;
      border-color: var(--app-accent-color);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid var(--app-border-color);
      text-align: center;
      color: var(--app-text-color-secondary);
      font-size: 12px;
    }

    /* NEW: Hidden file input */
    #file-input {
      display: none;
    }
  `;
  /**
   * Creates a new TodoApp instance.
   *
   * @constructor
   */
  constructor() {
    super();
    this.storageService = new StorageService();
    this.model = new TodoModel(this.storageService);
    this.todos = this.model.todos;
    // [NEW] Load theme or default to 'light'
    this.theme = this.storageService.load('theme', 'light');
    this._applyTheme();

    // Subscribe to model changes
    this.model.subscribe(() => {
      this.todos = [...this.model.todos];
    });
  }

  /**
   * [NEW] Applies the current theme to the document body.
   * @private
   */
  _applyTheme() {
    // document.body applies to the whole page
    document.body.dataset.theme = this.theme;
  }

  /**
   * [NEW] Toggles the theme between light and dark.
   */
  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.storageService.save('theme', this.theme);
    this._applyTheme();
  }

  /**
   * Handle add todo event.
   *
   * @param {CustomEvent} e - Event with detail.text
   * @returns {void}
   */
  handleAddTodo(e) {
    this.model.addTodo(e.detail.text);
  }

  /**
   * Handle toggle todo event.
   *
   * @param {CustomEvent} e - Event with detail.id
   * @returns {void}
   */
  handleToggleTodo(e) {
    this.model.toggleComplete(e.detail.id);
  }

  /**
   * Handle delete todo event.
   *
   * @param {CustomEvent} e - Event with detail.id
   * @returns {void}
   */
  handleDeleteTodo(e) {
    this.model.deleteTodo(e.detail.id);
  }

  /**
   * Handle update todo event.
   *
   * @param {CustomEvent} e - Event with detail.id and detail.text
   * @returns {void}
   */
  handleUpdateTodo(e) {
    this.model.updateTodo(e.detail.id, e.detail.text);
  }

  /**
   * Handle clear completed button click.
   *
   * @returns {void}
   */
  handleClearCompleted() {
    if (confirm('Clear all completed todos?')) {
      this.model.clearCompleted();
    }
  }

  /**
   * Handle clear all button click.
   *
   * @returns {void}
   */
  handleClearAll() {
    if (confirm('Clear ALL todos? This cannot be undone.')) {
      this.model.clearAll();
    }
  }

  /**
   * [NEW] Handles exporting tasks to a JSON file.
   */
  handleExport() {
    const tasksJson = JSON.stringify(this.model.todos, null, 2);
    const blob = new Blob([tasksJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todos-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * [NEW] Handles clicking the 'Import' button by triggering a file input.
   */
  handleImport() {
    this.shadowRoot.getElementById('file-input').click();
  }

  /**
   * [NEW] Handles the file input change event.
   * @param {Event} e - The file input event
   * @private
   */
  _handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const importedTasks = JSON.parse(event.target.result);
        if (
          confirm(
            'Importing tasks will overwrite all current tasks. Are you sure?'
          )
        ) {
          this.model.importTasks(importedTasks);
          alert('Tasks imported successfully!');
        }
      } catch (error) {
        console.error('Failed to parse imported file:', error);
        alert('Import failed: Invalid JSON file.');
      }
    };
    reader.readAsText(file);

    // Reset file input so the same file can be loaded again
    e.target.value = null;
  }

  /**
   * Render the component.
   *
   * @returns {TemplateResult}
   */
  render() {
    return html`
      <input
        type="file"
        id="file-input"
        accept="application/json"
        @change=${this._handleFileImport}
      />

      <div class="app-container">
        <div class="header">
          <h1>My Tasks</h1>
          <button
            class="theme-toggle"
            @click=${this.toggleTheme}
            title="Toggle dark mode"
          >
            ${this.theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        <p class="subtitle">Stay organized and productive</p>

        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">${this.todos.length}</div>
            <div class="stat-label">Total</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.model.activeCount}</div>
            <div class="stat-label">Active</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.model.completedCount}</div>
            <div class="stat-label">Completed</div>
          </div>
        </div>

        <todo-form @add-todo=${this.handleAddTodo}> </todo-form>

        <todo-list
          .todos=${this.todos}
          @toggle-todo=${this.handleToggleTodo}
          @delete-todo=${this.handleDeleteTodo}
          @update-todo=${this.handleUpdateTodo}
        >
        </todo-list>

        <div class="actions">
          <button
            class="import-btn"
            @click=${this.handleImport}
            title="Import tasks from a JSON file"
          >
            Import Tasks
          </button>
          <button
            class="export-btn"
            @click=${this.handleExport}
            ?disabled=${this.todos.length === 0}
            title="Export all tasks to a JSON file"
          >
            Export Tasks
          </button>

          <button
            class="clear-completed"
            @click=${this.handleClearCompleted}
            ?disabled=${this.model.completedCount === 0}
          >
            Clear Completed
          </button>
          <button
            class="clear-all"
            @click=${this.handleClearAll}
            ?disabled=${this.todos.length === 0}
          >
            Clear All
          </button>
        </div>

        <div class="footer">Lab 9: The final battle!</div>
      </div>
    `;
  }
}

customElements.define('todo-app', TodoApp);