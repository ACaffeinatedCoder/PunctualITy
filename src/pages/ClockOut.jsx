import { faCircleXmark, faIdBadge } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, useRef } from 'react';
import './ClockInCSS.css';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { useAuth } from '../AuthContext';

function ClockOut() {

  const { currentUser } = useAuth()

  const [scannedID, setScannedID] = useState('');
  const [animate, setAnimate] = useState(false);
  const inputRef = useRef(null);

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

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && scannedID !== '') {
      let currentTime = new Date();
      e.preventDefault();

      const dateIn = currentTime.toISOString().split('T')[0];
      const timeIn = currentTime.toTimeString().split(' ')[0];

      const logID = `${scannedID}_${Date.now()}`;

      setAnimate(true);

      let attendant = currentUser.displayName;

      const newRecord = {
        category: 'Clock Out',
        studentId: scannedID,
        date: dateIn,
        time: timeIn,
        user: attendant,
      };

      try {
        const collectionRef = collection(db, 'Attendance-Records');
        const documentRef = doc(collectionRef, logID);
        await setDoc(documentRef, newRecord);
      } catch (error) {
        console.error('Error adding document: ', error);
      }

      setTimeout(() => setAnimate(false), 1000);
      setScannedID('');
    }
  };

  return (
    <div>
      <a href="/">
        <FontAwesomeIcon icon={faCircleXmark} className="close" />
      </a>
      <h1>
        Tap your ID to <span style={{ color: '#f16522' }}>Clock Out</span>!
      </h1>
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
