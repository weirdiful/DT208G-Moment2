// Todo-interface
interface Todo {
  task: string;
  completed: boolean;
  priority: 1 | 2 | 3;
  createdAt: string;
  completedAt?: string;
}

// TodoList-klass
class TodoList {
  private todos: Todo[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  addTodo(task: string, priority: number): boolean {
    if (!task.trim() || ![1, 2, 3].includes(priority)) {
      return false;
    }

    const newTodo: Todo = {
      task: task.trim(),
      completed: false,
      priority: priority as 1 | 2 | 3,
      createdAt: new Date().toISOString(),
    };

    this.todos.push(newTodo);
    this.saveToLocalStorage();
    return true;
  }

  markTodoCompleted(index: number): void {
    if (index >= 0 && index < this.todos.length) {
      this.todos[index].completed = true;
      this.todos[index].completedAt = new Date().toISOString();
      this.saveToLocalStorage();
    }
  }

  getTodos(): Todo[] {
    return [...this.todos];
  }

  saveToLocalStorage(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  loadFromLocalStorage(): void {
    const saved = localStorage.getItem('todos');
    if (saved) {
      try {
        const parsed: Todo[] = JSON.parse(saved);
        this.todos = parsed.filter(todo =>
          typeof todo.task === 'string' &&
          typeof todo.completed === 'boolean' &&
          [1, 2, 3].includes(todo.priority)
        );
      } catch (e) {
        console.error('Kunde inte läsa från localStorage:', e);
      }
    }
  }
}

// DOM & app-logik
const todoList = new TodoList();

const form = document.querySelector<HTMLFormElement>('#todo-form')!;
const taskInput = document.querySelector<HTMLInputElement>('#task-input')!;
const prioritySelect = document.querySelector<HTMLSelectElement>('#priority-select')!;
const todoContainer = document.querySelector<HTMLUListElement>('#todo-list')!;

function renderTodos() {
  todoContainer.innerHTML = '';
  todoList.getTodos().forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';
    li.innerHTML = `
      <span>${todo.task} (prio ${todo.priority})</span>
      ${!todo.completed ? `<button data-index="${index}">Klar</button>` : ''}
    `;

    if (!todo.completed) {
      const button = li.querySelector('button')!;
      button.addEventListener('click', () => {
        todoList.markTodoCompleted(index);
        renderTodos();
      });
    }

    todoContainer.appendChild(li);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const task = taskInput.value;
  const priority = parseInt(prioritySelect.value);
  const added = todoList.addTodo(task, priority);
  if (!added) {
    alert('Ogiltiga värden! Fyll i uppgift och välj prio 1-3.');
    return;
  }

  taskInput.value = '';
  prioritySelect.value = '1';
  renderTodos();
});

renderTodos();
