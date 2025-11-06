import { test, describe } from 'node:test';
import assert from 'node:assert';
import { TodoModel } from '../src/models/todo-model.js';

class MockStorage {
  constructor() {
    this.data = {};
  }

  save(key, value) {
    this.data[key] = value;
  }

  load(key, defaultValue) {
    return this.data[key] !== undefined ? this.data[key] : defaultValue;
  }

  remove(key) {
    delete this.data[key];
  }

  clear() {
    this.data = {};
  }
}

describe('TodoModel - addTodo', () => {
  test('Should add a new todo with correct properties', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('Test todo');

    assert.strictEqual(model.todos.length, 1);
    assert.strictEqual(model.todos[0].text, 'Test todo');
    assert.strictEqual(model.todos[0].completed, false);
    assert.ok(model.todos[0].id);
    assert.ok(model.todos[0].createdAt);
  });

  test('Should not add empty todos tasks', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('');
    model.addTodo('   ');

    assert.strictEqual(model.todos.length, 0);
  });

  test('Should cut down whitespace from todo text', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('  Test todo  ');

    assert.strictEqual(model.todos[0].text, 'Test todo');
  });

  test('Should increment nextId for each todo', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('First');
    model.addTodo('Second');

    assert.strictEqual(model.todos[0].id, 1);
    assert.strictEqual(model.todos[1].id, 2);
  });
});

describe('TodoModel - toggleComplete', () => {
  test('Should toggle todo completion status', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('Test todo');
    const todoId = model.todos[0].id;

    model.toggleComplete(todoId);
    assert.strictEqual(model.todos[0].completed, true);

    model.toggleComplete(todoId);
    assert.strictEqual(model.todos[0].completed, false);
  });

  test('Should handle invalid todo id properly', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('Test todo');
    model.toggleComplete(999); // Non-existent id

    assert.strictEqual(model.todos[0].completed, false);
  });
});

describe('TodoModel - deleteTodo', () => {
  test('Should delete a todo by id', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('First');
    model.addTodo('Second');
    const firstId = model.todos[0].id;

    model.deleteTodo(firstId);

    assert.strictEqual(model.todos.length, 1);
    assert.strictEqual(model.todos[0].text, 'Second');
  });

  test('Should handle deleting non-existent todo', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('Test');
    const initialLength = model.todos.length;

    model.deleteTodo(999);

    assert.strictEqual(model.todos.length, initialLength);
  });
});

describe('TodoModel - updateTodo', () => {
  test('Should update todo text', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('Original text');
    const todoId = model.todos[0].id;

    model.updateTodo(todoId, 'Updated text');

    assert.strictEqual(model.todos[0].text, 'Updated text');
  });

  test('Should cut down whitespace when updating', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('Original');
    const todoId = model.todos[0].id;

    model.updateTodo(todoId, '  Updated  ');

    assert.strictEqual(model.todos[0].text, 'Updated');
  });

  test('Should not update with empty text', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('Original');
    const todoId = model.todos[0].id;

    model.updateTodo(todoId, '');
    assert.strictEqual(model.todos[0].text, 'Original');

    model.updateTodo(todoId, '   ');
    assert.strictEqual(model.todos[0].text, 'Original');
  });

  test('should handle updating non-existent todo', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('Test');

    // Should not throw error
    model.updateTodo(999, 'New text');
    assert.strictEqual(model.todos[0].text, 'Test');
  });
});

describe('TodoModel - clearCompleted', () => {
  test('should remove all completed todos', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('Todo 1');
    model.addTodo('Todo 2');
    model.addTodo('Todo 3');

    model.toggleComplete(model.todos[0].id);
    model.toggleComplete(model.todos[2].id);

    model.clearCompleted();

    assert.strictEqual(model.todos.length, 1);
    assert.strictEqual(model.todos[0].text, 'Todo 2');
  });

  test('should do nothing if no completed todos', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('Todo 1');
    model.addTodo('Todo 2');

    model.clearCompleted();

    assert.strictEqual(model.todos.length, 2);
  });
});

describe('TodoModel - clearAll', () => {
  test('should remove all todos', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('Todo 1');
    model.addTodo('Todo 2');
    model.addTodo('Todo 3');

    model.clearAll();

    assert.strictEqual(model.todos.length, 0);
  });

  test('should work on empty list', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.clearAll();

    assert.strictEqual(model.todos.length, 0);
  });
});

describe('TodoModel - counts', () => {
  test('activeCount should return number of incomplete todos', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('Todo 1');
    model.addTodo('Todo 2');
    model.addTodo('Todo 3');

    assert.strictEqual(model.activeCount, 3);

    model.toggleComplete(model.todos[0].id);
    assert.strictEqual(model.activeCount, 2);
  });

  test('completedCount should return number of completed todos', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('Todo 1');
    model.addTodo('Todo 2');
    model.addTodo('Todo 3');

    assert.strictEqual(model.completedCount, 0);

    model.toggleComplete(model.todos[0].id);
    model.toggleComplete(model.todos[1].id);

    assert.strictEqual(model.completedCount, 2);
  });
});

describe('TodoModel - observer pattern', () => {
  test('should notify subscribers when todos change', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);
    let notificationCount = 0;

    model.subscribe(() => {
      notificationCount++;
    });

    model.addTodo('Test');
    assert.strictEqual(notificationCount, 1);

    model.toggleComplete(model.todos[0].id);
    assert.strictEqual(notificationCount, 2);

    model.deleteTodo(model.todos[0].id);
    assert.strictEqual(notificationCount, 3);
  });

  test('should support multiple subscribers', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);
    let count1 = 0;
    let count2 = 0;

    model.subscribe(() => { count1++; });
    model.subscribe(() => { count2++; });

    model.addTodo('Test');

    assert.strictEqual(count1, 1);
    assert.strictEqual(count2, 1);
  });
});

describe('TodoModel - localStorage integration', () => {
  test('should save todos to storage after adding', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('Test todo');

    assert.ok(storage.data.items);
    assert.strictEqual(storage.data.items.length, 1);
    assert.strictEqual(storage.data.items[0].text, 'Test todo');
  });

  test('should save nextId to storage', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('Test');

    assert.strictEqual(storage.data.nextId, 2);
  });

  test('should load existing todos from storage', () => {
    const storage = new MockStorage();
    storage.save('items', [
      { id: 1, text: 'Existing todo', completed: false }
    ]);
    storage.save('nextId', 2);

    const model = new TodoModel(storage);

    assert.strictEqual(model.todos.length, 1);
    assert.strictEqual(model.todos[0].text, 'Existing todo');
    assert.strictEqual(model.nextId, 2);
  });

  test('should persist changes to storage', () => {
    const storage = new MockStorage();
    const model = new TodoModel(storage);

    model.addTodo('Todo 1');
    const todoId = model.todos[0].id;
    model.toggleComplete(todoId);

    assert.strictEqual(storage.data.items[0].completed, true);
  });
});