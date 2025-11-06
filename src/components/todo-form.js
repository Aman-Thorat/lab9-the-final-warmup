import { LitElement, html, css } from 'lit';

/**
 * @class TodoForm
 * @extends LitElement
 * @description Form component for adding new todos.
 * Handles input validation and emits events when todos are submitted.
 *
 * @fires add-todo - Emitted when a valid todo is submitted with detail.text
 *
 * @example
 * <todo-form @add-todo="${this.handleAddTodo}"></todo-form>
 */
export class TodoForm extends LitElement {
  static properties = {
    /** @type {string} Current input value */
    inputValue: { state: true }
  };

  static styles = css`
    :host {
      display: block;
    }

    form {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }

    input {
      flex: 1;
      padding: 12px 16px;
      font-size: 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.2s;
    }

    input:focus {
      border-color: #667eea;
    }

    button {
      padding: 12px 24px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    button:hover {
      background: #5568d3;
    }

    button:active {
      transform: scale(0.98);
    }
  `;

  /**
   * Creates a new TodoForm instance.
   *
   * @constructor
   */
  constructor() {
    super();
    this.inputValue = '';
  }

  /**
   * Handle form submission.
   *
   * @param {Event} e - Submit event
   * @returns {void}
   */
  handleSubmit(e) {
    e.preventDefault();
    if (this.inputValue.trim()) {
      this.dispatchEvent(
        new CustomEvent('add-todo', {
          detail: { text: this.inputValue },
          bubbles: true,
          composed: true
        })
      );
      this.inputValue = '';
    }
  }

  /**
   * Render the component.
   *
   * @returns {TemplateResult}
   */
  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <input
          type="text"
          .value=${this.inputValue}
          @input=${e => this.inputValue = e.target.value}
          placeholder="What needs to be done?"
          aria-label="New todo"
        />
        <button type="submit">Add</button>
      </form>
    `;
  }
}

customElements.define('todo-form', TodoForm);