import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Servers from './components/Servers';
import Users from './components/Users';
import Settings from './components/Settings';
import Login from './components/Login';
import Home from './components/Home';
import ErrorPopup from './components/ErrorPopup'; // Import the ErrorPopup component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState('');
  const [servers, setServers] = useState([]);
  const [currentPage, setCurrentPage] = useState('');
  const [theme, setTheme] = useState('dark');
  const [error, setError] = useState({ show: false, message: '', type: 'error', errorCode: '' }); // State for controlling the error popup visibility, type, and errorCode


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsLoggedIn(true);
    }
  }, []);

  const showError = (type, message, error = null, errorCode = '') => {
    if (error) {
      message = `${message} ${JSON.stringify(error)}`;
    }
    setError({ show: true, message, type, errorCode });
  };

  const handleErrorPopupClose = () => {
    setError({ show: false, message: '', type: 'error', errorCode: '' });
  };

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
  
        // Get user data and check for the developer role
        const userData = await getUserData();
        if (userData && userData.role === 'developer') {
          setIsLoggedIn(true);
          setUsername('');
          setPassword('');
          showError('success', 'Access allowed:', "Welcome to the developer's area");
        } else {
          // If the user doesn't have the developer role, show an error message
          setIsLoggedIn(false);
          showError('error', 'Access denied:', "User doesn't have the developer role");
        }
      }
    } catch (error) {
      setIsLoggedIn(false);
      showError('error', 'Authentication error:', error);
      console.error('Authentication error:', error);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserData(null);
    setCurrentPage('Home');
  };
  
  const getUserData = async () => {
    try {
      const response = await axios.get('https://localhost:7254/api/Users/get-user', {
        params: { emailOrNickname: username, password: password },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      if (response.status === 200) {
        console.log('User data:', response.data);
        // Save the user data in the React app state.
        setUserData(response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Get user data error:', error);
      return null;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'servers':
        return <Servers servers={servers} setServers={setServers} />;
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings userData={userData}/>;
      default:
        return <Home />;
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
                      <button onClick={logout}>Logout</button>
                      <button onClick={toggleTheme}>Toggle {theme === 'light' ? 'dark' : 'light'} Mode</button>
                  </div>
              </>
          )}
          {!isLoggedIn ? <Login username={username} setUsername={setUsername} password={password} setPassword={setPassword} login={login} /> : null}        
      </header>
      <main>{renderPage()}</main>
      <footer>&copy; 2023 Nomad Journey Managment</footer>
      {error.show && (
                      <ErrorPopup
                        type={error.type}
                        message={error.message}
                        errorCode={error.errorCode}
                        handleClose={handleErrorPopupClose}
                      />
                    )}
    </div>
  );
}

export default App;
