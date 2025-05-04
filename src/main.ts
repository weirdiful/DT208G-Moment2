import './style.css';
import { TodoList } from './todolist';

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
