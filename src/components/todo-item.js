import { LitElement, html, css } from 'lit';

/**
 * @class TodoItem
 * @extends LitElement
 * @description Individual todo item component with edit, delete, and toggle functionality.
 * Supports inline editing with save/cancel actions.
 *
 * @property {Todo} todo - The todo object to display
 * @property {boolean} isEditing - Whether the item is in edit mode
 * @property {string} editValue - The current edit input value
 *
 * @fires toggle-todo - When checkbox is clicked
 * @fires delete-todo - When delete button is clicked
 * @fires update-todo - When save button is clicked in edit mode
 *
 * @example
 * <todo-item
 *   .todo="${todo}"
 *   @toggle-todo="${this.handleToggle}"
 *   @delete-todo="${this.handleDelete}">
 * </todo-item>
 */
export class TodoItem extends LitElement {
  static properties = {
    /** @type {Todo} The todo object */
    todo: { type: Object },
    /** @type {boolean} Whether in edit mode */
    isEditing: { state: true },
    /** @type {string} Current edit value */
    editValue: { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    .todo-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: white;
      border-radius: 8px;
      margin-bottom: 8px;
      transition:
        transform 0.2s,
        box-shadow 0.2s;
    }

    .todo-item:hover {
      transform: translateX(4px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .checkbox {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .todo-text {
      flex: 1;
      font-size: 16px;
      color: #333;
      word-break: break-word;
    }

    .todo-text.completed {
      text-decoration: line-through;
      color: #999;
    }

    .edit-input {
      flex: 1;
      padding: 8px;
      font-size: 16px;
      border: 2px solid #667eea;
      border-radius: 4px;
      outline: none;
    }

    .button-group {
      display: flex;
      gap: 8px;
    }

    button {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }

    .edit-btn {
      background: #4caf50;
      color: white;
    }

    .edit-btn:hover {
      background: #45a049;
    }

    .delete-btn {
      background: #f44336;
      color: white;
    }

    .delete-btn:hover {
      background: #da190b;
    }

    .save-btn {
      background: #2196f3;
      color: white;
    }

    .save-btn:hover {
      background: #0b7dda;
    }

    .cancel-btn {
      background: #757575;
      color: white;
    }

    .cancel-btn:hover {
      background: #616161;
    }
  `;

  /**
   * Creates a new TodoItem instance.
   *
   * @constructor
   */
  constructor() {
    super();
    this.isEditing = false;
    this.editValue = '';
  }

  /**
   * Handle checkbox toggle.
   *
   * @returns {void}
   * @fires toggle-todo
   */
  handleToggle() {
    this.dispatchEvent(
      new CustomEvent('toggle-todo', {
        detail: { id: this.todo.id },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Handle delete button click.
   *
   * @returns {void}
   * @fires delete-todo
   */
  handleDelete() {
    if (confirm('Delete this todo?')) {
      this.dispatchEvent(
        new CustomEvent('delete-todo', {
          detail: { id: this.todo.id },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  /**
   * Handle edit button click.
   *
   * @returns {void}
   */
  handleEdit() {
    this.isEditing = true;
    this.editValue = this.todo.text;
  }

  /**
   * Handle save button click.
   *
   * @returns {void}
   * @fires update-todo
   */
  handleSave() {
    if (this.editValue.trim()) {
      this.dispatchEvent(
        new CustomEvent('update-todo', {
          detail: { id: this.todo.id, text: this.editValue },
          bubbles: true,
          composed: true,
        })
      );
      this.isEditing = false;
    }
  }

  /**
   * Handle cancel button click.
   *
   * @returns {void}
   */
  handleCancel() {
    this.isEditing = false;
    this.editValue = '';
  }

  /**
   * Handle keydown events in edit mode.
   *
   * @param {KeyboardEvent} e - Keyboard event
   * @returns {void}
   */
  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.handleSave();
    } else if (e.key === 'Escape') {
      this.handleCancel();
    }
  }

  /**
   * Render the component.
   *
   * @returns {TemplateResult}
   */
  render() {
    if (this.isEditing) {
      return html`
        <div class="todo-item">
          <input
            class="edit-input"
            type="text"
            .value=${this.editValue}
            @input=${e => (this.editValue = e.target.value)}
            @keydown=${this.handleKeyDown}
            autofocus
          />
          <div class="button-group">
            <button class="save-btn" @click=${this.handleSave}>Save</button>
            <button class="cancel-btn" @click=${this.handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      `;
    }

    return html`
      <div class="todo-item">
        <input
          type="checkbox"
          class="checkbox"
          .checked=${this.todo.completed}
          @change=${this.handleToggle}
          aria-label="Toggle todo"
        />
        <span class="todo-text ${this.todo.completed ? 'completed' : ''}">
          ${this.todo.text}
        </span>
        <div class="button-group">
          <button
            class="edit-btn"
            @click=${this.handleEdit}
            ?disabled=${this.todo.completed}
            aria-label="Edit todo"
          >
            Edit
          </button>
          <button
            class="delete-btn"
            @click=${this.handleDelete}
            aria-label="Delete todo"
          >
            Delete
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('todo-item', TodoItem);