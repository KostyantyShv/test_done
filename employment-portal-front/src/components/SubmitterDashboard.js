import { useState } from 'react';

export default function SubmitterDashboard({ user }) {
  const [cv, setCv] = useState({
    position: '',
    full_name: user.full_name || '',
    email: user.email,
    about_your_self: '',
    skills: '',
    experience: '',
    languages: '',
    project: '',
  });
  const [isCvCreated, setIsCvCreated] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCv((prevCv) => ({
      ...prevCv,
      [name]: value,
    }));
  };

  const handleCvSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3000/cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({ cv }),
      });

      if (!response.ok) {
        throw new Error('Failed to create CV');
      }

      setIsCvCreated(true);
    } catch (error) {
      setError('Failed to create CV. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Submitter Dashboard</h2>
      <form onSubmit={handleCvSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Position:</label>
          <input
            type="text"
            name="position"
            value={cv.position}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Full Name:</label>
          <input
            type="text"
            name="full_name"
            value={cv.full_name}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Email:</label>
          <input
            type="email"
            name="email"
            value={cv.email}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>About Yourself:</label>
          <textarea
            name="about_your_self"
            value={cv.about_your_self}
            onChange={handleInputChange}
            rows="4"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              resize: 'vertical',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Skills:</label>
          <textarea
            name="skills"
            value={cv.skills}
            onChange={handleInputChange}
            rows="4"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              resize: 'vertical',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Experience:</label>
          <textarea
            name="experience"
            value={cv.experience}
            onChange={handleInputChange}
            rows="4"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              resize: 'vertical',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Languages:</label>
          <input
            type="text"
            name="languages"
            value={cv.languages}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Project:</label>
          <input
            type="text"
            name="project"
            value={cv.project}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '12px',
            fontSize: '16px',
            backgroundColor: '#0070f3',
            color: '#fff',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          {isLoading ? 'Submitting...' : 'Submit CV'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {isCvCreated && <p style={{ color: 'green', marginTop: '10px' }}>CV created successfully!</p>}
    </div>
  );
}
