import React from 'react';
import './Home.css';
import nomadImage from '../images/nomad.png';
import diagramImage from '../images/diagram.png';

const Home = () => {
  return (
    <div className="home">
      <h1>Managment WebUI</h1>
      <img src={nomadImage} alt="Nomad" style={{ width: '10%', height: 'auto' }} />    
      <img src={diagramImage} alt="Diagram" style={{ width: '25%', height: 'auto' }} /> 
      </div>
  );
};

export default Home;
