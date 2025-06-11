import './App.css';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPersonRunning } from '@fortawesome/free-solid-svg-icons';
import RequestAccess from './pages/RequestAccess';

/**
 * Departmental colors:
 *   #f16522 #f6941d #020202
 */
export default function MainLandingPage() {
  const [count, setCount] = useState(0);
  const [rec, setRec] = useState(false)
  const [user, setUser] = useState('Casey')

  const recordsAccess = () => {
    console.log('Requesting access to records...')
  }

  useEffect(() => {
    // Mock Credential
    localStorage.setItem('User', user)
  }, [])

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
          <h1>
            Punctual<span style={{ color: '#f16522' }} onClick={() => setRec(!rec)}>IT</span>y
          </h1>
          <h3 style={{ paddingBottom: '10%' }}>
            by <i>acaffeinatedcoder</i>
          </h3>
        </div>
        <div className="card">
          <p>How are you clocking?</p>
          <div className="clocking-in">
            <div className="clock">
              <a href='/clockin'>
                <h2>CLOCK IN</h2>
                <FontAwesomeIcon icon={faClock} className="clock-icon" />
              </a>
            </div>
            <div className="clock">
              <a href='/clockout'>
                <h2>CLOCK OUT</h2>
                <FontAwesomeIcon icon={faPersonRunning} className="clock-icon" />                
              </a>

            </div>
          </div>
        </div>
        <p className="read-the-docs">
          This website was developed by Mr. Francisco for the Siena College of
          Taytay's College of Engineering and Information Technology Department.
        </p>
      </div>
      {rec && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <RequestAccess
              panel={setRec}
            />
          </div>
        )}
    </div>
  );
}
