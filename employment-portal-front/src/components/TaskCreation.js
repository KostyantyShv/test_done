import { useState, useEffect } from 'react';

export default function TaskCreation({ userId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitterId, setSubmitterId] = useState('');
  const [submitters, setSubmitters] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSubmitters = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/cv/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch submitters');
        }
        const data = await response.json();
        setSubmitters(data);
      } catch (error) {
        setError('Failed to fetch submitters. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/task/customer', {
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

    fetchSubmitters();
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const task = {
        title,
        description,
        submitterId: Number(submitterId), 
      };

      const response = await fetch('http://localhost:3000/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({ task }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      setTitle('');
      setDescription('');
      setSubmitterId('');
      const updatedTasks = await fetch('http://localhost:3000/task/customer', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      }).then((res) => res.json());
      setTasks(updatedTasks);
    } catch (error) {
      setError('Failed to create task. Please try again.');
    }
  };

  const handleComplete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/task/confirm', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({ task: { id: taskId, confirmCustomer: true } }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete task');
      }

      setTasks(
        tasks
          .map((task) => (task.id === taskId ? { ...task, status: 'Completed', confirmed: true } : task))
          .filter((task) => !task.confirmed),
      ); 
    } catch (error) {
      setError('Task was not completed by submitter.');
    }
  };

  return (
    <div>
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Assign to Submitter</label>
          <select value={submitterId} onChange={(e) => setSubmitterId(e.target.value)} required>
            <option value="">Select Submitter</option>
            {submitters.map((submitter) => (
              <option key={submitter.id} value={submitter.id}>
                {submitter.full_name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Task</button>
      </form>

      <h2>Assigned Tasks</h2>
      {isLoading && <p>Loading tasks...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        {console.log(tasks, 'tasks')}
        {tasks.length > 0 ? (
          tasks
            .filter((task) => !task.confirmCustomer)
            .map((task) => {
              const submitter = submitters.find((s) => s.id === task.submitterId);
              return (
                <div key={task.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                  <h3>{task.title}</h3>
                  <p>
                    <strong>Description:</strong> {task.description}
                  </p>
                  <p>
                    <strong>Status:</strong> {task.status}
                  </p>
                  {submitter && (
                    <p>
                      <strong>Assigned to:</strong> {submitter.full_name}
                    </p>
                  )}
                  {task.status !== 'Completed' && !task.confirmCustomer && (
                    <button onClick={() => handleComplete(task.id)}>Confirm Task</button>
                  )}
                </div>
              );
            })
        ) : (
          <p>No tasks assigned</p>
        )}
      </div>
    </div>
  );
}
