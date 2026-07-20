const STORAGE_KEY = 'oibsip_todo_tasks';

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const pendingList = document.getElementById('pending-list');
const completedList = document.getElementById('completed-list');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');
const pendingEmpty = document.getElementById('pending-empty');
const completedEmpty = document.getElementById('completed-empty');

let tasks = loadTasks();

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function render() {
  pendingList.innerHTML = '';
  completedList.innerHTML = '';

  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  pendingCount.textContent = `${pending.length} pending`;
  completedCount.textContent = `${completed.length} completed`;

  pendingEmpty.style.display = pending.length === 0 ? 'block' : 'none';
  completedEmpty.style.display = completed.length === 0 ? 'block' : 'none';

  pending.forEach(task => pendingList.appendChild(buildTaskEl(task)));
  completed.forEach(task => completedList.appendChild(buildTaskEl(task)));
}

function buildTaskEl(task) {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.completed ? ' completed' : '');
  li.dataset.id = task.id;

  const textWrap = document.createElement('div');
  textWrap.className = 'task-text';

  const span = document.createElement('span');
  span.textContent = task.text;

  const time = document.createElement('span');
  time.className = 'timestamp';
  time.textContent = task.completed
    ? `Added ${formatTime(task.createdAt)} · Completed ${formatTime(task.completedAt)}`
    : `Added ${formatTime(task.createdAt)}`;

  textWrap.appendChild(span);
  textWrap.appendChild(time);

  const completeBtn = document.createElement('button');
  completeBtn.className = 'complete-btn';
  completeBtn.textContent = task.completed ? 'Undo' : 'Mark Complete';
  completeBtn.addEventListener('click', () => toggleComplete(task.id));

  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => startEdit(li, task));

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  li.appendChild(textWrap);
  li.appendChild(completeBtn);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  return li;
}

function startEdit(li, task) {
  li.innerHTML = '';
  const inputEl = document.createElement('input');
  inputEl.className = 'edit-input';
  inputEl.value = task.text;

  const saveBtn = document.createElement('button');
  saveBtn.className = 'edit-btn';
  saveBtn.textContent = 'Save';
  saveBtn.addEventListener('click', () => {
    const newText = inputEl.value.trim();
    if (newText) {
      task.text = newText;
      saveTasks();
    }
    render();
  });

  li.appendChild(inputEl);
  li.appendChild(saveBtn);
  inputEl.focus();
}

function addTask(text) {
  tasks.push({
    id: Date.now().toString(),
    text,
    completed: false,
    createdAt: Date.now(),
    completedAt: null
  });
  saveTasks();
  render();
}

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  task.completedAt = task.completed ? Date.now() : null;
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTask(text);
  input.value = '';
  input.focus();
});

render();
