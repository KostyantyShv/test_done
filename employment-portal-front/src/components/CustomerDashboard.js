import { useEffect, useState } from 'react';

export default function CustomerDashboard() {
  const [cvs, setCvs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCvIndex, setExpandedCvIndex] = useState(null);

  useEffect(() => {
    const fetchCvs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/cv/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`, // Ensure Bearer token is properly set
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch CVs');
        }

        const data = await response.json();
        setCvs(data);
      } catch (error) {
        setError('Failed to fetch CVs. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCvs();
  }, []);

  const toggleExpand = (index) => {
    setExpandedCvIndex(expandedCvIndex === index ? null : index);
  };

  return (
    <div>
      <h2>Welcome, Customer!</h2>
      <p>This is your customer dashboard.</p>
      {isLoading && <p>Loading CVs...</p>}
      <div>
        {cvs.length > 0 ? (
          cvs.map((cv, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <h3 onClick={() => toggleExpand(index)} style={{ cursor: 'pointer' }}>
                {cv.position} {expandedCvIndex === index ? '-' : '+'}
              </h3>
              {expandedCvIndex === index && (
                <div>
                  <p>
                    <strong>Full Name:</strong> {cv.full_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {cv.email}
                  </p>
                  <p>
                    <strong>About Yourself:</strong> {cv.about_your_self}
                  </p>
                  <p>
                    <strong>Skills:</strong> {cv.skills}
                  </p>
                  <p>
                    <strong>Experience:</strong> {cv.experience}
                  </p>
                  <p>
                    <strong>Languages:</strong> {cv.languages}
                  </p>
                  <p>
                    <strong>Project:</strong> {cv.project}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <h1>There are no CVs at the moment</h1>
        )}
      </div>
    </div>
  );
}
