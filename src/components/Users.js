import React, { useState } from 'react';
import './Users.css';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewOption, setViewOption] = useState(null);

  // Mock data for users list
  const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelection = (user) => {
    setSelectedUser(user);
    setViewOption('info');
  };

  const renderRightContent = () => {
    if (!selectedUser) {
      return <p>Select a user to view information.</p>;
    }

    switch (viewOption) {
      case 'info':
        return <div>User Information: {selectedUser.name}</div>;
      case 'character':
        return <div>Character Information</div>;
      default:
        return null;
    }
  };

  return (
    <div className="users">
      <div className="users-left">
        <input
          className="users-search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
        />
        <ul className="users-list">
          {filteredUsers.map((user) => (
            <li key={user.id} onClick={() => handleUserSelection(user)}>
              {user.name}
            </li>
          ))}
        </ul>
        <button className="green-button" onClick={() => setViewOption('info')}>
          Info
        </button>
        <button className="green-button" onClick={() => setViewOption('character')}>
          Character
        </button>
        <button className="green-button" onClick={() => alert('Kick')}>
          Kick
        </button>
        <button className="green-button" onClick={() => alert('Ban')}>
          Ban
        </button>
        <button className="green-button" onClick={() => alert('Mute')}>
          Mute
        </button>
      </div>
      <div className="users-right">{renderRightContent()}</div>
    </div>
  );
};

export default Users;
