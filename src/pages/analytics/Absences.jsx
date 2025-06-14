import {
  faCircleXmark,
  faMagnifyingGlass,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import './AbsencesCSS.css';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../config/firebase-config';

function Absences({ absent }) {
  const [attendance, setAttendance] = useState([]);
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
      console.log('Error', err);
    }
  };

  const [datesOfAbsences, setDates] = useState([]);

  const [selectedID, setSelectedID] = useState('');
  const [students, setStudents] = useState([]);
  const [studentDetails, setStudentDetails] = useState({
    studentID: '',
    studentFName: '',
    studentLName: '',
  });

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
      console.log('Error', err);
    }
  };

  useEffect(() => {
    getRecords();
    getStudents();
  }, []);

  const [foundID, setFoundID] = useState(false);

  useEffect(() => {
    const foundStudent = students.find((stud) => stud.id === selectedID);
    if (foundStudent) {
      setStudentDetails({
        studentID: foundStudent.id,
        studentFName: foundStudent.firstname,
        studentLName: foundStudent.lastname,
      });
      setFoundID(true);
    } else {
      setStudentDetails({ studentID: '', studentFName: '', studentLName: '' });
      setFoundID(false);
    }
  }, [selectedID, students]);

  useEffect(() => {
    if (selectedID !== '' && foundID === true) {
      const allDates = [
        ...new Set(
          attendance.map((item) => item.date).filter((date) => date !== '')
        ),
      ];

      const presentDates = [
        ...new Set(
          attendance
            .filter((item) => item.studentId === selectedID)
            .map((item) => item.date)
        ),
      ];

      const absentDates = allDates.filter(
        (date) => !presentDates.includes(date)
      );
      setDates(absentDates);
    } else {
      setDates([]);
    }
  }, [selectedID, foundID]);

  const clearFilters = () => {
    setSelectedID('');
    setDates([]);
  };

  const records_mapped = datesOfAbsences.map((abse, index) => (
    <div key={index} className="absence-item">
      <p>{abse}</p>
    </div>
  ));

  return (
    <div className="absence-overall-container">
      <div className="absence-header">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="close-absences"
          onClick={() => absent(false)}
        />
        <h1>
          <span style={{ color: '#f16522' }}>ABSENCES</span>
        </h1>
      </div>

      <div className="absence-and-analytics">
        <div className="id-container">
          <div className="absence-title">
            <input
              value={selectedID}
              placeholder="Student ID..."
              onChange={(e) => setSelectedID(e.target.value)}
            />
            <FontAwesomeIcon icon={faRotate} onClick={clearFilters} />
          </div>
          <h2>
            <span style={{ color: '#f16522' }}>STUDENT</span> DETAILS
          </h2>
          <div className="student-details">
            <h3>
              ID: {'\t'}
              {studentDetails.studentID}
            </h3>
            <h3>
              Name: {studentDetails.studentFName} {studentDetails.studentLName}
            </h3>
          </div>
        </div>

        <div className="absence-container">
          <div className="id-title">
            <h2>ABSENCE RECORDS</h2>
          </div>
          <div className="records">{records_mapped}</div>
        </div>
      </div>
    </div>
  );
}

export default Absences;
