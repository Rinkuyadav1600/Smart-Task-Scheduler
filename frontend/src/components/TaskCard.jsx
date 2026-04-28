import { CheckCircle2, Trash2, Clock, Calendar } from 'lucide-react';

export default function TaskCard({ task, onComplete, onDelete }) {
  const isCompleted = task.status === 'completed';
  const isOverdue = task.status === 'overdue';
  
  // Format dates
  const deadlineDate = new Date(task.deadline);
  const formattedDate = deadlineDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = deadlineDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`task-card ${task.status}`}>
      <div className="task-content">
        <div className="task-header">
          <h3 className="task-title">{task.title}</h3>
          <span className={`badge badge-${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
          <span className={`badge badge-status-${task.status.toLowerCase()}`}>
            {task.status}
          </span>
        </div>
        
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        
        <div className="task-meta">
          <div className="task-meta-item">
            <Calendar size={16} />
            {formattedDate}
          </div>
          <div className="task-meta-item">
            <Clock size={16} />
            {formattedTime}
          </div>
        </div>
      </div>

      <div className="task-actions">
        {!isCompleted && (
          <button 
            className="btn btn-success" 
            onClick={() => onComplete(task.id)}
            title="Mark as completed"
          >
            <CheckCircle2 size={18} />
            Complete
          </button>
        )}
        <button 
          className="btn btn-danger" 
          onClick={() => onDelete(task.id)}
          title="Delete task"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </div>
    </div>
  );
}
