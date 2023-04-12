import React from 'react';
import './ErrorPopup.css';

const ErrorPopup = ({ type, message, errorCode, handleClose }) => {
  const getTitleColor = () => {
    switch (type) {
      case 'error':
        return 'red';
      case 'success':
        return 'green';
      case 'info':
      default:
        return 'black';
    }
  };

  return (
    <div className="error-popup">
      <div className="error-popup-content">
        <h4 style={{ color: getTitleColor() }}>{type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Info'}</h4>
        <p>{message}</p>
        {errorCode && (
          <div className="error-code">
            <p>Error Code: {errorCode}</p>
          </div>
        )}
        <button className="green-button" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;
