// components/TaskList.js
import { useState, useEffect } from 'react';

export default function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/task/submitter', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        setError('Failed to fetch tasks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleConfirm = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/task/complete', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({ task: { id: taskId, completed: true } }),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm task');
      }

      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: 'Pending' } : task)));
    } catch (error) {
      setError('Task was already submitted to confirm');
    }
  };

  const handleComplete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/task/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({ task: { id: taskId, completed: true } }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete task');
      }

      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: 'Completed' } : task)));
    } catch (error) {
      setError('Failed to complete task. Please try again.');
    }
  };

  return (
    <div>
      <h2>My Tasks</h2>
      {isLoading && <p>Loading tasks...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        {tasks.length > 0 ? (
          tasks
            .filter((task) => !task.confirmCustomer)
            .map((task) => (
              <div key={task.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                <h3>{task.title}</h3>
                <p>
                  <strong>Description:</strong> {task.description}
                </p>
                <p>
                  <strong>Status:</strong> {task.status}
                </p>
                <button onClick={() => handleConfirm(task.id)}>Complete Task</button>
              </div>
            ))
        ) : (
          <p>No tasks available</p>
        )}
      </div>
    </div>
  );
}
