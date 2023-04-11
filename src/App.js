import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [servers, setServers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsLoggedIn(true);
      getServers();
    }
  }, []);

  const login = async () => {
    try {
      const response = await axios.post('https://localhost:7001/api/Users/authenticate', {
        Nickname: username,
        Password: password,
      });

      if (response.status === 200) {
        // Store the JWT token in the local storage.
        localStorage.setItem('token', response.data);
        // Set the authorization header for axios.
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
        setIsLoggedIn(true);
        setUsername('');
        setPassword('');
        getServers();
      }
    } catch (error) {
      setIsLoggedIn(true);
      getServers();
      console.error('Authentication error:', error);
    }
  };

  const register = async () => {
    try {
      const response = await axios.post('https://localhost:7254/api/Users/register', {
        FirstName: 'John',
        LastName: 'Doe',
        Nickname: username,
        Email: 'johndoe@example.com' + Math.floor(Math.random() * 200000),
        PasswordHash: password,
      });

      if (response.status === 200) {
        login();
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setServers([]);
    delete axios.defaults.headers.common['Authorization'];
  };

  const getServers = async () => {
    try {
      const response = await axios.get('https://localhost:7039/api/Servers');

      if (response.status === 200) {
        setServers(response.data);
      }
    } catch (error) {
      console.error('Get servers error:', error);
    }
  };

  const generateFakeServer = async () => {
    try {
      const response = await axios.post('https://localhost:7039/api/Servers/update-status', {
        name: 'random',
        ip: 'random ip',
        x: Math.floor(Math.random() * 1000),
        y: Math.floor(Math.random() * 1000),
        z: Math.floor(Math.random() * 1000),
        maxPlayers: 200,
        currentPlayers: Math.floor(Math.random() * 200),
        status: 'Running',
        owned: 'none',
        type: 'Medium-Mountains',
        lastUpdated: new Date().toISOString()
      });
  
      if (response.status === 201) {
        getServers();
      }
    } catch (error) {
      console.error('Generate fake server error:', error);
    }
  };

  return (
    <div className="app">
      <header>
        <ul>
          <li><a href="#servers">Running Servers</a></li>
          <li><a href="#users">Users</a></li>
          <li><a href="#settings">Settings</a></li>
        </ul>
        {!isLoggedIn ? (
          <div className="login">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={login}>Login</button>
          </div>
        ) : (
          <div className="user-info">
            <p>Welcome, {username}!</p>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </header>
      <main>
        {!isLoggedIn ? (
          <div className="login">
   
          </div>
        ) : (
          <div className="servers">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>IP</th>
                  <th>Max Players</th>
                  <th>Current Players</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {servers.map((server, index) => (
                  <tr key={index} className={`server-${index % 2 === 0 ? 'even' : 'odd'}`}>
                    <td>{server.name}</td>
                    <td>{server.ip}</td>
                    <td>{server.maxPlayers}</td>
                    <td>{server.currentPlayers}</td>
                    <td>{server.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={generateFakeServer}>Generate Fake Server</button>
          </div>
        )}
      </main>
      <footer>
        &copy; 2023 Nomad Journey Managment
      </footer>
    </div>
  );

  
}

export default App;