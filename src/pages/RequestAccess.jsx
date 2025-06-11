import {
  faLock,
  faLockOpen,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, useRef } from 'react';
import './AccessCSS.css';

function RequestAccess({ panel, attendee }) {
  const [access, setAccess] = useState(true);
  const [email, setEmail] = useState('');

  return (
    <div className="access">
      <h1>
        Enter your <span style={{ color: '#f16522' }}>Credentials</span>.
      </h1>
      {/*<button onClick={() => logs()}>view logs</button>*/}
      <div className="card">
        <FontAwesomeIcon
          icon={access ? faLock : faLockOpen}
          className={`lock-icon ${access ? 'fade-out' : 'fade-in'}`}
          onClick={() => {
            attendee(email);
            panel(false);
          }}
        />
      </div>
      <div className="credentials">
        <input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email..."
        />
        <input type="password" placeholder="Password..." />
      </div>
      <p className="read-the-docs">
        Don't have access? Make a request for access with your Chairperson.
      </p>
    </div>
  );
}

export default RequestAccess;
