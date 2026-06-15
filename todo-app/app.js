/* ==========================================
   JavaScript for To-Do List Application
   Local Storage, CRUD Operations, Filtering
   ========================================== */

// ==================== Local Storage Manager ====================
class StorageManager {
    constructor(storageKey = 'todoList') {
        this.storageKey = storageKey;
    }

    // Get all tasks from localStorage
    getTasks() {
        const tasks = localStorage.getItem(this.storageKey);
        return tasks ? JSON.parse(tasks) : [];
    }

    // Save tasks to localStorage
    saveTasks(tasks) {
        localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    }

    // Add a new task
    addTask(task) {
        const tasks = this.getTasks();
        tasks.push(task);
        this.saveTasks(tasks);
        return task;
    }

    // Update a task
    updateTask(id, updates) {
        const tasks = this.getTasks();
        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
            this.saveTasks(tasks);
            return tasks[taskIndex];
        }
        return null;
    }

    // Delete a task
    deleteTask(id) {
        let tasks = this.getTasks();
        tasks = tasks.filter(t => t.id !== id);
        this.saveTasks(tasks);
    }

    // Clear completed tasks
    clearCompleted() {
        let tasks = this.getTasks();
        tasks = tasks.filter(t => !t.completed);
        this.saveTasks(tasks);
    }

    // Clear all tasks
    clearAll() {
        localStorage.removeItem(this.storageKey);
    }

    // Export tasks as JSON
    exportTasks() {
        const tasks = this.getTasks();
        return JSON.stringify(tasks, null, 2);
    }

    // Export tasks as CSV
    exportTasksCSV() {
        const tasks = this.getTasks();
        let csv = 'Task,Priority,Completed,Description,Created\n';
        
        tasks.forEach(task => {
            const row = [
                `"${task.title}"`,
                task.priority,
                task.completed ? 'Yes' : 'No',
                `"${task.description || ''}"`,
                new Date(task.createdAt).toLocaleString()
            ];
            csv += row.join(',') + '\n';
        });

        return csv;
    }
}

