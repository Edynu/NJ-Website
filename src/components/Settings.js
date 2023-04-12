import React, { useState } from 'react';
import axios from 'axios';
import './Settings.css';
import ErrorPopup from './ErrorPopup'; // Import the ErrorPopup component

const Settings = ({ userData }) => {
  const [viewOption, setViewOption] = useState('userSettings');

  //User setting
  const [oldpassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  //Create user
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  //errors
  const [error, setError] = useState({ show: false, message: '', type: 'error', errorCode: '' }); // State for controlling the error popup visibility, type, and errorCode



  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    try {
      const response = await axios.post('https://localhost:7039/api/Users/password-change', {
        Nickname: userData.nickname, // Use the userData prop to get the user nickname // Use the userData prop to get the user email
        oldPassword: oldpassword,
        newPassword: password,
      });

      if (response.status === 200) {
        console.log('Password updated successfully');
      }
    } catch (error) {
      console.error('Change password error:', error);
    }
  };

  const showError = (type, message, error = null, errorCode = '') => {
    if (error) {
      message = `${message} ${JSON.stringify(error)}`;
    }
    setError({ show: true, message, type, errorCode });
  };

  const handleErrorPopupClose = () => {
    setError({ show: false, message: '', type: 'error', errorCode: '' });
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      showError('Password dont match');
      return;
    }
  
    const registerData = {
      firstName: firstName,
      lastName: lastName,
      nickname: nickname,
      email: email,
      passwordHash: password,
      role: role,
    };
  
    try {
      const response = await axios.post('https://localhost:7254/api/Users/register', registerData);
  
      if (response.status === 200) {
        console.log('User registered successfully');
        showError('success','User registered successfully', '');
      }
    } catch (error) {
      console.error('User registration error:', error);
      showError('error', 'User registration error', error);
    }
  };

  const renderSettingsContent = () => {
    switch (viewOption) {
      case 'userSettings':
        return (
          <div className="settings-content">
            <h2 className="settings-header">User Settings</h2>
            <div className="user-data">
              <p>Username: {userData?.nickname}</p>
              <p>Email: {userData?.email}</p>
              <p>Role: {userData?.role}</p>
            </div>
            <hr />
            <div className="password-change">
            <h3>Change Password</h3>
            <form className="settings-form" onSubmit={handleChangePassword}>
              <div className="password-inputs">
                <div>
                  <label htmlFor="oldpassword">Old Password:</label>
                  <input
                    type="password"
                    id="oldpassword"
                    value={oldpassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password">New Password:</label>
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
              </div>
              <button type="submit" className="green-button">
                Update Password
              </button>
            </form>
            </div>
            <hr />
            <div className="blank-div"></div>
          </div>
        );
        case 'registerUser':
  return (
    <div className="settings-content">
      <h2 className="settings-header">Register User</h2>
      <div className='password-change'>
        <form className="settings-form" onSubmit={handleRegisterUser}>
          <div className="input-row">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label htmlFor="nickname">Nickname:</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="green-button">
            Register
          </button>
        </form>
      </div>
      <hr />
      <div className="blank-div"></div>
    </div>
  );
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
        <button className="green-button" onClick={() => setViewOption('registerUser')}>
          Register User
        </button>
        {/* Add your other buttons for Management Settings and Logs here */}
      </div>
      <div className="settings-right">{renderSettingsContent()}</div>
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
};

export default Settings;
