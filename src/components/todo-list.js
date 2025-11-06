import { LitElement, html, css } from 'lit';
import './todo-item.js';

/**
 * @class TodoList
 * @extends LitElement
 * @description List component that displays all todo items.
 * Renders todo-item components and passes through events.
 *
 * @property {Array<Todo>} todos - Array of todo items to display
 *
 * @fires toggle-todo - Passed through from todo-item
 * @fires delete-todo - Passed through from todo-item
 * @fires update-todo - Passed through from todo-item
 *
 * @example
 * <todo-list
 *   .todos="${this.todos}"
 *   @toggle-todo="${this.handleToggle}">
 * </todo-list>
 */
export class TodoList extends LitElement {
  static properties = {
    /** @type {Array<Todo>} Array of todo items */
    todos: { type: Array }
  };

  static styles = css`
    :host {
      display: block;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #999;
    }

    .empty-state p {
      margin: 0;
      font-size: 18px;
    }
  `;

  /**
   * Creates a new TodoList instance.
   *
   * @constructor
   */
  constructor() {
    super();
    this.todos = [];
  }

  /**
   * Render the component.
   *
   * @returns {TemplateResult}
   */
  render() {
    if (this.todos.length === 0) {
      return html`
        <div class="empty-state">
          <p>No tasks yet. Add one above to get started!</p>
        </div>
      `;
    }

    return html`
      ${this.todos.map(
      todo => html`
          <todo-item .todo=${todo}></todo-item>
        `
    )}
    `;
  }
}

customElements.define('todo-list', TodoList);