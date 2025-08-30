import './App.css';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faPersonRunning,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import RequestAccess from './pages/RequestAccess';
import { useAuth } from './AuthContext';

/**
 * Departmental colors:
 *   #f16522 #f6941d #020202
 */
export default function MainLandingPage() {
  const { currentUser, isLoggedIn, logout } = useAuth();
  const [rec, setRec] = useState(true);

  const { mockLogin } = useAuth();

  const handleLogin = () => {
    mockLogin('');
  };

  useEffect(() => {
    //check if 'User' is empty
    setRec(!isLoggedIn);
  });

  return (
    <div>
      <div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: 0,
            zIndex: 100,
            flexDirection: 'column',
          }}>
          <div className="record-header">
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="close-records"
              onClick={() => logout()}
            />
          </div>
          <h1>
            Punctual
            <a href="/login">
              <span style={{ color: '#f16522' }}>IT</span>
            </a>
            y
          </h1>
          {currentUser && (
            <h3 style={{ paddingBottom: '10%' }}>
              Welcome,{' '}
              <i onClick={() => handleLogin()}>{currentUser.displayName}</i>
            </h3>
          )}
        </div>
        <div className="card">
          <p>How are you clocking?</p>
          <div className="clocking-in">
            <div className="clock">
              <a href="/clockin">
                <h2>CLOCK IN</h2>
                <FontAwesomeIcon icon={faClock} className="clock-icon" />
              </a>
            </div>
            <div className="clock">
              <a href="/clockout">
                <h2>CLOCK OUT</h2>
                <FontAwesomeIcon
                  icon={faPersonRunning}
                  className="clock-icon"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <p className="read-the-docs">
        This website was developed by Mr. Francisco for the Siena College of
        Taytay's College of Engineering and Information Technology Department.
      </p>
    </div>
  );
}
