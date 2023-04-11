import React, { useState } from 'react';
import axios from 'axios';
import './Settings.css';

const Settings = () => {
  const [viewOption, setViewOption] = useState('userSettings');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    try {
      const response = await axios.post('https://localhost:7254/api/Users/password-change', {
        Id: 1, // Replace with the actual user ID
        Nickname: 'user', // Replace with the actual user nickname
        Email: 'user@example.com', // Replace with the actual user email
        Password: password,
      });

      if (response.status === 200) {
        console.log('Password updated successfully');
      }
    } catch (error) {
      console.error('Change password error:', error);
    }
  };

  const renderSettingsContent = () => {
    switch (viewOption) {
      case 'userSettings':
        return (
          <div>
            <h2>User Settings</h2>
            <form className="settings-form" onSubmit={handleChangePassword}>
              <div>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="green-button">
                Update Password
              </button>
            </form>
          </div>
        );
      // Add your other cases for Management Settings and Logs here
      default:
        return null;
    }
  };

  return (
    <div className="settings">
      <div className="settings-left">
        <button className="green-button" onClick={() => setViewOption('userSettings')}>
          User Settings
        </button>
        {/* Add your other buttons for Management Settings and Logs here */}
      </div>
      <div className="settings-right">{renderSettingsContent()}</div>
    </div>
  );
};

export default Settings;
