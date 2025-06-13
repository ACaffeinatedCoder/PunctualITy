import { faCalendarDays, faCircleExclamation, faCircleXmark, faPersonCircleExclamation, faPersonCircleQuestion, faRotate, faUserXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, useRef } from 'react';
import './RecordsCSS.css';
import Absences from './Absences';

function Records() {
  const [attendance, setAttendance] = useState(() => {
    const stored = localStorage.getItem('idLogs');
    return stored ? JSON.parse(stored) : [];
  });

  const [ids, setIds] = useState(() => {
    const stored = localStorage.getItem('StudentList');
    return stored ? JSON.parse(stored) : [];
  });

  const [selectedID, setSelectedID] = useState('');
  const [selectedCateg, setSelectedCateg] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const [studDrop, setStudDrop] = useState([]);
  const [categDrop, setCategDrop] = useState(['Clock In', 'Clock Out']);
  const [dateDrop, setDateDrop] = useState([]);
  const [facDrop, setFacDrop] = useState([]);

  const [absentPage, setAbsent] = useState(false);
  const [latePage, setLate] = useState(false);
  const [unusualPage, setUnusual] = useState(false);
  const [eventsPage, setEvents] = useState(false);

  useEffect(() => {
    const extracted = ids.map((item) => item.studentID);
    setStudDrop(extracted);
  }, []);

  useEffect(() => {
    const extracted = [
      ...new Set(
        attendance
          .map((item) => item.time.split(',')[0].trim()) // Just the date part
          .filter((date) => date !== '')
      ),
    ];
    setDateDrop(extracted);
  }, []);

  useEffect(() => {
    const extracted = [
      ...new Set(
        attendance
          .map((item) => item.user)
          .filter((user) => user && user.trim() !== '')
      ),
    ];
    setFacDrop(extracted);
  }, []);

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

  
  const [studID, setStudID] = useState('');
  const [studName, setStudName] = useState('');
  
  const newStudent = () => {
    setIds([...ids, { studentID: studID, studentName: studName }]);
  };
  

  // for filtering
  const filteredAttendance = attendance
    .filter((rec) => {
      const matchCategory = selectedCateg
        ? rec.category === selectedCateg
        : true;
      const matchID = selectedID ? rec.id === selectedID : true;
      const matchUser = selectedUser ? rec.user === selectedUser : true;
      const matchDate = selectedTime
        ? rec.time.split(',')[0].trim() === selectedTime
        : true;

      return matchCategory && matchID && matchUser && matchDate;
    })
    .sort((a, b) => new Date(b.time) - new Date(a.time));

  const clearFilters = () => {
    setSelectedID('');
    setSelectedCateg('');
    setSelectedTime('');
    setSelectedUser('');
  };

  const records_mapped = filteredAttendance.map((rec, index) => (
    <div key={index} className="record-item">
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

  /*
  const students_mapped = ids.map((stud, index) => (
    <div key={index} className="record-item">
      <h2>
        <strong>{stud.studentID}</strong>
      </h2>
      <p>{stud.studentName}</p>
    </div>
  ));
*/

  return (
    <div className="record-overall-container">
      <div className="record-header">
        <a href="/">
          <FontAwesomeIcon icon={faCircleXmark} className="close-records" />
        </a>
        <h1>
          <span style={{ color: '#f16522' }}>Attendance</span> Records
        </h1>
      </div>

      <div className="record-and-analytics">
        <div className="record-container">
          <div className="record-title">
            <select
              value={selectedCateg}
              onChange={(e) => setSelectedCateg(e.target.value)}>
              <option value="" disabled>
                Select Category
              </option>
              {categDrop.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              value={selectedID}
              onChange={(e) => setSelectedID(e.target.value)}>
              <option value="" disabled>
                Select ID
              </option>
              {studDrop.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}>
              <option value="" disabled>
                Select Time & Date
              </option>
              {dateDrop.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}>
              <option value="" disabled>
                Select User
              </option>
              {facDrop.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <FontAwesomeIcon
              icon={faRotate}
              onClick={clearFilters}
              style={{}}
            />
          </div>
          <div className="records">{records_mapped}</div>
        </div>

        <div
          style={{
            width: '20px',
            height: '100%',
            backgroundColor: '#242424',
          }}>
          </div>

        <div className="record-container">
          <div className="analytics-title">
            <h2>ANALYTICS</h2>
          </div>
          <div className="records">
            <div className='analytics-subcontainer'>
              <div className='analytics-item'
                  onClick={() => setAbsent(true)}>
                <h2>ABSENCES</h2>
                <FontAwesomeIcon
                  icon={faUserXmark}
                  className='analytics-icon'
                />
              </div>
              <div className='analytics-item'>
                <h2>TARDINESS</h2>
                <FontAwesomeIcon
                  icon={faPersonCircleQuestion}
                  className='analytics-icon'
                />
              </div>
            </div>
            <div className='analytics-subcontainer'>
              <div className='analytics-item'>
                <h2>UNUSUAL LOGS</h2>
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  className='analytics-icon'
                />
              </div>
              <div className='analytics-item'>
                <h2>EVENTS</h2>
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  className='analytics-icon'
                />
              </div>
            </div>
            {/*
                        <input
                            onChange={(e) => setStudID(e.target.value)}
                            placeholder='ID Number'
                        />
                        <input
                            onChange={(e) => setStudName(e.target.value)}
                            placeholder='Student Name'
                        />
                        <button
                            onClick={() => newStudent()}
                        >Add student</button>
                        <h2>STUDENTS</h2>
                        {students_mapped}
                     */}
          </div>
        </div>
      </div>
      <div>
        <p className="read-the-docs">
          This website was developed by Mr. Francisco for the Siena College of
          Taytay's College of Engineering and Information Technology Department.
        </p>
      </div>
      {absentPage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#444',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Absences absent={setAbsent}/>
        </div>
      )}
    </div>
  );
}

export default Records;
