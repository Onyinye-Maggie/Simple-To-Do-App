const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Load existing tasks
tasks.forEach(task => createTask(task));

addBtn.addEventListener("click", () => {
  const taskText = input.value.trim();
  if (!taskText) return;

  const task = { text: taskText, done: false };
  tasks.push(task);
  saveTasks();
  createTask(task);
  input.value = "";
});

function createTask(task) {
  const li = document.createElement("li");
  li.draggable = true;
  li.textContent = task.text;
  if (task.done) li.classList.add("done");

  // Task click toggles done
  li.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) return;
    task.done = !task.done;
    li.classList.toggle("done");
    saveTasks();
  });

  // Delete button
  const delBtn = document.createElement("button");
  delBtn.textContent = "×";
  delBtn.classList.add("delete-btn");
  delBtn.addEventListener("click", () => {
    const index = tasks.indexOf(task);
    tasks.splice(index, 1);
    li.remove();
    saveTasks();
  });
  li.appendChild(delBtn);

  // Drag & Drop
  li.addEventListener("dragstart", () => {
    li.classList.add("dragging");
  });

  li.addEventListener("dragend", () => {
    li.classList.remove("dragging");
    reorderTasks();
    saveTasks();
  });

  list.appendChild(li);
}

// Reorder tasks based on current DOM order
function reorderTasks() {
  const newTasks = [];
  document.querySelectorAll("#todo-list li").forEach(li => {
    const text = li.firstChild.textContent;
    const task = tasks.find(t => t.text === text);
    if (task) newTasks.push(task);
  });
  tasks = newTasks;
}

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Drag & drop logic
list.addEventListener("dragover", (e) => {
  e.preventDefault();
  const dragging = document.querySelector(".dragging");
  const afterElement = getDragAfterElement(list, e.clientY);
  if (afterElement == null) {
    list.appendChild(dragging);
  } else {
    list.insertBefore(dragging, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
