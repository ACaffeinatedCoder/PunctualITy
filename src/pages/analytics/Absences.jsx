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

  const [events, setEvents] = useState([]);
  const [lateRecord, setLateRecord] = useState([]);

  const getEvents = async () => {
    const recordCollection = collection(db, 'Event-Information');
    const q = query(recordCollection);
    try {
      const recordsRaw = await getDocs(q);
      const records = recordsRaw.docs.map((rec) => ({
        ...rec.data(),
        id: rec.id,
      }));
      setEvents(records);
    } catch (error) {
      console.log('Error', err);
    }
  };

  useEffect(() => {
    getRecords();
    getStudents();
    getEvents();
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
    const allDates = [
      ...new Set(
        attendance.map((item) => item.date).filter((date) => date !== '')
      ),
    ];

    if (selectedID === '') {
      const allStudentIds = students.map((s) => s.id);

      const present = attendance.reduce((acc, rec) => {
        if (!acc[rec.date]) acc[rec.date] = new Set();
        acc[rec.date].add(rec.studentId);
        return acc;
      }, {});

      const allAbsences = [];

      for (const date of allDates) {
        for (const studentId of allStudentIds) {
          if (!present[date]?.has(studentId)) {
            allAbsences.push({ date, studentId });
          }
        }
      }

      setDates(allAbsences);
    } else {
      const presentDates = [
        ...new Set(
          attendance
            .filter((item) => item.studentId === selectedID)
            .map((item) => item.date)
        ),
      ];

      const absentDates = allDates
        .filter((date) => !presentDates.includes(date))
        .map((date) => ({ date, studentId: selectedID }));

      setDates(absentDates);
    }
  }, [selectedID, students, attendance]);

  const clearFilters = () => {
    setSelectedID('');
    setDates([]);
  };

  useEffect(() => {
    const matchedLateRecords = [];

    events.forEach((event) => {
      const {
        date: eventDate,
        timeStart: eventTime,
        eventName: eventName,
      } = event;

      const attendancesOnThisEvent = attendance.filter(
        (rec) => rec.date === eventDate
      );

      attendancesOnThisEvent.forEach((att) => {
        if (att.time > eventTime) {
          matchedLateRecords.push({
            ...att,
            eventTimeStart: eventTime,
            eventName: eventName || '(Unnamed Event)',
          });
        }
      });
    });

    setLateRecord(matchedLateRecords);
  }, [events, attendance]);

  const records_mapped = datesOfAbsences.map((abse, index) => (
    <div key={index} className="absence-item">
      <p>
        {abse.studentId} was absent on <strong>{abse.date}</strong>
      </p>
    </div>
  ));

  const late_mapped = lateRecord
    .filter((late) => selectedID === '' || late.studentId === selectedID)
    .map((late, index) => (
      <div key={index} className="absence-item">
        <p>
          {late.studentId} was late on <strong>{late.date}</strong> for event{' '}
          <strong>{late.eventName}</strong>. Arrived at{' '}
          <strong>{late.time}</strong> (event started at {late.eventTimeStart}).
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
          <span style={{ color: '#f16522' }}>ABSENCES</span> and{' '}
          <span style={{ color: '#f16522' }}>TARDINESS</span>
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
          {selectedID && (
            <div className="student-details">
              <h3>ID: {studentDetails.studentID}</h3>
              <h3>
                Name: {studentDetails.studentFName}{' '}
                {studentDetails.studentLName}
              </h3>
            </div>
          )}
        </div>

        <div className="absence-and-late-container">
          <div className="absence-container">
            <div className="id-absel-title">
              <h2>ABSENCE RECORDS</h2>
            </div>
            <div className="records">{records_mapped}</div>
          </div>
          <div className="absence-container">
            <div className="id-absel-title">
              <h2>TARDINESS RECORDS</h2>
            </div>
            <div className="records">{late_mapped}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Absences;
