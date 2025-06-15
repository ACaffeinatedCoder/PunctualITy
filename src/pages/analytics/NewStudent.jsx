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

function NewStudent({ newPage }) {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [newStudents, setNewStudents] = useState([]);

  const [newId, setNewId] = useState('');
  const [newFName, setNewFName] = useState('');
  const [newSName, setNewSName] = useState('');

  const getRecords = async () => {
    const recordCollection = collection(db, 'Attendance-Records');
    const q = query(recordCollection);
    try {
      const recordsRaw = await getDocs(q);
      const records = recordsRaw.docs.map((rec) => ({
        ...rec.data(),
        id: rec.id,
      }));
      setAttendance(records);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const getStudents = async () => {
    const recordCollection = collection(db, 'Student-Information');
    const q = query(recordCollection);
    try {
      const recordsRaw = await getDocs(q);
      const records = recordsRaw.docs.map((rec) => ({
        ...rec.data(),
        id: rec.id,
      }));
      setStudents(records);
    } catch (error) {
      console.log('Error', error);
    }
  };

  useEffect(() => {
    getRecords();
    getStudents();
  }, []);

  useEffect(() => {
    findNewStudents();
  }, [students]);

  const findNewStudents = () => {
    const recordedStudents = [...new Set(students.map((item) => item.id))];

    const allStudents = [
      ...new Set(
        attendance
          .map((item) => item.studentId)
          .filter((studentId) => studentId !== '')
      ),
    ];

    const newStudents = allStudents.filter(
      (stud) => !recordedStudents.includes(stud)
    );

    setNewStudents(newStudents);
  };

  const addNewStudent = async () => {
    if (newId !== '' && newFName !== '' && newSName !== '') {
      try {
        const collectionRef = collection(db, 'Student-Information');
        const documentRef = doc(collectionRef, newId);

        const newStudent = {
          firstname: newFName,
          lastname: newSName,
        };

        await setDoc(documentRef, newStudent);

        alert('Student added!');
        getStudents();
        resetForm();
      } catch (error) {
        console.error('Error adding document: ', error);
        alert(
          'Something went wrong. Please contact your technician for checking.'
        );
      }
    } else {
      alert('Incomplete student information...');
    }
  };

  const resetForm = () => {
    setNewId('');
    setNewFName('');
    setNewSName('');
  };

  const records_mapped = newStudents.map((rec, index) => (
    <div
      key={index}
      className="absence-item"
      style={{ cursor: 'pointer' }}
      onClick={() => setNewId(rec)}>
      <p>
        <strong>{rec}</strong>
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
          <span style={{ color: '#f16522' }} onClick={() => findNewStudents()}>
            ADD
          </span>{' '}
          STUDENT
        </h1>
      </div>

      <div className="absence-and-analytics">
        <div className="idlogs-container">
          <h2>
            <span style={{ color: '#f16522' }}>Student</span> Details
          </h2>
          <div className="newstud-details">
            <div className="events-name">
              <h2>
                <span style={{ color: '#f16522' }}>ID</span> of Student:
              </h2>
              <input
                placeholder="Student ID..."
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
              />
            </div>
            <div className="events-name">
              <h2>
                <span style={{ color: '#f16522' }}>First</span> Name:
              </h2>
              <input
                placeholder="Student First Name..."
                value={newFName}
                onChange={(e) => setNewFName(e.target.value)}
              />
            </div>
            <div className="events-name">
              <h2>
                <span style={{ color: '#f16522' }}>Surname</span>:
              </h2>
              <input
                placeholder="Student Surname..."
                value={newSName}
                onChange={(e) => setNewSName(e.target.value)}
              />
            </div>
            <button onClick={() => addNewStudent()}>
              Submit Student Information
            </button>
          </div>
        </div>

        <div className="anomalogs-container">
          <div className="anomalogs-title">
            <h2>
              <span style={{ color: '#f6941d' }}>UNNAMED</span> IDs
            </h2>
          </div>
          <div className="records">{records_mapped}</div>
        </div>
      </div>
    </div>
  );
}

export default NewStudent;
