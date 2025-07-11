import {
  faRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, useRef } from 'react';
import './AccessCSS.css';
import { useAuth } from '../AuthContext';
import { auth } from '../config/firebase-config';
import { sendPasswordResetEmail } from 'firebase/auth';

function RequestAccess({ panel }) {
  const [access, setAccess] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
    const [emailValidity, setEmailValidity] = useState(false)

    const validateEmail = () => {
        const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailValidity(emailRegex.test(email))

    }
    
    useEffect(() => {
        validateEmail()
    },[email])

  const handleLogin = async () => {
    const result = await login(email, password);

    if (result.success) {
      panel(false);
    } else {
      alert('Login failed!');
    }
  };

      const forgotPass = async() => {
        if (email === '') {
            window.alert('No email detected')
        } else if (emailValidity === false) {
            window.alert('Invalid email input')
        } else {
            try {
                await sendPasswordResetEmail(auth, email).then(() => {
                    window.alert('A Password Reset Email has been sent to your email. Please check your spam and trash folders.')
                })
            } catch(error) {
                window.alert('This email is not recognized.')
            }
        }
    }

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
      <p className="forgot-pass" onClick={() => forgotPass()}>Forgot Password?</p>
      <p className="read-the-docs">
        Don't have access? Make a request for access with your Chairperson.
      </p>
    </div>
  );
}

export default RequestAccess;
