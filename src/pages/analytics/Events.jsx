import {
  faCircleXmark,
  faMagnifyingGlass,
  faRotate,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import './AbsencesCSS.css';
import './AnomaLogsCSS.css';
import './EventsCSS.css';
import {
  collection,
  getDocs,
  query,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../config/firebase-config';

function Events({ events }) {
  const [searchItem, setSearch] = useState('');
  const [eventsList, setEventsList] = useState([]);
  const [eveName, setEveName] = useState('');
  const [eveDate, setEveDate] = useState('');
  const [eveStart, setEveStart] = useState('');
  const [eveEnd, setEveEnd] = useState('');
  const [eveSem, setEveSem] = useState('');
  const [eveSY, setEveSY] = useState('');

  const [sYs, setSys] = useState([]);
  const [filledForm, setFilledForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (
      eveName !== '' &&
      eveDate !== '' &&
      eveStart !== '' &&
      eveEnd !== '' &&
      eveSem !== '' &&
      eveSY !== '' &&
      errorMsg === ''
    ) {
      /** Form has been filled */
      setFilledForm(true);
    } else {
      setFilledForm(false);
    }
  }, [eveName, eveDate, eveStart, eveEnd, eveSem, eveSY]);

  useEffect(() => {
    if (errorMsg !== '') {
        alert(errorMsg)
    }

  }, [errorMsg])

  const getSYs = () => {
    // get current year
    if (!eveDate) return;
    const ay = parseInt(eveDate.slice(0, 4));
    const yearNow = `${ay}-${ay + 1}`;
    const yearBefore = `${ay - 1}-${ay}`;
    setSys([yearBefore, yearNow]);
  };

  const getEvents = async () => {
    const recordCollection = collection(db, 'Event-Information');
    const q = query(recordCollection);
    try {
      const recordsRaw = await getDocs(q);
      const records = recordsRaw.docs.map((rec) => ({
        ...rec.data(),
        id: rec.id,
      }));
      setEventsList(records);
    } catch (error) {
      console.log('Error', error);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
    getSYs();
  }, [eveDate]);

  const clearFilters = () => {
    setSearch('');
  };

  const records_mapped = eventsList
    .filter(
      (eve) =>
        searchItem.trim() === '' ||
        eve.eventName.toLowerCase().includes(searchItem.toLowerCase())
    )
    .map((eve, index) => (
      <div key={index} className="events-item">
        <p>
          <strong>{eve.eventName}</strong> &nbsp;&nbsp;&nbsp;&nbsp;
          {eve.semester} Semester&nbsp;&nbsp;&nbsp;&nbsp;
          <strong>{eve.date}</strong> &nbsp;&nbsp;&nbsp;&nbsp;
          <strong>
            <span style={{ color: '#f16522' }}>Start:</span> {eve.timeStart}
          </strong>{' '}
          &nbsp;
          <strong>
            <span style={{ color: '#f16522' }}>End:</span> {eve.timeEnd}
          </strong>
        </p>
      </div>
    ));

  const submitEventDetails = async () => {
    if (filledForm === false) {
      alert('Incomplete event details');
    } else {
      const parts = eveSY.split('-');
      const yearPart = parts[0].slice(2) + parts[1].slice(2);

      const semesterCode =
        eveSem === '1st' ? '01' : eveSem === '2nd' ? '02' : 'SUM';

      const namePart = eveName
        .trim()
        .split(/\s+/)
        .map((word) => word.slice(0, 3).toUpperCase())
        .join('');

      const eventID = `${yearPart}${semesterCode}_${namePart}`;

      try {
        const collectionRef = collection(db, 'Event-Information');
        const documentRef = doc(collectionRef, eventID);

        const existingDoc = await getDoc(documentRef);

        if (existingDoc.exists()) {
          alert(
            'Event with similar name in the similar school year already exists. Please use a different name.'
          );
          return;
        }

        const newEvent = {
          date: eveDate,
          eventName: eveName,
          schoolYear: eveSY,
          semester: eveSem,
          timeEnd: eveEnd,
          timeStart: eveStart,
        };

        await setDoc(documentRef, newEvent);

        alert('Event added!');
        getEvents();
        resetForm();
      } catch (error) {
        console.error('Error adding document: ', error);
        alert(
          'Something went wrong. Please contact your technician for checking.'
        );
      }
    }
  };

  const resetForm = () => {
    setEveDate('');
    setEveEnd('');
    setEveStart('');
    setEveName('');
    setEveSY('');
    setEveSem('');
    setFilledForm(false);
    setErrorMsg('');
  };

  return (
    <div className="absence-overall-container">
      <div className="events-header">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="close-absences"
          style={{ cursor: 'pointer' }}
          onClick={() => events(false)}
        />
        <h1>
          DEPARTMENT <span style={{ color: '#f16522' }}>EVENTS</span>
        </h1>
      </div>

      <div className="events-overall">
        <div className="events-container">
          <div className="events-title">
            <input
              value={searchItem}
              placeholder="Event name..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <FontAwesomeIcon icon={faRotate} onClick={clearFilters} />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <h2>
              <span style={{ color: '#f16522' }}>Add</span> an event
            </h2>
            <FontAwesomeIcon
              icon={faUpload}
              className="events-submit"
              style={{ cursor: 'pointer', color: filledForm ? 'green' : 'red' }}
              onClick={() => submitEventDetails()}
            />
          </div>
          <div className="events-details">
            <div className="events-name">
              <h2>
                <span style={{ color: '#f16522' }}>Name</span> of Event
              </h2>
              <input
                value={eveName}
                onChange={(e) => setEveName(e.target.value)}
              />
            </div>
            <div className="events-name">
              <h2>
                <span style={{ color: '#f16522' }}>Date</span> of Event
              </h2>
              <input
                type="date"
                value={eveDate}
                onChange={(e) => setEveDate(e.target.value)}
              />
            </div>
            <div className="events-name">
              <h2>
                Time <span style={{ color: '#f16522' }}>Start</span>
              </h2>
              <input
                type="time"
                value={eveStart}
                // onChange={(e) => setEveStart(e.target.value)}
                onChange={(e) => {
                  const value = e.target.value;
                  setEveStart(value);

                  // Validate against eveEnd
                  if (eveEnd && value >= eveEnd) {
                    setErrorMsg('Start time must be earlier than end time.');
                  } else {
                    setErrorMsg('');
                  }
                }}
              />
            </div>
            <div className="events-name">
              <h2>
                Time <span style={{ color: '#f16522' }}>End</span>
              </h2>
              <input
                type="time"
                value={eveEnd}
                // onChange={(e) => setEveEnd(e.target.value)}
                onChange={(e) => {
                  const value = e.target.value;
                  setEveEnd(value);

                  // Validate against eveStart
                  if (eveStart && value <= eveStart) {
                    setErrorMsg('End time must be later than start time.');
                  } else {
                    setErrorMsg('');
                  }
                }}
              />
            </div>
            <div className="events-name">
              <h2>
                <span style={{ color: '#f16522' }}>Sem</span>ester
              </h2>
              <select
                value={eveSem}
                onChange={(e) => setEveSem(e.target.value)}>
                <option value="" disabled>
                  Select Semester
                </option>
                <option value="1st">1st Semester</option>
                <option value="2nd">2nd Semester</option>
                <option value="Summer">Summer Class</option>
              </select>
            </div>
            <div className="events-name">
              <h2>
                School <span style={{ color: '#f16522' }}>Year</span>
              </h2>
              <select value={eveSY} onChange={(e) => setEveSY(e.target.value)}>
                <option value="" disabled>
                  Select School Year
                </option>
                {sYs.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="events-container2">
          <div className="anomalogs-title">
            <h2>
              <span style={{ color: '#f6941d' }}>EVENT</span> DETAILS
            </h2>
          </div>
          <div className="events-records">{records_mapped}</div>
        </div>
      </div>
    </div>
  );
}

export default Events;
