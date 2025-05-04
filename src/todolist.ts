//To-do interface

export interface Todo {
  task: string;
  completed: boolean;
  priority: 1 | 2 | 3;
  createdAt: string;
  completedAt?: string;
}

export class TodoList {
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

  private saveToLocalStorage(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  private loadFromLocalStorage(): void {
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
        console.error('Kunde inte hämta från localStorage:', e);
      }
    }
  }
}
