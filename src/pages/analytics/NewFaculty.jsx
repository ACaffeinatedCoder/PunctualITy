import {
  faCircleXmark,
  faMagnifyingGlass,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import './AbsencesCSS.css';
import './AnomaLogsCSS.css';
import './EventsCSS.css';
import './NewStudentCSS.css';
import {
  collection,
  getDocs,
  query,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../config/firebase-config';
import { useAuth } from '../../AuthContext';

function NewFaculty({ newPage }) {
  const { registerUser } = useAuth();

  const [facultyMembers, setFacultyMembers] = useState([]);

  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [role, setRole] = useState('');

  const getFaculty = async () => {
    const recordCollection = collection(db, 'User-Information');
    const q = query(recordCollection);
    try {
      const recordsRaw = await getDocs(q);
      const records = recordsRaw.docs.map((rec) => ({
        ...rec.data(),
        id: rec.id,
      }));
      setFacultyMembers(records);
    } catch (error) {
      console.log('Error', error);
    }
  };

  useEffect(() => {
    getFaculty();
  }, []);

  const addNewFaculty = async () => {
    if (
      newEmail !== '' &&
      newName !== '' &&
      newPassword !== '' &&
      role !== ''
    ) {
      const result = await registerUser(newEmail, newPassword, role, newName);
      if (result.success) {
        alert('Faculty added!');
        resetForm();
        getFaculty();
      } else {
        alert('Registration failed: ' + result.message);
      }
    } else {
      alert('Incomplete/Incorrect faculty information...');
    }
  };

  const resetForm = () => {
    setNewEmail('');
    setNewPassword('');
    setNewName('');
    setRole('');
  };

  const records_mapped = facultyMembers.map((rec, index) => (
    <div key={index} className="absence-item" style={{ cursor: 'pointer' }}>
      <p>
        <strong>{rec.email}</strong>&nbsp;&nbsp;{rec.displayName}&nbsp;&nbsp;
        <strong>{rec.role}</strong>
      </p>
    </div>
  ));

  return (
    <div className="absence-overall-container">
      <div className="absence-header">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="close-absences"
          style={{ cursor: 'pointer' }}
          onClick={() => newPage(false)}
        />
        <h1>
          ADD{' '}
          <span style={{ color: '#f16522' }} onClick={() => getFaculty()}>
            FACULTY
          </span>{' '}
        </h1>
      </div>

      <div className="absence-and-analytics">
        <div className="idlogs-container">
          <h2>
            <span style={{ color: '#f16522' }}>Faculty</span> Details
          </h2>
          <div className="newstud-details">
            <div className="events-name">
              <h2>
                E<span style={{ color: '#f16522' }}>mail</span>:
              </h2>
              <input
                placeholder="faculty@email.com..."
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="events-name">
              <h2>
                <span style={{ color: '#f16522' }}>Pass</span>word:
              </h2>
              <input
                placeholder="Set default password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="events-name">
              <h2>
                Display<span style={{ color: '#f16522' }}> name</span>:
              </h2>
              <input
                placeholder="Faculty member name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="events-name">
              <h2>
                <span style={{ color: '#f16522' }}>Role</span> :
              </h2>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="" disabled>
                  Select role...
                </option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <button onClick={() => addNewFaculty()}>
              Submit Faculty Information
            </button>
          </div>
        </div>

        <div className="anomalogs-container">
          <div className="anomalogs-title">
            <h2>
              <span style={{ color: '#f6941d' }}>FACULTY</span>MEMBERS
            </h2>
          </div>
          <div className="records">{records_mapped}</div>
        </div>
      </div>
    </div>
  );
}

export default NewFaculty;
