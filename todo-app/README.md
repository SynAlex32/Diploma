# To-Do List Application

A modern, fully-featured to-do list application with persistent local storage, priority levels, filtering, and export functionality.

## ✨ Features

### Core Functionality
- ✅ **Add Tasks** - Quickly add new tasks to your list
- ✏️ **Edit Tasks** - Modify task title, priority, and description
- 🗑️ **Delete Tasks** - Remove individual tasks
- ☑️ **Mark Complete** - Check off completed tasks
- 🔄 **Filter Tasks** - View all, active, or completed tasks
- 💾 **Auto-Save** - All changes saved to browser's localStorage

### Task Management
- **Priority Levels**: Assign high, medium, or low priority to tasks
- **Descriptions**: Add detailed descriptions to tasks
- **Timestamps**: Automatic creation date tracking
- **Task Statistics**: Real-time dashboard showing total, completed, and pending tasks

### Data Management
- 📤 **Export**: Download tasks as JSON or CSV format
- 🧹 **Clear Operations**: 
  - Clear completed tasks
  - Clear all tasks
- 💾 **Persistent Storage**: Tasks persist across browser sessions
- 🔐 **No Server Required**: All data stored locally in browser

### User Interface
- 🎨 **Modern Design**: Clean, intuitive interface with gradient styling
- 📱 **Responsive**: Works perfectly on mobile, tablet, and desktop
- ⌨️ **Keyboard Support**: Press Enter to add tasks quickly
- 🎯 **Modal Dialogs**: Beautiful edit and confirmation modals
- 🌙 **Visual Feedback**: Smooth animations and transitions

## 📁 Project Structure

```
todo-app/
├── index.html      # HTML structure
├── styles.css      # Complete styling
├── app.js          # JavaScript functionality
└── README.md       # This file
```

## 🚀 Getting Started

### Quick Start
1. Open `index.html` in any modern web browser
2. Start adding tasks immediately
3. No installation required!

### Installation (Optional - for local server)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000/todo-app/index.html`

## 📖 Usage Guide

### Adding Tasks
1. Type your task in the input field
2. Press Enter or click "Add Task" button
3. Task appears in the list with current timestamp

### Editing Tasks
1. Click the "Edit" button on any task
2. Modify title, priority, and description
3. Click "Save Changes" to update
4. Changes are automatically saved

### Managing Tasks
- **Check/Uncheck**: Click the checkbox to mark tasks complete/incomplete
- **Delete**: Click the "Delete" button to remove a task
- **Filter**: Use filter buttons to view All, Active, or Completed tasks

### Statistics Dashboard
- **Total Tasks**: Count of all tasks
- **Completed**: Count of finished tasks
- **Pending**: Count of incomplete tasks

Updates in real-time as you manage tasks.

### Clearing Tasks
- **Clear Completed**: Removes all completed tasks (confirmation required)
- **Clear All**: Deletes all tasks (confirmation required)

### Exporting Data
1. Click "Export" button
2. Choose format:
   - **JSON**: Export all task data as structured JSON
   - **CSV**: Export as spreadsheet-compatible CSV format
3. File is downloaded to your computer

## 💾 Local Storage

### How It Works
- Tasks are automatically saved to browser's localStorage
- Storage key: `todoList`
- Data persists across browser sessions
- No server required

### Storage Structure
```json
{
  "id": 1234567890,
  "title": "Complete project",
  "description": "Finish the to-do app",
  "priority": "high",
  "completed": false,
  "createdAt": "2026-06-12T10:30:00.000Z",
  "updatedAt": "2026-06-12T10:30:00.000Z"
}
```

### Clearing Storage
- Use "Clear All" button in the app
- Or clear browser cache/storage manually
- Or open browser DevTools → Application → localStorage → remove 'todoList'

## 🎨 Priority Levels

| Level | Color | Use Case |
|-------|-------|----------|
| 🔴 High | Red | Urgent tasks |
| 🟠 Medium | Orange | Regular tasks |
| 🟢 Low | Green | Optional tasks |

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Enter | Add task (when focused on input) |
| Tab | Navigate between elements |

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile phones (320px and up)
- 📱 Tablets (600px and up)
- 💻 Desktop (800px and up)

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Flexbox, Grid, Gradients, Animations
- **JavaScript (ES6+)**: Classes, Arrow Functions, Async Operations
- **LocalStorage API**: Client-side data persistence

### Browser Compatibility
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security Features

- **Input Sanitization**: HTML special characters escaped
- **No Sensitive Data**: Tasks stored locally only
- **CSRF Protection**: N/A (client-side only)
- **XSS Prevention**: All user input sanitized

## 📊 Data Export Examples

### JSON Export
```json
[
  {
    "id": 1234567890,
    "title": "Complete project",
    "description": "Finish the to-do app",
    "priority": "high",
    "completed": false,
    "createdAt": "2026-06-12T10:30:00.000Z",
    "updatedAt": "2026-06-12T10:30:00.000Z"
  }
]
```

### CSV Export
```
Task,Priority,Completed,Description,Created
"Complete project",high,No,"Finish the to-do app",6/12/2026, 10:30:00 AM
```

## 🚀 Advanced Features

### StorageManager Class
Handles all localStorage operations:
- `getTasks()` - Retrieve all tasks
- `addTask(task)` - Add new task
- `updateTask(id, updates)` - Modify existing task
- `deleteTask(id)` - Remove task
- `clearCompleted()` - Clear done tasks
- `clearAll()` - Clear everything
- `exportTasks()` - Export as JSON
- `exportTasksCSV()` - Export as CSV

### TodoApp Class
Main application controller:
- Task CRUD operations
- Filtering logic
- Modal management
- Statistics calculation
- Export functionality

## 🎯 Planned Enhancements

- [ ] Categories/Tags for tasks
- [ ] Recurring tasks
- [ ] Due dates with reminders
- [ ] Dark mode toggle
- [ ] Drag and drop reordering
- [ ] Cloud sync with multiple devices
- [ ] Collaboration features
- [ ] Task search functionality

## 🐛 Troubleshooting

### Tasks Not Saving
- Check if browser allows localStorage
- Clear cache and try again
- Check browser console for errors

### Lost Tasks
- Check browser settings aren't blocking storage
- Try using a different browser
- Restore from exported backup if available

### Modal Not Closing
- Click outside modal to close
- Click Cancel button
- Refresh the page

## 📞 Support

For issues or questions:
1. Check the console for error messages (F12)
2. Try clearing browser cache
3. Restart the browser
4. Create an issue in the repository

## 📄 License

MIT License - Free to use and modify

## 👨‍💻 Author

Created by SynAlex32 as part of the Diploma project.

---

**Happy task managing! 🎉**
