document.addEventListener("DOMContentLoaded", () => {
  // Select DOM elements
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const dateInput = document.getElementById("date-input");
  const todoList = document.getElementById("todo-list");
  const errorMsg = document.getElementById("error-message");
  const filterBtns = document.querySelectorAll(".filter-btn");

  // State
  let todos = JSON.parse(localStorage.getItem("premiumTodos")) || [];

  // Helper: Show Error
  const showError = (message) => {
    errorMsg.textContent = message;
    errorMsg.classList.add("visible");
    setTimeout(() => {
      errorMsg.classList.remove("visible");
    }, 3000);
  };

  // Helper: Save to LocalStorage
  const saveTodos = () => {
    localStorage.setItem("premiumTodos", JSON.stringify(todos));
  };

  // Helper: Format Date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Render Todos
  const renderTodos = (filter = "all") => {
    todoList.innerHTML = "";

    const filteredTodos = todos.filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    });

    if (filteredTodos.length === 0) {
      todoList.innerHTML = `
                <div class="empty-state">
                    <p>Tidak ada tugas yang ditemukan. Tambahkan satu untuk memulai!</p>
                </div>
            `;
      return;
    }

    filteredTodos.forEach((todo) => {
      const li = document.createElement("li");
      li.className = `todo-item ${todo.completed ? "completed" : ""}`;
      li.dataset.id = todo.id;

      li.innerHTML = `
                <button class="check-btn" aria-label="Toggle Complete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </button>
                <div class="todo-content">
                    <span class="todo-text">${todo.text}</span>
                    ${
                      todo.date
                        ? `<span class="todo-date">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        ${formatDate(todo.date)}
                    </span>`
                        : ""
                    }
                </div>
                <button class="delete-btn" aria-label="Delete Task">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `;

      todoList.appendChild(li);
    });
  };

  // Add Todo
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = todoInput.value.trim();
    const date = dateInput.value;

    // Validation
    if (!text) {
      showError("Please enter a task description.");
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: text,
      date: date,
      completed: false,
    };

    todos.unshift(newTodo);
    saveTodos();
    renderTodos(document.querySelector(".filter-btn.active").dataset.filter);

    todoInput.value = "";
    dateInput.value = "";
  });

  // Handle Click Events (Delete & Toggle)
  todoList.addEventListener("click", (e) => {
    const item = e.target.closest(".todo-item");
    if (!item) return;

    const id = Number(item.dataset.id);

    // Delete
    if (e.target.closest(".delete-btn")) {
      todos = todos.filter((todo) => todo.id !== id);
      saveTodos();
      item.style.opacity = "0";
      item.style.transform = "translateY(10px)";
      setTimeout(() => {
        renderTodos(
          document.querySelector(".filter-btn.active").dataset.filter
        );
      }, 300);
    }

    // Toggle Complete
    if (e.target.closest(".check-btn") || e.target.closest(".todo-content")) {
      // Avoid toggling if clicking delete
      if (e.target.closest(".delete-btn")) return;

      todos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
      saveTodos();
      renderTodos(document.querySelector(".filter-btn.active").dataset.filter);
    }
  });

  // Handle Filters
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all
      filterBtns.forEach((b) => b.classList.remove("active"));
      // Add active to clicked
      btn.classList.add("active");

      renderTodos(btn.dataset.filter);
    });
  });

  // Initial Render
  renderTodos();
});
