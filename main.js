// src/App.js

import React, { useEffect, useState } from 'react';

const App = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const GITHUB_USERNAME = 'your_github_username'; // replace with your GitHub username
  const REPO_NAME = 'your_repository_name'; // replace with your repository name
  const BASE_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents`;

  const fetchFiles = async (path) => {
    try {
      const response = await fetch(`${BASE_URL}/${path}`);
      const data = await response.json();
      setFiles(data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch the files in the Aws directory
    fetchFiles('Aws');
  }, []);

  const renderFiles = (files) => {
    return files.map((file) => (
      <div key={file.path}>
        <h3>{file.name}</h3>
        {file.type === 'file' && (
          <a href={file.download_url} target="_blank" rel="noopener noreferrer">
            Download
          </a>
        )}
        {file.type === 'dir' && (
          <button onClick={() => fetchFiles(file.path)}>View Contents</button>
        )}
      </div>
    ));
  };

  return (
    <div>
      <h1>GitHub Repository Contents</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error fetching data: {error.message}</p>}
      <div>{!loading && renderFiles(files)}</div>
    </div>
  );
};

export default App;