// ==================== To-Do App Class ====================
class TodoApp {
    constructor() {
        this.storage = new StorageManager();
        this.currentFilter = 'all';
        this.editingTaskId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Add task
        document.getElementById('addBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderTasks();
            });
        });

        // Action buttons
        document.getElementById('clearCompletedBtn').addEventListener('click', () => this.confirmClearCompleted());
        document.getElementById('clearAllBtn').addEventListener('click', () => this.confirmClearAll());
        document.getElementById('exportBtn').addEventListener('click', () => this.showExportMenu());

        // Modal controls
        this.setupModalControls();
    }

    setupModalControls() {
        // Edit Modal
        const editModal = document.getElementById('editModal');
        const closeBtn = document.querySelector('.close');
        closeBtn.addEventListener('click', () => this.closeEditModal());

        document.getElementById('cancelEditBtn').addEventListener('click', () => this.closeEditModal());
        document.getElementById('saveEditBtn').addEventListener('click', () => this.saveEdit());

        // Confirmation Modal
        const confirmModal = document.getElementById('confirmModal');
        document.getElementById('confirmCancelBtn').addEventListener('click', () => {
            confirmModal.classList.remove('show');
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === editModal) this.closeEditModal();
            if (e.target === confirmModal) confirmModal.classList.remove('show');
        });
    }

    // ==================== Task Operations ====================

    addTask() {
        const input = document.getElementById('taskInput');
        const title = input.value.trim();

        if (!title) {
            alert('Please enter a task!');
            return;
        }

        const task = {
            id: Date.now(),
            title,
            description: '',
            priority: 'medium',
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.storage.addTask(task);
        input.value = '';
        input.focus();
        this.render();
    }

    toggleComplete(id) {
        const tasks = this.storage.getTasks();
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            task.updatedAt = new Date().toISOString();
            this.storage.saveTasks(tasks);
            this.render();
        }
    }

    openEditModal(id) {
        const tasks = this.storage.getTasks();
        const task = tasks.find(t => t.id === id);

        if (!task) return;

        this.editingTaskId = id;

        document.getElementById('editTaskInput').value = task.title;
        document.getElementById('editPrioritySelect').value = task.priority;
        document.getElementById('editDescriptionInput').value = task.description || '';

        document.getElementById('editModal').classList.add('show');
        document.getElementById('editTaskInput').focus();
    }

    closeEditModal() {
        document.getElementById('editModal').classList.remove('show');
        this.editingTaskId = null;
    }

    saveEdit() {
        const title = document.getElementById('editTaskInput').value.trim();
        const priority = document.getElementById('editPrioritySelect').value;
        const description = document.getElementById('editDescriptionInput').value.trim();

        if (!title) {
            alert('Task title cannot be empty!');
            return;
        }

        this.storage.updateTask(this.editingTaskId, {
            title,
            priority,
            description,
            updatedAt: new Date().toISOString()
        });

        this.closeEditModal();
        this.render();
    }

    deleteTask(id) {
        this.storage.deleteTask(id);
        this.render();
    }

    // ==================== Confirmation Dialogs ====================

    showConfirmation(title, message, callback) {
        const modal = document.getElementById('confirmModal');
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;

        document.getElementById('confirmOkBtn').onclick = () => {
            modal.classList.remove('show');
            callback();
        };

        modal.classList.add('show');
    }

    confirmClearCompleted() {
        this.showConfirmation(
            'Clear Completed Tasks',
            'Are you sure you want to delete all completed tasks? This action cannot be undone.',
            () => {
                this.storage.clearCompleted();
                this.render();
            }
        );
    }

    confirmClearAll() {
        this.showConfirmation(
            'Clear All Tasks',
            'Are you sure you want to delete ALL tasks? This action cannot be undone.',
            () => {
                this.storage.clearAll();
                this.render();
            }
        );
    }

    // ==================== Export Functionality ====================

    showExportMenu() {
        const format = prompt('Export format:\n1. JSON\n2. CSV\n\nEnter 1 or 2:', '1');

        if (format === '1') {
            this.exportJSON();
        } else if (format === '2') {
            this.exportCSV();
        }
    }

    exportJSON() {
        const data = this.storage.exportTasks();
        this.downloadFile(data, 'tasks.json', 'application/json');
    }

    exportCSV() {
        const data = this.storage.exportTasksCSV();
        this.downloadFile(data, 'tasks.csv', 'text/csv');
    }

    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // ==================== Filtering ====================

    getFilteredTasks() {
        const tasks = this.storage.getTasks();

        switch (this.currentFilter) {
            case 'active':
                return tasks.filter(t => !t.completed);
            case 'completed':
                return tasks.filter(t => t.completed);
            default:
                return tasks;
        }
    }

    // ==================== Rendering ====================

    render() {
        this.renderTasks();
        this.updateStats();
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        const emptyState = document.getElementById('emptyState');
        const tasks = this.getFilteredTasks();

        taskList.innerHTML = '';

        if (tasks.length === 0) {
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');

        tasks.forEach(task => {
            const taskItem = this.createTaskElement(task);
            taskList.appendChild(taskItem);
        });
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        const createdDate = new Date(task.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="app.toggleComplete(${task.id})"
            >
            <div class="task-content">
                <div class="task-text">
                    <span class="priority-badge ${task.priority}"></span>
                    ${this.escapeHtml(task.title)}
                </div>
                ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                <div class="task-date">Created: ${createdDate}</div>
            </div>
            <div class="task-actions">
                <button class="task-btn edit-btn" onclick="app.openEditModal(${task.id})">Edit</button>
                <button class="task-btn delete-btn" onclick="app.deleteTask(${task.id})">Delete</button>
            </div>
        `;

        return li;
    }

    updateStats() {
        const allTasks = this.storage.getTasks();
        const completedTasks = allTasks.filter(t => t.completed).length;
        const pendingTasks = allTasks.length - completedTasks;

        document.getElementById('totalTasks').textContent = allTasks.length;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;
    }

    // ==================== Utilities ====================

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// ==================== Initialize App ====================
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new TodoApp();
    
    // Log initialization
    console.log('✅ To-Do List App Initialized');
    console.log('📦 Tasks loaded from localStorage:', app.storage.getTasks().length);
});
