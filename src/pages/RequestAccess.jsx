import {
  faRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, useRef } from 'react';
import './AccessCSS.css';
import { useAuth } from '../AuthContext';

function RequestAccess({ panel }) {
  const [access, setAccess] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    const result = await login(email, password);

    if (result.success) {
      panel(false);
    } else {
      alert('Login failed!');
    }
  };

  return (
    <div className="access">
      <h1>
        Enter your <span style={{ color: '#f16522' }}>Credentials</span>.
      </h1>
      <div className="credentials">
        <input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleLogin();
          }}
        />
        <input
          type="password"
          placeholder="Password..."
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleLogin();
          }}
        />
      </div>

      <div className="card">
        <FontAwesomeIcon
          icon={faRightToBracket}
          className={`lock-icon`}
          onClick={() => handleLogin()}
        />
      </div>
      <p className="read-the-docs">
        Don't have access? Make a request for access with your Chairperson.
      </p>
    </div>
  );
}

export default RequestAccess;
