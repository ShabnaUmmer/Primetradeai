const db = require('../models/db');

// Get all tasks with search and filters
const getTasks = (req, res) => {
    console.log("🔍 Incoming query:", req.query);
  const { search, status } = req.query;
  const userId = req.user.id;
  
  console.log('🔍 [BACKEND] Received query parameters:');
  console.log('   - search:', search);
  console.log('   - status:', status);
  console.log('   - userId:', userId);
  
  let query = `
    SELECT id, title, description, status, created_at, updated_at 
    FROM tasks 
    WHERE user_id = ?
  `;
  const params = [userId];

  // Build search and filter conditions
  if (search && search.trim() !== '') {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    const searchTerm = `%${search.trim()}%`;
    params.push(searchTerm, searchTerm);
    console.log('   - Adding search filter:', searchTerm);
  }

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
    console.log('   - Adding status filter:', status);
  }

  // Add ordering
  query += ' ORDER BY created_at DESC';

  console.log('📝 [BACKEND] Final SQL query:', query);
  console.log('🔢 [BACKEND] Query parameters:', params);

  db.all(query, params, (err, tasks) => {
    if (err) {
      console.error('Tasks fetch error:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching tasks'
      });
    }

    console.log('✅ [BACKEND] Tasks found:', tasks.length);
    console.log('📋 [BACKEND] Task statuses:', tasks.map(task => task.status));
    
    res.json({
      success: true,
      data: { tasks: tasks || [] }
    });
  });
};

// Create a new task
const createTask = (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  // Basic validation
  if (!title || title.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Task title is required'
    });
  }

  db.run(
    `INSERT INTO tasks (user_id, title, description, status) 
     VALUES (?, ?, ?, 'pending')`,
    [
      userId, 
      title.trim(), 
      description?.trim() || null
    ],
    function(err) {
      if (err) {
        console.error('Task creation error:', err);
        return res.status(500).json({
          success: false,
          message: 'Error creating task'
        });
      }

      // Return the created task
      db.get(
        'SELECT * FROM tasks WHERE id = ?',
        [this.lastID],
        (err, task) => {
          if (err) {
            console.error('Task fetch error:', err);
            return res.status(500).json({
              success: false,
              message: 'Task created but failed to fetch details'
            });
          }

          res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: { task }
          });
        }
      );
    }
  );
};

// Update a task
const updateTask = (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const { title, description, status } = req.body;

  // Check if task exists and belongs to user
  db.get(
    'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
    [taskId, userId],
    (err, task) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Server error'
        });
      }

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Build update query based on provided fields
      const updates = [];
      const params = [];

      if (title !== undefined) {
        if (!title.trim()) {
          return res.status(400).json({
            success: false,
            message: 'Title cannot be empty'
          });
        }
        updates.push('title = ?');
        params.push(title.trim());
      }

      if (description !== undefined) {
        updates.push('description = ?');
        params.push(description?.trim() || null);
      }

      if (status !== undefined) {
        updates.push('status = ?');
        params.push(status);
      }

      // If no fields to update, return early
      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update'
        });
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(taskId, userId);

      const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`;

      db.run(query, params, function(err) {
        if (err) {
          console.error('Task update error:', err);
          return res.status(500).json({
            success: false,
            message: 'Error updating task'
          });
        }

        // Return updated task
        db.get(
          'SELECT * FROM tasks WHERE id = ?',
          [taskId],
          (err, updatedTask) => {
            if (err) {
              console.error('Task fetch error:', err);
              return res.status(500).json({
                success: false,
                message: 'Task updated but failed to fetch details'
              });
            }

            res.json({
              success: true,
              message: 'Task updated successfully',
              data: { task: updatedTask }
            });
          }
        );
      });
    }
  );
};

// Delete a task
const deleteTask = (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  db.run(
    'DELETE FROM tasks WHERE id = ? AND user_id = ?',
    [taskId, userId],
    function(err) {
      if (err) {
        console.error('Task deletion error:', err);
        return res.status(500).json({
          success: false,
          message: 'Error deleting task'
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    }
  );
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};