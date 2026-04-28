import TaskCard from './TaskCard';
import { ListTodo } from 'lucide-react';

export default function TaskList({ tasks, onComplete, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <ListTodo size={48} style={{ margin: '0 auto 1rem auto', color: 'var(--text-secondary)' }} />
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No tasks yet</h3>
        <p>Add a task above to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-grid">
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onComplete={onComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
