const db = require('../config/db');

// Get all tasks for the logged-in user
exports.getTasks = async (req, res) => {
  try {
    const [tasks] = await db.execute(
      'SELECT * FROM tasks WHERE user_id = ?',
      [req.user.id]
    );
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    await db.execute(
      'INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)',
      [title, description || '', req.user.id]
    );
    res.status(201).json({ message: 'Task created successfully' });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// Update an existing task
exports.updateTask = async (req, res) => {
  const taskId = req.params.id;
  const { title, description } = req.body;

  try {
    const [existing] = await db.execute(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    await db.execute(
      'UPDATE tasks SET title = ?, description = ? WHERE id = ?',
      [
        title || existing[0].title,
        description || existing[0].description,
        taskId,
      ]
    );

    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
  
};

exports.deleteTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    const [result] = await db.execute(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};