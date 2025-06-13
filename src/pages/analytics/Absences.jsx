import {
  faCalendarDays,
  faCircleExclamation,
  faCircleXmark,
  faPersonCircleExclamation,
  faPersonCircleQuestion,
  faRotate,
  faUserXmark
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import './AbsencesCSS.css';

function Absences({ absent }) {
  const [attendance, setAttendance] = useState(() => {
    const stored = localStorage.getItem('idLogs');
    return stored ? JSON.parse(stored) : [];
  });

  const [ids, setIds] = useState(() => {
    const stored = localStorage.getItem('StudentList');
    return stored ? JSON.parse(stored) : [];
  });

  const [selectedID, setSelectedID] = useState('');
  const [studDrop, setStudDrop] = useState([]);
  const [studentDetails, setStudentDetails] = useState({ studentID: '', studentName: '' });

  useEffect(() => {
    const foundStudent = ids.find((stud) => stud.studentID === selectedID);
    if (foundStudent) {
      setStudentDetails(foundStudent);
    } else {
      setStudentDetails({ studentID: '', studentName: '' });
    }
  }, [selectedID, ids]);

  useEffect(() => {
    const extracted = ids.map((item) => item.studentID);
    setStudDrop(extracted);
  }, [ids]);


  useEffect(() => {
    const stored = localStorage.getItem('StudentList');
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
    localStorage.setItem('StudentList', JSON.stringify(ids));
  }, [ids]);

  const filteredAttendance = attendance
    .filter((rec) => {
      const matchID = selectedID ? rec.id === selectedID : true;

      return matchID;
    })
    .sort((a, b) => new Date(b.time) - new Date(a.time));

  const clearFilters = () => {
    setSelectedID('');
  };

  const records_mapped = filteredAttendance.map((rec, index) => (
    <div key={index} className="absence-item">
      <p>{rec.category}</p>
      <h2>
        <strong>{rec.id}</strong>
      </h2>
      <p>{rec.time}</p>
      <p>
        <b>{rec.user}</b>
      </p>
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
            <select
              value={selectedID}
              onChange={(e) => setSelectedID(e.target.value)}
            >
              <option value="" disabled>
                Select ID
              </option>
              {studDrop.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <FontAwesomeIcon icon={faRotate} onClick={clearFilters} />
          </div>
          <div className='student-details'>
            <h3>ID: {'\t'}{studentDetails.studentID}</h3>
            <h3>Name: {studentDetails.studentName}</h3>
          </div>
        </div>

        <div className="absence-container">
          <div className="id-title">
            <h2>ABSENCE RECORDS</h2>
          </div>
          <div className="records">{records_mapped}</div>
        </div>
      </div>
      <div>
        <p className="read-the-docs">
          This website was developed by Mr. Francisco for the Siena College of
          Taytay's College of Engineering and Information Technology Department.
        </p>
      </div>
    </div>
  );
}

export default Absences;
