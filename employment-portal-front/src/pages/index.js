// pages/sign-up.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('SUBMITTER'); 
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            email: email,
            password: password,
            role: role,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Sign-up failed');
      }

      const data = await response.json();
      console.log('Sign-up successful:', data);
      router.push('/login');
    } catch (error) {
      console.error('Error during sign-up:', error);
      setError('Sign-up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form
        onSubmit={handleSignUp}
        style={{ width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}
      >
        <h2>Sign Up</h2>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          >
            <option value="SUBMITTER">Submitter</option>
            <option value="CUSTOMER">Customer</option>
          </select>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
        <p style={{ marginTop: '10px' }}>
          Already have an account?{' '}
          <a href="#" onClick={() => router.push('/login')} style={{ color: '#0070f3', textDecoration: 'underline' }}>
            Login here
          </a>
          .
        </p>
      </form>
    </div>
  );
}
