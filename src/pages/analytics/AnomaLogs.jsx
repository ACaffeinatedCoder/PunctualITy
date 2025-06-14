import {
  faCircleXmark,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import './AbsencesCSS.css';
import './AnomaLogsCSS.css';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../config/firebase-config';

function AnomaLogs({ suspicious }) {
  const [selectedID, setSelectedID] = useState('');
  const [students, setStudents] = useState([]);
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

  const [unevenCount, setUnevenCount] = useState([]);
  const suspiciousLogs = () => {
    /**
     * The logic:
     *  - for every Clock In, there must be a Clock Out
     *  -- count Clock Ins and Clock Outs per ID per Day
     *  --- unevent count? mark as suspicious
     *  - Clock Out should be done before Clock In
     *  -- irregular logging? mark as suspicious
     */

    /** Uneven Count */
    const unevenRecords = [];
    const allDates = [
      ...new Set(
        attendance.map((item) => item.date).filter((date) => date !== '')
      ),
    ];

    const allStudents = [...new Set(students.map((item) => item.id))];

    for (const date of allDates) {
      /** For every date... */
      for (const studentID of allStudents) {
        /** For every student...
         *  check amount of Clock Ins and Clock Outs made that date
         */
        const recordsForStudentDate = attendance
          .filter((item) => item.date === date && item.studentId === studentID)
          .sort((a, b) => new Date(a.time) - new Date(b.time));

        const clockIns = recordsForStudentDate.filter(
          (item) => item.category === 'Clock In'
        ).length;

        const clockOuts = recordsForStudentDate.filter(
          (item) => item.category === 'Clock Out'
        ).length;

        let hasOutBeforeIn = false;

        for (let i = 0; i < recordsForStudentDate.length - 1; i++) {
          const current = recordsForStudentDate[i];
          const next = recordsForStudentDate[i + 1];

          if (
            current.category === 'Clock Out' &&
            next.category === 'Clock In'
          ) {
            hasOutBeforeIn = true;
            break;
          }
        }

        if (clockIns !== clockOuts || hasOutBeforeIn) {
          unevenRecords.push({
            studentID,
            date,
            clockIn: clockIns,
            clockOut: clockOuts,
            anomaly: hasOutBeforeIn ? 'Clock-Out before Clock-In' : '',
          });
        }
      }
    }

    setUnevenCount(unevenRecords);
  };

  useEffect(() => {
    if (attendance.length > 0 && students.length > 0) {
      suspiciousLogs();
    }
  }, [attendance, students]);

  const clearFilters = () => {
    setSelectedID('');
  };

  const records_mapped = unevenCount
  .filter((sus) => selectedID === '' || sus.studentID === selectedID)
  .map((sus, index) => (
    <div key={index} className="anomalogs-item">
      <div className="anomalogs-content">
        <p>
          <strong>Date:</strong> {sus.date}&nbsp;&nbsp;&nbsp;&nbsp;
          <strong>Student ID:</strong> {sus.studentID}&nbsp;&nbsp;&nbsp;&nbsp;
          <strong>Clock-ins:</strong> {sus.clockIn}&nbsp;&nbsp;&nbsp;&nbsp;
          <strong>Clock-outs:</strong> {sus.clockOut}
        </p>
        {sus.anomaly && (
          <span className="anomaly-text">Anomaly: {sus.anomaly}</span>
        )}
      </div>
    </div>
  ));


  const students_mapped = students.map((stud, index) => (
    <div
      key={index}
      className="absence-item"
      style={{ cursor: 'pointer' }}
      onClick={() => setSelectedID(stud.id)}>
      <p>
        <strong>{stud.id}</strong>: {stud.lastname}, {stud.firstname}
      </p>
    </div>
  ));

  return (
    <div className="absence-overall-container">
      <div className="absence-header">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="close-absences"
          style={{ cursor: 'pointet' }}
          onClick={() => suspicious(false)}
        />
        <h1>
          <span style={{ color: '#f16522' }}>SUSPICIOUS</span> LOGS
        </h1>
      </div>

      <div className="absence-and-analytics">
        <div className="idlogs-container">
          <div className="absence-title">
            <input
              value={selectedID}
              placeholder="Student ID..."
              onChange={(e) => setSelectedID(e.target.value)}
            />
            <FontAwesomeIcon icon={faRotate} onClick={clearFilters} />
          </div>
          <h2>
            <span style={{ color: '#f16522' }}>Student</span> Logs
          </h2>
          <div className="student-details">{students_mapped}</div>
        </div>

        <div className="anomalogs-container">
          <div className="anomalogs-title">
            <h2>
              <span style={{ color: '#f6941d' }}>LOG</span> DETAILS
            </h2>
          </div>
          <div className="records">{records_mapped}</div>
        </div>
      </div>
    </div>
  );
}

export default AnomaLogs;
