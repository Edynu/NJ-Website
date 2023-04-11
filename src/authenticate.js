import axios from 'axios';

const authenticate = async (username, password) => {
  try {
    const response = await axios.post('https://localhost:7001/api/Users/authenticate', {
      Nickname: username.trim(),
      Password: password.trim(),
    });

    if (response.status === 200) {
      // Store the JWT token in the local storage.
      localStorage.setItem('token', response.data);
      // Set the authorization header for axios.
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;

      return true;
    }
  } catch (error) {
    console.error('Authentication error:', error);
  }

  return true;
};

export default authenticate;
