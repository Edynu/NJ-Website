import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Servers from './components/Servers';
import Users from './components/Users';
import Settings from './components/Settings';
import Login from './components/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [servers, setServers] = useState([]);
  const [currentPage, setCurrentPage] = useState('');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsLoggedIn(true);
    }
  }, []);

  // Rest of your axios code ...

  const changePage = (page) => {
    setCurrentPage(page);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const login = async () => {
    try {
      const response = await axios.post('https://localhost:7254/api/Users/authenticate', {
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
  
        // Get user data
        const userDataResponse = await axios.get('https://localhost:7254/api/Users/get-user', {
          params: { Nickname: username },
        });
  
        if (userDataResponse.status === 200) {
          console.log('User data:', userDataResponse.data);
        }
      }
    } catch (error)
      {
      setIsLoggedIn(false);
      console.error('Authentication error:', error);
    }
  };
  

  const renderPage = () => {
    switch (currentPage) {
      case 'servers':
        return <Servers servers={servers} setServers={setServers} />;
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className={`app ${theme}`}>
      <header>
        {isLoggedIn && (
          <>
            <ul>
              <li>
                <button onClick={() => changePage('servers')}>Servers</button>
              </li>
              <li>
                <button onClick={() => changePage('users')}>Users</button>
              </li>
              <li>
                <button onClick={() => changePage('settings')}>Settings</button>
              </li>
            </ul>
            <div className="theme-toggle">
              <button onClick={toggleTheme}>Toggle {theme === 'light' ? 'dark' : 'light'} Mode</button>
            </div>
          </>
        )}
        {!isLoggedIn ? <Login username={username} setUsername={setUsername} password={password} setPassword={setPassword} login={login} /> : null}
      </header>
      <main>{renderPage()}</main>
      <footer>&copy; 2023 Nomad Journey Managment</footer>
    </div>
  );
}

export default App;
