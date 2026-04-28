const express = require('express');
const router = express.Router();
const db = require('../db');

// Add task
router.post('/', async (req, res) => {
    try {
        const { title, description, deadline, priority } = req.body;
        const query = `
            INSERT INTO tasks (title, description, deadline, priority)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [title, description, deadline, priority]);
        res.status(201).json({ id: result.insertId, message: 'Task created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add task' });
    }
});

// Fetch tasks with sorting logic and overdue checking
router.get('/', async (req, res) => {
    try {
        // Mark overdue tasks first
        const updateOverdueQuery = `
            UPDATE tasks 
            SET status = 'overdue' 
            WHERE status = 'pending' AND deadline < NOW()
        `;
        await db.query(updateOverdueQuery);

        // Fetch sorted tasks
        // Priority order: High (3), Medium (2), Low (1) - but we map ENUM to values for sorting
        // Higher priority first, nearest deadline first
        const fetchQuery = `
            SELECT * FROM tasks 
            ORDER BY 
                CASE priority
                    WHEN 'High' THEN 1
                    WHEN 'Medium' THEN 2
                    WHEN 'Low' THEN 3
                    ELSE 4
                END ASC,
                deadline ASC
        `;
        const [rows] = await db.query(fetchQuery);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Mark task as completed
router.put('/:id/complete', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `UPDATE tasks SET status = 'completed' WHERE id = ?`;
        await db.query(query, [id]);
        res.status(200).json({ message: 'Task marked as completed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete task
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM tasks WHERE id = ?`;
        await db.query(query, [id]);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;
