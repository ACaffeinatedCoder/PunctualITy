import './App.css';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPersonRunning } from '@fortawesome/free-solid-svg-icons';
import RequestAccess from './pages/RequestAccess';
import { useAuth } from './AuthContext';

/**
 * Departmental colors:
 *   #f16522 #f6941d #020202
 */
export default function UnauthorizedPage() {

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
            Punctual
            <a href="/">
              <span style={{ color: '#f16522' }}>IT</span>
            </a>
            y
          </h1>
          <h3 style={{ paddingBottom: '10%' }}>
            by{' '}
            <i
              onClick={() => handleLogin()}
            >
              acaffeinatedcoder
            </i>
          </h3>
        </div>
        <div className="card">
          <p>You do not have the right permissions.</p>
        </div>
      </div>
      <p className="read-the-docs">
        This website was developed by Mr. Francisco for the Siena College of
        Taytay's College of Engineering and Information Technology Department.
      </p>
    </div>
  );
}
