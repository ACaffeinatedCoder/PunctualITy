import { faCircleXmark, faIdBadge } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, useRef } from 'react';
import './ClockInCSS.css';

function ClockOut() {
  const [scannedID, setScannedID] = useState('');
  const [animate, setAnimate] = useState(false);
  const inputRef = useRef(null);

  const [ids, setIds] = useState(() => {
    const stored = localStorage.getItem('idLogs');
    return stored ? JSON.parse(stored) : [];
  });
  // Load from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem('idLogs');
    if (stored) {
      try {
        setIds(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse localStorage:', e);
        setIds([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('idLogs', JSON.stringify(ids));
  }, [ids]);

  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    focusInput();
    window.addEventListener('focus', focusInput);
    document.addEventListener('click', focusInput);

    return () => {
      window.removeEventListener('focus', focusInput);
      document.removeEventListener('click', focusInput);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && scannedID != '') {
      let currentTime = new Date();
      e.preventDefault();

      const timeIn = currentTime.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour12: false,
      });

      // Trigger animation
      setAnimate(true);

      let attendant = localStorage.getItem('User');

      setTimeout(() => setAnimate(false), 1000);
      setIds([
        ...ids,
        { category: 'Clock Out', id: scannedID, time: timeIn, user: attendant },
      ]);

      setScannedID('');
    }
  };

  const logs = () => {
    console.log('From idLogs:');
    console.log(
      'From idLogs:' +
        JSON.stringify(JSON.parse(localStorage.getItem('idLogs')), null, 2)
    );
  };

  return (
    <div>
      <a href="/">
        <FontAwesomeIcon icon={faCircleXmark} className="close" />
      </a>
      <h1>
        Tap your ID to <span style={{ color: '#f16522' }}>Clock Out</span>!
      </h1>
      {/*<button onClick={() => logs()}>view logs</button>*/}
      <div className="card">
        <input
          ref={inputRef}
          type="text"
          value={scannedID}
          onChange={(e) => setScannedID(e.target.value)}
          onKeyDown={handleKeyDown}
          className="scanner-input"
          autoFocus
        />
        <FontAwesomeIcon
          icon={faIdBadge}
          className={`scanner-icon ${animate ? 'beat-once' : ''}`}
        />
      </div>
      <p className="read-the-docs">
        New student? Remember to register your ID card with your Chairperson!
      </p>
    </div>
  );
}

export default ClockOut;
