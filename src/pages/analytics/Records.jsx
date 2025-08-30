import {
  faCalendarDays,
  faCircleExclamation,
  faCircleXmark,
  faDownload,
  faMagnifyingGlass,
  faPersonCircleExclamation,
  faPersonCircleQuestion,
  faRotate,
  faUserPlus,
  faUserTie,
  faUserXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, useRef } from 'react';
import './RecordsCSS.css';
import Absences from './Absences';
import AnomaLogs from './AnomaLogs';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../config/firebase-config';
import Events from './Events';
import NewStudent from './NewStudent';
import NewFaculty from './NewFaculty';
import * as XLSX from 'xlsx';
import RequestAccess from '../RequestAccess';

function Records() {
  const [recordees, setRecordees] = useState([])
  const [rawAtt, setRawAtt] = useState ([])
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
      setRawAtt(records);
    } catch (error) {
      console.log('Error', err);
    }
  };

  const getAttendees = async () => {
    const recordCollection = collection(db, 'Student-Information');
    const q = query(recordCollection);

    try {
      const recordsRaw = await getDocs(q);
      const records = recordsRaw.docs.map((rec) => ({
        ...rec.data(),
        id: rec.id,
      }));
      setRecordees(records);
    } catch (error) {
      console.log('Error', err);
    }
  };

  useEffect(() => {
    getAttendees()
    getRecords();
  }, []);

  useEffect(() => {
    if (rawAtt.length > 0 && recordees.length > 0) {
    const mergedArray = rawAtt.map((itemA) => {
       const matched = recordees.find((itemB) => itemB.id === itemA.studentId);
       return {
         ...itemA,
         name: matched ? matched.firstname : "Unknown",
       };
     });
     setAttendance(mergedArray);
   }
  }, [rawAtt, recordees])

  const [selectedID, setSelectedID] = useState('');
  const [selectedCateg, setSelectedCateg] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const [categDrop, setCategDrop] = useState(['Clock In', 'Clock Out']);
  const [dateDrop, setDateDrop] = useState([]);
  const [facDrop, setFacDrop] = useState([]);

  const [absentPage, setAbsent] = useState(false);
  const [newStudentPage, setStudent] = useState(false);
  const [unusualPage, setUnusual] = useState(false);
  const [eventsPage, setEvents] = useState(false);
  const [facultyPage, setFaculty] = useState(false);

  const [rec, setRec] = useState(true);

  useEffect(() => {
    const extracted = [
      ...new Set(
        attendance
          .map((item) => item.date)
          .filter((date) => date && date !== '')
      ),
    ];
    setDateDrop(extracted);
  }, [attendance]);

  useEffect(() => {
    const extracted = [
      ...new Set(
        attendance
          .map((item) => item.name)
          .filter((user) => user && user.trim() !== '')
      ),
    ];
    setFacDrop(extracted);
  }, [attendance]);

  // for filtering
  const filteredAttendance = attendance
    .filter((rec) => {
      const matchCategory = selectedCateg
        ? rec.category === selectedCateg
        : true;
      const matchID = selectedID ? rec.studentId === selectedID : true;
      const matchUser = selectedUser ? rec.name === selectedUser : true;
      const matchDate = selectedTime ? rec.date === selectedTime : true;

      return matchCategory && matchID && matchUser && matchDate;
    })
    .sort((a, b) => {
      const aDateTime = new Date(`${a.date}T${a.time}`);
      const bDateTime = new Date(`${b.date}T${b.time}`);
      return bDateTime - aDateTime;
    });

  const clearFilters = () => {
    setSelectedID('');
    setSelectedCateg('');
    setSelectedTime('');
    setSelectedUser('');
  };

  const records_mapped = filteredAttendance.map((rec, index) => (
    <div key={index} className="record-item">
      <p>{rec.category}</p>
      <p>
        <strong>{rec.studentId}</strong>
      </p>
      <div style={{ flexDirection: 'column' }}>
        <p>
          <strong>{rec.date}</strong>
        </p>
        <p>{rec.time}</p>
      </div>
      <p>
        <b>{rec.name}</b>
      </p>
    </div>
  ));

  const downloadRecords = () => {
    const dlTitle = `PunctualITy-Records_${Date.now()}`;
    console.log(dlTitle);

    const worksheet = XLSX.utils.json_to_sheet(filteredAttendance);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${dlTitle}.xlsx`);
  };

  return (
    <div className="record-overall-container">
      <div>
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
            <div className="record-search">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="record-search-icon"
              />
              <input
                value={selectedID}
                placeholder="Student ID..."
                onChange={(e) => setSelectedID(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faDownload}
                className="record-search-icon"
                onClick={() => downloadRecords()}
              />
            </div>
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
              <input
                type="date"
                onChange={(e) => setSelectedTime(e.target.value)}
              />
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
            <div className="records">
              {records_mapped && records_mapped.length > 0 ? (
                <>{records_mapped}</>
              ) : (
                <>
                  <h2>No records found</h2>
                </>
              )}
            </div>
          </div>

          <div
            style={{
              width: '20px',
              height: '100%',
              backgroundColor: '#242424',
            }}></div>

          <div className="record-container">
            <div className="analytics-title">
              <h2>ANALYTICS</h2>
            </div>
            <div className="records">
              <div className="analytics-subcontainer">
                <div
                  className="analytics-item"
                  onClick={() => setAbsent(true)}
                  style={{ cursor: 'pointer' }}>
                  <h2>ABSENCES</h2>
                  <FontAwesomeIcon
                    icon={faUserXmark}
                    className="analytics-icon"
                  />
                </div>
                <div
                  className="analytics-item"
                  onClick={() => setStudent(true)}
                  style={{ cursor: 'pointer' }}>
                  <h2>ADD STUDENT</h2>
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    className="analytics-icon"
                  />
                </div>
              </div>
              <div className="analytics-subcontainer">
                <div
                  className="analytics-item"
                  onClick={() => setUnusual(true)}
                  style={{ cursor: 'pointer' }}>
                  <h2>UNUSUAL LOGS</h2>
                  <FontAwesomeIcon
                    icon={faCircleExclamation}
                    className="analytics-icon"
                  />
                </div>
                <div
                  className="analytics-item"
                  onClick={() => setEvents(true)}
                  style={{ cursor: 'pointer' }}>
                  <h2>EVENTS</h2>
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    className="analytics-icon"
                  />
                </div>
              </div>
              <div className="analytics-subcontainer">
                <div
                  className="analytics-item"
                  onClick={() => setFaculty(true)}
                  style={{ cursor: 'pointer' }}>
                  <h2>ADD FACULTY</h2>
                  <FontAwesomeIcon
                    icon={faUserTie}
                    className="analytics-icon"
                  />
                </div>
              </div>
            </div>
          </div>
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
            <Absences absent={setAbsent} />
          </div>
        )}
        {newStudentPage && (
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
            <NewStudent newPage={setStudent} />
          </div>
        )}
        {unusualPage && (
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
            <AnomaLogs suspicious={setUnusual} />
          </div>
        )}
        {eventsPage && (
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
            <Events events={setEvents} />
          </div>
        )}
        {facultyPage && (
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
            <NewFaculty faculty={setFaculty} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Records;
