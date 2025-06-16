import {
  faRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, useRef } from 'react';
import './AccessCSS.css';
import { useAuth } from '../AuthContext';

/**
 * -- REVAMP --
 * Turn into a login page
 *  - signInWithEmailAndPassword
 *
 * Track user
 *  - onAuthStateChanged?
 *  - setDoc(doc(db, "Users", user.uid)) upon register
 * {
 *    email, role, displayName
 * }
 *  - const userDoc = await getDoc(doc(db, "Users", user.uid));
 *  - (const userInfo = userDoc.data();
 *
 * Restrict pages per role
 *  - check role of current user and restrict accordingly
 *  - use createContext for a globally available variable
 */

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
        />
        <input
          type="password"
          placeholder="Password..."
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="card">
        <FontAwesomeIcon
          icon={faRightToBracket}
          className={`lock-icon ${access ? 'fade-out' : 'fade-in'}`}
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
