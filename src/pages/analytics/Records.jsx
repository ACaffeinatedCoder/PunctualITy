import { faCircleXmark, faIdBadge } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, useRef } from 'react';
import './RecordsCSS.css';

function Records() {
  const [attendance, setAttendance] = useState(() => {
    const stored = localStorage.getItem("idLogs");
    return stored ? JSON.parse(stored) : [];
  })

  const records_mapped = attendance.map((rec, index) => (
    <div key={index} className='record-item'>
        <p>{rec.category}</p>
        <h2><strong>{rec.id}</strong></h2>
        <p>{rec.time}</p>
        <p><b>{rec.user}</b></p>
    </div>
  ))

  return (
    <div className="record-overall-container">
        <div className="record-header">
            <a href='/'>
                <FontAwesomeIcon
                    icon={faCircleXmark}
                    className='close-records'
                />
            </a>
            <h1><span style={{color:'#f16522'}}>Attendance</span> Records</h1>            
        </div>

        <div className="record-container">
            <div className="record-title">
                <h2>Category</h2>
                <h2>ID</h2>
                <h2>Date & Time</h2>
                <h2>Faculty</h2>
            </div>
            <div className="records">
                {records_mapped}
            </div>
            <div>
                <p className="read-the-docs">
                    This website was developed by Mr. Francisco for the Siena College of
                    Taytay's College of Engineering and Information Technology Department.
                </p>
            </div>
        </div>
        
    </div>
  );
}

export default Records;
