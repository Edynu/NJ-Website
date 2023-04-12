import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Servers = ({ servers, setServers }) => {
const [expandedServerIndex, setExpandedServerIndex] = useState(null);

    const getServers = async () => {
        try {
        const response = await axios.get('https://localhost:7039/api/Servers');

        if (response.status === 200) {
            console.log("yes")
            setServers(response.data);
        }
        } catch (error) {
        console.error('Get servers error:', error);
        }

    };

    const toggleDropdown = (index) => {
        if (expandedServerIndex === index) {
            setExpandedServerIndex(null);
        } else {
            setExpandedServerIndex(index);
        }
    }

    const generateFakeServer = async () => {
        try {
            const response = await axios.post('https://localhost:7039/api/Servers/update-status', {
            name: 'Fake Server',
            ip: Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
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

  useEffect(() => {
    getServers();
  }, []);

  return (
    <div className="servers">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>IP</th>
            <th>Max Players</th>
            <th>Current Players</th>
            <th>Status</th>
            <th>Owned</th>
            <th>Type</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {servers.map((server, index) => (
            <React.Fragment key={index}>
              <tr onClick={() => toggleDropdown(index)}>
                <td>{server.name}</td>
                <td>{server.ip}</td>
                <td>{server.maxPlayers}</td>
                <td>{server.currentPlayers}</td>
                <td>{server.status}</td>
                <td>{server.owned}</td>
                <td>{server.type}</td>
                <td>{new Date(server.lastUpdated).toLocaleString()}</td>
              </tr>
              {expandedServerIndex === index && (
                <tr>
                  <td colSpan="8">
                    <div className="dropdown">
                      <button className='green-button'>Start</button>
                      <button className='green-button'>Restart</button>
                      <button className='green-button'>Stop</button>
                      <button className='green-button'>Manage</button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <button className="green-button" onClick={generateFakeServer}>Generate Fake Server</button>
    </div>
  );
};

export default Servers;