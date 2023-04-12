import React from 'react';
import './Home.css';
import nomadImage from '../images/nomad.png';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Nomad Journey Management</h1>
      <p>This is the home page of our management system.</p>
      <p>Please use the navigation menu above to access other pages.</p>
      <img src={nomadImage} alt="Nomad" style={{ width: '25%', height: 'auto' }} />    </div>
  );
};

export default Home;
