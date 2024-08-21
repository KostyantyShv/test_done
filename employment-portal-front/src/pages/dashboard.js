// pages/dashboard.js
import { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import SubmitterDashboard from '../components/SubmitterDashboard';
import CustomerDashboard from '../components/CustomerDashboard';
import TaskCreation from '../components/TaskCreation';
import TaskList from '../components/TaskList'; // Component to view tasks
import LogoutButton from '../components/LogoutButton';

const { TabPane } = Tabs;

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <LogoutButton />
      <h1>Dashboard</h1>
      <p>
        <strong>Role:</strong> {user.role}
      </p>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Dashboard" key="1">
          {user.role === 'SUBMITTER' ? (
            <SubmitterDashboard user={user} />
          ) : user.role === 'CUSTOMER' ? (
            <CustomerDashboard />
          ) : (
            <p>Unknown role</p>
          )}
        </TabPane>
        {user.role === 'CUSTOMER' && (
          <TabPane tab="Tasks" key="2">
            <TaskCreation userId={user.id} />
          </TabPane>
        )}
        {user.role === 'SUBMITTER' && (
          <TabPane tab="Tasks" key="2">
            <TaskList user={user} />
          </TabPane>
        )}
      </Tabs>
    </div>
  );
}
