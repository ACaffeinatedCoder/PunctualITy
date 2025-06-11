import { faCircleXmark, faIdBadge, faLock, faLockOpen, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, useRef } from 'react';
import './AccessCSS.css';

function RequestAccess({panel}) {

    const [access, setAccess] = useState(true);
    const reqAccess = () => {
        setAccess(!access)
    }

  return (
    <div className='access'>
        <FontAwesomeIcon
            icon={faCircleXmark}
            className='close'
            onClick={() => panel(false)}
        />
      <h1>Enter your <span style={{color:'#f16522'}}>Credentials</span>.</h1>
      {/*<button onClick={() => logs()}>view logs</button>*/}
      <div className="card">
        <a href='/records'>
            <FontAwesomeIcon
                icon={access ? faLock : faLockOpen}
                className={`lock-icon ${access ? 'fade-out' : 'fade-in'}`}
                onClick={() => reqAccess()}
            />     
        </a>

      </div>
      <div className='credentials'>
        <input
            placeholder='Email...'
        />
        <input
            type='password'
            placeholder='Password...'
        />
      </div>
      <p className="read-the-docs">
        Don't have access? Make a request for access with your Chairperson.
      </p>
    </div>
  );
}

export default RequestAccess;
