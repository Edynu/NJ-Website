import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Users.css';
import ErrorPopup from './ErrorPopup';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewOption, setViewOption] = useState(null);
  const [error, setError] = useState({ show: false, message: '', type: 'error', errorCode: '' });
  const [users, setUsers] = useState([]); // Replace mock data with an empty array
  const [characterData, setCharacterData] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://localhost:7039/api/Users/get-users');
      setUsers(response.data);
    } catch (error) {
      showError('error', 'Failed to fetch users', error);
      console.error('Fetch users error:', error);
    }
  };

  const fetchCharacterData = async (userId) => {
    try {
      const response = await fetch(`https://localhost:7039/api/Character/get-character-data?userId=${userId}`);
      const data = await response.json();
      setCharacterData(data);
    } catch (error) {
      showError('error', 'Failed to fetch character data', error);
      console.error('Failed to fetch character data:', error);
    }
  };
  

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showError = (type, message, error = null, errorCode = '') => {
    if (error) {
      message = `${message} ${JSON.stringify(error)}`;
    }
    setError({ show: true, message, type, errorCode });
  };

  const handleErrorPopupClose = () => {
    setError({ show: false, message: '', type: 'error', errorCode: '' });
  };

  const handleUserSelection = (user) => {
    setSelectedUser(user);
    setViewOption('info');
    fetchCharacterData(user.id);
  };

  const renderRightContent = () => {
    if (!selectedUser) {
      return <p>Select a user to view information.</p>;
    }
  
    switch (viewOption) {
      case 'info':
        return (
          <div>
            <h3>User Information</h3>
            <table className="user-info-table">
              <tbody>
                <tr>
                  <th>First Name</th>
                  <td>{selectedUser.firstName}</td>
                </tr>
                <tr>
                  <th>Last Name</th>
                  <td>{selectedUser.lastName}</td>
                </tr>
                <tr>
                  <th>Nickname</th>
                  <td>{selectedUser.nickname}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{selectedUser.email}</td>
                </tr>
                <tr>
                  <th>Role</th>
                  <td>{selectedUser.role}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
        case 'character':
            if (!characterData) {
              return <p>Loading character data...</p>;
            }
      
            return (
              <div>
                <h3>Character Information</h3>
                <table className="character-info-table">
                  <tbody>
                    <tr>
                      <th>Name</th>
                      <td>{characterData.name}</td>
                    </tr>
                    <tr>
                      <th>Level</th>
                      <td>{characterData.level}</td>
                    </tr>
                    <tr>
                      <th>EXP</th>
                      <td>{characterData.exp}</td>
                    </tr>
                    <tr>
                      <th>Coordinates</th>
                      <td>{characterData.x}, {characterData.y}, {characterData.z}</td>
                    </tr>
                    <tr>
                      <th>Server</th>
                      <td>{characterData.server}</td>
                    </tr>
                    <tr>
                      <th>Health</th>
                      <td>{characterData.health}</td>
                    </tr>
                    <tr>
                      <th>Water</th>
                      <td>{characterData.water}</td>
                    </tr>
                    <tr>
                      <th>Stamina</th>
                      <td>{characterData.stamina}</td>
                    </tr>
                    <tr>
                      <th>Stamina Attribute</th>
                      <td>{characterData.staminaAtr}</td>
                    </tr>
                    <tr>
                      <th>Defense Attribute</th>
                      <td>{characterData.deffenseAtr}</td>
                    </tr>
                    <tr>
                      <th>Damage Attribute</th>
                      <td>{characterData.damageAtr}</td>
                    </tr>
                    <tr>
                      <th>Mobility Attribute</th>
                      <td>{characterData.mobilityAtr}</td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <td>{characterData.status}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      };
  

  return (
    <div className="users">
      <div className="users-left">
      <button className="green-button" onClick={fetchUsers}>
          Refresh
        </button>
        <input
          className="users-search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
        />
        <button className="green-button" onClick={() => setViewOption('info')}>
          Info
        </button>
        <button className="green-button" onClick={() => setViewOption('character')}>
          Character
        </button>
        
        <ul className="users-list">
          {filteredUsers.map((user) => (
          <li key={user.id} onClick={() => handleUserSelection(user)}>
            {`${user.role}`} ({user.nickname})
          </li>
        ))}
        </ul>
      </div>
      <div className="users-right">{renderRightContent()}</div>
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

export default Users;
