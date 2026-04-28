import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { CheckSquare } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // Poll every minute to update overdue status automatically
    const interval = setInterval(fetchTasks, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCompleteTask = async (id) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}/complete`);
      fetchTasks();
    } catch (error) {
      console.error('Error marking task as complete:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <CheckSquare size={40} color="var(--primary-color)" />
          <h1>Smart Task Scheduler</h1>
        </div>
        <p>Intelligent sorting based on priority and deadlines</p>
      </header>

      <main>
        <TaskForm onTaskAdded={fetchTasks} />
        
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>Your Tasks</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              Loading tasks...
            </div>
          ) : (
            <TaskList 
              tasks={tasks} 
              onComplete={handleCompleteTask} 
              onDelete={handleDeleteTask} 
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
