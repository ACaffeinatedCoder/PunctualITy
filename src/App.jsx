import './App.css';
import { Routes, Route } from 'react-router-dom';
import MainLandingPage from './MainLanding';
import ClockIn from './pages/ClockIn';
import ClockOut from './pages/ClockOut';
import Records from './pages/analytics/Records';

/**
 * Filter Records, Sort Records*
 * Analytics Page
 * -- Compare IDs with Names *
 * -- Compare Records with Events
 * -- Spot Anomalous Time-In and Time-Out
 * --- Incomplete Clocking: Time-In Only or Time-Out Only
 * --- Incomplete Clocking for Event
 * 
 * Analysis:
 *    Records of Tardiness
 *    Records of Absences *
 *    Did the student stay for the event?
 * 
 * Authentication
 * -- Match Credentials with Records *
 * -- Per Clocking, log Credentials as well *
 */

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLandingPage />} />
      <Route path="/clockin" element={<ClockIn />} />
      <Route path="/clockout" element={<ClockOut />} />
      <Route path="/records" element={<Records />} />
    </Routes>
  );
}

export default App;
