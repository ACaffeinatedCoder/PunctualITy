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

  const [datesOfAbsences, setDates] = useState([]);

  const [selectedID, setSelectedID] = useState('');
  const [studDrop, setStudDrop] = useState([]);
  const [studentDetails, setStudentDetails] = useState({ studentID: '', studentName: '' });

  // Get student details when selectedID changes
  useEffect(() => {
    const foundStudent = ids.find((stud) => stud.studentID === selectedID);
    if (foundStudent) {
      setStudentDetails(foundStudent);
    } else {
      setStudentDetails({ studentID: '', studentName: '' });
    }
  }, [selectedID, ids]);

  // Set dropdown values for student IDs
  useEffect(() => {
    const extracted = ids.map((item) => item.studentID);
    setStudDrop(extracted);
  }, [ids]);

  // Compute dates of absence when selectedID or attendance changes
  useEffect(() => {
    if (selectedID !== '') {
      const allDates = [
        ...new Set(
          attendance
            .map((item) => item.time.split(',')[0].trim())
            .filter((date) => date !== '')
        ),
      ];

      const presentDates = [
        ...new Set(
          attendance
            .filter((item) => item.id === selectedID)
            .map((item) => item.time.split(',')[0].trim())
        ),
      ];

      const absentDates = allDates.filter((date) => !presentDates.includes(date));
      setDates(absentDates);
    }
  }, [selectedID, attendance]);

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
          <h2><span style={{ color: '#f16522' }}>STUDENT</span> DETAILS</h2>
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
